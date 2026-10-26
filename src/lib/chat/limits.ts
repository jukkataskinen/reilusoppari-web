/**
 * Chatin rajat: syötteen validointi, nopeusrajoitus, päiväbudjetti ja
 * originin tarkistus. Kaikki ilman ulkoista palvelua.
 *
 * Rajoitus: laskurit ovat funktioinstanssin muistissa. Vercelissä jokainen
 * lämmin instanssi laskee omaansa ja kylmäkäynnistys nollaa laskurin, joten
 * rajat ovat "kevyt suoja", eivät tarkka kiintiö. Varsinainen kovakatto on
 * Anthropicin konsolin kuukausiraja (BLOCKERS.md, kohta "Chatbot"). Tämä riittää pitämään
 * yksittäisen väärinkäyttäjän ja vahingossa syntyvän silmukan kurissa.
 */

export const MAX_MESSAGE_CHARS = 800;
export const MAX_MESSAGES = 20;
export const MAX_TOTAL_CHARS = 8000;

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ValidationResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; code: "invalid_body" | "too_long" | "too_many_messages" };

// Poistaa ohjausmerkit (paitsi rivinvaihto ja sarkain), jotka eivät kuulu viestiin.
function clean(text: string): string {
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

/** Tarkistaa selaimelta tulevan keskusteluhistorian muodon ja pituudet. */
export function validateMessages(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) return { ok: false, code: "invalid_body" };
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return { ok: false, code: "invalid_body" };
  if (raw.length > MAX_MESSAGES) return { ok: false, code: "too_many_messages" };

  const messages: ChatMessage[] = [];
  let total = 0;
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i] as { role?: unknown; content?: unknown } | null;
    if (!item || typeof item.content !== "string") return { ok: false, code: "invalid_body" };
    // Vuorottelu: käyttäjä aloittaa ja viimeinen on käyttäjän.
    const expected = i % 2 === 0 ? "user" : "assistant";
    if (item.role !== expected) return { ok: false, code: "invalid_body" };
    const content = clean(item.content);
    if (content.length === 0) return { ok: false, code: "invalid_body" };
    if (content.length > (expected === "user" ? MAX_MESSAGE_CHARS : MAX_MESSAGE_CHARS * 4)) {
      return { ok: false, code: "too_long" };
    }
    total += content.length;
    messages.push({ role: expected, content });
  }
  if (messages[messages.length - 1].role !== "user") return { ok: false, code: "invalid_body" };
  if (total > MAX_TOTAL_CHARS) return { ok: false, code: "too_long" };
  return { ok: true, messages };
}

/** Hyväksyy vain saman sivuston selainpyynnöt (ei muiden sivujen skriptejä). */
export function isAllowedOrigin(
  origin: string | null,
  host: string | null,
  siteUrl: string,
  dev = process.env.NODE_ENV !== "production",
): boolean {
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const allowed = new Set<string>();
  if (host) allowed.add(host);
  try {
    const site = new URL(siteUrl).host;
    allowed.add(site);
    allowed.add(`www.${site}`);
  } catch {
    // siteUrl on aina kelvollinen; ohitetaan varmuuden vuoksi.
  }
  if (dev) {
    allowed.add("localhost:3000");
    allowed.add("127.0.0.1:3000");
  }
  return allowed.has(originHost);
}

type Bucket = { count: number; resetAt: number };

/** Liukumaton aikaikkuna per avain (IP). Palauttaa true jos pyyntö sallitaan. */
export class RateLimiter {
  private buckets = new Map<string, Bucket>();
  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  allow(key: string, now = Date.now()): boolean {
    if (this.buckets.size > 5000) this.sweep(now);
    const bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (bucket.count >= this.limit) return false;
    bucket.count += 1;
    return true;
  }

  private sweep(now: number) {
    for (const [key, bucket] of this.buckets) if (bucket.resetAt <= now) this.buckets.delete(key);
  }
}

/** Päivän kulu dollareina (UTC-päivä). Ylittyessä chat sulkeutuu päivän loppuun. */
export class DailyBudget {
  private day = "";
  private spent = 0;
  constructor(private readonly limitUsd: number) {}

  private roll(now: Date) {
    const day = now.toISOString().slice(0, 10);
    if (day !== this.day) {
      this.day = day;
      this.spent = 0;
    }
  }

  hasRoom(now = new Date()): boolean {
    this.roll(now);
    return this.spent < this.limitUsd;
  }

  add(usd: number, now = new Date()) {
    this.roll(now);
    this.spent += usd;
  }
}

/** Sonnet 5.5 -hinnat dollaria per miljoona tokenia (input / cache-luku / cache-kirjoitus / output). */
const PRICE = { input: 2, cacheRead: 0.2, cacheWrite: 2.5, output: 10 };

export function estimateCostUsd(usage: {
  input_tokens?: number | null;
  output_tokens?: number | null;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
}): number {
  return (
    ((usage.input_tokens ?? 0) * PRICE.input +
      (usage.cache_read_input_tokens ?? 0) * PRICE.cacheRead +
      (usage.cache_creation_input_tokens ?? 0) * PRICE.cacheWrite +
      (usage.output_tokens ?? 0) * PRICE.output) /
    1_000_000
  );
}

export function numberFromEnv(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}
