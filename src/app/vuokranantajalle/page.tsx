import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OgImageMeta } from "@/components/OgImageMeta";
import { PageHero, Section } from "@/components/PageHero";
import { PricingCalculator } from "@/components/PricingCalculator";
import { CtaSection } from "@/components/sections/CtaSection";
import { pricing } from "@content/pricing";
import { formatEuroAuto } from "@/lib/format";

const title = "Vuokranantajalle";
const description =
  "Sopimus pankkitunnuksilla, kuvat asunnon kunnosta, kuukausikuittaus ja verolaskelma keväällä. Ensimmäinen vuokrasuhde on ilmainen.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/vuokranantajalle" },
  openGraph: { title, description, type: "website" },
};

const benefits = [
  {
    title: "Sopimus, joka pitää",
    body: "Vuokrasopimus allekirjoitetaan pankkitunnuksilla tai mobiilivarmenteella. Tiedät, kuka allekirjoitti – ja niin tietää vuokralainenkin sinusta.",
  },
  {
    title: "Kuvat, joita ei tarvitse muistella",
    body: "Alkukatselmuksen kuvat aikaleimataan ja sinetöidään sopimuksen liitteeksi. Muuttopäivänä katsotte samoja kuvia.",
  },
  {
    title: "Kuukausikuittaus yhdellä napilla",
    body: "Kerran kuussa yksi kysymys ja yksi napautus. Vuoden päästä kummallakin on sama maksuhistoria – ilman pankkitiliä.",
  },
  {
    title: "Huoltokirja, joka pysyy järjestyksessä",
    body: "Viat, ilmoitukset ja korjaukset aikajärjestyksessä. Kun asunto vaihtaa vuokralaista, historia ei katoa.",
  },
  {
    title: "Kulut talteen pitkin vuotta",
    body: "Kuitit ja kulut asunnoittain sitä mukaa kun niitä syntyy, eikä maaliskuussa tarvitse kaivaa kenkälaatikkoa.",
  },
  {
    title: "Verolaskelma keväällä",
    body: "Yhteenveto omista kirjauksistasi OmaVeron kenttien mukaan: vastikkeet, korjaukset ja matkakulut eriteltyinä.",
  },
];

export default function VuokranantajallePage() {
  return (
    <>
      <OgImageMeta title={title} eyebrow="Vuokranantajalle" alt="Reilusoppari vuokranantajalle" />
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Vuokranantajalle", path: "/vuokranantajalle" },
        ]}
      />
      <PageHero
        tone="sky"
        eyebrow="Vuokranantajalle"
        title="Paperisota pois, asiat silti todistettavissa"
        lead="Yksi asunto tai kaksikymmentä – Reilusoppari hoitaa sopimuksen, kuvat, kuittaukset ja kevään verolaskelman. Ensimmäinen vuokrasuhde on ilmainen."
      />

      <Section title="Mitä saat">
        <div className="grid gap-8 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div key={benefit.title}>
              <h3 className="text-lg">{benefit.title}</h3>
              <p className="mt-2 text-ink/80">{benefit.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Mitä maksat" tone="cloud">
        <div className="prose-measure">
          <p className="text-ink/80">
            Ensimmäinen vuokrasuhde on ilmainen. Sen jälkeen{" "}
            {formatEuroAuto(pricing.tenancy.fee)} kerran vuokrasuhteelta, koko vuokrasuhteen
            ajaksi, enintään {pricing.tenancy.maxYears} vuodeksi. Ei kuukausimaksua. Vuokralaiselle
            palvelu on aina maksuton.
          </p>
          <p className="mt-4 text-ink/80">
            Kulujen kirjaaminen on ilmaista. Plus – eli verolaskelma – veloitetaan vasta kun
            tulostat ensimmäisen laskelman, {formatEuroAuto(pricing.plus.yearlyPerApartment)}{" "}
            asunnolta vuodessa.
          </p>
        </div>
        <div className="mt-8">
          <PricingCalculator />
        </div>
      </Section>

      <Section title="Salkku">
        <div className="prose-measure text-ink/80">
          <p>
            Vähintään {pricing.portfolio.minApartments} asunnon salkulle hinta on{" "}
            {formatEuroAuto(pricing.portfolio.yearlyPerApartment)} asunnolta vuodessa, ja se
            sisältää kaiken: vuokrasuhteet, katselmukset, kuittaukset ja verolaskelman. Uusi
            vuokrasuhde ei siis maksa erikseen.
          </p>
          <p className="mt-4">
            Salkkuhinta on tarkoitettu siihen, että asuntojen määrä ei tee kirjanpidosta
            kalliimpaa asuntoa kohden – päinvastoin.
          </p>
          <p className="mt-6">
            <Link href="/hinnat" className="font-medium underline underline-offset-4">
              Koko hinnasto ja UKK hinnoista
            </Link>
          </p>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
