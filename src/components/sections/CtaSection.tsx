import { Container } from "@/components/Container";
import { WaitlistForm } from "@/components/WaitlistForm";
import { isLive, LAUNCH_TARGET } from "@/lib/launch";
import { PrimaryCta } from "@/components/PrimaryCta";

/**
 * Loppu-CTA ja odotuslista (CLAUDE.md kohta 4.10).
 *
 * Odotuslistatilassa lomake on tässä, koska hero-CTA osoittaa ankkuriin
 * `#odotuslista`. Live-tilassa lomaketta ei ole, vaan pelkkä CTA sovellukseen.
 */
export function CtaSection() {
  const live = isLive();

  return (
    <section id="odotuslista" className="scroll-mt-16 bg-paper py-14 md:py-[88px]">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-2xl md:text-[32px]">Aloitetaanko reilusti?</h2>
            <p className="prose-measure mt-4 text-ink/80">
              {live
                ? "Ensimmäinen vuokrasuhde on ilmainen, eikä vuokralaiselle tule kuluja koskaan."
                : `Reilusoppari avautuu ${LAUNCH_TARGET}. Jätä sähköpostisi, niin kerromme kun voit aloittaa – emme lähetä muuta.`}
            </p>
            <p className="mt-4 text-sm text-ink/70">
              Ensimmäinen vuokrasuhde ilmaiseksi · Vuokralaiselle aina maksuton
            </p>
            {live && (
              <div className="mt-8">
                <PrimaryCta size="lg" />
              </div>
            )}
          </div>

          {!live && (
            <div className="rounded-[var(--radius-panel)] border border-line bg-cloud p-6">
              <WaitlistForm />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
