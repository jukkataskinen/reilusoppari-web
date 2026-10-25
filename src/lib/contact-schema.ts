import { z } from "zod";

/**
 * Yhteydenoton aihe ja lähde (Jukka 26.10.2026). Chatin ehdotusnappi esitäyttää aiheen
 * kyselyparametrilla ?aihe=…&lahde=chat. Vain nämä kiinteät arvot hyväksytään, joten
 * URL:iin ei voi päätyä vapaata tekstiä. Reilusopparissa ei ole esittelyä: kuluttaja
 * kysyy, salkun omistaja tai yritys pyytää tarjouksen.
 */
export const CONTACT_TOPICS = ["kysymys", "tarjous", "palaute", "muu"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];
export const CONTACT_TOPIC_LABELS: Record<ContactTopic, string> = {
  kysymys: "Kysymys",
  tarjous: "Tarjous salkulle",
  palaute: "Palaute",
  muu: "Muu asia",
};
export const CONTACT_SOURCES = ["sivusto", "chat"] as const;
export type ContactSource = (typeof CONTACT_SOURCES)[number];

/** Kyselyparametrin arvo aiheeksi; tuntematon arvo antaa oletuksen. */
export function topicFromParam(value: unknown): ContactTopic {
  return typeof value === "string" && (CONTACT_TOPICS as readonly string[]).includes(value) ? (value as ContactTopic) : "kysymys";
}

export function sourceFromParam(value: unknown): ContactSource {
  return value === "chat" ? "chat" : "sivusto";
}

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
  topic: z.enum(CONTACT_TOPICS).catch("muu"),
  source: z.enum(CONTACT_SOURCES).catch("sivusto"),
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
    topic: formData.get("topic") ?? "muu",
    source: formData.get("source") ?? "sivusto",
    company: formData.get("company") ?? "",
    turnstileToken: formData.get("cf-turnstile-response") ?? undefined,
  });
}
