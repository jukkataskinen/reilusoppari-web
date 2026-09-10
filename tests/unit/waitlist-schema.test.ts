import { describe, expect, it } from "vitest";
import { parseWaitlistFormData, waitlistSchema } from "@/lib/waitlist-schema";

function formData(values: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(values)) fd.set(key, value);
  return fd;
}

describe("waitlistSchema", () => {
  it("hyväksyy kelvollisen syötteen", () => {
    const result = waitlistSchema.safeParse({
      email: "Etunimi.Sukunimi@Esimerkki.fi",
      party: "vuokranantaja",
      apartments: "3",
      company: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      // sähköposti normalisoidaan pieniksi kirjaimiksi
      expect(result.data.email).toBe("etunimi.sukunimi@esimerkki.fi");
      expect(result.data.apartments).toBe(3);
    }
  });

  it("hylkää virheellisen sähköpostin", () => {
    const result = waitlistSchema.safeParse({
      email: "ei-sahkoposti",
      party: "vuokranantaja",
      apartments: "",
      company: "",
    });
    expect(result.success).toBe(false);
  });

  it("hylkää tuntemattoman osapuolen", () => {
    const result = waitlistSchema.safeParse({
      email: "a@b.fi",
      party: "isannoitsija",
      apartments: "",
      company: "",
    });
    expect(result.success).toBe(false);
  });

  it("sallii tyhjän asuntomäärän myös vuokranantajalta", () => {
    const result = waitlistSchema.safeParse({
      email: "a@b.fi",
      party: "vuokranantaja",
      apartments: "",
      company: "",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.apartments).toBeUndefined();
  });

  it("pudottaa asuntomäärän vuokralaiselta", () => {
    // Kenttä on vuokralaiselle piilotettu, joten arvo voi tulla vain
    // vanhentuneesta lomakkeesta – sitä ei tallenneta.
    const result = waitlistSchema.safeParse({
      email: "a@b.fi",
      party: "vuokralainen",
      apartments: "7",
      company: "",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.apartments).toBeUndefined();
  });

  it("hylkää nollan ja negatiiviset asuntomäärät", () => {
    for (const value of ["0", "-2"]) {
      const result = waitlistSchema.safeParse({
        email: "a@b.fi",
        party: "vuokranantaja",
        apartments: value,
        company: "",
      });
      expect(result.success).toBe(false);
    }
  });

  it("hylkää täytetyn honeypot-kentän", () => {
    const result = waitlistSchema.safeParse({
      email: "a@b.fi",
      party: "vuokranantaja",
      apartments: "",
      company: "botti",
    });
    expect(result.success).toBe(false);
  });
});

describe("parseWaitlistFormData", () => {
  it("lukee arvot FormDatasta", () => {
    const result = parseWaitlistFormData(
      formData({ email: "a@b.fi", party: "molempia", apartments: "2", company: "" }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.party).toBe("molempia");
      expect(result.data.apartments).toBe(2);
    }
  });

  it("selviää puuttuvasta asuntokentästä", () => {
    const result = parseWaitlistFormData(
      formData({ email: "a@b.fi", party: "vuokralainen", company: "" }),
    );
    expect(result.success).toBe(true);
  });
});
