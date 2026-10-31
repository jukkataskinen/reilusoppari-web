import { Container } from "@/components/Container";

/**
 * "Edut molemmille osapuolille" (CLAUDE.md kohta 4.4, tekstit Jukan hyväksymät
 * 31.10.2026; huoltokirja ja muut aiemmat edut säilyivät).
 *
 * Kaksi palstaa rinnakkain, EI kortteja. Palstoissa on tarkoituksella yhtä
 * monta riviä ja ne ovat samanpituiset – se on osiota kantava viesti, ei
 * taittoseikka. Jos toiseen lisätään rivi, toiseen on lisättävä myös.
 */
const landlord = [
  "Sähköinen sopimus ja allekirjoitus pankkitunnuksilla",
  "Kuvat asunnon kunnosta sopimuksen liitteenä",
  "Helppo vuokranseuranta",
  "Huoltokirja: viat ja korjaukset talteen",
  "Valmis verolaskelma keväisin (Plus)",
  "Ensimmäinen vuokrasuhde maksuton",
];

const tenant = [
  "Maksuton palvelu",
  "Varmuus vuokranantajan henkilöllisyydestä",
  "Omat kuvat samassa paikassa",
  "Ilmoitus, kun vuokra on kuitattu",
  "Viat kirjattu, kukaan ei voi poistaa",
  "Allekirjoitettu vuokratodistus seuraavaa asuntoa varten",
];

export function MolemmilleJotain() {
  return (
    <section className="border-b border-line bg-cloud py-14 md:py-[88px]">
      <Container>
        <h2 className="text-2xl md:text-[32px]">Edut molemmille osapuolille</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <Column title="Vuokranantaja" tone="sky" items={landlord} />
          <Column title="Vuokralainen" tone="coral" items={tenant} />
        </div>
      </Container>
    </section>
  );
}

function Column({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "sky" | "coral";
  items: string[];
}) {
  const bar = tone === "sky" ? "bg-sky" : "bg-coral";
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${bar}`} aria-hidden="true" />
        <h3 className="text-lg">{title}</h3>
      </div>
      <ul className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
        {items.map((item) => (
          <li key={item} className="text-ink/80">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
