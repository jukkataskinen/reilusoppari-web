import { describe, expect, it } from "vitest";
import {
  DailyBudget,
  MAX_MESSAGES,
  MAX_MESSAGE_CHARS,
  RateLimiter,
  estimateCostUsd,
  isAllowedOrigin,
  validateMessages,
} from "@/lib/chat/limits";

const user = (content: string) => ({ role: "user", content });
const bot = (content: string) => ({ role: "assistant", content });

describe("validateMessages", () => {
  it("hyväksyy vuorottelevan keskustelun, joka päättyy käyttäjän viestiin", () => {
    const r = validateMessages({ messages: [user("Hei"), bot("Moi"), user("Mitä maksaa?")] });
    expect(r.ok).toBe(true);
  });

  it("hylkää tyhjän, väärän muotoisen ja väärin vuorottelevan syötteen", () => {
    const bad = [
      null,
      "x",
      {},
      { messages: [] },
      { messages: "x" },
      { messages: [bot("a")] },
      { messages: [user("a"), user("b")] },
      { messages: [user(" ")] },
      { messages: [{ role: "user", content: 5 }] },
      { messages: [{ role: "system", content: "x" }] },
    ];
    for (const body of bad) {
      expect(validateMessages(body)).toMatchObject({ ok: false, code: "invalid_body" });
    }
  });

  it("hylkää liian pitkän viestin", () => {
    expect(validateMessages({ messages: [user("a".repeat(MAX_MESSAGE_CHARS + 1))] })).toMatchObject({
      ok: false,
      code: "too_long",
    });
    expect(validateMessages({ messages: [user("a".repeat(MAX_MESSAGE_CHARS))] }).ok).toBe(true);
  });

  it("hylkää liian pitkän keskustelun", () => {
    const many = Array.from({ length: MAX_MESSAGES + 1 }, (_, i) => (i % 2 === 0 ? user("a") : bot("b")));
    expect(validateMessages({ messages: many })).toMatchObject({ ok: false, code: "too_many_messages" });
  });

  it("poistaa ohjausmerkit", () => {
    const r = validateMessages({ messages: [user("ab\u0000c")] });
    expect(r.ok && r.messages[0].content).toBe("abc");
  });
});

describe("isAllowedOrigin", () => {
  it("sallii saman sivuston ja www-version", () => {
    expect(isAllowedOrigin("https://reilusoppari.fi", "reilusoppari.fi", "https://reilusoppari.fi", false)).toBe(true);
    expect(isAllowedOrigin("https://www.reilusoppari.fi", "reilusoppari.fi", "https://reilusoppari.fi", false)).toBe(true);
  });
  it("hylkää muut originit ja puuttuvan originin", () => {
    expect(isAllowedOrigin("https://example.com", "reilusoppari.fi", "https://reilusoppari.fi", false)).toBe(false);
    expect(isAllowedOrigin(null, "reilusoppari.fi", "https://reilusoppari.fi", false)).toBe(false);
    expect(isAllowedOrigin("not a url", "reilusoppari.fi", "https://reilusoppari.fi", false)).toBe(false);
    expect(isAllowedOrigin("https://reilusoppari.fi.evil.com", "reilusoppari.fi", "https://reilusoppari.fi", false)).toBe(false);
  });
  it("sallii localhostin vain kehityksessä", () => {
    expect(isAllowedOrigin("http://localhost:3000", "x", "https://reilusoppari.fi", true)).toBe(true);
    expect(isAllowedOrigin("http://localhost:3000", "x", "https://reilusoppari.fi", false)).toBe(false);
  });
});

describe("RateLimiter", () => {
  it("estää rajan ylittymisen ja vapauttaa ikkunan jälkeen", () => {
    const l = new RateLimiter(2, 1000);
    expect(l.allow("a", 0)).toBe(true);
    expect(l.allow("a", 10)).toBe(true);
    expect(l.allow("a", 20)).toBe(false);
    expect(l.allow("b", 20)).toBe(true);
    expect(l.allow("a", 1001)).toBe(true);
  });
});

describe("DailyBudget", () => {
  it("sulkeutuu ylityksessä ja nollautuu seuraavana päivänä", () => {
    const b = new DailyBudget(1);
    const d1 = new Date("2026-10-18T10:00:00Z");
    expect(b.hasRoom(d1)).toBe(true);
    b.add(1.2, d1);
    expect(b.hasRoom(d1)).toBe(false);
    expect(b.hasRoom(new Date("2026-10-19T00:01:00Z"))).toBe(true);
  });
  it("arvioi kulun Sonnet 5.5 -hinnoilla", () => {
    // 1 M cache-lukua = 0,20 $, 100 k ulostuloa = 1 $
    expect(estimateCostUsd({ cache_read_input_tokens: 1_000_000, output_tokens: 100_000 })).toBeCloseTo(1.2, 5);
  });
});
