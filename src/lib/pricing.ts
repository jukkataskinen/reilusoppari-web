import { pricing } from "@content/pricing";
import { formatEuroAuto } from "@/lib/format";

/**
 * Hinnoittelun laskenta yhdessä paikassa (CLAUDE.md kohta 2). Kaikki
 * hintalaskelmat sivustolla kutsuvat näitä – ei omia kaavoja komponenteissa.
 *
 * Laskenta tehdään sentteinä kokonaislukuina, jotta liukuluvut eivät tuota
 * 133,50000000000003-tyyppisiä arvoja muotoiluun asti.
 */

function toCents(value: number): number {
  return Math.round(value * 100);
}

function normalizeApartments(apartments: number): number {
  if (!Number.isFinite(apartments)) return 0;
  return Math.max(0, Math.floor(apartments));
}

/** Onko asuntomäärä salkkuhinnan piirissä (vähintään 5 asuntoa)? */
export function isPortfolio(apartments: number): boolean {
  return normalizeApartments(apartments) >= pricing.portfolio.minApartments;
}

/** Salkkuhinta vuodessa annetulle asuntomäärälle. */
export function portfolioYearly(apartments: number): number {
  const count = normalizeApartments(apartments);
  return (toCents(pricing.portfolio.yearlyPerApartment) * count) / 100;
}

/** Plussan vuosihinta annetulle asuntomäärälle (ilman vuokrasuhdemaksuja). */
export function plusYearly(apartments: number): number {
  const count = normalizeApartments(apartments);
  return (toCents(pricing.plus.yearlyPerApartment) * count) / 100;
}

/**
 * Vuokrasuhteiden kertamaksut yhteensä, kun ensimmäinen on ilmainen.
 * `tenancies` on uusien vuokrasuhteiden määrä, ei asuntojen.
 */
export function tenancyFeesTotal(tenancies: number): number {
  const count = normalizeApartments(tenancies);
  const billable = pricing.tenancy.freeFirst ? Math.max(0, count - 1) : count;
  return (toCents(pricing.tenancy.fee) * billable) / 100;
}

export type PriceEstimate = {
  /** Käytössä oleva malli: alle 5 asuntoa vai salkku. */
  model: "tenancy" | "portfolio";
  apartments: number;
  /** Toistuva vuosihinta euroina. */
  yearly: number;
  /** Kertaluonteiset vuokrasuhdemaksut euroina (salkussa aina 0). */
  oneOff: number;
  /** Yhden rivin selitys laskutavasta. */
  explanation: string;
};

/**
 * Vuosihinta-arvio hinnastosivun laskurille (CLAUDE.md kohta 8, vaihe B).
 *
 * Alle 5 asunnon vuokranantajalla toistuvaa maksua syntyy vain Plussasta;
 * vuokrasuhteen 29 € on kertamaksu, joka esitetään erikseen eikä sitä
 * jaeta vuosille – muuten sivu antaisi ymmärtää, että kyseessä on
 * vuosimaksu, mitä se ei ole.
 *
 * @param apartments asuntojen määrä
 * @param withPlus otetaanko Plus mukaan (ei vaikutusta salkkuhinnassa)
 * @param newTenanciesPerYear montako uutta vuokrasuhdetta vuodessa alkaa
 */
export function estimate(
  apartments: number,
  withPlus: boolean,
  newTenanciesPerYear = 1,
): PriceEstimate {
  const count = normalizeApartments(apartments);

  if (isPortfolio(count)) {
    return {
      model: "portfolio",
      apartments: count,
      yearly: portfolioYearly(count),
      oneOff: 0,
      explanation: `${count} × ${formatEuroAuto(pricing.portfolio.yearlyPerApartment)} / asunto / v`,
    };
  }

  const yearly = withPlus ? plusYearly(count) : 0;
  const oneOff = tenancyFeesTotal(newTenanciesPerYear);
  const parts: string[] = [];
  if (withPlus && count > 0) {
    parts.push(`Plus ${count} × ${formatEuroAuto(pricing.plus.yearlyPerApartment)} / asunto / v`);
  }
  parts.push(
    oneOff > 0
      ? `${formatEuroAuto(pricing.tenancy.fee)} / uusi vuokrasuhde`
      : "ensimmäinen vuokrasuhde ilmainen",
  );

  return {
    model: "tenancy",
    apartments: count,
    yearly,
    oneOff,
    explanation: parts.join(" · "),
  };
}

/**
 * Salkkuhinnan raja lauseena, yksi totuus etusivulle ja hinnastoon:
 * "Vähintään 5 asuntoa: 15 € / asunto / v".
 */
export function portfolioLabel(): string {
  return `Vähintään ${pricing.portfolio.minApartments} asuntoa: ${formatEuroAuto(
    pricing.portfolio.yearlyPerApartment,
  )} / asunto / v`;
}

/** Vuokrasuhteen kertamaksu lauseena. */
export function tenancyLabel(): string {
  return `${formatEuroAuto(pricing.tenancy.fee)} kerran, koko vuokrasuhteen ajaksi (enintään ${pricing.tenancy.maxYears} v)`;
}
