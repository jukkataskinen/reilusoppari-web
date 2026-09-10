import { renderOgImage } from "@/lib/og";

export const runtime = "edge";

/**
 * OG-kuvat REST-reittinä (next/og:n ImageResponse), EI tiedostokonvention
 * (opengraph-image.tsx) kautta. Ks. DECISIONS.md: tiedostokonventio sai
 * Next.js 15.5.25:n striimaamaan KOKO sivun metadatan (title, meta description)
 * pysyvästi <body>:hyn <head>:n sijaan tässä nonce-CSP-asetuksessa – reitti
 * välttää tämän, koska sitä ei käsitellä automaattisena metadata-tiedostona.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Reilusoppari";
  const eyebrow = searchParams.get("eyebrow") ?? undefined;

  return renderOgImage(title, eyebrow);
}
