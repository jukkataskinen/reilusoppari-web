import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog/posts";
import { formatArticleDate } from "@/lib/blog/format-date";
import { siteUrl } from "@/lib/site";
import { company } from "@content/company";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { frontmatter } = post;
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical: `/blogi/${slug}` },
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description: frontmatter.description,
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.updated ?? frontmatter.date,
      tags: frontmatter.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, Content } = post;
  const url = `${siteUrl}/blogi/${slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated ?? frontmatter.date,
    inLanguage: "fi-FI",
    author: { "@type": "Organization", name: company.name, url: siteUrl },
    publisher: { "@type": "Organization", name: company.name, url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <article className="border-b border-line bg-paper">
      <Container className="py-16 md:py-24">
        <p className="text-sm text-ink/70">
          <Link href="/blogi" className="hover:text-ink">
            Blogi
          </Link>
        </p>
        <h1 className="mt-3 max-w-3xl text-[32px] md:text-[44px]">{frontmatter.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink/70">
          <time dateTime={frontmatter.date}>{formatArticleDate(frontmatter.date)}</time>
          {frontmatter.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-cloud px-2.5 py-0.5 text-xs text-ink/70">
              {tag}
            </span>
          ))}
        </div>

        <div className="article-body prose-measure mt-10">
          <Content />
        </div>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </article>
  );
}
