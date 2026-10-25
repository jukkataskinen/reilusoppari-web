/**
 * Chatin toimintakehotteet (Jukka 26.10.2026: botti ohjaa hienovaraisesti seuraavaan askeleeseen).
 *
 * Botti voi lopettaa vastauksensa tagiin [[ehdotus:tyyppi]]. Palvelin poistaa tagin
 * suoratoistosta (käyttäjä ei koskaan näe sitä raakana) ja lähettää ehdotuksen vastauksen
 * perässä erotinmerkin jälkeen. Selain näyttää siitä napin, joka vie sivuston omalle
 * lomakkeelle aihe esitäytettynä. URL:iin menee vain aihe ja lähde, ei koskaan keskustelun
 * sisältöä tai henkilötietoja.
 *
 * Tiedosto on puhdasta logiikkaa ilman palvelin- tai selainriippuvuuksia, joten sama koodi
 * kelpaa molemmille ja siirtyy sellaisenaan muille sivustoille.
 */

/**
 * Reilusopparissa ei ole esittelyä (kuluttajatuote, aloitetaan itse). Tyypit:
 * kokeilu = aloita ilmaiseksi (vain live-tilassa), tarjous = salkku tai yritys,
 * konsultaatio = kysy meiltä, kun tilanne on epäselvä.
 */
export const CTA_TYPES = ["kokeilu", "tarjous", "konsultaatio"] as const;
export type CtaType = (typeof CTA_TYPES)[number];

/** Erotin tekstin ja ehdotuksen välissä (ASCII Record Separator). Ei esiinny tavallisessa tekstissä. */
export const CTA_SEPARATOR = "\u001E";

const TAG_FULL = /^\[\[ehdotus:([a-z]{1,20})\]\]/;
const TAG_PREFIX = "[[ehdotus:";

export function isCtaType(value: unknown): value is CtaType {
  return typeof value === "string" && (CTA_TYPES as readonly string[]).includes(value);
}

/** Tagi, jolla aiempi ehdotus merkitään historiaan, jotta botti tietää mitä se on jo ehdottanut. */
export function ctaTag(type: CtaType): string {
  return `[[ehdotus:${type}]]`;
}

/** Voiko puskurin alku vielä kasvaa ehdotustagiksi (odotetaan lisää tekstiä). */
function couldBeTag(buf: string): boolean {
  if (buf.length <= TAG_PREFIX.length) return TAG_PREFIX.startsWith(buf);
  if (!buf.startsWith(TAG_PREFIX)) return false;
  return /^[a-z]{0,20}\]?$/.test(buf.slice(TAG_PREFIX.length));
}

/**
 * Suodattaa ehdotustagit suoratoistosta. Teksti, joka voisi olla tagin alku, pidätetään,
 * kunnes se joko täydentyy tagiksi (poistetaan) tai osoittautuu tavalliseksi tekstiksi.
 */
export class CtaStreamFilter {
  private buf = "";
  private found: string | null = null;

  push(chunk: string): string {
    this.buf += chunk;
    let out = "";
    for (;;) {
      const i = this.buf.indexOf("[[");
      if (i === -1) {
        // Yksittäinen "[" lopussa voi olla tagin alku.
        if (this.buf.endsWith("[")) {
          out += this.buf.slice(0, -1);
          this.buf = "[";
        } else {
          out += this.buf;
          this.buf = "";
        }
        return out;
      }
      out += this.buf.slice(0, i);
      this.buf = this.buf.slice(i);
      const full = TAG_FULL.exec(this.buf);
      if (full) {
        this.found ??= full[1];
        this.buf = this.buf.slice(full[0].length);
        continue;
      }
      if (couldBeTag(this.buf)) return out;
      out += "[[";
      this.buf = this.buf.slice(2);
    }
  }

  /** Loppuun: pidätetty teksti ja löytynyt ehdotus (vain tunnettu tyyppi). */
  flush(): { text: string; type: CtaType | null } {
    // Kesken jäänyt tagi pudotetaan; pelkkä "[" tai "[[" lopussa on tavallista tekstiä.
    const rest = this.buf.length > 2 && couldBeTag(this.buf) ? "" : this.buf;
    this.buf = "";
    return { text: rest, type: isCtaType(this.found) ? this.found : null };
  }
}

/** Selaimen puoli: erottaa näytettävän tekstin ja ehdotuksen palvelimen vastauksesta. */
export function splitCtaTrailer(raw: string): { text: string; type: CtaType | null } {
  const i = raw.indexOf(CTA_SEPARATOR);
  if (i === -1) return { text: raw, type: null };
  let type: CtaType | null = null;
  try {
    const parsed = JSON.parse(raw.slice(i + 1)) as { cta?: unknown };
    if (isCtaType(parsed.cta)) type = parsed.cta;
  } catch {
    // Rikkinäinen loppuosa: näytetään pelkkä teksti.
  }
  return { text: raw.slice(0, i), type };
}

/** Avainsanat, joilla käyttäjä pyytää samaa askelta uudelleen (silloin nappi saa toistua). */
const ASKS: Record<CtaType, RegExp> = {
  kokeilu: /kokeil|aloit|rekister/i,
  tarjous: /tarjou/i,
  konsultaatio: /kysy|yhtey|neuvo|soit|puhel/i,
};

/**
 * Palvelimen viimeinen sana ehdotuksesta: vain sallittu tyyppi, ja sama ehdotus ei toistu
 * peräkkäisissä vastauksissa, ellei käyttäjä itse kysy siitä.
 */
export function decideCta(
  proposed: CtaType | null,
  history: readonly { role: "user" | "assistant"; content: string }[],
  available: readonly CtaType[],
): CtaType | null {
  if (!proposed || !available.includes(proposed)) return null;
  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
  if (lastAssistant?.content.includes(ctaTag(proposed))) {
    const lastUser = history[history.length - 1];
    if (!lastUser || lastUser.role !== "user" || !ASKS[proposed].test(lastUser.content)) return null;
  }
  return proposed;
}

export type CtaDefinition = {
  label: string;
  /** Napin teksti painalluksen jälkeen, kunnes sivu vaihtuu. */
  pending: string;
  /** Sisäinen polku (lomake) tai "signup" = sovelluksen rekisteröityminen. */
  target: string;
  /** Lomakkeen aihe-kenttään esitäytettävä arvo. */
  topic?: string;
};

/**
 * Napin osoite. Vain kiinteät, sallitut arvot: aihe ja lähde. Ei koskaan käyttäjän syötettä.
 */
export function ctaHref(def: CtaDefinition, signupUrl: string): string {
  if (def.target === "signup") return signupUrl;
  const params = new URLSearchParams();
  if (def.topic) params.set("aihe", def.topic);
  params.set("lahde", "chat");
  return `${def.target}?${params.toString()}`;
}
