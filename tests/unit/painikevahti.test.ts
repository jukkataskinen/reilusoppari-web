import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

/**
 * Painikevahti (Jukka 18.10.2026): jokainen painike näyttää heti painalluksen jälkeen, että työ
 * on käynnissä. Lähetyspainike on siksi aina `Nappi`, jotka
 * lukittuvat ja näyttävät ilmaisimen. Paljas `<button>` tai `<input type="submit">` ei saa
 * lähettää lomaketta, koska siitä puuttuu palaute. Paljas `<button type="button">` on sallittu,
 * koska se ei lähetä lomaketta (paikallinen toiminto, esim. välilehden vaihto).
 */

const JUURI = resolve(__dirname, "../..");
const OHITA = new Set(["node_modules", ".next", "dist", "build", ".turbo", "coverage"]);

/** Tiedostot, joissa paljas lähettävä painike on perusteltu. */
const SALLITUT = new Set<string>(["src/components/painike.tsx"]);

function tiedostot(kansio: string): string[] {
  const tulos: string[] = [];
  for (const nimi of readdirSync(kansio)) {
    if (OHITA.has(nimi)) continue;
    const polku = join(kansio, nimi);
    if (statSync(polku).isDirectory()) tulos.push(...tiedostot(polku));
    else if (/\.tsx$/.test(nimi) && !/\.test\./.test(nimi)) tulos.push(polku);
  }
  return tulos;
}

/** Avaava `<button`-tagi loppuun asti (aaltosulut huomioiden, jotta `=>` ei katkaise). */
function painikeTagit(lahde: string): string[] {
  const tagit: string[] = [];
  for (const m of lahde.matchAll(/<button(?=[\s>])/g)) {
    let syvyys = 0;
    let i = m.index!;
    for (; i < lahde.length; i++) {
      const c = lahde[i];
      if (c === "{") syvyys++;
      else if (c === "}") syvyys--;
      else if (c === ">" && syvyys === 0 && lahde[i - 1] !== "=") break;
    }
    tagit.push(lahde.slice(m.index!, i + 1));
  }
  return tagit;
}

describe("painikevahti", () => {
  const kaikki = ["src"].flatMap((k) => tiedostot(join(JUURI, k)));

  it("löytää lähdetiedostot", () => {
    expect(kaikki.length).toBeGreaterThan(10);
  });

  it("lomaketta lähettävät painikkeet käyttävät yhteistä painikekomponenttia", () => {
    const rikkomukset: string[] = [];
    for (const tiedosto of kaikki) {
      const nimi = relative(JUURI, tiedosto).replaceAll("\\", "/");
      if (SALLITUT.has(nimi)) continue;
      // Kommenteissa saa mainita <button>-tagin.
      const lahde = readFileSync(tiedosto, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      for (const tagi of painikeTagit(lahde)) {
        if (/type=["']button["']/.test(tagi)) continue;
        rikkomukset.push(`${nimi}: ${tagi.replace(/\s+/g, " ").slice(0, 90)}`);
      }
      if (/<input[^>]*type=["']submit["']/.test(lahde)) rikkomukset.push(`${nimi}: <input type="submit">`);
    }
    expect(
      rikkomukset,
      "Käytä Nappi-komponenttia (src/components), jotta painike näyttää käynnissä olon.",
    ).toEqual([]);
  });
});
