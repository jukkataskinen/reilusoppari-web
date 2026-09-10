import Link from "next/link";
import { Container } from "@/components/Container";
import { pricing } from "@content/pricing";
import { formatEuroAuto } from "@/lib/format";

/**
 * Etusivun hintaosio (CLAUDE.md kohta 4.7). Luvut tulevat content/pricing.ts:stä,
 * jotta hinta ei ole kahdessa paikassa eri.
 */
export function HomePricing() {
  return (
    <section className="border-b border-line bg-paper py-14 md:py-[88px]">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <h2 className="text-2xl md:text-[32px]">
              Ensimmäinen vuokrasuhde ilmaiseksi. Sen jälkeen{" "}
              {formatEuroAuto(pricing.tenancy.fee)} – kerran, koko vuokrasuhteen ajaksi.
            </h2>
            <p className="mt-4 text-ink/80">
              Vuokralaiselle {formatEuroAuto(pricing.tenant.price)}.
            </p>
            <p className="mt-2 text-ink/70">
              Plus: kulut ja verolaskelma {formatEuroAuto(pricing.plus.yearlyPerApartment)}
              /asunto/v. Salkut: {formatEuroAuto(pricing.portfolio.yearlyPerApartment)}/asunto/v.
            </p>
            <p className="mt-6">
              <Link href="/hinnat" className="font-medium underline underline-offset-4">
                Koko hinnasto
              </Link>
            </p>
          </div>

          <dl className="rounded-[var(--radius-panel)] border border-line bg-cloud p-6">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink/70">Ensimmäinen vuokrasuhde</dt>
              <dd className="font-mono text-lg">{formatEuroAuto(0)}</dd>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-3">
              <dt className="text-ink/70">Seuraavat, kertamaksu</dt>
              <dd className="font-mono text-lg">{formatEuroAuto(pricing.tenancy.fee)}</dd>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-3">
              <dt className="text-ink/70">Vuokralainen</dt>
              <dd className="font-mono text-lg text-moss">{formatEuroAuto(pricing.tenant.price)}</dd>
            </div>
            <p className="mt-4 text-xs text-ink/60">{pricing.vatNote}.</p>
          </dl>
        </div>
      </Container>
    </section>
  );
}
