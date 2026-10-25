/**
 * Onko chat käytössä? Vain kun ANTHROPIC_API_KEY on asetettu (Jukka 26.10.2026).
 *
 * Root layout kutsuu tätä palvelimella ja renderöi chat-painikkeen vain, kun avain on olemassa.
 * Ilman avainta sivustolla ei näy nappia lainkaan, koska nappi, joka avaa ilmoituksen "ei vielä
 * käytössä", on kävijälle turha. Avain luetaan vain palvelimella eikä se koskaan päädy selaimeen.
 */
export function isChatEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.ANTHROPIC_API_KEY?.trim());
}
