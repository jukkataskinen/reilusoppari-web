import { Sheet, SheetHead } from "./parts";

/**
 * Vuosilaskelma vuokratulosta (CLAUDE.md 5.7).
 *
 * ===========================================================================
 * VAROITUS ON OSA ASIAKIRJAA
 *
 * "Tämä on yhteenveto omista kirjauksistasi, ei veroneuvontaa." Sama lause on
 * laskelmassa itsessään, ja siksi se on myös esimerkissä. Markkinointikuva,
 * josta varoitus on siivottu pois, antaisi asiakirjasta väärän kuvan juuri
 * siinä kohdassa, jossa se eniten haittaa.
 *
 * LUVUISTA EI VOI PÄÄTELLÄ VEROTAKSOJA
 *
 * Esimerkissä on tarkoituksella vain suoria kulueriä eikä kilometrikorvauksia.
 * Kilometririvi paljastaisi laskelmasta km-taksan, ja taksa muuttuu vuosittain
 * (`content/tax-rates.ts`) – markkinointisivu vanhentuisi hiljaa ja kertoisi
 * väärää lukua.
 * ===========================================================================
 */

const rows = [
  { label: "Vuokratulo", value: "10 200 €" },
  { label: "Hoitovastike", value: "−3 480 €" },
  { label: "Vuosikorjaus", value: "−620 €" },
  { label: "Vakuutus", value: "−180 €" },
];

export function TaxReportPreview() {
  return (
    <Sheet label="Verolaskelma vuodelta 2026: vuokratulo 10 200 euroa, hoitovastike 3 480 euroa, vuosikorjaus 620 euroa, vakuutus 180 euroa, verotettava tulo 5 920 euroa. Sinetöity 12.2.2027.">
      <SheetHead
        kicker="Verolaskelma"
        title="Vuokratulo 2026"
        subtitle="Asunto Oy Esimerkki · Helsinki"
        badge={{ text: "sinetöity", done: true }}
      />

      <dl className="mt-3 divide-y divide-line border-b border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-3 py-1.5">
            <dt className="text-[12px] text-ink/70">{row.label}</dt>
            <dd className="font-mono text-[12px]">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex items-baseline justify-between gap-3 pt-2.5">
        <span className="text-[13px] font-semibold">Verotettava tulo</span>
        <span className="font-mono text-[13px] font-semibold">5 920 €</span>
      </div>

      <p className="mt-3 rounded-lg bg-cloud px-2.5 py-2 text-[10px] leading-snug text-ink/70">
        Tämä on yhteenveto omista kirjauksistasi, ei veroneuvontaa.
      </p>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3 text-[10px] text-ink/55">
        <span>14 kuittia liitteenä</span>
        <span className="font-mono">sinetöity 12.2.2027</span>
      </div>
    </Sheet>
  );
}
