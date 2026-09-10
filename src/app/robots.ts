import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/resend";

/**
 * /robots.txt /vahvista suljetaan indeksoinnilta, koska
 * se on odotuslistan vahvistuslinkin kohdesivu, ei sisältösivu.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/vahvista",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
