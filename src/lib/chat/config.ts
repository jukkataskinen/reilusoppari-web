import type { LaunchMode } from "@/lib/launch";
import type { CtaDefinition, CtaType } from "./cta";

/**
 * Chatbotin sivustokohtaiset asetukset. Tämä on ainoa tiedosto (tietopohjan ja prompt.ts:n
 * lisäksi), joka erottaa Reilusopparin chatin eSinetin chatista: nimi, tervehdys,
 * kysymysehdotukset ja toimintakehotteet. Mekanismi (cta.ts, handler.ts) on sama.
 */

export const CHAT_CONFIG = {
  /** Palvelun nimi, jota botti edustaa. */
  productName: "Reilusoppari",
  /** Chat-ikkunan ja -painikkeen otsikko. */
  title: "Kysy Reilusopparista",
  /** Yhteydenottosivu, jonne botti ohjaa kun se ei osaa vastata. */
  contactPath: "/yhteystiedot",
  /** Sivu, jonne linkataan jos lähdettä ei löydy. */
  fallbackSourcePath: "/ukk",
  welcome:
    "Hei. Vastaan kysymyksiin Reilusopparista: miten vuokrasopimus, katselmus ja kuittaukset toimivat, mitä ne maksavat ja kenelle palvelu sopii.",
  privacyNotice:
    "Älä kirjoita henkilötunnusta, osoitetta tai muita henkilötietoja. Keskusteluja ei tallenneta, mutta viestit käsittelee Anthropic (Yhdysvallat), joka tuottaa vastaukset.",
  suggestions: [
    "Mitä Reilusoppari maksaa kolmelle asunnolle?",
    "Miten alkukatselmus toimii?",
    "Mitä vuokralainen hyötyy?",
  ],
} as const;

/**
 * Toimintakehotteet (Jukka 26.10.2026). Reilusopparissa ei ole esittelyä: kuluttaja aloittaa
 * itse. Kokeilu vie sovelluksen aloitussivulle ja on käytössä vain kun LAUNCH_MODE=live.
 * Tarjous ja konsultaatio vievät yhteydenottolomakkeelle aihe esitäytettynä.
 */
export const CHAT_CTAS: Record<CtaType, CtaDefinition> = {
  kokeilu: { label: "Aloita ilmaiseksi", pending: "Avataan…", target: "signup" },
  tarjous: { label: "Pyydä tarjous salkulle", pending: "Avataan…", target: "/yhteystiedot", topic: "tarjous" },
  konsultaatio: { label: "Kysy meiltä", pending: "Avataan…", target: "/yhteystiedot", topic: "kysymys" },
};

/**
 * Ehdotukset, joita botti saa käyttää julkaisutilassa. Odotuslistaa ei ehdoteta: lista ei ole
 * nyt auki (LAUNCH_MODE=soon), ja jos se avataan, sivuston oma CTA ohjaa sinne jo.
 */
export function availableCtas(mode: LaunchMode): CtaType[] {
  return mode === "live" ? ["kokeilu", "tarjous", "konsultaatio"] : ["tarjous", "konsultaatio"];
}
