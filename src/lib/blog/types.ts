/**
 * Blogiartikkelin metatiedot (CLAUDE.md kohta 2: "frontmatter: title,
 * description, date, updated, tags"). Sama muoto toistetaan kunkin
 * artikkelin .mdx-tiedoston YAML-frontmatterissa (ihmisluettavuutta ja
 * mahdollista tulevaa CMS-siirtoa varten) ja tässä TS-rekisterissä, josta
 * sovellus oikeasti lukee arvot – ks. src/lib/blog/posts.ts ja DECISIONS.md
 * miksi metadataa ei lueta ajonaikaisesti tiedostojärjestelmästä.
 */
export interface PostFrontmatter {
  title: string;
  description: string;
  /** ISO-päivämäärä (YYYY-MM-DD), julkaisupäivä. */
  date: string;
  /** ISO-päivämäärä, jos artikkelia on päivitetty julkaisun jälkeen. */
  updated?: string;
  tags: string[];
}

export interface PostSummary extends PostFrontmatter {
  slug: string;
}
