import { Container } from "@/components/Container";

/**
 * Sisältösivujen yhteinen otsikkoalue. Sama rakenne joka sivulla, jotta
 * sivut tuntuvat samalta tuotteelta eikä jokainen keksi omaa taittoaan.
 *
 * `tone` kertoo, kenen sivusta on kyse: `sky` vuokranantajan, `coral`
 * vuokralaisen, ja oletus (`ink`) on yhteinen. Väri on ohut viiva otsikon
 * yllä – ei taustaväri, koska kumpikaan osapuoli ei omista kokonaista sivua.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  tone = "ink",
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  tone?: "ink" | "sky" | "coral";
  children?: React.ReactNode;
}) {
  const bar = tone === "sky" ? "bg-sky" : tone === "coral" ? "bg-coral" : "bg-ink";

  return (
    <section className="border-b border-line bg-paper py-14 md:py-[72px]">
      <Container>
        <span className={`block h-1 w-12 rounded-full ${bar}`} aria-hidden="true" />
        {eyebrow && <p className="mt-5 text-sm font-medium text-ink/60">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-[30px] md:text-[44px]">{title}</h1>
        {lead && <p className="prose-measure mt-5 text-lg text-ink/80">{lead}</p>}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}

/**
 * Sisältöosio otsikolla. Vuorottelee paper/cloud kuten etusivukin.
 */
export function Section({
  title,
  tone = "paper",
  children,
}: {
  title?: string;
  tone?: "paper" | "cloud";
  children: React.ReactNode;
}) {
  return (
    <section
      className={`border-b border-line py-12 md:py-[72px] ${tone === "cloud" ? "bg-cloud" : "bg-paper"}`}
    >
      <Container>
        {title && <h2 className="text-2xl md:text-[30px]">{title}</h2>}
        <div className={title ? "mt-6" : undefined}>{children}</div>
      </Container>
    </section>
  );
}
