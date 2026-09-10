import type { Element as MDXElement, MDXProps } from "mdx/types";
import type { PostFrontmatter, PostSummary } from "@/lib/blog/types";
import { POST_FRONTMATTER, POST_ORDER, isPostSlug, type PostSlug } from "@/lib/blog/registry";

/**
 * Artikkelien sisältö. Yksi staattinen import per artikkeli – EI dynaamista
 * import(`...${slug}...`):ia. Staattinen import varmistaa, että webpack
 * niputtaa jokaisen artikkelin bundleen build-aikana, jolloin ajossa ei
 * tarvita tiedostojärjestelmälukua, joka olisi altis Vercelin serverless-
 * funktioiden "output file tracing" -rajauksille dynaamisilla poluilla.
 */
import * as post01 from "@content/blogi/vuokrasopimuspohja-2027.mdx";
import * as post02 from "@content/blogi/muuttotarkastus-vuokra-asunnossa.mdx";
import * as post03 from "@content/blogi/vuokravakuuden-palautus.mdx";
import * as post04 from "@content/blogi/vuokralaisen-tunnistaminen.mdx";
import * as post05 from "@content/blogi/vuokrakuittaus-ilman-pankkiliittymaa.mdx";
import * as post06 from "@content/blogi/mita-suositukseen-saa-kirjoittaa.mdx";
import * as post07 from "@content/blogi/vuokrankorotus-indeksiehto-ja-ilmoitusaika.mdx";
import * as post08 from "@content/blogi/vuokrasuhteen-paattyminen-reilusti.mdx";

type MDXContent = (props: MDXProps) => MDXElement;

const CONTENT_BY_SLUG: Record<PostSlug, MDXContent> = {
  "vuokrasopimuspohja-2027": post01.default,
  "muuttotarkastus-vuokra-asunnossa": post02.default,
  "vuokravakuuden-palautus": post03.default,
  "vuokralaisen-tunnistaminen": post04.default,
  "vuokrakuittaus-ilman-pankkiliittymaa": post05.default,
  "mita-suositukseen-saa-kirjoittaa": post06.default,
  "vuokrankorotus-indeksiehto-ja-ilmoitusaika": post07.default,
  "vuokrasuhteen-paattyminen-reilusti": post08.default,
};

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
