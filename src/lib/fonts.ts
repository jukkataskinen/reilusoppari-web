import localFont from "next/font/local";

/**
 * Itse hostatut fontit (CLAUDE.md kohta 5: ei Google Fonts -CDN-kutsuja).
 *
 * HUOM `sans-variable.woff2`: CLAUDE.md lukitsee leipäfontiksi **Plus Jakarta
 * Sansin**. Tiedostoa ei ole vielä ladattu, joten paikalla on väliaikaisesti
 * esinetti-webin Manrope-muuttujafontti samalla painovälillä. Vaihto tehdään
 * korvaamalla pelkkä woff2-tiedosto – tämä tiedosto ja tokenit eivät muutu.
 * Ks. DECISIONS.md "Leipäfontti: väliaikainen tiedosto".
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
