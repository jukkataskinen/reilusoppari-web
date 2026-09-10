import Link from "next/link";
import { Container } from "@/components/Container";
import { FaqList } from "@/components/FaqList";
import { homeFaq } from "@content/faq";

/**
 * Etusivun UKK (CLAUDE.md kohta 4.9): kuusi kysymystä, lyhyet vastaukset.
 * Laajemmat vastaukset ovat /ukk-sivulla.
 *
 * FAQPage-skeema tulee FaqList-komponentista, joka renderöi sen samasta
 * datasta – siksi sitä ei lisätä tässä uudestaan.
 */
export function Faq() {
  return (
    <section className="border-b border-line bg-cloud py-14 md:py-[88px]">
      <Container>
        <h2 className="text-2xl md:text-[32px]">Usein kysyttyä</h2>
        <div className="mt-8">
          <FaqList items={homeFaq} />
        </div>
        <p className="mt-8">
          <Link href="/ukk" className="font-medium underline underline-offset-4">
            Kaikki kysymykset
          </Link>
        </p>
      </Container>
    </section>
  );
}
