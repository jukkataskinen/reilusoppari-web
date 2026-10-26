import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CTA_SEPARATOR,
  CTA_TYPES,
  CtaStreamFilter,
  ctaHref,
  ctaTag,
  decideCta,
  splitCtaTrailer,
} from "@/lib/chat/cta";
import { CHAT_CTAS, availableCtas } from "@/lib/chat/config";
import { isChatEnabled } from "@/lib/chat/enabled";
import { handleChat, resetChatState, type ChatModel } from "@/lib/chat/handler";
import { SYSTEM_PROMPT } from "@/lib/chat/prompt";
import { CONTACT_TOPICS, parseContactFormData, sourceFromParam, topicFromParam } from "@/lib/contact-schema";

const SITE = "https://reilusoppari.fi";

function run(chunks: string[]) {
  const f = new CtaStreamFilter();
  let out = "";
  for (const c of chunks) out += f.push(c);
  const tail = f.flush();
  return { text: out + tail.text, type: tail.type };
}

describe("CtaStreamFilter", () => {
  it("poistaa tagin ja palauttaa tyypin", () => {
    expect(run(["Viisi asuntoa maksaa 75 € vuodessa.\n\n[[ehdotus:tarjous]]"])).toEqual({
      text: "Viisi asuntoa maksaa 75 € vuodessa.\n\n",
      type: "tarjous",
    });
  });

  it("ei vuoda tagia, vaikka se tulee pienissä paloissa", () => {
    const chunks = "Vastaus.\n[[ehdotus:konsultaatio]]".split("");
    const f = new CtaStreamFilter();
    const seen: string[] = [];
    for (const c of chunks) seen.push(f.push(c));
    const tail = f.flush();
    const all = seen.join("") + tail.text;
    expect(all).toBe("Vastaus.\n");
    expect(all).not.toContain("[[");
    expect(all).not.toContain("ehdotus");
    expect(tail.type).toBe("konsultaatio");
  });

  it("jättää tavalliset hakasulut ja Markdown-linkit ennalleen", () => {
    expect(run(["Lähde: [Hinnat](/hinnat) ja [[muu]] teksti ["]).text).toBe("Lähde: [Hinnat](/hinnat) ja [[muu]] teksti [");
  });

  it("hylkää tuntemattoman tyypin (myös eSinetin esittelyn) mutta poistaa tagin silti", () => {
    expect(run(["Ok.[[ehdotus:alennus]]"])).toEqual({ text: "Ok.", type: null });
    expect(run(["Ok.[[ehdotus:esittely]]"])).toEqual({ text: "Ok.", type: null });
  });

  it("käyttää vain ensimmäistä tagia", () => {
    expect(run(["A[[ehdotus:kokeilu]]B[[ehdotus:tarjous]]"])).toEqual({ text: "AB", type: "kokeilu" });
  });

  it("pudottaa kesken jääneen tagin lopusta", () => {
    expect(run(["Teksti [[ehdotus:tarj"])).toEqual({ text: "Teksti ", type: null });
  });
});

describe("splitCtaTrailer", () => {
  it("erottaa tekstin ja ehdotuksen", () => {
    expect(splitCtaTrailer(`Hei${CTA_SEPARATOR}{"cta":"konsultaatio"}`)).toEqual({ text: "Hei", type: "konsultaatio" });
  });
  it("sietää rikkinäisen tai tuntemattoman loppuosan", () => {
    expect(splitCtaTrailer(`Hei${CTA_SEPARATOR}{"cta":"x"}`)).toEqual({ text: "Hei", type: null });
    expect(splitCtaTrailer(`Hei${CTA_SEPARATOR}{rikki`)).toEqual({ text: "Hei", type: null });
    expect(splitCtaTrailer("Pelkkä teksti")).toEqual({ text: "Pelkkä teksti", type: null });
  });
});

