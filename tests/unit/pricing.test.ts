import { describe, expect, it } from "vitest";
import { pricing } from "@content/pricing";
import { formatEuroAuto } from "@/lib/format";
import {
  estimate,
  isPortfolio,
  plusYearly,
  portfolioYearly,
  tenancyFeesTotal,
} from "@/lib/pricing";

describe("salkkuraja", () => {
  it("alle viisi asuntoa ei ole salkku", () => {
    expect(isPortfolio(4)).toBe(false);
  });

  it("viisi asuntoa on jo salkku", () => {
    expect(isPortfolio(pricing.portfolio.minApartments)).toBe(true);
  });

  it("kelvoton syöte ei kaadu eikä muutu salkuksi", () => {
    expect(isPortfolio(Number.NaN)).toBe(false);
    expect(isPortfolio(-3)).toBe(false);
  });
});

describe("vuosihinnat", () => {
  it("salkku on 15 euroa asunnolta vuodessa", () => {
    expect(portfolioYearly(8)).toBe(120);
  });

  it("Plus on 12 euroa asunnolta vuodessa", () => {
    expect(plusYearly(3)).toBe(36);
  });
});

describe("vuokrasuhteen kertamaksut", () => {
  it("ensimmäinen vuokrasuhde on ilmainen", () => {
    expect(tenancyFeesTotal(1)).toBe(0);
  });

  it("toisesta alkaen veloitetaan kertamaksu", () => {
    expect(tenancyFeesTotal(3)).toBe(pricing.tenancy.fee * 2);
  });
});

describe("estimate", () => {
  it("alle viiden asunnon vuosihinta tulee vain Plussasta", () => {
    const result = estimate(2, true, 1);
    expect(result.model).toBe("tenancy");
    expect(result.yearly).toBe(24);
    // Ensimmäinen vuokrasuhde on ilmainen, joten kertamaksuja ei synny.
    expect(result.oneOff).toBe(0);
  });

  it("ilman Plussaa alle viiden asunnon vuosihinta on nolla", () => {
    expect(estimate(2, false, 1).yearly).toBe(0);
  });

  it("salkkuhinta ohittaa Plus-valinnan", () => {
    const withPlus = estimate(10, true);
    const withoutPlus = estimate(10, false);
    expect(withPlus.model).toBe("portfolio");
    expect(withPlus.yearly).toBe(withoutPlus.yearly);
    expect(withPlus.yearly).toBe(150);
  });

  it("kertamaksu ei sisälly vuosihintaan", () => {
    const result = estimate(1, false, 3);
    expect(result.yearly).toBe(0);
    expect(result.oneOff).toBe(pricing.tenancy.fee * 2);
  });
});

describe("muotoilu", () => {
  it("tasaluvut näytetään ilman desimaaleja", () => {
    // Intl käyttää sitovaa välilyöntiä (U+00A0), joten se normalisoidaan
    // ennen vertailua – muuten testi vertaisi näkymätöntä merkkieroa.
    const formatted = formatEuroAuto(pricing.tenancy.fee).replace(/\u00a0/g, " ");
    expect(formatted).toBe("29 €");
  });

  it("senttiarvot näytetään desimaaleilla", () => {
    const formatted = formatEuroAuto(12.5).replace(/\u00a0/g, " ");
    expect(formatted).toBe("12,50 €");
  });
});
