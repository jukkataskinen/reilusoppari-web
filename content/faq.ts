import { pricing } from "@content/pricing";
import { formatEuroAuto } from "@/lib/format";

/**
 * UKK-sisällöt. Vastaukset pysyvät CLAUDE.md kohdan 7 sallittujen väittämien
 * rajoissa: ei luottotieto- tai perintäsanastoa, ei taustatarkistuksia, eikä
 * mitään, mikä asemoi palvelun toista osapuolta vastaan.
 *
 * `homeFaq` = etusivun kuusi kysymystä (CLAUDE.md kohta 4.9).
 * `ukkFaq`  = laajempi lista /ukk-sivulle.
 */
export type FaqItem = {
  question: string;
  answer: string;
};

export const homeFaq: FaqItem[] = [
  {
    question: "Onko sähköinen vuokrasopimus pätevä?",
    answer:
      "On. Vuokrasopimus allekirjoitetaan pankkitunnuksilla tai mobiilivarmenteella, ja kyse on eIDAS-asetuksen mukaisesta kehittyneestä sähköisestä allekirjoituksesta, joka on laillisesti pätevä. Asuinhuoneiston vuokrauksesta annettu laki (481/1995) ei vaadi paperia.",
  },
  {
    question: "Mitä vuokralainen maksaa?",
    answer:
      "Ei mitään. Vuokralaiselle palvelu on aina maksuton – myös kuvat, kuittaukset ja todistus.",
  },
  {
    question: "Kuka näkee kuvat?",
    answer:
      "Vain vuokrasuhteen osapuolet: sinä ja toinen osapuoli. Kuvat aikaleimataan, tiivistetään ja sinetöidään sopimuksen liitteeksi, eikä kumpikaan voi muuttaa tai poistaa niitä jälkikäteen.",
  },
  {
    question: "Voiko vuokranantaja kirjoittaa todistukseen mitä tahansa?",
    answer:
      "Todistuksen numerot tulevat kuittauksista automaattisesti, eikä niitä kirjoiteta käsin. Vuokranantaja voi lisätä omat terveisensä, ja vuokralainen näkee todistuksen ennen kuin se on valmis. Todistus on vuokralaisen oma asiakirja: hän päättää, kenelle sen näyttää.",
  },
  {
    question: "Mitä jos vuokralainen ei halua käyttää palvelua?",
    answer:
      "Silloin sitä ei käytetä – molempien pitää allekirjoittaa. Useimmiten kannattaa kertoa, että vuokralainen saa samat kuvat, saman sopimuksen ja lopuksi todistuksen, eikä maksa mitään.",
  },
  {
    question: "Missä tiedot säilytetään?",
    answer:
      "EU:ssa. Palvelun on kehittänyt suomalainen tilitoimistoyrittäjä, ja säilytysajat kuvataan tietosuojaselosteessa.",
  },
];

