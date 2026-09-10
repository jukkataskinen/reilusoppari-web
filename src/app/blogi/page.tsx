import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { getAllPosts } from "@/lib/blog/posts";
import { formatArticleDate } from "@/lib/blog/format-date";
import { LAUNCH_TARGET } from "@/lib/launch";

const description =
  "Käytännön ohjeita vuokranantajalle ja vuokralaiselle: sopimus, muuttotarkastus, vakuus, vuokrankorotus ja vuokratulon verotus.";

export const metadata: Metadata = {
  title: "Blogi",
  description,
  alternates: { canonical: "/blogi" },
};

/**
 * Blogin listaussivu. Artikkelit kirjoitetaan vaiheessa C, joten lista voi
 * olla tyhjä – tyhjä tila kertoo sen suoraan sen sijaan, että sivu näyttäisi
 * rikkinäiseltä.
 */
export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Blogi", path: "/blogi" },
        ]}
      />
      <PageHero eyebrow="Tietopankki" title="Blogi" lead={description} />

      <section className="bg-paper py-12 md:py-[72px]">
        <Container>
          {posts.length === 0 ? (
            <div className="rounded-[var(--radius-panel)] border border-line bg-cloud p-8">
              <h2 className="text-xl">Ensimmäiset artikkelit ovat työn alla</h2>
              <p className="prose-measure mt-3 text-ink/80">
                Tänne tulee käytännön ohjeita vuokrasopimuksesta, muuttotarkastuksesta, vakuudesta
                ja vuokratulon verotuksesta. Ne julkaistaan ennen kuin palvelu avautuu{" "}
                {LAUNCH_TARGET}.
              </p>
              <p className="mt-4">
                <Link href="/#odotuslista" className="font-medium underline underline-offset-4">
                  Liity odotuslistalle, niin kerromme kun ensimmäiset ovat luettavissa
                </Link>
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {posts.map((post) => (
                <li key={post.slug} className="py-6">
                  <Link href={`/blogi/${post.slug}`} className="text-xl font-medium hover:underline">
                    {post.title}
                  </Link>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink/70">
                    <time dateTime={post.date}>{formatArticleDate(post.date)}</time>
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-cloud px-2.5 py-0.5 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="prose-measure mt-2 text-ink/70">{post.description}</p>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
