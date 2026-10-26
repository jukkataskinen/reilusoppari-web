import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChatMarkdown, safeInternalHref } from "@/lib/chat/markdown";

const PATHS = ["/hinnat", "/ukk"];
const html = (text: string) => renderToStaticMarkup(createElement(ChatMarkdown, { text, knownPaths: PATHS }));

describe("ChatMarkdown", () => {
  it("renderöi lihavoinnin, luettelon ja sisäisen linkin", () => {
    const out = html("**Hinta** on tässä:\n- yksi\n- kaksi\n\nLähde: [Hinnat](/hinnat)");
    expect(out).toContain("<strong>Hinta</strong>");
    expect(out).toContain("<ul");
    expect(out).toContain('href="/hinnat"');
  });

  it("escapaa HTML:n eikä suorita sitä", () => {
    const out = html("<script>alert(1)</script><img src=x onerror=alert(1)>");
    expect(out).not.toContain("<script");
    expect(out).not.toContain("<img");
    expect(out).toContain("&lt;script&gt;");
  });

  it("ei tee linkkiä ulkoisesta, javascript- tai tuntemattomasta osoitteesta", () => {
    for (const href of ["https://evil.example", "javascript:alert(1)", "//evil.example", "/tuntematon", "data:text/html,x"]) {
      const out = html(`[klikkaa](${href})`);
      expect(out).not.toContain("<a ");
      expect(out).toContain("klikkaa");
    }
  });

  it("safeInternalHref sallii ankkurit ja kyselyt tunnetuille poluille", () => {
    expect(safeInternalHref("/ukk#hinta", PATHS)).toBe("/ukk#hinta");
    expect(safeInternalHref("/ukk/", PATHS)).toBe("/ukk/");
    expect(safeInternalHref("/\\evil", PATHS)).toBeNull();
  });
});
