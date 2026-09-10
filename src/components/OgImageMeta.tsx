import { getSiteUrl } from "@/lib/resend";

/**
 * OG-kuvan meta-tagit (PLAN.md Vaihe B: "OG-kuvat next/og:llä jokaiselle
 * sivulle"). Kuva itse generoidaan /api/og-reitillä (next/og:n ImageResponse,
 * ks. src/lib/og.tsx ja src/app/api/og/route.tsx).
 *
 * TÄRKEÄÄ: näitä <meta>-tageja EI anneta Next.js:n metadata-APIn
 * `openGraph.images`-kentän kautta, vaan renderöidään suoraan JSX:nä.
 * React 19 nostaa (hoist) sivulla missä tahansa renderöidyt <title>/<meta>/
 * <link>-elementit automaattisesti <head>:iin. Next.js 15.5.25:n
 * `openGraph.images`-metadatakenttä sen sijaan pakottaa KOKO sivun
 * title/description-metadatan striimautumaan pysyvästi <body>:hyn tässä
 * projektissa käytetyllä nonce-CSP:llä (täysin dynaaminen renderöinti,
 * ks. DECISIONS.md) – todennettu selvittämällä asia rakentamalla erillinen
 * diagnostiikkasivu, joka bisektoitiin kunnes syy löytyi. Tämä JSX-reitti
 * välttää bugin kokonaan, koska se ei kulje Next.js:n metadata-resoluution
 * kautta lainkaan.
 */
export function OgImageMeta({ title, eyebrow, alt }: { title: string; eyebrow?: string; alt: string }) {
  const params = new URLSearchParams({ title });
  if (eyebrow) params.set("eyebrow", eyebrow);
  const imageUrl = `${getSiteUrl()}/api/og?${params.toString()}`;

  return (
    <>
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={alt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={imageUrl} />
    </>
  );
}
