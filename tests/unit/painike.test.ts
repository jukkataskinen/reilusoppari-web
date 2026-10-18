import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Nappi } from "@/components/painike";

describe("Nappi", () => {
  it("näyttää levossa vain tekstin, ilman ilmaisinta", () => {
    const html = renderToStaticMarkup(h("form", null, h(Nappi, null, "Tallenna")));
    expect(html).toContain("Tallenna");
    expect(html).not.toContain("<svg");
    expect(html).not.toContain("aria-busy");
    expect(html).not.toContain("disabled");
  });

  it("lukittuu ja näyttää ilmaisimen sekä oman tekstin, kun työ on käynnissä", () => {
    const html = renderToStaticMarkup(h(Nappi, { kaynnissa: true, kesken: "Tallennetaan…" }, "Tallenna"));
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("<svg");
    expect(html).toContain("Tallennetaan…");
    expect(html).not.toContain(">Tallenna<");
    expect(html).toContain('aria-live="polite"');
  });

  it("muuntaa tavallisen painiketekstin passiiviksi ja jättää valmiin tekstin ennalleen", () => {
    expect(renderToStaticMarkup(h(Nappi, { kaynnissa: true }, "Poista luonnos"))).toContain("Poistetaan…");
    expect(renderToStaticMarkup(h(Nappi, { kaynnissa: true }, "Jotain outoa"))).toContain("Käsitellään…");
    expect(renderToStaticMarkup(h(Nappi, { kaynnissa: true }, "Luodaan…"))).toContain("Luodaan…");
  });

  it("type=button ei lukitu lomakkeen mukana", () => {
    const html = renderToStaticMarkup(h("form", null, h(Nappi, { type: "button" }, "Avaa")));
    expect(html).not.toContain("disabled");
  });

});
