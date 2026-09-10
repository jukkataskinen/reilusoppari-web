import { Container } from "@/components/Container";

/**
 * "Sopikaa. Kuvatkaa. Kuitatkaa." (CLAUDE.md kohta 4.2).
 *
 * Numerointi on perusteltua, koska askeleet ovat aito sekvenssi: sopimusta
 * ei voi kuitata ennen kuin se on tehty. Yksi lause per askel, ei enempää.
 */
const steps = [
  {
    title: "Sopikaa",
    body: "Vuokrasopimus täytetään yhdessä ja allekirjoitetaan pankkitunnuksilla – molemmat saavat saman kappaleen.",
  },
  {
    title: "Kuvatkaa",
    body: "Kumpikin kuvaa ne kohdat, jotka itse pitää olennaisina, ja molemmat hyväksyvät kuvat allekirjoituksellaan.",
  },
  {
    title: "Kuitatkaa",
    body: "Kerran kuussa vuokranantaja kuittaa vuokran, ja vuokralainen näkee kuittauksen heti.",
  },
];

export function Steps() {
  return (
    <section className="border-b border-line bg-cloud py-14 md:py-[88px]">
      <Container>
        <h2 className="text-2xl md:text-[32px]">Sopikaa. Kuvatkaa. Kuitatkaa.</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="font-mono text-sm text-ink/60">{`0${index + 1}`}</span>
              <h3 className="mt-2 text-lg">{step.title}</h3>
              <p className="mt-2 text-ink/80">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
