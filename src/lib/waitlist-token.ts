import { createHmac, timingSafeEqual } from "node:crypto";
import type { Party } from "@/lib/waitlist-schema";

/**
 * Kaksoisvarmistuksen (double opt-in) vahvistuslinkin token.
 *
 * CLAUDE.md ei erittele allekirjoitussalaisuutta, mutta kaksoisvarmistus
 * vaatii sellaisen: WAITLIST_TOKEN_SECRET on .env.example:ssa – ks. DECISIONS.md.
 *
 * Token on base64url-koodattu "payload.signature", jossa payload sisältää
 * sähköpostin, osapuolen, asuntojen määrän ja vanhenemisajan. HMAC-SHA256 allekirjoitus
 * estää tokenin väärentämisen. Ei ulkoisia riippuvuuksia (vain node:crypto).
 */
const TOKEN_TTL_MS = 48 * 60 * 60 * 1000; // 48 tuntia

type TokenPayload = {
  email: string;
  party: Party;
  /** Vain vuokranantajalta kysytty, siksi valinnainen. */
  apartments?: number;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.WAITLIST_TOKEN_SECRET;
  if (!secret) {
    // Kehitysympäristössä ei kaadeta buildia/dev-serveriä puuttuvasta
    // salaisuudesta – tuotannossa Jukan pitää asettaa oikea arvo (BLOCKERS.md).
    return "dev-only-insecure-waitlist-secret";
  }
  return secret;
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + padding, "base64").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createWaitlistToken(input: {
  email: string;
  party: Party;
  apartments?: number;
}): string {
  const payload: TokenPayload = {
    email: input.email,
    party: input.party,
    apartments: input.apartments,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export type VerifyWaitlistTokenResult =
  | { valid: true; payload: TokenPayload }
  | { valid: false; reason: "malformed" | "signature" | "expired" };

export function verifyWaitlistToken(token: string): VerifyWaitlistTokenResult {
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, reason: "malformed" };
  const [encodedPayload, signature] = parts;

  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureValid =
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer);

  if (!signatureValid) return { valid: false, reason: "signature" };

  let payload: TokenPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as TokenPayload;
  } catch {
    return { valid: false, reason: "malformed" };
  }

  if (typeof payload.exp !== "number" || Date.now() > payload.exp) {
    return { valid: false, reason: "expired" };
  }

  return { valid: true, payload };
}