/** Laajennettu UKK (/ukk-sivu). Vastaukset 2–4 lausetta. */
export const ukkFaq: FaqItem[] = [
  ...homeFaq,
  {
    question: "Mitä alkukatselmuksessa tehdään?",
    answer:
      "Molemmat kuvaavat samat huoneet ennen muuttoa. Kuvat aikaleimataan palvelimella, tiivistetään ja sinetöidään sopimuksen liitteeksi. Muuttopäivänä katsotaan samoja kuvia, joten kummankaan ei tarvitse muistaa, oliko naarmu jo siinä.",
  },
  {
    question: "Miten vuokrakuittaus toimii?",
    answer:
      "Kerran kuussa vuokranantaja saa kysymyksen, tuliko vuokra. Hän vastaa kyllä, ei vielä tai osittain. Kuittaukset ovat vuokranantajan omia merkintöjä, jotka vuokralainen näkee ja voi kommentoida. Pankkitiliä ei liitetä palveluun.",
  },
  {
    question: "Entä jos kuittaus on mielestäni väärin?",
    answer:
      "Vuokralainen voi kommentoida jokaista kuittausta, ja kommentti näkyy merkinnän vieressä. Kumpikaan ei voi poistaa toisen merkintää tai kommenttia.",
  },
  {
    question: "Mitä huoltokirjaan kirjataan?",
    answer:
      "Viat, ilmoitukset ja korjaukset aikajärjestyksessä: milloin ilmoitettiin, milloin korjattiin ja mitä siitä sovittiin. Molemmat näkevät saman listan koko vuokrasuhteen ajan.",
  },
  {
    question: "Mitä todistuksessa lukee?",
    answer:
      "Vuokrasuhteen kesto, osoite ja yhteenveto vuokranmaksusta kuittausten perusteella, sekä vuokranantajan terveiset. Aitouden voi tarkistaa linkistä. Vuokranantaja saa oman todistuksensa: vakuus palautettu ajallaan, viat korjattu.",
  },
  {
    question: "Teettekö taustatarkistuksia vuokralaisesta?",
    answer:
      "Emme. Reilusoppari ei tee taustatarkistuksia eikä ylläpidä mitään rekisteriä vuokralaisista. Palvelu tunnistaa molemmat osapuolet pankkitunnuksilla – se suojaa kumpaakin siltä, ettei toinen ole joku muu kuin sanoo olevansa.",
  },
  {
    question: "Mitä verolaskelma tekee?",
    answer: `Verolaskelma on yhteenveto omista kirjauksistasi OmaVeron kenttien mukaan: vastikkeet, korjaukset ja matkakulut eriteltyinä. Se ei ole veroneuvontaa eikä veroilmoituksen tekemistä puolestasi. Plus maksaa ${formatEuroAuto(pricing.plus.yearlyPerApartment)} asunnolta vuodessa, ja veloitus alkaa vasta ensimmäisestä tulostetusta laskelmasta.`,
  },
  {
    question: "Voiko palvelua käyttää kesken vuokrasuhteen?",
    answer:
      "Voi. Sopimus voidaan tehdä myös olemassa olevalle vuokrasuhteelle, ja katselmus tehdään siitä hetkestä eteenpäin. Aiempaa historiaa ei voi jälkikäteen todistaa, mutta kuittaukset ja huoltokirja alkavat heti.",
  },
  {
    question: "Mitä palvelu maksaa vuokranantajalle?",
    answer: `Ensimmäinen vuokrasuhde on ilmainen. Sen jälkeen ${formatEuroAuto(pricing.tenancy.fee)} kerran vuokrasuhteelta, koko vuokrasuhteen ajaksi, enintään ${pricing.tenancy.maxYears} vuodeksi. Vähintään ${pricing.portfolio.minApartments} asunnon salkulle ${formatEuroAuto(pricing.portfolio.yearlyPerApartment)} asunnolta vuodessa, jolloin kaikki sisältyy hintaan. ${pricing.vatNote}.`,
  },
];

/** Hinnastosivun oma UKK (CLAUDE.md kohta 3: /hinnat "hinnasto ja UKK hinnoista"). */
export const pricingFaq: FaqItem[] = [
  {
    question: "Onko kyseessä kuukausimaksu?",
    answer: `Ei. ${formatEuroAuto(pricing.tenancy.fee)} on kertamaksu, joka kattaa koko vuokrasuhteen enintään ${pricing.tenancy.maxYears} vuodeksi. Salkkuhinta on vuosimaksu asunnolta.`,
  },
  {
    question: "Milloin maksu veloitetaan?",
    answer:
      "Vuokrasuhteen maksu veloitetaan sopimuksen allekirjoittamisen yhteydessä. Plus veloitetaan vasta kun tulostat ensimmäisen verolaskelman – kulujen kirjaaminen on siihen asti ilmaista.",
  },
  {
    question: "Mitä tapahtuu, jos vuokrasuhde kestää yli viisi vuotta?",
    answer: `Vuokrasuhde jatkuu normaalisti, ja kuittaukset sekä huoltokirja pysyvät käytössä. Kertamaksu kattaa ${pricing.tenancy.maxYears} vuotta, minkä jälkeen samasta vuokrasuhteesta veloitetaan uusi kertamaksu.`,
  },
  {
    question: "Mistä salkkuhinnan raja lasketaan?",
    answer: `Vuokrattavien asuntojen määrästä. Vähintään ${pricing.portfolio.minApartments} asuntoa tarkoittaa salkkuhintaa ${formatEuroAuto(pricing.portfolio.yearlyPerApartment)} asunnolta vuodessa, ja se sisältää vuokrasuhteet, katselmukset, kuittaukset ja verolaskelman.`,
  },
  {
    question: "Sisältävätkö hinnat arvonlisäveron?",
    answer: `Kyllä. ${pricing.vatNote}, koska hinnat esitetään kuluttajahintoina.`,
  },
  {
    question: "Mitä suositteluetu tarkoittaa?",
    answer: `${pricing.referral} Etu näkyy tilillä, kun kaveri on tehnyt oman ensimmäisen sopimuksensa.`,
  },
];
