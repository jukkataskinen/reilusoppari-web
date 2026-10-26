import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Kevyt ja turvallinen Markdown-renderöinti botin vastauksille. Tuottaa vain
 * React-elementtejä (ei dangerouslySetInnerHTML), joten vastauksessa oleva
 * HTML näkyy tekstinä eikä suoriudu. Tuetut: kappaleet, **lihavointi**,
 * *kursiivi*, `koodi`, luettelot ja sivuston sisäiset linkit.
 */

const INLINE = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\))/g;

/** Sallii vain tunnetut sisäiset polut; ulkoiset ja muut osoitteet jäävät tekstiksi. */
export function safeInternalHref(href: string, knownPaths: readonly string[]): string | null {
  if (!href.startsWith("/") || href.startsWith("//") || href.includes("\\")) return null;
  const pathOnly = href.split(/[?#]/)[0].replace(/(.)\/$/, "$1");
  return knownPaths.includes(pathOnly) ? href : null;
}

function inline(text: string, knownPaths: readonly string[], keyPrefix: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={key} className="rounded bg-cloud px-1 font-mono text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2 && !part.startsWith("**")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const href = safeInternalHref(link[2], knownPaths);
      if (href) {
        return (
          <Link key={key} href={href} className="font-medium text-ink underline decoration-sky underline-offset-2">
            {link[1]}
          </Link>
        );
      }
      return link[1];
    }
    return part;
  });
}

export function ChatMarkdown({ text, knownPaths }: { text: string; knownPaths: readonly string[] }) {
  const blocks: ReactNode[] = [];
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let list: { ordered: boolean; items: string[] } | null = null;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const key = `p${blocks.length}`;
    blocks.push(<p key={key}>{inline(paragraph.join(" "), knownPaths, key)}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    const key = `l${blocks.length}`;
    const items = list.items.map((item, i) => <li key={`${key}-${i}`}>{inline(item, knownPaths, `${key}-${i}`)}</li>);
    blocks.push(
      list.ordered ? (
        <ol key={key} className="list-decimal pl-5">
          {items}
        </ol>
      ) : (
        <ul key={key} className="list-disc pl-5">
          {items}
        </ul>
      ),
    );
    list = null;
  };

  for (const line of lines) {
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      if (list && list.ordered !== ordered) flushList();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      // Otsikkomerkit (#) poistetaan; botilla ei ole otsikoita.
      paragraph.push(line.replace(/^#{1,6}\s+/, "").trim());
    }
  }
  flushParagraph();
  flushList();

  return <div className="flex flex-col gap-2">{blocks}</div>;
}
