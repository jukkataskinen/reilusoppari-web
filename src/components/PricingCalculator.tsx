"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { pricing } from "@content/pricing";
import { formatEuroAuto } from "@/lib/format";
import { estimate } from "@/lib/pricing";

/**
 * Hintalaskuri: asuntojen määrä → vuosihinta (CLAUDE.md kohta 8, vaihe B).
 *
 * Laskenta on kokonaan src/lib/pricing.ts:ssä – tämä komponentti vain näyttää
 * tuloksen. Kertamaksua EI jaeta vuosille, koska se ei ole vuosimaksu; se
 * näytetään omalla rivillään.
 */
export function PricingCalculator({ showLink = true }: { showLink?: boolean }) {
  const apartmentsId = useId();
  const plusId = useId();
  const [apartments, setApartments] = useState(1);
  const [withPlus, setWithPlus] = useState(false);

  const result = estimate(apartments, withPlus);
  const portfolio = result.model === "portfolio";

  return (
    <div className="rounded-[var(--radius-panel)] border border-line bg-cloud p-6">
      <h3 className="text-lg font-bold">Paljonko tämä maksaisi minulle?</h3>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor={apartmentsId} className="block text-sm font-medium">
            Montako asuntoa vuokraat?
          </label>
          <input
            id={apartmentsId}
            type="range"
            min={1}
            max={30}
            step={1}
            value={apartments}
            onChange={(event) => setApartments(Number(event.target.value))}
            className="mt-3 w-full accent-[var(--color-ink)]"
          />
          <p className="mt-1 font-mono text-sm">
            {apartments} {apartments === 1 ? "asunto" : "asuntoa"}
          </p>

          {/*
            Plus-valinta piilotetaan salkkuhinnassa: salkku sisältää jo
            verolaskelman, joten valinnalla ei olisi vaikutusta hintaan.
          */}
          {!portfolio && (
            <label htmlFor={plusId} className="mt-4 flex items-center gap-2.5 text-sm">
              <input
                id={plusId}
                type="checkbox"
                checked={withPlus}
                onChange={(event) => setWithPlus(event.target.checked)}
                className="size-4 accent-[var(--color-ink)]"
              />
              Otan mukaan Plussan (kulut ja verolaskelma)
            </label>
          )}
        </div>

        <div className="rounded-[var(--radius-panel)] border border-line bg-paper p-5">
          <p className="text-sm text-ink/70">{portfolio ? "Salkkuhinta" : "Vuodessa"}</p>
          <p className="mt-1 text-3xl font-extrabold">
            {formatEuroAuto(result.yearly)}
            <span className="text-base font-normal text-ink/70"> / v</span>
          </p>
          <p className="mt-2 text-sm text-ink/70">{result.explanation}</p>

          {!portfolio && (
            <p className="mt-4 border-t border-line pt-4 text-sm">
              Lisäksi{" "}
              <strong className="font-medium">
                {formatEuroAuto(pricing.tenancy.fee)} jokaisesta uudesta vuokrasuhteesta
              </strong>{" "}
              – kertamaksuna, ei vuodessa. Ensimmäinen on ilmainen.
            </p>
          )}

          <p className="mt-4 text-sm font-medium text-moss">Vuokralaiselle 0 €.</p>
        </div>
      </div>

      <p className="mt-5 text-sm text-ink/70">
        {portfolio
          ? pricing.portfolio.note
          : `Vähintään ${pricing.portfolio.minApartments} asuntoa siirtyy salkkuhintaan ${formatEuroAuto(pricing.portfolio.yearlyPerApartment)} / asunto / v, joka sisältää kaiken.`}{" "}
        {pricing.vatNote}.
      </p>

      {showLink && (
        <p className="mt-4">
          <Link href="/hinnat" className="font-medium underline underline-offset-4">
            Koko hinnasto
          </Link>
        </p>
      )}
    </div>
  );
}
