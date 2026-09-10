/**
 * Yksi totuuden lähde kaikille sivuston hintaesiintymille (CLAUDE.md kohta 2).
 * Jukka muuttaa hintoja vain tästä tiedostosta.
 *
 * Malli lyhyesti:
 *  - Vuokralainen ei maksa koskaan mitään.
 *  - Vuokranantajan ensimmäinen vuokrasuhde on ilmainen.
 *  - Sen jälkeen 29 € kertamaksuna vuokrasuhteelta, koko vuokrasuhteen ajaksi
 *    (enintään 5 vuotta). Ei kuukausimaksua.
 *  - Plus (kulut ja verolaskelma) 12 €/asunto/vuosi, veloitetaan vasta kun
 *    ensimmäinen laskelma tulostetaan.
 *  - Vähintään 5 asunnon salkku: 15 €/asunto/vuosi, sisältää kaiken.
 *
 * Hinnat ovat kuluttajahintoja ja sisältävät ALV 25,5 % (CLAUDE.md kohta 2).
 */
export const pricing = {
  currency: "EUR",
  vatRate: 0.255,
  vatNote: "Hinnat sisältävät ALV 25,5 %",

  /** Vuokralaisen hinta. Ei ole muuttuja – se on lupaus. */
  tenant: {
    price: 0,
    note: "Vuokralaiselle aina maksuton.",
  },

  /** Yksittäinen vuokrasuhde. */
  tenancy: {
    /** Kertamaksu vuokrasuhteelta. Ei kuukausimaksua. */
    fee: 29,
    /** Ensimmäinen vuokrasuhde on ilmainen. */
    freeFirst: true,
    /** Kertamaksu kattaa vuokrasuhteen enintään näin monta vuotta. */
    maxYears: 5,
    includes: [
      "Vuokrasopimus pankkitunnuksilla, molemmille sama kappale",
      "Alkukatselmus kuvin, aikaleimattuna ja sinetöitynä",
      "Kuukausittainen vuokrakuittaus",
      "Huoltokirja: viat, korjaukset ja ilmoitukset samassa paikassa",
      "Loppukatselmus ja vertailu alkukuviin",
      "Todistus molemmille vuokrasuhteen päätyttyä",
    ],
  },

  /** Plus: kulut talteen ja verolaskelma keväällä. */
  plus: {
    name: "Plus",
    /** Hinta asuntoa kohden vuodessa. */
    yearlyPerApartment: 12,
    billingNote:
      "Veloitetaan vasta kun tulostat ensimmäisen verolaskelman – kulujen kirjaaminen on ilmaista.",
    includes: [
      "Kulut ja kuitit talteen asunnoittain",
      "Vuosiyhteenveto OmaVeron kenttien mukaan",
      "Vastikkeet, korjaukset ja matkakulut eriteltyinä",
    ],
  },

  /** Salkku: vähintään 5 asuntoa, kaikki sisältyy. */
  portfolio: {
    name: "Salkku",
    /** Pienin asuntomäärä, jolla salkkuhinta on käytössä. */
    minApartments: 5,
    /** Hinta asuntoa kohden vuodessa. Sisältää vuokrasuhteet ja Plussan. */
    yearlyPerApartment: 15,
    note: "Sisältää kaiken: vuokrasuhteet, katselmukset, kuittaukset ja verolaskelman.",
  },

  /** Suositteluetu (CLAUDE.md kohta 2). Toteutus on sovelluksessa. */
  referral: "Tuo kaveri, molemmat saatte seuraavan sopimuksen ilmaiseksi.",
} as const;

export type Pricing = typeof pricing;
