import type { ContactFieldErrors, ContactSource, ContactTopic } from "@/lib/contact-schema";

/**
 * Tyypit ja aloitusarvo erillään src/app/actions/contact.ts:stä, koska
 * "use server" -tiedosto saa exportata VAIN async-funktioita (ks. DECISIONS.md
 * vastaava huomio waitlist-state.ts:stä).
 */
export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ContactFieldErrors;
  /** Onnistuneen lähetyksen aihe ja lähde seurantaa varten (ei henkilötietoja). */
  sent?: { topic: ContactTopic; source: ContactSource };
};

export const initialContactState: ContactState = { status: "idle" };
