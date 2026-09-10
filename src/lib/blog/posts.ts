import type { Element as MDXElement, MDXProps } from "mdx/types";
import type { PostFrontmatter, PostSummary } from "@/lib/blog/types";
import { POST_FRONTMATTER, POST_ORDER, isPostSlug, type PostSlug } from "@/lib/blog/registry";

/**
 * Artikkelien sisältö. Yksi staattinen import per artikkeli – EI dynaamista
 * import(`...${slug}...`):ia. Staattinen import varmistaa, että webpack
 * niputtaa jokaisen artikkelin bundleen build-aikana, jolloin ajossa ei
 * tarvita tiedostojärjestelmälukua, joka olisi altis Vercelin serverless-
 * funktioiden "output file tracing" -rajauksille dynaamisilla poluilla.
 *
 * Vaiheessa C tähän tulee rivi per artikkeli:
 *   import * as post01 from "@content/blogi/<slug>.mdx";
 *   ... ja "<slug>": post01.default CONTENT_BY_SLUG:iin.
 */
type MDXContent = (props: MDXProps) => MDXElement;

const CONTENT_BY_SLUG: Record<PostSlug, MDXContent> = {};

export type { PostSlug };
export { POST_ORDER };

export function getAllPostSlugs(): PostSlug[] {
  return [...POST_ORDER];
}

/** Kaikki artikkelit, uusin ensin (listaus- ja RSS-sivuille). */
export function getAllPosts(): PostSummary[] {
  return POST_ORDER.map((slug) => ({ slug, ...POST_FRONTMATTER[slug] })).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function getPostBySlug(
  slug: string,
): { slug: PostSlug; frontmatter: PostFrontmatter; Content: MDXContent } | null {
  if (!isPostSlug(slug)) return null;
  return { slug, frontmatter: POST_FRONTMATTER[slug], Content: CONTENT_BY_SLUG[slug] };
}
