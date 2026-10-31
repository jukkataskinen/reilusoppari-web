// Kokoaa chatbotin tietopohjan sivuston omasta sisällöstä (content/ ja sivut).
// Ajetaan rakennusvaiheessa (prebuild) ja käsin: npm run chat:build.
// Bottia ei ajossa viedä verkkoon hakemaan mitään; kaikki tieto on tässä tiedostossa,
// jonka Claude saa välimuistitettuna järjestelmäohjeen mukana.
//
// Rakenne on sama kuin esinetti-webissä; sivustokohtaista on vain SECTIONS-lista ja hintafaktat.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pricing } from "@content/pricing";
import { homeFaq, ukkFaq, pricingFaq } from "@content/faq";
import { company, companyAddress, signingProvider } from "@content/company";
import { formatEuroAuto } from "@/lib/format";
import { estimate, portfolioLabel, tenancyLabel } from "@/lib/pricing";
import { POST_ORDER, POST_FRONTMATTER } from "@/lib/blog/registry";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "src/lib/chat/knowledge.generated.ts");

type Faq = { question: string; answer: string };
const faqText = (items: Faq[]) => items.map((i) => `K: ${i.question}\nV: ${i.answer}`).join("\n\n");

/**
 * Poimii sivun tai komponentin näkyvän tekstin TSX-lähteestä: JSX-tekstit, objektien
 * merkkijonoarvot (title: "...") ja JSX-attribuuttien tekstit (lead="...", quote="...").
 * Polku on suhteessa repon juureen.
 */
