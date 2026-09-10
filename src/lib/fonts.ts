import localFont from "next/font/local";

/**
 * Itse hostatut fontit (CLAUDE.md kohta 5: ei Google Fonts -CDN-kutsuja).
 *
 * `sans-variable.woff2` on **Plus Jakarta Sans** -muuttujafontti (latin-osajoukko,
 * painot 400–800), ladattu kertaalleen Google Fontsista paikalliseksi
 * tiedostoksi ja tarjoiltu omasta domainista. Osajoukko kattaa U+0000–00FF eli
 * myös ä, ö ja å, sekä ajatusviivan ja lainausmerkit. Ks. DECISIONS.md.
 */
export const sans = localFont({
  src: "../../public/fonts/sans-variable.woff2",
  // Hero 800, otsikot 700, leipäteksti 400 (CLAUDE.md kohta 5).
  weight: "400 800",
  style: "normal",
  display: "swap",
  variable: "--font-sans-local",
  // Kokosäädetty varafontti: teksti ei hyppää fontin vaihtuessa (pienempi CLS).
  adjustFontFallback: "Arial",
});

export const jetbrainsMono = localFont({
  src: "../../public/fonts/jetbrains-mono-variable.woff2",
  weight: "400 500",
  style: "normal",
  display: "swap",
  variable: "--font-jetbrains-mono",
  // Monospace vain tiivisteissä ja tarkistuskoodeissa – ei kriittisellä polulla.
  preload: false,
});
