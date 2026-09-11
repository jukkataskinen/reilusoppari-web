import Link from "next/link";
import { Container } from "@/components/Container";
import { WaitlistForm } from "@/components/WaitlistForm";
import { getLaunchMode, LAUNCH_TARGET } from "@/lib/launch";
import { PrimaryCta } from "@/components/PrimaryCta";

/**
 * Loppu-CTA (CLAUDE.md kohta 4.10). Kolme tilaa, ks. `src/lib/launch.ts`:
 *
 * - `live`: CTA sovellukseen.
 * - `waitlist`: lomake tässä, koska hero-CTA osoittaa ankkuriin `#odotuslista`.
 * - `soon`: ei lomaketta eikä päivämäärälupausta – vain se, mitä tiedetään.
 */
export function CtaSection() {
  const mode = getLaunchMode();

  return (
    <section id="odotuslista" className="scroll-mt-16 bg-paper py-14 md:py-[88px]">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-2xl md:text-[32px]">Aloitetaanko reilusti?</h2>
            <p className="prose-measure mt-4 text-ink/80">
              {mode === "live" &&
                "Ensimmäinen vuokrasuhde on ilmainen, eikä vuokralaiselle tule kuluja koskaan."}
              {mode === "waitlist" &&
                `Reilusoppari avautuu ${LAUNCH_TARGET}. Jätä sähköpostisi, niin kerromme kun voit aloittaa – emme lähetä muuta.`}
              {mode === "soon" &&
                "Reilusoppari avautuu pian. Sitä odotellessa kannattaa lukea, mitä vuokrasopimukseen kuuluu ja miten asunnon kunto kannattaa kuvata – ne asiat eivät muutu mihinkään."}
            </p>
            <p className="mt-4 text-sm text-ink/70">
              Ensimmäinen vuokrasuhde ilmaiseksi · Vuokralaiselle aina maksuton
            </p>

            {mode === "live" && (
              <div className="mt-8">
                <PrimaryCta size="lg" />
              </div>
            )}

            {mode === "soon" && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PrimaryCta size="lg" />
                <Link href="/blogi" className="text-[15px] underline underline-offset-4">
                  Lue blogista
                </Link>
              </div>
            )}
          </div>

          {mode === "waitlist" && (
            <div className="rounded-[var(--radius-panel)] border border-line bg-cloud p-6">
              <WaitlistForm />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
