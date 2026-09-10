import type { FaqItem } from "@content/faq";
import { JsonLd } from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/schema";

/**
 * Yleiskäyttöinen UKK-lista + FAQPage-skeema samasta datasta.
 * Käytetään etusivulla (src/components/sections/Faq.tsx) ja
 * Vaihe B:n sivuilla (hinnoittelu, toimialasivut).
 */
export function FaqList({ items, heading }: { items: FaqItem[]; heading?: string }) {
  return (
    <div>
      <JsonLd data={faqPageSchema(items)} />
      {heading && <h2 className="text-[26px] text-ink md:text-[32px]">{heading}</h2>}
      <div className={`divide-y divide-line ${heading ? "mt-8" : ""}`}>
        {items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-ink">
              <span className="font-medium">{item.question}</span>
              <span
                className="shrink-0 text-ink/70 transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="prose-measure mt-3 text-ink/70">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
