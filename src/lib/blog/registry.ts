import type { PostFrontmatter } from "@/lib/blog/types";

/**
 * Julkaisujärjestys (CLAUDE.md kohta 6, artikkelit 1–10).
 *
 * Lista on tyhjä, koska artikkelit kirjoitetaan vaiheessa C. Rakenne on
 * valmis: kun artikkeli lisätään, se tulee tähän listaan, saa rivin
 * POST_FRONTMATTER:iin ja importin src/lib/blog/posts.ts:ään. Tyhjä lista
 * ei riko mitään – /blogi näyttää tyhjän tilan ja sivukartta jättää
 * artikkelit pois.
 *
 * Huom CLAUDE.md kohta 9.5: verotusartikkelit 6 ja 7 ovat sivuston
 * uskottavuuden ydin, ja Jukka kirjoittaa tai tarkistaa ne itse.
 */
export const POST_ORDER: readonly string[] = [];

export type PostSlug = string;

/**
 * Metadata jokaiselle artikkelille. Toistaa kunkin artikkelin .mdx-tiedoston
 * YAML-frontmatterin – pidetty erillään MDX-komponenttien importeista
 * (ks. src/lib/blog/posts.ts), jotta tämä tiedosto voidaan lukea myös
 * Vitestissä ilman MDX-kääntäjää.
 */
export const POST_FRONTMATTER: Record<PostSlug, PostFrontmatter> = {};

export function isPostSlug(value: string): value is PostSlug {
  return Object.prototype.hasOwnProperty.call(POST_FRONTMATTER, value);
}
