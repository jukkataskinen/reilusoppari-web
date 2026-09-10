import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { POST_FRONTMATTER, POST_ORDER } from "@/lib/blog/registry";

/**
 * Jokaisen artikkelin .mdx-tiedostossa on ihmisluettava YAML-frontmatter,
 * mutta sovellus lukee metadatan src/lib/blog/registry.ts:n TS-rekisteristä
 * ajonaikaisen tiedostojärjestelmäluvun sijaan (ks. DECISIONS.md). Tämä testi
 * lukee raa'at .mdx-tiedostot suoraan (gray-matter, vain testeissä) ja
 * varmistaa, etteivät kaksi lähdettä pääse eriytymään toisistaan.
 */
describe("blogiartikkelien frontmatter pysyy synkronissa rekisterin kanssa", () => {
  it.each(POST_ORDER)("%s: YAML-frontmatter vastaa src/lib/blog/registry.ts:ää", (slug) => {
    const filePath = path.join(process.cwd(), "content", "blogi", `${slug}.mdx`);
    const raw = readFileSync(filePath, "utf8");
    const { data } = matter(raw);

    const expected = POST_FRONTMATTER[slug];

    expect(data.title).toBe(expected.title);
    expect(data.description).toBe(expected.description);
    expect(data.date).toBe(expected.date);
    expect(data.tags).toEqual(expected.tags);
  });

  it("kaikkien artikkelien description on alle 155 merkkiä", () => {
    for (const slug of POST_ORDER) {
      const { description } = POST_FRONTMATTER[slug];
      expect(description.length, `${slug}: description liian pitkä`).toBeLessThan(155);
    }
  });

  it("julkaisujärjestyksessä ei ole duplikaatteja", () => {
    expect(new Set(POST_ORDER).size).toBe(POST_ORDER.length);
  });

  /**
   * CLAUDE.md kohta 6 vaatii 900–1400 sanaa.
   *
   * UKK- ja Askeleet-komponenttien tekstit lasketaan mukaan, koska ne ovat
   * lukijalle näkyvää artikkelia – UKK-osio on kohdan 6 mukaan pakollinen osa
   * jokaista artikkelia. Ne poimitaan lainausmerkkien sisältä ennen kuin JSX
   * riisutaan, koska muuten koko monirivinen komponentti katoaisi laskennasta.
   */
  function countWords(content: string): number {
    const componentBlocks = content.match(/<(UKK|Askeleet)\b[\s\S]*?\/>/g) ?? [];
    const componentText = componentBlocks
      .flatMap((block) => block.match(/"(?:[^"\\]|\\.)*"/g) ?? [])
      .join(" ");
    const prose = content
      .replace(/<(UKK|Askeleet)\b[\s\S]*?\/>/g, " ")
      .replace(/<\/?[A-Za-z][^>]*>/g, " ");

    return `${prose} ${componentText}`
      .replace(/[#*>[\]()|`\-{}=":]/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
  }

  it.each(POST_ORDER)("%s: pituus on 900–1400 sanaa", (slug) => {
    const filePath = path.join(process.cwd(), "content", "blogi", `${slug}.mdx`);
    const { content } = matter(readFileSync(filePath, "utf8"));
    const words = countWords(content);

    expect(words, `${slug}: ${words} sanaa`).toBeGreaterThanOrEqual(900);
    expect(words, `${slug}: ${words} sanaa`).toBeLessThanOrEqual(1400);
  });

  /**
   * CLAUDE.md kohta 6: jokaisessa artikkelissa on sisäinen linkki
   * /katselmus- tai /verolaskelma-sivulle ja hintoihin.
   */
  it.each(POST_ORDER)("%s: sisältää sisäiset linkit", (slug) => {
    const filePath = path.join(process.cwd(), "content", "blogi", `${slug}.mdx`);
    const { content } = matter(readFileSync(filePath, "utf8"));

    expect(content).toMatch(/\((\/katselmus|\/verolaskelma|\/miten-toimii|\/todistus)\)/);
    expect(content).toContain("(/hinnat)");
  });
});
