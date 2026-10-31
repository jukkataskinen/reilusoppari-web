import { describe, expect, it } from "vitest";
import {
  kayttoehdotHeroLead,
  tietosuojaEsinettiSopimus,
  tietosuojaHeroLead,
  tietosuojaMuutoksetIntro,
  tietosuojaOsa2Heading,
  tietosuojaOsa2Intro,
} from "@/lib/legal-copy";

// PLAN.md Vaihe D: "Tietosuojaselosteen ja käyttöehtojen live-muotoiset
// luonnokset". Nykyinen (soon/waitlist) teksti ei saa muuttua tämän
// yöajon myötä, ja live-teksti ei saa luvata mitään, joka olettaisi
// palvelun olevan vielä avautumassa.

describe("tietosuojaHeroLead", () => {
  it("soon-tilassa ei kerro keräävänsä tietoja nyt", () => {
    expect(tietosuojaHeroLead("soon")).toMatch(/ei kerää nyt henkilötietoja/);
  });

  it("waitlist-tilassa kertoo odotuslistasta ennallaan", () => {
    expect(tietosuojaHeroLead("waitlist")).toMatch(/odotuslistan sähköpostiosoitteita nyt/);
  });

  it("live-tilassa sanoo palvelun olevan avoinna, ei tulevaa avautumista", () => {
    const text = tietosuojaHeroLead("live");
    expect(text).toMatch(/on avoinna/);
    expect(text).not.toMatch(/kun palvelu avautuu/);
    expect(text).not.toMatch(/ei kerää nyt henkilötietoja/);
  });
});

describe("tietosuojaOsa2Heading", () => {
  it("soon-tilassa ei lupaa päivämäärää", () => {
    const heading = tietosuojaOsa2Heading("soon");
    expect(heading).not.toMatch(/alkaa/);
  });

  it("waitlist-tilassa näyttää tavoitelanseerauksen", () => {
    expect(tietosuojaOsa2Heading("waitlist")).toMatch(/alkaa lokakuussa 2026/);
  });

  it("live-tilassa ei enää puhu alkamisesta", () => {
    const heading = tietosuojaOsa2Heading("live");
    expect(heading).toBe("Osa 2: Palvelun tiedot");
    expect(heading).not.toMatch(/alkaa|lokakuussa/);
  });
});

describe("tietosuojaOsa2Intro", () => {
  it("soon- ja waitlist-tilassa kuvaa suunnitellun käsittelyn", () => {
    expect(tietosuojaOsa2Intro("soon")).toMatch(/suunnitellun käsittelyn/);
    expect(tietosuojaOsa2Intro("waitlist")).toMatch(/suunnitellun käsittelyn/);
  });

  it("live-tilassa kuvaa käsittelyn nykyhetkessä", () => {
    const text = tietosuojaOsa2Intro("live");
    expect(text).toMatch(/on avoinna/);
    expect(text).not.toMatch(/suunnitellun käsittelyn/);
  });
});

describe("tietosuojaEsinettiSopimus", () => {
  it("soon/waitlist-tilassa sopimus on vielä tulevaisuudessa", () => {
    expect(tietosuojaEsinettiSopimus("soon")).toMatch(/sovitaan.*ennen kuin palvelu avautuu/);
    expect(tietosuojaEsinettiSopimus("waitlist")).toMatch(/sovitaan.*ennen kuin palvelu avautuu/);
  });

  it("live-tilassa sopimuksen kerrotaan olevan jo voimassa", () => {
    expect(tietosuojaEsinettiSopimus("live")).toMatch(/on sovittu/);
  });
});

describe("tietosuojaMuutoksetIntro", () => {
  it("live-tilassa ei puhu selosteen täydentämisestä ennen avaamista", () => {
    expect(tietosuojaMuutoksetIntro("live")).not.toMatch(/ennen palvelun avaamista/);
  });

  it("soon-tilassa teksti pysyy ennallaan", () => {
    expect(tietosuojaMuutoksetIntro("soon")).toMatch(/ennen palvelun avaamista/);
  });
});

describe("kayttoehdotHeroLead", () => {
  it("soon-tilassa ei mainitse odotuslistaa eikä kiinteää kuukautta", () => {
    const text = kayttoehdotHeroLead("soon");
    expect(text).not.toMatch(/odotuslista/i);
    expect(text).not.toMatch(/lokakuussa 2026/);
  });

  it("waitlist-tilassa viittaa odotuslistan rajattuihin kohtiin ennallaan", () => {
    expect(kayttoehdotHeroLead("waitlist")).toMatch(/kohtia 1 ja 9/);
  });

  it("live-tilassa ei lupaa tulevaa avautumista eikä mainitse odotuslistaa", () => {
    const text = kayttoehdotHeroLead("live");
    expect(text).not.toMatch(/avautuu/);
    expect(text).not.toMatch(/odotuslista/i);
  });
});
