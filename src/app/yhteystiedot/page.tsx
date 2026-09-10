import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OgImageMeta } from "@/components/OgImageMeta";
import { PageHero, Section } from "@/components/PageHero";
import { CtaSection } from "@/components/sections/CtaSection";

const title = "Yhteystiedot";
const description = "Reilusopparin takana on Adepta Oy, suomalainen tilitoimisto Joutsasta.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/yhteystiedot" },
  openGraph: { title, description, type: "website" },
};

export default function YhteystiedotPage() {
  return (
    <>
      <OgImageMeta title={title} eyebrow="Yhteystiedot" alt="Reilusopparin yhteystiedot" />
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Yhteystiedot", path: "/yhteystiedot" },
        ]}
      />
      <PageHero
        eyebrow="Yhteystiedot"
        title="Kuka tämän takana on"
        lead="Reilusopparin on kehittänyt suomalainen tilitoimistoyrittäjä. Sama talo pyörittää eSinetti-allekirjoituspalvelua, jonka moottorilla Reilusoppari toimii."
      />

      <Section title="Yritys">
        <dl className="divide-y divide-line border-y border-line">
          <Row label="Yritys" value="Adepta Oy" />
          <Row label="Y-tunnus" value="2237131-2" />
          <Row label="Kotipaikka" value="Joutsa" />
          <Row label="Palvelu" value="Reilusoppari (reilusoppari.fi)" />
        </dl>
      </Section>

      <Section title="Yhteydenotot" tone="cloud">
        <div className="prose-measure text-ink/80">
          <p>
            Palvelu on rakenteilla, ja odotuslistalle liittyneille kerrotaan sähköpostilla, kun se
            avautuu. Jos haluat kysyä jotain jo nyt, jätä sähköpostiosoitteesi odotuslistalle ja
            mainitse asiasi vastausviestissä.
          </p>
          <p className="mt-4">
            Tietosuojaan liittyvissä asioissa yhteydenottotavat kuvataan tietosuojaselosteessa.
          </p>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
      <dt className="text-ink/70">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
