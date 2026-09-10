/**
 * Nonce-pohjainen Content-Security-Policy (CLAUDE.md kohta 8).
 *
 * Nonce pitää generoida per pyyntö, joten tämä rakennetaan middlewaressa
 * (src/middleware.ts), ei next.config.ts:n staattisessa headers()-funktiossa
 * – ks. DECISIONS.md miksi CSP ja muut turvaotsakkeet on jaettu kahteen
 * tiedostoon.
 *
 * https://challenges.cloudflare.com on sallittu ETUKÄTEEN Turnstile-widgetiä
 * varten (PLAN.md Vaihe B: /yhteystiedot), vaikka TURNSTILE_SITE_KEY ei ole
 * vielä asetettu (ks. BLOCKERS.md) – src/components/ContactForm.tsx ei lataa
 * widgetin skriptiä ennen kuin site key on olemassa, joten tästä ei aiheudu
 * turhia verkkopyyntöjä nyt, mutta CSP:tä ei tarvitse muistaa päivittää
 * enää erikseen kun avain lisätään.
 */
export function buildCsp(nonce: string): string {
  // Next.js:n dev-palvelimen webpack HMR/Fast Refresh -runtime käyttää eval():ia
  // lähdekarttojen ajamiseen — ilman 'unsafe-eval':ia CSP kaataa koko sivun
  // hydraation kehityksessä (nähtiin oikeasti: "Kolme askelta" ym. JS-ohjatut
  // osiot jäivät tyhjiksi, konsolissa "Evaluating a string as JavaScript
  // violates CSP"). Tuotannossa (`next build && next start`/Vercel) eval():ia
  // ei käytetä, joten pidetään CSP täysin tiukkana vain siellä.
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' https://plausible.io https://challenges.cloudflare.com`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://plausible.io https://challenges.cloudflare.com`;

  const directives = [
    `default-src 'self'`,
    scriptSrc,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data:`,
    `font-src 'self'`,
    `connect-src 'self' https://plausible.io https://challenges.cloudflare.com`,
    `frame-src https://challenges.cloudflare.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ];
  return directives.join("; ");
}
