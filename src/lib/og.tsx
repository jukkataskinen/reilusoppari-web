import { ImageResponse } from "next/og";

/**
 * Yhteinen OG-kuvapohja jokaiselle Vaihe B:n sivulle (CLAUDE.md kohta 8:
 * "Open Graph -kuva generoituna (next/og) sivun otsikolla ja leimalla").
 *
 * Ei ladata mukautettua fonttia: next/og (Satori) ei tue woff2-tiedostoja,
 * ja projektin ainoat fonttitiedostot (public/fonts/*.woff2) ovat woff2-
 * muodossa (ks. src/lib/fonts.ts). Oletusfontti riittää OG-kuvassa hyvin,
 * koska varsinaisilla sivuilla ei käytetä Google Fonts -CDN:ää (kohta 5/8) –
 * tämä koskee vain kertakertaalleen generoitavaa jaettua kuvaa, ei sivun
 * renderöintiä selaimessa.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function renderOgImage(title: string, eyebrow?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px",
          background: "#1B2A41",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#3D8BFF",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            eS
          </div>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 700 }}>Reilusoppari</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {eyebrow && (
            <div style={{ display: "flex", fontSize: 24, color: "#F3F6FA", opacity: 0.8 }}>
              {eyebrow}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