describe("availableCtas", () => {
  it("kokeilu vain live-tilassa, ei esittelyä eikä odotuslistaa", () => {
    expect(availableCtas("live")).toEqual(["kokeilu", "tarjous", "konsultaatio"]);
    expect(availableCtas("soon")).toEqual(["tarjous", "konsultaatio"]);
    expect(availableCtas("waitlist")).toEqual(["tarjous", "konsultaatio"]);
    expect(CTA_TYPES as readonly string[]).not.toContain("esittely");
  });

  it("napit ovat sivuston sävyn mukaiset", () => {
    expect(CHAT_CTAS.kokeilu.label).toBe("Aloita ilmaiseksi");
    expect(CHAT_CTAS.tarjous.label).toBe("Pyydä tarjous salkulle");
    expect(CHAT_CTAS.konsultaatio.label).toBe("Kysy meiltä");
    for (const def of Object.values(CHAT_CTAS)) expect(def.label).not.toMatch(/!/);
  });
});

describe("decideCta", () => {
  const all = availableCtas("live");
  it("sallii vain käytettävissä olevat", () => {
    expect(decideCta("kokeilu", [{ role: "user", content: "x" }], availableCtas("soon"))).toBeNull();
    expect(decideCta("kokeilu", [{ role: "user", content: "x" }], all)).toBe("kokeilu");
  });
  it("ei toista samaa ehdotusta peräkkäin, ellei käyttäjä kysy", () => {
    const history = [
      { role: "user" as const, content: "Paljonko 12 asuntoa maksaa?" },
      { role: "assistant" as const, content: `180 € vuodessa.\n\n${ctaTag("tarjous")}` },
      { role: "user" as const, content: "Entä verolaskelma?" },
    ];
    expect(decideCta("tarjous", history, all)).toBeNull();
    expect(decideCta("konsultaatio", history, all)).toBe("konsultaatio");
    const asks = [...history.slice(0, 2), { role: "user" as const, content: "Miten pyydän tarjouksen?" }];
    expect(decideCta("tarjous", asks, all)).toBe("tarjous");
  });
});

describe("ehdotusnapin osoite", () => {
  it("sisältää vain aiheen ja lähteen", () => {
    for (const type of availableCtas("live")) {
      const href = ctaHref(CHAT_CTAS[type], "https://app.reilusoppari.fi/aloita");
      const url = new URL(href, SITE);
      const keys = [...url.searchParams.keys()].sort();
      expect(keys.every((k) => k === "aihe" || k === "lahde")).toBe(true);
      if (type !== "kokeilu") {
        expect(url.pathname).toBe("/yhteystiedot");
        expect(url.searchParams.get("lahde")).toBe("chat");
        expect(CONTACT_TOPICS).toContain(url.searchParams.get("aihe"));
      }
      // Ei sähköpostiosoitteita, numeroita tai vapaata tekstiä.
      expect(href).not.toMatch(/@|%40|\d{3,}/);
    }
    expect(ctaHref(CHAT_CTAS.tarjous, "x")).toBe("/yhteystiedot?aihe=tarjous&lahde=chat");
    expect(ctaHref(CHAT_CTAS.konsultaatio, "x")).toBe("/yhteystiedot?aihe=kysymys&lahde=chat");
    expect(ctaHref(CHAT_CTAS.kokeilu, "https://app.reilusoppari.fi/aloita")).toBe("https://app.reilusoppari.fi/aloita");
  });

  it("lomake hyväksyy vain sallitut aiheet ja lähteet", () => {
    expect(topicFromParam("tarjous")).toBe("tarjous");
    expect(topicFromParam("<script>")).toBe("kysymys");
    expect(topicFromParam(["tarjous"])).toBe("kysymys");
    expect(sourceFromParam("chat")).toBe("chat");
    expect(sourceFromParam("x")).toBe("sivusto");
    const fd = new FormData();
    for (const [k, v] of Object.entries({ name: "Testi", email: "t@example.com", message: "Viesti on tarpeeksi pitkä.", topic: "hakkerointi", source: "x", company: "" })) {
      fd.set(k, v);
    }
    const parsed = parseContactFormData(fd);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.topic).toBe("muu");
      expect(parsed.data.source).toBe("sivusto");
    }
  });
});

