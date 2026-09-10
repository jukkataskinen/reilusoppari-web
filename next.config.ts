import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";

/**
 * Turvaotsakkeet (CLAUDE.md kohta 8): HSTS, X-Content-Type-Options,
 * Referrer-Policy asetetaan tässä staattisesti kaikille reiteille.
 * Content-Security-Policy vaatii per-pyyntö noncen, joten se asetetaan
 * src/middleware.ts:ssä – ks. DECISIONS.md.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    // remark-frontmatter: tunnistaa ---yaml--- -lohkon jokaisen artikkelin
    // alussa (CLAUDE.md kohta 2: "frontmatter: title, description, date,
    // updated, tags") ja poistaa sen renderöitävästä sisällöstä, ettei se
    // näy raakatekstinä artikkelissa. Metadata itse luetaan erikseen
    // src/lib/blog/posts.ts:ssä TS-rekisteristä (ks. DECISIONS.md miksi ei
    // remark-mdx-frontmatter/gray-matter-ajonaikaista lukua).
    remarkPlugins: [remarkFrontmatter, remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
});

export default withMDX(nextConfig);
