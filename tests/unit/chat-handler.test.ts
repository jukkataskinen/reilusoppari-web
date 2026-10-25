import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildSystemText, handleChat, resetChatState, type ChatModel } from "@/lib/chat/handler";
import { SYSTEM_PROMPT } from "@/lib/chat/prompt";
import { KNOWLEDGE } from "@/lib/chat/knowledge.generated";

const SITE = "https://reilusoppari.fi";
const KEYS = [
  "ANTHROPIC_API_KEY",
  "CHAT_MODEL",
  "CHAT_DAILY_BUDGET_USD",
  "CHAT_RATE_LIMIT_PER_MINUTE",
  "CHAT_RATE_LIMIT_PER_HOUR",
] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

// Anthropicia ei kutsuta testeissä: malli on mock.
function mockModel(chunks = ["Hei ", "maailma"], usage: Record<string, number> = { input_tokens: 10, output_tokens: 5 }) {
  const calls: Parameters<ChatModel["stream"]>[0][] = [];
  const model: ChatModel = {
    stream(args) {
      calls.push(args);
      return {
        text: (async function* () {
          for (const c of chunks) yield c;
        })(),
        usage: async () => usage,
      };
    },
  };
  return { model, calls };
}

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://reilusoppari.fi/api/chat", {
    method: "POST",
    headers: {
      origin: SITE,
      host: "reilusoppari.fi",
      "content-type": "application/json",
      "x-forwarded-for": "1.2.3.4",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}
const ok = { messages: [{ role: "user", content: "Mitä vuokrasuhde maksaa?" }] };
const deps = (model?: ChatModel) => ({ model, siteUrl: SITE, launchNote: "TILANNE" });

beforeEach(() => {
  resetChatState();
  for (const k of KEYS) delete process.env[k];
  vi.spyOn(console, "info").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("handleChat", () => {
  it("suoratoistaa mallin vastauksen", async () => {
    const { model, calls } = mockModel();
    const res = await handleChat(req(ok), deps(model));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hei maailma");
    expect(calls[0].model).toBe("claude-sonnet-5-5");
    expect(calls[0].system).toContain("TIETOPOHJA");
  });

  it("käyttää mallia ympäristömuuttujasta", async () => {
    process.env.CHAT_MODEL = "claude-opus-5-5";
    const { model, calls } = mockModel();
    await (await handleChat(req(ok), deps(model))).text();
    expect(calls[0].model).toBe("claude-opus-5-5");
  });

  it("palauttaa 503 kun avainta ei ole (ei kaadu)", async () => {
    const res = await handleChat(req(ok), deps(undefined));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "not_configured" });
  });

  it("hylkää väärän originin ennen mallikutsua", async () => {
    const { model, calls } = mockModel();
    const res = await handleChat(req(ok, { origin: "https://evil.example" }), deps(model));
    expect(res.status).toBe(403);
    expect(calls).toHaveLength(0);
  });

  it("hylkää virheellisen ja liian pitkän syötteen", async () => {
    const { model, calls } = mockModel();
    expect((await handleChat(req({ messages: [] }), deps(model))).status).toBe(400);
    const long = { messages: [{ role: "user", content: "a".repeat(5000) }] };
    expect((await handleChat(req(long), deps(model))).status).toBe(413);
    expect(calls).toHaveLength(0);
  });

  it("rajoittaa pyyntöjen määrää IP:tä kohti", async () => {
    process.env.CHAT_RATE_LIMIT_PER_MINUTE = "2";
    const { model } = mockModel();
    expect((await handleChat(req(ok), deps(model))).status).toBe(200);
    expect((await handleChat(req(ok), deps(model))).status).toBe(200);
    const third = await handleChat(req(ok), deps(model));
    expect(third.status).toBe(429);
    expect(await third.json()).toEqual({ error: "rate_limited" });
    // Toinen IP pääsee läpi.
    expect((await handleChat(req(ok, { "x-forwarded-for": "9.9.9.9" }), deps(model))).status).toBe(200);
  });

  it("sulkeutuu kun päiväbudjetti ylittyy", async () => {
    process.env.CHAT_DAILY_BUDGET_USD = "0.01";
    const { model } = mockModel(["x"], { input_tokens: 1_000_000, output_tokens: 0 });
    await (await handleChat(req(ok), deps(model))).text();
    const res = await handleChat(req(ok, { "x-forwarded-for": "5.5.5.5" }), deps(model));
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "budget_exceeded" });
  });

  it("ei kirjaa viestien sisältöä lokiin", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const { model } = mockModel();
    const secret = "salainen-henkilotieto-12345";
    await (await handleChat(req({ messages: [{ role: "user", content: secret }] }), deps(model))).text();
    const logged = info.mock.calls.map((c) => String(c[0])).join("\n");
    expect(logged).toContain('"event":"ok"');
    expect(logged).not.toContain(secret);
    expect(logged).not.toContain("Hei maailma");
  });
});

describe("järjestelmäohje", () => {
  it("torjuu ohjeiden ohitusyritykset ja rajaa aiheen", () => {
    expect(SYSTEM_PROMPT).toMatch(/unohtamaan ohjeet/);
    expect(SYSTEM_PROMPT).toMatch(/kieltäydy/);
    expect(SYSTEM_PROMPT).toMatch(/Älä keksi hintoja/);
    expect(SYSTEM_PROMPT).toMatch(/oikeudellista neuvontaa/);
    expect(SYSTEM_PROMPT).toMatch(/Lähde: \[/);
  });

  it("esittää hinnat verollisina eikä käytä kiellettyjä väittämiä myönteisesti", () => {
    expect(SYSTEM_PROMPT).toMatch(/sisältävät arvonlisäveron 25,5 %/);
    expect(SYSTEM_PROMPT).not.toMatch(/ALV 0/);
    expect(SYSTEM_PROMPT).toMatch(/Vuokralaiselle palvelu on aina maksuton/);
    expect(SYSTEM_PROMPT).toMatch(/älä käytä sanoja luottotieto, maksuhäiriö, maksumoraali tai vuokralaisrekisteri/);
    expect(SYSTEM_PROMPT).toMatch(/palvelu ei tee taustatarkistuksia/);
    expect(SYSTEM_PROMPT).toMatch(/aina molempien/);
  });

  it("sisältää tietopohjan hinnat verollisina ja sivuston osiot", () => {
    const text = buildSystemText();
    expect(text).toContain(KNOWLEDGE);
    // Euromuotoilu käyttää sitovaa välilyöntiä, joten \s eikä tavallinen välilyönti.
    expect(KNOWLEDGE).toMatch(/29\s€/);
    expect(KNOWLEDGE).toMatch(/12\s€ \/ asunto \/ vuosi/);
    expect(KNOWLEDGE).toMatch(/15\s€ \/ asunto \/ v/);
    expect(KNOWLEDGE).toContain("ALV 25,5 %");
    expect(KNOWLEDGE).not.toMatch(/ALV 0/);
    expect(KNOWLEDGE).toContain("[/katselmus]");
    expect(KNOWLEDGE).toContain("[/vuokralaiselle]");
  });

  it("ei sisällä luonnosartikkeleita", () => {
    expect(KNOWLEDGE).not.toMatch(/LUONNOS/);
  });

  it("on vakaa (välimuisti): ei päivämääriä tai satunnaisarvoja", () => {
    expect(buildSystemText()).toBe(buildSystemText());
    expect(SYSTEM_PROMPT).not.toMatch(/20\d\d-\d\d-\d\d/);
  });
});
