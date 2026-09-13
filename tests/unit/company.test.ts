import { describe, expect, it } from "vitest";
import {
  company,
  companyAddress,
  companyLegalName,
  isValidBusinessId,
  signingProvider,
} from "@content/company";

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

  it("juridinen muoto sisältää nimen, Y-tunnuksen ja käyntiosoitteen", () => {
    const teksti = companyLegalName();
    expect(teksti).toContain(company.name);
    expect(teksti).toContain(company.businessId);
    expect(teksti).toContain(companyAddress());
  });

  /*
    Kotipaikka on kirjattu mutta sitä ei näytetä (Jukan linjaus 2026-09-13).
    Osoite kertoo lukijalle mihin voi ottaa yhteyttä, kotipaikka ei kerro
    mitään. Testi vartioi, ettei kotipaikka livahda juridisiin teksteihin
    osoitteen tilalle.
  */
  it("kotipaikka ei näy juridisessa muodossa", () => {
    expect(companyLegalName()).not.toContain(company.domicile);
  });

  it("käyntiosoite on kokonainen: katu, postinumero ja kaupunki", () => {
    expect(companyAddress()).toBe("Yhdystie 4, 19650 Joutsa");
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
