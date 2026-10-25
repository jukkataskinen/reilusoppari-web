import Anthropic from "@anthropic-ai/sdk";
import { KNOWLEDGE } from "./knowledge.generated";
import { SYSTEM_PROMPT } from "./prompt";
import { CTA_SEPARATOR, CtaStreamFilter, decideCta, type CtaType } from "./cta";
import {
  DailyBudget,
  RateLimiter,
  estimateCostUsd,
  isAllowedOrigin,
  numberFromEnv,
  validateMessages,
  type ChatMessage,
} from "./limits";

/** Oletusmalli; vaihdettavissa ympäristömuuttujalla CHAT_MODEL. */
export const DEFAULT_MODEL = "claude-sonnet-5-5";
const MAX_OUTPUT_TOKENS = 700;

export type ChatErrorCode =
  | "forbidden_origin"
  | "invalid_body"
  | "too_long"
  | "too_many_messages"
  | "rate_limited"
  | "budget_exceeded"
  | "not_configured"
  | "upstream_error";

const STATUS: Record<ChatErrorCode, number> = {
  forbidden_origin: 403,
  invalid_body: 400,
  too_long: 413,
  too_many_messages: 400,
  rate_limited: 429,
  budget_exceeded: 429,
  not_configured: 503,
  upstream_error: 502,
};

type Usage = {
  input_tokens?: number | null;
  output_tokens?: number | null;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
};

/** Malliyhteys piilotettuna rajapinnan taakse, jotta testit voivat mockata Anthropicin. */
export interface ChatModel {
  stream(args: {
    model: string;
    system: string;
    messages: ChatMessage[];
    launchNote: string;
  }): { text: AsyncIterable<string>; usage: () => Promise<Usage> };
}

export function createAnthropicModel(apiKey: string): ChatModel {
  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 45_000 });
  return {
    stream({ model, system, messages, launchNote }) {
      const stream = client.messages.stream({
        model,
        max_tokens: MAX_OUTPUT_TOKENS,
        // Matala työmäärä ja ei erillistä ajattelua: lyhyt neuvonta ei tarvitse sitä,
        // ja se pienentää viivettä ja kuluja. "between_tools" on Sonnet 5.5:n tapa
        // sulkea ajattelu (disabled palauttaa 400); muille malleille parametri jätetään pois.
        ...(model.startsWith("claude-sonnet-5-5")
          ? { thinking: { type: "between_tools" as const }, output_config: { effort: "low" as const } }
          : {}),
        system: [
          // Tietopohja on kiinteä, joten se välimuistitetaan. Pyyntökohtainen tieto tulee sen jälkeen.
          { type: "text", text: system, cache_control: { type: "ephemeral" } },
          { type: "text", text: launchNote },
        ],
        messages,
      });
      async function* text() {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            yield event.delta.text;
          }
        }
      }
      return { text: text(), usage: async () => (await stream.finalMessage()).usage };
    },
  };
}

export function buildSystemText(): string {
  return `${SYSTEM_PROMPT}\n\nTIETOPOHJA (sivuston oma sisältö; hakasulkeissa sivun polku):\n\n${KNOWLEDGE}`;
}

// Moduulitason tila: jaetaan saman instanssin pyyntöjen kesken (ks. limits.ts).
const state: { limiter?: RateLimiter; burst?: RateLimiter; budget?: DailyBudget } = {};

function limits() {
  state.limiter ??= new RateLimiter(numberFromEnv("CHAT_RATE_LIMIT_PER_HOUR", 30), 60 * 60 * 1000);
  state.burst ??= new RateLimiter(numberFromEnv("CHAT_RATE_LIMIT_PER_MINUTE", 6), 60 * 1000);
  state.budget ??= new DailyBudget(numberFromEnv("CHAT_DAILY_BUDGET_USD", 5));
  return state as Required<typeof state>;
}

/** Testeille: nollaa laskurit. */
export function resetChatState() {
  delete state.limiter;
  delete state.burst;
  delete state.budget;
}

function clientKey(request: Request): string {
  // Vercel asettaa nämä otsakkeet itse, eikä selain voi ohittaa niitä.
  const forwarded = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown").trim();
}

function fail(code: ChatErrorCode, extra?: HeadersInit) {
  return Response.json({ error: code }, { status: STATUS[code], headers: { "Cache-Control": "no-store", ...extra } });
}

/** Lokiin vain määrät ja virhekoodit, ei koskaan viestien sisältöä. */
function log(entry: Record<string, string | number | boolean>) {
  console.info(JSON.stringify({ scope: "chat", ...entry }));
}

export async function handleChat(
  request: Request,
  deps: { model?: ChatModel; siteUrl: string; launchNote: string; ctas?: readonly CtaType[] },
): Promise<Response> {
  if (!isAllowedOrigin(request.headers.get("origin"), request.headers.get("host"), deps.siteUrl)) {
    log({ event: "rejected", code: "forbidden_origin" });
    return fail("forbidden_origin");
  }

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  const model = deps.model ?? (apiKey ? createAnthropicModel(apiKey) : undefined);
  if (!model) return fail("not_configured");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("invalid_body");
  }
  const validated = validateMessages(body);
  if (!validated.ok) {
    log({ event: "rejected", code: validated.code });
    return fail(validated.code);
  }

  const { limiter, burst, budget } = limits();
  const key = clientKey(request);
  if (!burst.allow(key) || !limiter.allow(key)) {
    log({ event: "rejected", code: "rate_limited" });
    return fail("rate_limited", { "Retry-After": "60" });
  }
  if (!budget.hasRoom()) {
    log({ event: "rejected", code: "budget_exceeded" });
    return fail("budget_exceeded");
  }

  const started = Date.now();
  let result: ReturnType<ChatModel["stream"]>;
  try {
    result = model.stream({
      model: process.env.CHAT_MODEL?.trim() || DEFAULT_MODEL,
      system: buildSystemText(),
      messages: validated.messages,
      launchNote: deps.launchNote,
    });
  } catch {
    log({ event: "error", code: "upstream_error" });
    return fail("upstream_error");
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Ehdotustagi poistetaan tekstistä ja lähetetään erottimen jälkeen (ks. cta.ts).
        const filter = new CtaStreamFilter();
        for await (const chunk of result.text) {
          const visible = filter.push(chunk);
          if (visible) controller.enqueue(encoder.encode(visible));
        }
        const tail = filter.flush();
        if (tail.text) controller.enqueue(encoder.encode(tail.text));
        const cta = decideCta(tail.type, validated.messages, deps.ctas ?? []);
        if (cta) controller.enqueue(encoder.encode(`${CTA_SEPARATOR}${JSON.stringify({ cta })}`));
        const usage = await result.usage();
        budget.add(estimateCostUsd(usage));
        log({
          event: "ok",
          ms: Date.now() - started,
          turns: validated.messages.length,
          in: usage.input_tokens ?? 0,
          out: usage.output_tokens ?? 0,
          cacheRead: usage.cache_read_input_tokens ?? 0,
          cacheWrite: usage.cache_creation_input_tokens ?? 0,
          // Seuranta ilman henkilötietoja: keskustelun alku ja näytetyn ehdotuksen tyyppi.
          started: validated.messages.length === 1,
          cta: cta ?? "none",
        });
        controller.close();
      } catch (error) {
        // Vain virheen tyyppi ja tila, ei viestin tekstiä (voisi sisältää käyttäjän syötettä).
        const status = error instanceof Anthropic.APIError ? (error.status ?? 0) : 0;
        log({ event: "error", code: "upstream_error", status });
        controller.error(error);
      }
    },
  });

  return new Response(body$, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
