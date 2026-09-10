import Image from "next/image";
import { Container } from "@/components/Container";

interface StoryBlockProps {
  /**
   * Jukan kirjoittama, SITOVA teksti (CLAUDE.md kohta 4.3, 4.5 ja 4.6).
   * Näitä kappaleita ei muotoilla uudelleen eikä lyhennetä.
   */
  quote: string;
  /** Yksi asiallinen lause, joka kertoo mitä palvelu oikeasti tekee. */
  fact: string;
  illustration: { src: string; alt: string };
  /** Kuvateksti kuvituksen alla, esim. aikaleima. */
  caption?: string;
  /** Vuorottelu paper / cloud (CLAUDE.md kohta 5). */
  tone?: "paper" | "cloud";
  /** Kuva vasemmalle sen sijaan, että se olisi oikealla. */
  reverse?: boolean;
  children?: React.ReactNode;
}

/**
 * Etusivun kertomusosio: sitova sitaatti, sen vieressä kuvitus ja alla yksi
 * asiallinen lause. Sama rakenne toistuu kolmesti (katselmus, kuittaus,
 * todistus), joten se on yksi komponentti – ei kolmea lähes samaa.
 */
export function StoryBlock({
  quote,
  fact,
  illustration,
  caption,
  tone = "paper",
  reverse = false,
  children,
}: StoryBlockProps) {
  return (
    <section
      className={`border-b border-line py-14 md:py-[88px] ${tone === "cloud" ? "bg-cloud" : "bg-paper"}`}
    >
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className={reverse ? "md:order-2" : undefined}>
            <p className="prose-measure text-xl leading-[1.5] md:text-2xl">{quote}</p>
            <p className="prose-measure mt-6 text-ink/70">{fact}</p>
            {children}
          </div>
          <figure className={reverse ? "md:order-1" : undefined}>
            <div className="flex justify-center rounded-[var(--radius-panel)] border border-line bg-paper p-8">
              <Image
                src={illustration.src}
                alt={illustration.alt}
                width={320}
                height={240}
                unoptimized
                className="w-full max-w-[300px]"
              />
            </div>
            {caption && (
              <figcaption className="mt-3 text-center font-mono text-xs text-ink/60">
                {caption}
              </figcaption>
            )}
          </figure>
        </div>
      </Container>
    </section>
  );
}
