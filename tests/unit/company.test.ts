import { describe, expect, it } from "vitest";
import { company, companyLegalName, isValidBusinessId, signingProvider } from "@content/company";

/*
  Y-tunnus esiintyy käyttöehdoissa ja tietosuojaselosteessa. Yksi väärä numero
  näyttää täsmälleen yhtä uskottavalta kuin oikea, eikä sitä huomaa lukemalla –
  siksi tarkistusmerkki lasketaan testissä.
*/
describe("yhtiötiedot", () => {
  it("palvelun tarjoajan Y-tunnus on kelvollinen", () => {
    expect(isValidBusinessId(company.businessId)).toBe(true);
  });

  it("allekirjoitusmoottorin tarjoajan Y-tunnus on kelvollinen", () => {
    expect(isValidBusinessId(signingProvider.businessId)).toBe(true);
  });

  it("Reilusoppari ja eSinetti ovat eri yhtiöitä", () => {
    expect(company.businessId).not.toBe(signingProvider.businessId);
    expect(company.name).not.toBe(signingProvider.name);
  });

  it("juridinen muoto sisältää nimen, Y-tunnuksen ja kotipaikan", () => {
    const teksti = companyLegalName();
    expect(teksti).toContain(company.name);
    expect(teksti).toContain(company.businessId);
    expect(teksti).toContain(company.domicile);
  });
});

describe("isValidBusinessId", () => {
  it("hylkää väärän tarkistusmerkin", () => {
    expect(isValidBusinessId("2145627-6")).toBe(false);
  });

  it("hylkää väärän muodon", () => {
    expect(isValidBusinessId("21456277")).toBe(false);
    expect(isValidBusinessId("214562-77")).toBe(false);
    expect(isValidBusinessId("")).toBe(false);
  });
});
