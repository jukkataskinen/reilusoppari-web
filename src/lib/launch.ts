/**
 * LAUNCH_MODE-logiikka (CLAUDE.md kohta 2).
 *
 * Kolme tilaa:
 *
 * - `soon` (OLETUS): palvelu avautuu pian, odotuslistaa ei kerätä. CTA ohjaa
 *   lukemaan miten palvelu toimii. Tämä on oletus tarkoituksella: ilman
 *   ympäristömuuttujaa sivusto ei voi näyttää lomaketta, joka ei toimi.
 * - `waitlist`: odotuslistalomake näkyy ja kerää sähköposteja. Edellyttää
 *   Resend-asetukset (`RESEND_API_KEY`, `RESEND_SEGMENT_ID`).
 * - `live`: CTA on "Aloita ilmaiseksi" ja ohjaa app.reilusoppari.fi:hin.
 *
 * Kaikki sivuston CTA:t lukevat tilan tämän tiedoston kautta
 * (ks. src/components/PrimaryCta.tsx) – ei suoria process.env-lukuja muualla.
 *
 * Oletuksen vaihto `waitlist` → `soon` tehtiin 2026-09-11, kun odotuslista
 * päätettiin jättää keräämättä. Ks. DECISIONS.md.
 */
export type LaunchMode = "soon" | "waitlist" | "live";

const DEFAULT_MODE: LaunchMode = "soon";

/**
 * Tavoitelanseeraus. Näytetään vain `waitlist`-tilassa, jossa on tarpeen
 * kertoa kuinka pitkästä odotuksesta on kyse. `soon`-tila ei lupaa
 * päivämäärää lainkaan.
 */
export const LAUNCH_TARGET = "kesällä 2027";

export function getLaunchMode(): LaunchMode {
  const raw = process.env.LAUNCH_MODE?.trim().toLowerCase();
  if (raw === "live") return "live";
  if (raw === "waitlist") return "waitlist";
  if (raw === "soon") return "soon";
  return DEFAULT_MODE;
}

export function isLive(): boolean {
  return getLaunchMode() === "live";
}

/** Näytetäänkö odotuslistalomake? Vain `waitlist`-tilassa. */
export function isWaitlistOpen(): boolean {
  return getLaunchMode() === "waitlist";
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://app.reilusoppari.fi";
}

export function getSignupUrl(): string {
  return `${getAppUrl()}/aloita`;
}
