import Link from "next/link";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema, type BreadcrumbEntry } from "@/lib/schema";

/**
 * Näkyvä murupolku + BreadcrumbList-skeema samasta tiedosta (PLAN.md Vaihe B).
 * `entries` alkaa aina Etusivusta ja päättyy nykyiseen sivuun.
 */
export function Breadcrumbs({ entries }: { entries: BreadcrumbEntry[] }) {
  return (
    <nav aria-label="Murupolku" className="border-b border-line bg-cloud">
      <Container className="py-3">
        <JsonLd data={breadcrumbListSchema(entries)} />
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink/70">
          {entries.map((entry, index) => {
            const isLast = index === entries.length - 1;
            return (
              <li key={entry.path} className="flex items-center gap-1.5">
                {index > 0 && <span aria-hidden="true">/</span>}
                {isLast ? (
                  <span className="text-ink" aria-current="page">
                    {entry.name}
                  </span>
                ) : (
                  <Link href={entry.path} className="hover:text-ink">
                    {entry.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
