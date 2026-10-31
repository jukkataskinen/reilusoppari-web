import { Container } from "@/components/Container";

/**
 * "Sopikaa. Kuvatkaa. Kuitatkaa." (CLAUDE.md kohta 4.2). Yläotsikko säilyi,
 * otsikko ja askelten tekstit Jukan hyväksymät 31.10.2026.
 *
 * Numerointi on perusteltua, koska askeleet ovat aito sekvenssi: sopimusta
 * ei voi kuitata ennen kuin se on tehty.
 */
const steps = [
  {
    title: "Tehkää sopimus verkossa",
    body: "Täyttäkää ehdot yhdessä ja allekirjoittakaa pankkitunnuksilla. Molemmat saavat saman asiakirjan.",
  },
  {
    title: "Kuvatkaa asunnon kunto",
    body: "Ottakaa kuvat esimerkiksi parketin jäljistä tai seinistä ja hyväksykää ne osaksi sopimusta. Poismuutossa verrataan kuvia, ei muistikuvia.",
  },
  {
    title: "Kuitatkaa vuokrat yhdellä painalluksella",
    body: "Vuokranantaja kuittaa maksun saapuneeksi, ja vuokralaiselle kertyy maksuhistoria.",
  },
];

export function Steps() {
  return (
    <section className="border-b border-line bg-cloud py-14 md:py-[88px]">
      <Container>
        <p className="text-sm font-medium text-ink/70">Sopikaa. Kuvatkaa. Kuitatkaa.</p>
        <h2 className="mt-2 text-2xl md:text-[32px]">Miten Reilusoppari toimii käytännössä?</h2>
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
