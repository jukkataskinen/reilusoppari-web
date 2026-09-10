/**
 * Cloudflare Turnstile -runko yhteydenottolomakkeelle (CLAUDE.md kohta 2 ja 8;
 * PLAN.md Vaihe B: "Turnstile-runko laiskasti alustettuna, ei tunnuksia vielä").
 *
 * TURNSTILE_SITE_KEY/TURNSTILE_SECRET_KEY puuttuvat tälle sivustolle vielä
 * kokonaan (ks. BLOCKERS.md). Kunnes ne on asetettu:
 *  - getTurnstileSiteKey() palauttaa nullin, jolloin ContactForm ei lataa
 *    Turnstile-skriptiä eikä renderöi widgettiä lainkaan (ei CSP-rikkomuksia,
 *    ei konsolivirheitä ilman avainta).
 *  - verifyTurnstileToken() ohittaa varmennuksen (palauttaa true) kun
 *    secret-avainta ei ole asetettu, jotta lomake ei jää täysin lukkoon
 *    ennen kuin Jukka lisää tunnukset.
 */
export function getTurnstileSiteKey(): string | null {
  return process.env.TURNSTILE_SITE_KEY?.trim() || null;
}

function getTurnstileSecretKey(): string | null {
  return process.env.TURNSTILE_SECRET_KEY?.trim() || null;
}

export async function verifyTurnstileToken(token: string | null): Promise<boolean> {
  const secret = getTurnstileSecretKey();
  if (!secret) return true; // Ei vielä käytössä, ks. BLOCKERS.md.
  if (!token) return false;

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data: unknown = await response.json();
    return Boolean(data && typeof data === "object" && "success" in data && data.success === true);
  } catch {
    return false;
  }
}
