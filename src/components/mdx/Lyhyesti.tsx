import type { ReactNode } from "react";

/**
 * MDX-komponentti "Lyhyesti" (CLAUDE.md kohta 8): yksi tiivistelmälaatikko
 * jokaisen blogiartikkelin alussa (kohta 6: "yksi 'Lyhyesti'-laatikko alussa").
 * Käytössä automaattisesti kaikissa .mdx-tiedostoissa src/mdx-components.tsx:n
 * kautta.
 */
export function Lyhyesti({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 rounded-[var(--radius-panel)] border border-line bg-cloud p-6">
      <p className="font-medium text-ink">Lyhyesti</p>
      <div className="mt-2 text-ink/70 [&>p]:mt-2 [&>p:first-child]:mt-0">{children}</div>
    </div>
  );
}
