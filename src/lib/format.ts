/**
 * Suomalainen valuuttamuotoilu content/pricing.ts-arvoille.
 * Ei pyöristystä piiloon – näyttää senttiarvot sellaisenaan (0,89 €).
 */
const euroFormatter = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const euroWholeFormatter = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Muotoile senttitarkka hinta, esim. 0.89 -> "0,89 €". */
export function formatEuro(value: number): string {
  return euroFormatter.format(value);
}

/** Muotoile pyöreä kuukausihinta, esim. 246 -> "246 €". */
export function formatEuroWhole(value: number): string {
  return euroWholeFormatter.format(value);
}

/**
 * Laskettu summa: tasaluku ilman desimaaleja ("246 €"), muuten senttitarkasti
 * ("133,50 €"). Käytetään laskureiden ja hintaesimerkkien lopputuloksissa;
 * yksikköhinnat (0,99 € / 0,89 €) näytetään aina senttitarkasti.
 */
export function formatEuroAuto(value: number): string {
  const cents = Math.round(value * 100);
  return cents % 100 === 0 ? formatEuroWhole(cents / 100) : formatEuro(cents / 100);
}
