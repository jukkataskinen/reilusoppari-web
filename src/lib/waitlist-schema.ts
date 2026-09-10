import { z } from "zod";

/**
 * Odotuslistalomakkeen validointi (CLAUDE.md kohta 2: sähköposti + "Olen
 * vuokranantaja / vuokralainen / molempia" + asuntojen määrä, joka kysytään
 * vain vuokranantajalta).
 *
 * Erillinen tiedosto ilman "use server" -direktiiviä, jotta skeema on
 * yksikkötestattavissa ilman Resend-riippuvuutta.
 */
export const parties = ["vuokranantaja", "vuokralainen", "molempia"] as const;

export type Party = (typeof parties)[number];

export const partyLabels: Record<Party, string> = {
  vuokranantaja: "Olen vuokranantaja",
  vuokralainen: "Olen vuokralainen",
  molempia: "Molempia",
};

/** Asuntojen määrä kysytään vain näiltä – vuokralaisella ei ole asuntoja. */
export function asksApartments(party: Party): boolean {
  return party === "vuokranantaja" || party === "molempia";
}

/** Yläraja on väärinkirjoitusten torjuntaa, ei tuotesääntö. */
const MAX_APARTMENTS = 1000;

export const waitlistSchema = z
  .object({
    email: z
      .string({ message: "Anna sähköpostiosoite." })
      .trim()
      .toLowerCase()
      .min(1, "Anna sähköpostiosoite.")
      .email("Anna kelvollinen sähköpostiosoite."),
    party: z.enum(parties, { message: "Valitse, kumpi osapuoli olet." }),
    /**
     * Tyhjä kenttä on sallittu myös vuokranantajalle: määrä on hyödyllinen
     * tieto, ei pääsyn ehto. Annettu arvo validoidaan silti.
     */
    apartments: z
      .union([
        z.literal(""),
        z.coerce
          .number({ message: "Anna asuntojen määrä numerona." })
          .int("Anna asuntojen määrä kokonaislukuna.")
          .min(1, "Anna vähintään yksi asunto tai jätä kenttä tyhjäksi.")
          .max(MAX_APARTMENTS, "Ota yhteyttä, jos asuntoja on yli 1000."),
      ])
      .optional(),
    // Honeypot: botit täyttävät usein kaikki kentät. Ihmiskäyttäjälle kenttä
    // on piilotettu, joten sen pitäisi pysyä tyhjänä.
    company: z.string().max(0, "Ohita tämä kenttä."),
  })
  .transform((value) => ({
    email: value.email,
    party: value.party,
    // Vuokralaiselta mahdollisesti tullut määrä heitetään pois: kenttä on
    // hänelle piilotettu, joten arvo voi tulla vain vanhentuneesta lomakkeesta.
    apartments:
      asksApartments(value.party) && typeof value.apartments === "number"
        ? value.apartments
        : undefined,
  }));

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export type WaitlistFieldErrors = Partial<Record<"email" | "party" | "apartments", string>>;

export function parseWaitlistFormData(formData: FormData) {
  const rawApartments = formData.get("apartments");
  return waitlistSchema.safeParse({
    email: formData.get("email"),
    party: formData.get("party"),
    apartments: typeof rawApartments === "string" ? rawApartments.trim() : "",
    company: formData.get("company") ?? "",
  });
}
