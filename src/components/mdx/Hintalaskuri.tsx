import { PricingCalculator } from "@/components/PricingCalculator";

/**
 * MDX-komponentti blogiartikkeleihin: sama hintalaskuri kuin /hinnat-sivulla.
 * Erillinen tiedosto vain siksi, että artikkelissa laskuri saa oman marginaalinsa
 * ja linkin hinnastoon – laskenta ja ulkoasu tulevat PricingCalculatorista,
 * jottei hintalogiikkaa ole kahdessa paikassa.
 */
export function Hintalaskuri() {
  return (
    <div className="my-8">
      <PricingCalculator />
    </div>
  );
}
