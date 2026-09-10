import { Resend } from "resend";

/**
 * Laiska Resend-alustus – ei kaadu buildia tai devserveriä puuttuvalla
 * RESEND_API_KEY:llä, samaan tapaan kuin sisarprojektin esinetti-webin vastaava.
 * RESEND_API_KEY/RESEND_SEGMENT_ID puuttuvat vielä kokonaan (ks. BLOCKERS.md)
 * – client palautuu nulliksi kunnes ne on asetettu.
 */
let cachedClient: Resend | null | undefined;

export function getResendClient(): Resend | null {
  if (cachedClient !== undefined) return cachedClient;
  const apiKey = process.env.RESEND_API_KEY;
  cachedClient = apiKey ? new Resend(apiKey) : null;
  return cachedClient;
}

/**
 * Resendin Segment-ID (ei enää "Audience" – Resend on siirtänyt kontaktien
 * ryhmittelyn Audiencesta Segmentteihin, `audienceId` on SDK:ssa deprecated.
 * Ks. DECISIONS.md "Resend: Audience -> Segment -siirtymä".
 */
export function getWaitlistSegmentId(): string | null {
  return process.env.RESEND_SEGMENT_ID?.trim() || null;
}

export function getContactEmail(): string | null {
  return process.env.REILUSOPPARI_CONTACT_EMAIL?.trim() || null;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://reilusoppari.fi";
}

/**
 * Lähettäjäosoite sähköposteille. Oletuksena Resendin testidomain, koska
 * `reilusoppari.fi` ei ole vielä vahvistettu Resendissä (ks. BLOCKERS.md).
 * Vaihda `EMAIL_FROM`-ympäristömuuttujalla kun domain on vahvistettu – ei
 * vaadi koodimuutosta.
 */
export function getEmailFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || "Reilusoppari <onboarding@resend.dev>";
}
