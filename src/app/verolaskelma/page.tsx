import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OgImageMeta } from "@/components/OgImageMeta";
import { PageHero, Section } from "@/components/PageHero";
import { CtaSection } from "@/components/sections/CtaSection";
import { pricing } from "@content/pricing";
import { formatEuroAuto } from "@/lib/format";

const title = "Kulut talteen ja verolaskelma keväällä";
const description =
  "Kirjaa kulut sitä mukaa kun niitä syntyy, niin keväällä on valmis yhteenveto OmaVeron kenttien mukaan. Plus-ominaisuus.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/verolaskelma" },
  openGraph: { title, description, type: "website" },
};

const rows = [
  { label: "Hoitovastike", note: "Kuukausittain, asunnoittain" },
  { label: "Rahoitusvastike", note: "Käsittely riippuu siitä, tuloutetaanko vai rahastoidaanko" },
  { label: "Korjaukset", note: "Vuosikorjaus ja perusparannus eriteltyinä" },
  { label: "Matkakulut", note: "Käynnit asunnolla, kilometrit ja päivämäärät" },
  { label: "Muut kulut", note: "Välityspalkkiot, ilmoitukset, tarvikkeet" },
  { label: "Vuokratulot", note: "Kuittausten mukaan, kuukausittain" },
];

export default function VerolaskelmaPage() {
  return (
    <>
      <OgImageMeta title="Verolaskelma" eyebrow="Plus" alt="Verolaskelma ja kulujen kirjaus" />
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Verolaskelma", path: "/verolaskelma" },
        ]}
      />
      <PageHero
        tone="sky"
        eyebrow="Plus"
        title="Kulut talteen pitkin vuotta, laskelma valmiina keväällä"
        lead="Kuitti kannattaa kirjata silloin kun se on kädessä. Maaliskuussa kenkälaatikon pohjalta ei enää löydy sitä, mitä siellä pitäisi olla."
      />

      <Section title="Mitä laskelma on – ja mitä se ei ole" tone="cloud">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="prose-measure text-ink/80">
            <p>
              Verolaskelma on yhteenveto omista kirjauksistasi OmaVeron kenttien mukaan. Se kertoo,
              mihin kohtaan mikäkin summa kuuluu ja mistä se on peräisin.
            </p>
            <p className="mt-4">
              Se ei ole veroneuvontaa eikä veroilmoituksen tekemistä puolestasi. Vastuu ilmoituksesta
              on aina sinulla, ja laskelman tarkoitus on tehdä siitä nopeaa ja tarkistettavaa.
            </p>
          </div>
          <figure className="flex justify-center rounded-[var(--radius-panel)] border border-line bg-paper p-8">
            <Image
              src="/illustrations/verolaskelma.svg"
              alt="Kuitit kansiossa ja valmis yhteenveto"
              width={300}
              height={225}
              unoptimized
              className="w-full max-w-[260px]"
            />
          </figure>
        </div>
      </Section>

      <Section title="Mitä laskelmassa on">
        <dl className="divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
              <dt className="font-medium">{row.label}</dt>
              <dd className="text-ink/70">{row.note}</dd>
            </div>
          ))}
        </dl>
        <p className="prose-measure mt-6 text-ink/70">
          Jokainen rivi on avattavissa niihin kirjauksiin, joista se koostuu. Jos luku näyttää
          oudolta, näet yhdellä klikkauksella mistä se tuli.
        </p>
      </Section>

      <Section title="Mitä Plus maksaa" tone="cloud">
        <div className="prose-measure text-ink/80">
          <p>
            Kulujen ja kuittien kirjaaminen on ilmaista. Plus veloitetaan vasta kun tulostat
            ensimmäisen verolaskelman: {formatEuroAuto(pricing.plus.yearlyPerApartment)} asunnolta
            vuodessa.
          </p>
          <p className="mt-4">
            Vähintään {pricing.portfolio.minApartments} asunnon salkussa verolaskelma sisältyy
            salkkuhintaan {formatEuroAuto(pricing.portfolio.yearlyPerApartment)} asunnolta
            vuodessa, eikä sitä veloiteta erikseen.
          </p>
          <p className="mt-6">
            <Link href="/hinnat" className="font-medium underline underline-offset-4">
              Koko hinnasto
            </Link>
          </p>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
