import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/resend";
import { POST_ORDER, POST_FRONTMATTER } from "@/lib/blog/registry";

/**
 * /sitemap.xml (PLAN.md Vaihe B).
 * Next.js generoi tästä automaattisesti oikean XML-muodon
 * (MetadataRoute.Sitemap-tiedostokonventio).
 *
 * Ei sisällä /vahvista-sivua (transaktionaalinen, ei tarkoitettu indeksoitavaksi).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticPaths = [
    "/",
    "/miten-toimii",
    "/vuokranantajalle",
    "/vuokralaiselle",
    "/katselmus",
    "/verolaskelma",
    "/hinnat",
    "/todistus",
    "/ukk",
    "/yhteystiedot",
    "/tietosuoja",
    "/kayttoehdot",
    "/blogi",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = POST_ORDER.map((slug) => {
    const post = POST_FRONTMATTER[slug];
    return {
      url: `${siteUrl}/blogi/${slug}`,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly",
      priority: 0.6,
    };
  });

  return [...staticEntries, ...blogEntries];
}
