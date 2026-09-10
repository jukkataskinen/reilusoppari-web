import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { OgImageMeta } from "@/components/OgImageMeta";
import { PageHero, Section } from "@/components/PageHero";
import { CtaSection } from "@/components/sections/CtaSection";
import { ukkFaq } from "@content/faq";

const title = "Usein kysyttyä";
const description =
  "Vastauksia sopimuksesta, katselmuksesta, kuittauksista, todistuksesta ja hinnoista – molemmille osapuolille.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/ukk" },
  openGraph: { title, description, type: "website" },
};

export default function UkkPage() {
  return (
    <>
      <OgImageMeta title={title} eyebrow="UKK" alt="Usein kysytyt kysymykset" />
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "UKK", path: "/ukk" },
        ]}
      />
      <PageHero eyebrow="UKK" title={title} lead={description} />

      <Section>
        <FaqList items={ukkFaq} />
      </Section>

      <CtaSection />
    </>
  );
}