function pageText(file: string): string {
  let src = readFileSync(path.join(root, file), "utf8");
  src = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const parts: { i: number; t: string }[] = [];
  for (const m of src.matchAll(/>([^<>{}]+)</g)) {
    const t = m[1].replace(/\s+/g, " ").trim();
    if (t.length > 2 && /[A-Za-zÅÄÖåäö]/.test(t) && !t.includes("=>")) parts.push({ i: m.index!, t });
  }
  const KEYS = "title|description|label|name|text|answer|question|body|heading|summary|note|lead|quote|fact|eyebrow|caption|intro";
  for (const m of src.matchAll(new RegExp(`\\b(?:${KEYS})\\s*[:=]\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)+)"`, "g"))) {
    const t = m[1].replace(/\\"/g, '"').replace(/\s+/g, " ").trim();
    if (t.length > 8 && !/^[a-z0-9-]+$/.test(t)) parts.push({ i: m.index!, t });
  }
  parts.sort((a, b) => a.i - b.i);
  const seen = new Set<string>();
  return parts
    .map((p) => p.t.replace(/&quot;/g, '"').replace(/&nbsp;/g, " "))
    .filter((t) => (seen.has(t) ? false : seen.add(t)))
    .join("\n");
}

const pages = (...files: string[]) => files.map(pageText).join("\n");

/** Blogista vain otsikko, kuvaus, Lyhyesti-laatikko ja väliotsikot (kulu). LUONNOS-artikkelit eivät ole rekisterissä. */
function blogSummary(slug: string): string {
  const fm = POST_FRONTMATTER[slug];
  const raw = readFileSync(path.join(root, "content/blogi", `${slug}.mdx`), "utf8").replace(/^---[\s\S]*?---/, "");
  const lyhyesti = (raw.match(/<Lyhyesti>([\s\S]*?)<\/Lyhyesti>/)?.[1] ?? "").replace(/\s+/g, " ").trim();
  const headings = [...raw.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  return `### ${fm.title} (/blogi/${slug})\n${fm.description}\n${lyhyesti}\nAiheet: ${headings.join("; ")}`;
}

const e = formatEuroAuto;
const example = (apartments: number, withPlus: boolean, tenancies: number) => {
  const r = estimate(apartments, withPlus, tenancies);
  const yearly = r.yearly > 0 ? `${e(r.yearly)} vuodessa` : "ei vuosimaksua";
  const oneOff = r.model === "tenancy" ? `, vuokrasuhdemaksut ${e(r.oneOff)} kertamaksuna` : "";
  const flats = apartments === 1 ? "1 asunto" : `${apartments} asuntoa`;
  const newOnes = tenancies === 1 ? "1 uusi vuokrasuhde" : `${tenancies} uutta vuokrasuhdetta`;
  return `${flats}${r.model === "tenancy" ? (withPlus ? " Plussalla" : " ilman Plussaa") + `, ${newOnes}` : " (salkkuhinta)"}: ${yearly}${oneOff} (${r.explanation})`;
};

const facts = [
  `${pricing.vatNote}. Hinnat ovat kuluttajahintoja ja esitetään aina verollisina. Hintojen ainoa lähde on tämä osio ja hinnastosivu; älä päättele muita hintoja.`,
  `Vuokralainen: ${e(pricing.tenant.price)}. ${pricing.tenant.note}`,
  `Vuokrasuhde: ensimmäinen vuokrasuhde on ilmainen. Sen jälkeen ${tenancyLabel()}. Ei kuukausimaksua. Kertamaksu kattaa: ${pricing.tenancy.includes.join("; ")}.`,
  `${pricing.plus.name}: ${e(pricing.plus.yearlyPerApartment)} / asunto / vuosi. ${pricing.plus.billingNote} Sisältää: ${pricing.plus.includes.join("; ")}.`,
  `${pricing.portfolio.name}: ${portfolioLabel()}. ${pricing.portfolio.note} Salkkuhinta on vuosimaksu, eikä siihen lisätä vuokrasuhdemaksuja tai Plussaa.`,
  `Suositteluetu: ${pricing.referral}`,
  `Laskuesimerkkejä (sis. ALV 25,5 %): ${[example(1, false, 1), example(2, true, 1), example(3, true, 2), example(5, true, 2), example(10, true, 3)].join("; ")}.`,
].join("\n");

const sections: { title: string; path: string; body: string }[] = [
  { title: "Hinnat", path: "/hinnat", body: `${facts}\n\n${faqText(pricingFaq)}\n\nSivun teksti:\n${pageText("src/app/hinnat/page.tsx")}` },
  {
    title: "Etusivu: mikä Reilusoppari on",
    path: "/",
    body: pages(
      "src/app/page.tsx",
      "src/components/sections/Hero.tsx",
      "src/components/sections/Steps.tsx",
      "src/components/sections/MolemmilleJotain.tsx",
      "src/components/sections/HomePricing.tsx",
      "src/components/sections/TuoKaveri.tsx",
      "src/components/sections/Tarina.tsx",
    ),
  },
  { title: "Usein kysytyt kysymykset", path: "/ukk", // ukkFaq sisältää jo etusivun kysymykset (homeFaq), joten ne poistetaan vain varmuuden vuoksi.
    body: faqText([...homeFaq, ...ukkFaq.filter((q) => !homeFaq.some((h) => h.question === q.question))]) },
  { title: "Miten Reilusoppari toimii", path: "/miten-toimii", body: pageText("src/app/miten-toimii/page.tsx") },
  { title: "Vuokranantajalle", path: "/vuokranantajalle", body: pageText("src/app/vuokranantajalle/page.tsx") },
  { title: "Vuokralaiselle", path: "/vuokralaiselle", body: pageText("src/app/vuokralaiselle/page.tsx") },
  { title: "Alku- ja loppukatselmus", path: "/katselmus", body: pageText("src/app/katselmus/page.tsx") },
  { title: "Kulut ja verolaskelma (Plus)", path: "/verolaskelma", body: pageText("src/app/verolaskelma/page.tsx") },
  { title: "Vuokratodistus", path: "/todistus", body: pageText("src/app/todistus/page.tsx") },
  { title: "Käyttöehdot", path: "/kayttoehdot", body: pageText("src/app/kayttoehdot/page.tsx") },
  { title: "Tietosuoja", path: "/tietosuoja", body: pageText("src/app/tietosuoja/page.tsx") },
  {
    title: "Yhteystiedot",
    path: "/yhteystiedot",
    body: `Yhteydenotto tehdään sivuston lomakkeella, ja kirjeitse voi kirjoittaa osoitteeseen ${company.name}, ${companyAddress()}. Palvelun tarjoaa ${company.name} (Y-tunnus ${company.businessId}). Reilusopparin on kehittänyt suomalainen tilitoimistoyrittäjä. Allekirjoitusmoottorina toimii ${signingProvider.product}, joka on eri yhtiön (${signingProvider.name}, Y-tunnus ${signingProvider.businessId}) palvelu. Lomakkeella voi kysyä, pyytää tarjouksen salkulle tai antaa palautetta.`,
  },
  { title: "Blogiartikkelit (tiivistelmät)", path: "/blogi", body: POST_ORDER.map(blogSummary).join("\n\n") },
];

const knowledge = sections.map((s) => `## ${s.title} [${s.path}]\n${s.body.trim()}`).join("\n\n");
const paths = new Set<string>(["/", ...sections.map((s) => s.path), ...POST_ORDER.map((s) => `/blogi/${s}`)]);
for (const f of readdirSync(path.join(root, "src/app"), { withFileTypes: true })) {
  if (f.isDirectory() && existsSync(path.join(root, "src/app", f.name, "page.tsx")) && !["vahvista", "api"].includes(f.name)) paths.add("/" + f.name);
}

// Polut omaan tiedostoonsa, jotta selaimeen ei päädy koko tietopohja.
const NL = String.fromCharCode(10);
const header =
  ["// AUTOMAATTISESTI KOOTTU: älä muokkaa käsin. Päivitä ajamalla npm run chat:build", "// (ajetaan myös ennen jokaista buildia). Lähde: content/ ja src/app/-sivut."].join(NL) + NL;
writeFileSync(out, header + `export const KNOWLEDGE = ${JSON.stringify(knowledge)};` + NL);
writeFileSync(
  path.join(root, "src/lib/chat/known-paths.generated.ts"),
  header +
    "/** Sivuston polut, joihin botti saa linkittää. */" +
    NL +
    `export const KNOWN_PATHS: readonly string[] = ${JSON.stringify([...paths].sort())};` +
    NL,
);
console.log(`Tietopohja: ${knowledge.length} merkkiä, ${paths.size} polkua`);