describe("järjestelmäohjeen myyntisäännöt", () => {
  it("vastaa ensin, yksi ehdotus, ei painostusta eikä toistoa", () => {
    expect(SYSTEM_PROMPT).toMatch(/Vastaa aina ensin itse kysymykseen/);
    expect(SYSTEM_PROMPT).toMatch(/YKSI/);
    expect(SYSTEM_PROMPT).toMatch(/Enintään yksi tagi/);
    expect(SYSTEM_PROMPT).toMatch(/Älä toista samaa ehdotusta peräkkäisissä vastauksissa/);
    expect(SYSTEM_PROMPT).toMatch(/Ei painostusta: ei keksittyjä tarjouksia/);
    expect(SYSTEM_PROMPT).toMatch(/ei liioittelua eikä superlatiiveja/);
    expect(SYSTEM_PROMPT).toMatch(/Vuokralaiselle ei myydä mitään/);
    for (const t of CTA_TYPES) expect(SYSTEM_PROMPT).toContain(`[[ehdotus:${t}]]`);
  });

  it("totuudenmukaisuussäännöt pysyvät", () => {
    expect(SYSTEM_PROMPT).toMatch(/Älä keksi hintoja/);
    expect(SYSTEM_PROMPT).toMatch(/kehittyneestä sähköisestä allekirjoituksesta/);
  });
});

describe("chat pois päältä ilman avainta", () => {
  it("isChatEnabled vaatii ANTHROPIC_API_KEY:n", () => {
    expect(isChatEnabled({})).toBe(false);
    expect(isChatEnabled({ ANTHROPIC_API_KEY: "" })).toBe(false);
    expect(isChatEnabled({ ANTHROPIC_API_KEY: "   " })).toBe(false);
    expect(isChatEnabled({ ANTHROPIC_API_KEY: "sk-ant-testi" })).toBe(true);
  });

  it("root layout renderöi chat-painikkeen vain isChatEnabled-ehdolla", () => {
    const layout = readFileSync(resolve(__dirname, "../../src/app/layout.tsx"), "utf8");
    expect(layout).toMatch(/const chatEnabled = isChatEnabled\(\);/);
    expect(layout).toMatch(/\{chatEnabled && <ChatLauncher \/>\}/);
    // Ei toista, ehdotonta renderöintiä.
    expect(layout.match(/<ChatLauncher/g)).toHaveLength(1);
  });
});

describe("handleChat ja ehdotus", () => {
  beforeEach(() => {
    resetChatState();
    vi.spyOn(console, "info").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  function model(chunks: string[]): ChatModel {
    return {
      stream: () => ({
        text: (async function* () {
          for (const c of chunks) yield c;
        })(),
        usage: async () => ({ input_tokens: 1, output_tokens: 1 }),
      }),
    };
  }
  const req = (messages: unknown) =>
    new Request(`${SITE}/api/chat`, {
      method: "POST",
      headers: { origin: SITE, host: "reilusoppari.fi", "content-type": "application/json", "x-forwarded-for": "7.7.7.7" },
      body: JSON.stringify({ messages }),
    });

  it("raakatagi ei näy vastauksessa ja ehdotus tulee erottimen jälkeen", async () => {
    const res = await handleChat(req([{ role: "user", content: "Paljonko 8 asuntoa?" }]), {
      model: model(["120 € vuodessa.\n\n[[ehdo", "tus:tarjous]]"]),
      siteUrl: SITE,
      launchNote: "TILANNE",
      ctas: availableCtas("soon"),
    });
    const body = await res.text();
    expect(body).not.toContain("[[");
    expect(splitCtaTrailer(body)).toEqual({ text: "120 € vuodessa.\n\n", type: "tarjous" });
    const logged = (console.info as unknown as { mock: { calls: unknown[][] } }).mock.calls.map((c) => String(c[0])).join("\n");
    expect(logged).toContain('"cta":"tarjous"');
    expect(logged).toContain('"started":true');
  });

  it("kokeilua ei näytetä ennen julkaisua", async () => {
    const res = await handleChat(req([{ role: "user", content: "Miten aloitan?" }]), {
      model: model(["Näin.[[ehdotus:kokeilu]]"]),
      siteUrl: SITE,
      launchNote: "TILANNE",
      ctas: availableCtas("soon"),
    });
    expect(await res.text()).toBe("Näin.");
  });
});
