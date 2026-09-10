import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { OgImageMeta } from "@/components/OgImageMeta";
import { PageHero, Section } from "@/components/PageHero";
import { PricingCalculator } from "@/components/PricingCalculator";
import { CtaSection } from "@/components/sections/CtaSection";
import { pricingFaq } from "@content/faq";
import { pricing } from "@content/pricing";
import { formatEuroAuto } from "@/lib/format";

const title = "Hinnat";
const description =
  "Ensimmäinen vuokrasuhde ilmainen, sen jälkeen 29 € kertamaksuna. Plus 12 €/asunto/v, salkut 15 €/asunto/v. Vuokralaiselle aina 0 €.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/hinnat" },
  openGraph: { title, description, type: "website" },
};

export default function HinnatPage() {
  return (
    <>
      <OgImageMeta title={title} eyebrow="Hinnasto" alt="Reilusopparin hinnasto" />
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Hinnat", path: "/hinnat" },
        ]}
      />
      <PageHero
        eyebrow="Hinnasto"
        title="Kerran maksettu, koko vuokrasuhteen ajaksi"
        lead="Ei kuukausimaksua eikä käyttäjärajoja. Vuokranantaja maksaa, vuokralainen ei koskaan."
      />

      <Section title="Hinnat">
        <div className="grid gap-6 md:grid-cols-3">
          <PriceCard
            name="Vuokrasuhde"
            price={formatEuroAuto(pricing.tenancy.fee)}
            unit="kertamaksu"
            highlight={`Ensimmäinen ${formatEuroAuto(0)}`}
            items={[...pricing.tenancy.includes]}
            note={`Kattaa vuokrasuhteen enintään ${pricing.tenancy.maxYears} vuodeksi.`}
          />
          <PriceCard
            name={pricing.plus.name}
            price={formatEuroAuto(pricing.plus.yearlyPerApartment)}
            unit="/ asunto / v"
            items={[...pricing.plus.includes]}
            note={pricing.plus.billingNote}
          />
          <PriceCard
            name={pricing.portfolio.name}
            price={formatEuroAuto(pricing.portfolio.yearlyPerApartment)}
            unit="/ asunto / v"
            highlight={`Vähintään ${pricing.portfolio.minApartments} asuntoa`}
            items={[
              "Kaikki vuokrasuhteet ilman kertamaksuja",
              "Katselmukset ja kuittaukset",
              "Huoltokirja asunnoittain",
              "Verolaskelma sisältyy",
            ]}
            note={pricing.portfolio.note}
          />
        </div>

        <p className="mt-6 text-sm text-ink/70">{pricing.vatNote}.</p>

        <div className="mt-6 rounded-[var(--radius-panel)] border border-moss/30 bg-moss/5 p-5">
          <p className="font-medium text-moss">{pricing.tenant.note}</p>
          <p className="mt-1 text-sm text-ink/70">
            Vuokralaiselta ei veloiteta mitään missään vaiheessa – ei sopimuksesta, ei kuvista, ei
            todistuksesta.
          </p>
        </div>
      </Section>

      <Section title="Paljonko tämä maksaisi minulle" tone="cloud">
        <PricingCalculator showLink={false} />
      </Section>

      <Section title="Suosittelu">
        <p className="prose-measure text-ink/80">{pricing.referral}</p>
        <p className="prose-measure mt-3 text-ink/70">
          Etu näkyy tilillä, kun kaveri on tehnyt oman ensimmäisen sopimuksensa. Etuja voi kertyä
          useampia, eivätkä ne vanhene kesken vuokrasuhteen.
        </p>
      </Section>

      <Section title="Usein kysyttyä hinnoista" tone="cloud">
        <FaqList items={pricingFaq} />
      </Section>

      <CtaSection />
    </>
  );
}

function PriceCard({
  name,
  price,
  unit,
  highlight,
  items,
  note,
}: {
  name: string;
  price: string;
  unit: string;
  highlight?: string;
  items: string[];
  note: string;
}) {
  return (
    <div className="flex flex-col rounded-[var(--radius-panel)] border border-line bg-paper p-6">
      <h3 className="text-lg">{name}</h3>
      <p className="mt-3">
        <span className="font-mono text-3xl font-extrabold">{price}</span>{" "}
        <span className="text-sm text-ink/70">{unit}</span>
      </p>
      {highlight && <p className="mt-2 text-sm font-medium text-moss">{highlight}</p>}
      <ul className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-ink/80">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-ink/60">{note}</p>
    </div>
  );
}
