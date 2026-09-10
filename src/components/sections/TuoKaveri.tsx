import { Container } from "@/components/Container";
import { pricing } from "@content/pricing";

/**
 * Suosittelulupaus yhdellä lauseella (CLAUDE.md kohta 4.8). Teksti tulee
 * content/pricing.ts:stä, koska se on hinnoittelulupaus – ei markkinointiteksti,
 * jota saisi muotoilla sivukohtaisesti.
 *
 * Osio on tarkoituksella kapea kaistale: se on lupaus, ei oma tarinansa.
 */
export function TuoKaveri() {
  return (
    <section className="border-b border-line bg-ink py-10 text-paper">
      <Container>
        <p className="text-lg md:text-xl">{pricing.referral}</p>
        <p className="mt-2 text-sm text-cloud/70">
          Etu näkyy tilillä, kun kaveri on tehnyt oman ensimmäisen sopimuksensa.
        </p>
      </Container>
    </section>
  );
}
