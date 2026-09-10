import type { WaitlistFieldErrors } from "@/lib/waitlist-schema";

/**
 * Tyypit ja aloitusarvo erillään src/app/actions/waitlist.ts:stä, koska
 * "use server" -tiedosto saa exportata VAIN async-funktioita (Next.js
 * rajoitus) – vakiot ja tyypit eivät ole sallittuja siellä.
 */
export type WaitlistState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: WaitlistFieldErrors;
};

export const initialWaitlistState: WaitlistState = { status: "idle" };

export type ConfirmWaitlistResult =
  | { status: "confirmed"; email: string }
  | { status: "expired" }
  | { status: "invalid" }
  | { status: "unavailable" }
  | { status: "error" };
