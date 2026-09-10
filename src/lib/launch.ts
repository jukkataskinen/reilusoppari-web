/**
 * LAUNCH_MODE-logiikka (CLAUDE.md kohta 2).
 *
 * "waitlist": CTA on "Liity odotuslistalle", hinnat merkitään
 *   "Avautuu kesällä 2027" -tekstillä.
 * "live": CTA on "Aloita ilmaiseksi" ja ohjaa app.reilusoppari.fi:hin.
 *
 * Kaikki sivuston CTA:t lukevat tilan tämän tiedoston kautta
 * (ks. src/components/PrimaryCta.tsx) – ei suoria process.env-lukuja muualla.
 */
export type LaunchMode = "waitlist" | "live";

const DEFAULT_MODE: LaunchMode = "waitlist";

/** Tavoitelanseeraus (CLAUDE.md kohta 2). Näytetään odotuslistatilassa. */
export const LAUNCH_TARGET = "kesällä 2027";

export function getLaunchMode(): LaunchMode {
  const raw = process.env.LAUNCH_MODE?.trim().toLowerCase();
  if (raw === "live") return "live";
  if (raw === "waitlist") return "waitlist";
  return DEFAULT_MODE;
}

export function isLive(): boolean {
  return getLaunchMode() === "live";
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://app.reilusoppari.fi";
}

export function getSignupUrl(): string {
  return `${getAppUrl()}/aloita`;
}
