/**
 * Sivuston oma julkinen osoite (eri asia kuin NEXT_PUBLIC_APP_URL, joka
 * osoittaa app.reilusoppari.fi-sovellukseen). Käytetään RSS-syötteessä ja
 * JSON-LD-skeemoissa absoluuttisten URL:ien muodostamiseen.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://reilusoppari.fi").replace(/\/+$/, "");
