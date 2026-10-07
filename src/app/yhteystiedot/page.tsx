import type { Metadata } from "next";
import { headers } from "next/headers";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OgImageMeta } from "@/components/OgImageMeta";
import { PageHero, Section } from "@/components/PageHero";
import { CtaSection } from "@/components/sections/CtaSection";
import { ContactForm } from "@/components/ContactForm";
import { getTurnstileSiteKey } from "@/lib/turnstile";
import { company, companyAddress, signingProvider } from "@content/company";

const title = "Yhteystiedot";
const description = `Reilusopparin takana on ${company.name}. Yhteystiedot ja Y-tunnus tällä sivulla.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/yhteystiedot" },
  openGraph: { title, description, type: "website" },
};

export default async function YhteystiedotPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const turnstileSiteKey = getTurnstileSiteKey();

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
        lead="Reilusopparin on kehittänyt suomalainen tilitoimistoyrittäjä. Allekirjoitusmoottorina toimii eSinetti, joka on saman yrittäjän toisen yhtiön palvelu."
      />

      <Section title="Yritys">
        <dl className="divide-y divide-line border-y border-line">
          <Row label="Yritys" value={company.name} />
          <Row label="Y-tunnus" value={company.businessId} />
          <Row label="Käyntiosoite" value={companyAddress()} />
          <Row label="Palvelu" value="Reilusoppari (reilusoppari.fi)" />
          {/*
            eSinetti on eri yhtiön tuote, ja se kerrotaan tässä eikä
            alaviitteenä: allekirjoitus ja tunnistautuminen ovat se kohta,
            jossa käyttäjän tiedot siirtyvät toiselle yritykselle.
          */}
          <Row
            label="Allekirjoitusmoottori"
            value={`${signingProvider.product} · ${signingProvider.name} (Y-tunnus ${signingProvider.businessId})`}
          />
        </dl>
      </Section>

      <Section title="Yhteydenotot" tone="cloud">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_1fr]">
          <div className="max-w-xl">
            <ContactForm turnstileSiteKey={turnstileSiteKey} nonce={nonce} />
          </div>
          <div className="prose-measure text-ink/80">
            {/*
              Lomake lähettää viestin suoraan. Kirjeitse-vaihtoehto jää
              rinnalle niille, jotka eivät halua käyttää lomaketta – ja
              tietosuojaselosteen vaatimille yhteystiedoille on oltava
              osoite myös ilman lomaketta (27.9.2026, ks. BLOCKERS.md).
            */}
            <p>
              Voit myös kirjoittaa kirjeitse osoitteeseen {company.name}, {companyAddress()}.
            </p>
            <p className="mt-4">
              Tietosuoja-asioissa merkitse kuoreen tai viestin aiheeksi &quot;Tietosuoja&quot;.
              Tarkemmin tietosuojaselosteessa.
            </p>
          </div>
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
