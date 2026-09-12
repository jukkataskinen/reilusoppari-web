import { Glyph, PartyDot, Sheet, SheetHead } from "./parts";

/**
 * Katselmuspöytäkirja sellaisena kuin se oikeasti on.
 *
 * ===========================================================================
 * MITÄ TÄMÄ NÄYTTÄÄ
 *
 * Pöytäkirja on huoneluettelo: huone, sen kuvat, kunkin kuvan selite, kuvaaja
 * ja palvelimen vastaanottoaika. Esimerkissä näytetään yksi huone kokonaan –
 * kuusi riviä kuutta huonetta olisi taulukko, ei kuva.
 *
 * KUVAAJA NÄKYY JOKA KUVASSA
 *
 * Väripiste kertoo, kumpi osapuoli kuvan otti. Se on koko tuotteen ero
 * tavalliseen muuttotarkastukseen: vuokralainen kuvaa omansa, eikä hänen
 * kuvansa ole alaviite vaan samanarvoinen rivi.
 *
 * TIIVISTE ON MUKANA
 *
 * Pöytäkirjassa lukee kuvan tiivisteen alku. Se on se, mikä tekee kuvasta
 * todisteen eikä muistikuvan, ja siksi se näkyy myös esimerkissä.
 *
 * EI KORISTEITA
 *
 * Pöytäkirjassa kuva on todiste. Koristeita ei ole – sama sääntö kuin
 * sovelluksen omissa asiakirjoissa.
 * ===========================================================================
 */

const photos = [
  { glyph: "liesi", note: "Liesi ja uuni, toimivat", who: "landlord", hash: "a1f3c8" },
  { glyph: "lattia", note: "Naarmu kaapin edessä", who: "tenant", hash: "7b20de" },
  { glyph: "jaakaappi", note: "Jääkaapin ovessa kolhu", who: "tenant", hash: "4c9a11" },
] as const;

export function InspectionPreview() {
  return (
    <Sheet label="Alkukatselmuksen pöytäkirja: keittiö, kolme kuvaa selitteineen, kuvaajineen ja tiivisteineen. Lukittu 14.8.2026 klo 16.02, yhteensä 12 kuvaa kuudesta tilasta.">
      <SheetHead
        kicker="Katselmuspöytäkirja"
        title="Alkukatselmus"
        subtitle="Asunto Oy Esimerkki · Helsinki"
        badge={{ text: "lukittu", done: true }}
      />

      <p className="mt-3 text-[12px] font-semibold">Keittiö</p>

      <ul className="mt-2 grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <li key={photo.hash}>
            <div className="h-[58px] rounded-lg border border-line bg-cloud p-1.5">
              <Glyph name={photo.glyph} role={photo.who} />
            </div>
            <p className="mt-1.5 flex items-start gap-1 text-[10px] leading-snug text-ink/70">
              <span className="mt-1">
                <PartyDot role={photo.who} />
              </span>
              {photo.note}
            </p>
            <p className="mt-0.5 font-mono text-[9px] text-ink/45">{photo.hash}…</p>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3 text-[10px] text-ink/55">
        <span>12 kuvaa · 6 tilaa</span>
        <span className="font-mono">lukittu 14.8. 16.02</span>
      </div>
    </Sheet>
  );
}
