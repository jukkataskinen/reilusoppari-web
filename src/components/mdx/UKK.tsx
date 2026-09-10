/**
 * MDX-komponentti "UKK" (CLAUDE.md kohta 8): artikkelin UKK-osio.
 * Piirtää saitin muun UKK-tyylin mukaisen (ks. src/components/sections/Faq.tsx)
 * details/summary-listan JA upottaa FAQPage-skeeman (kohta 6: "UKK-osio
 * lopussa FAQPage-skeemalla"). Otsikko ("## Usein kysytyt kysymykset")
 * kirjoitetaan itse artikkelin Markdowniin ennen tätä komponenttia, jotta
 * rehype-slug antaa sille ankkurin kuten muillekin H2-otsikoille.
 */
export interface UkkItem {
  question: string;
  answer: string;
}

export function UKK({ items }: { items: UkkItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="my-8">
      <div className="divide-y divide-line">
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </div>
  );
}
