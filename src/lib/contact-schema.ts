import { z } from "zod";

/**
 * Yhteydenottolomakkeen validointi (PLAN.md Vaihe D: "Yhteydenottotapa").
 * Sama rakenne kuin src/lib/waitlist-schema.ts ja sisarprojektin
 * (esinetti-web) contact-schema.ts – ei organisaatiokenttää, koska
 * Reilusoppari on kuluttajatuote.
 *
 * Tietoturva (CLAUDE.md kohta 9.4): viestin sisältöä ei koskaan lokiteta;
 * kentät rajattu pituudeltaan syötteen väärinkäytön varalta.
 */
export const contactSchema = z.object({
  name: z
    .string({ message: "Kerro nimesi." })
    .trim()
    .min(1, "Kerro nimesi.")
    .max(200, "Nimi on liian pitkä."),
  email: z
    .string({ message: "Kerro sähköpostiosoitteesi." })
    .trim()
    .toLowerCase()
    .min(1, "Kerro sähköpostiosoitteesi.")
    .email("Tarkista sähköpostiosoite."),
  message: z
    .string({ message: "Kerro asiasi." })
    .trim()
    .min(10, "Kerro asiasi vähän tarkemmin (vähintään 10 merkkiä).")
    .max(4000, "Viesti on liian pitkä."),
  // Honeypot: piilotettu ihmiskäyttäjiltä, botit täyttävät sen usein.
  company: z.string().max(0, "Ohita tämä kenttä."),
  // Läsnä vain jos Turnstile-widget on renderöity (site key asetettu).
  turnstileToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<"name" | "email" | "message" | "turnstile", string>>;

export function parseContactFormData(formData: FormData) {
  return contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company") ?? "",
    turnstileToken: formData.get("cf-turnstile-response") ?? undefined,
  });
}
