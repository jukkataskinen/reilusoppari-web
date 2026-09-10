import type { PostFrontmatter } from "@/lib/blog/types";


/**
 * Julkaisujärjestys (CLAUDE.md kohta 6). Numerot suluissa viittaavat
 * CLAUDE.md:n listaan – kohdat 6 ja 7 (vuokratulon verotus ja vähennykset)
 * puuttuvat tarkoituksella: ne ovat sivuston uskottavuuden ydin ja Jukka
 * kirjoittaa tai tarkistaa ne itse (CLAUDE.md kohta 9.5).
 *
 * Uuden artikkelin lisääminen on kolme kohtaa: tiedosto
 * content/blogi/<slug>.mdx, rivi tähän listaan ja POST_FRONTMATTER:iin,
 * sekä staattinen import src/lib/blog/posts.ts:ään.
 *
 * HUOM päivämäärät: kaikki artikkelit on kirjoitettu samana päivänä eikä
 * sivustoa ole vielä julkaistu, joten `date` on sama kaikilla. Kun sivusto
 * avataan, päivämäärät kannattaa asettaa todellisen julkaisun mukaan.
 * Yhtä suurilla päivämäärillä listaus säilyttää tämän järjestyksen.
 */
export const POST_ORDER: readonly string[] = [
  "vuokrasopimuspohja-2027", // 1
  "muuttotarkastus-vuokra-asunnossa", // 2
  "vuokravakuuden-palautus", // 3
  "vuokralaisen-tunnistaminen", // 4
  "vuokrakuittaus-ilman-pankkiliittymaa", // 5
  "mita-suositukseen-saa-kirjoittaa", // 8
  "vuokrankorotus-indeksiehto-ja-ilmoitusaika", // 9
  "vuokrasuhteen-paattyminen-reilusti", // 10
];

export type PostSlug = string;

/**
 * Metadata jokaiselle artikkelille. Toistaa kunkin artikkelin .mdx-tiedoston
 * YAML-frontmatterin – pidetty erillään MDX-komponenttien importeista
 * (ks. src/lib/blog/posts.ts), jotta tämä tiedosto voidaan lukea myös
 * Vitestissä ilman MDX-kääntäjää. tests/unit/blog-frontmatter.test.ts
 * varmistaa, etteivät kaksi lähdettä pääse eriytymään toisistaan.
 */
export const POST_FRONTMATTER: Record<PostSlug, PostFrontmatter> = {
  "vuokrasopimuspohja-2027": {
    title: "Vuokrasopimuspohja 2027 – mitä siinä pitää olla ja mitä ei kannata laittaa",
    description:
      "Mitä asuinhuoneiston vuokrasopimukseen kuuluu, mitkä ehdot ovat pätemättömiä ja mikä liite puuttuu lähes jokaisesta pohjasta.",
    date: "2026-09-10",
    tags: ["Sopimukset", "Vuokranantajat", "AHVL"],
  },
  "muuttotarkastus-vuokra-asunnossa": {
    title: "Muuttotarkastus vuokra-asunnossa: näin kuvaat asunnon niin, että kuvista on hyötyä",
    description:
      "Mitä kuvata, missä järjestyksessä ja miksi kuvan aikaleima ratkaisee. Käytännön ohje sekä vuokranantajalle että vuokralaiselle.",
    date: "2026-09-10",
    tags: ["Katselmus", "Vuokranantajat", "Vuokralaiset"],
  },
  "vuokravakuuden-palautus": {
    title: "Vuokravakuuden palautus – milloin vuokranantaja saa pidättää ja miten riita vältetään",
    description:
      "Mistä vakuudesta saa pidättää, mistä ei, ja miksi erimielisyys ratkeaa lähes aina sillä, mitä asunnon lähtökunnosta pystytään osoittamaan.",
    date: "2026-09-10",
    tags: ["Vakuus", "Vuokranantajat", "Vuokralaiset"],
  },
  "vuokralaisen-tunnistaminen": {
    title: "Vuokralaisen tunnistaminen: miksi pankkitunnistus suojaa molempia",
    description:
      "Tunnistaminen kertoo kuka toinen on, ei millainen hän on. Miksi ero on tärkeä ja miksi vahva tunnistautuminen hyödyttää yhtä lailla vuokralaista.",
    date: "2026-09-10",
    tags: ["Tunnistautuminen", "Sopimukset", "eIDAS"],
  },
  "vuokrakuittaus-ilman-pankkiliittymaa": {
    title: "Vuokrakuittaus ilman pankkiliittymää – miksi kerran kuussa riittää",
    description:
      "Miksi vuokranantajan oma kuukausikuittaus toimii paremmin kuin tiliyhteys, ja mitä hyötyä siitä on vuokralaiselle.",
    date: "2026-09-10",
    tags: ["Kuittaukset", "Vuokranantajat", "Vuokralaiset"],
  },
  "mita-suositukseen-saa-kirjoittaa": {
    title: "Mitä vuokranantaja saa kirjoittaa suositukseen – ja mitä vuokralainen voi vastata",
    description:
      "Suositus on henkilötietoa toisesta ihmisestä. Mitä siihen kuuluu, mikä on mielipidettä ja miten vuokralainen voi puuttua asiaan.",
    date: "2026-09-10",
    tags: ["Todistus", "Vuokranantajat", "Vuokralaiset"],
  },
  "vuokrankorotus-indeksiehto-ja-ilmoitusaika": {
    title: "Vuokrankorotus: indeksiehto, ilmoitusaika ja tavallisimmat virheet",
    description:
      "Milloin vuokraa saa korottaa, miten indeksiehto kirjoitetaan oikein ja mitkä viisi virhettä toistuvat vuodesta toiseen.",
    date: "2026-09-10",
    tags: ["Vuokrankorotus", "Sopimukset", "AHVL"],
  },
  "vuokrasuhteen-paattyminen-reilusti": {
    title: "Vuokrasuhteen päättyminen reilusti: loppukatselmus, avaimet ja vakuus kahdessa viikossa",
    description:
      "Muistilista molemmille osapuolille: irtisanominen, loppusiivous, avainten luovutus, loppukatselmus ja vakuuden palautus ilman erimielisyyttä.",
    date: "2026-09-10",
    tags: ["Loppukatselmus", "Vakuus", "Vuokranantajat", "Vuokralaiset"],
  },
};

export function isPostSlug(value: string): value is PostSlug {
  return Object.prototype.hasOwnProperty.call(POST_FRONTMATTER, value);
}
