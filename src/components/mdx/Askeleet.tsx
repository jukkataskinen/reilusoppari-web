/**
 * MDX-komponentti "Askeleet" (CLAUDE.md kohta 8): numeroitu askelsekvenssi
 * blogiartikkeleihin, samalla visuaalisella kielellä kuin etusivun
 * "Kolme askelta" -osio (src/components/sections/Steps.tsx).
 */
export interface Askel {
  title: string;
  description: string;
}

export function Askeleet({ steps }: { steps: Askel[] }) {
  return (
    <ol className="my-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col gap-2">
          <span className="text-sm text-sky">{`0${index + 1}`}</span>
          <p className="text-lg font-medium text-ink">{step.title}</p>
          <p className="text-ink/70">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
