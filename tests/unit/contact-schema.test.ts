import { describe, expect, it } from "vitest";
import { parseContactFormData, contactSchema } from "@/lib/contact-schema";

function formData(values: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(values)) fd.set(key, value);
  return fd;
}

describe("contactSchema", () => {
  it("hyväksyy kelvollisen syötteen", () => {
    const result = contactSchema.safeParse({
      name: "Maija Meikäläinen",
      email: "Maija@Esimerkki.fi",
      message: "Haluaisin kysyä vuokrasopimuksesta.",
      company: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("maija@esimerkki.fi");
    }
  });

  it("hylkää liian lyhyen viestin", () => {
    const result = contactSchema.safeParse({
      name: "Maija",
      email: "maija@esimerkki.fi",
      message: "Liian",
      company: "",
    });
    expect(result.success).toBe(false);
  });

  it("hylkää virheellisen sähköpostin", () => {
    const result = contactSchema.safeParse({
      name: "Maija",
      email: "ei-sahkoposti",
      message: "Tämä on riittävän pitkä viesti.",
      company: "",
    });
    expect(result.success).toBe(false);
  });

  it("hylkää puuttuvan nimen", () => {
    const result = contactSchema.safeParse({
      name: "",
      email: "maija@esimerkki.fi",
      message: "Tämä on riittävän pitkä viesti.",
      company: "",
    });
    expect(result.success).toBe(false);
  });

  it("hylkää täytetyn honeypot-kentän", () => {
    const result = contactSchema.safeParse({
      name: "Maija",
      email: "maija@esimerkki.fi",
      message: "Tämä on riittävän pitkä viesti.",
      company: "botti täytti tämän",
    });
    expect(result.success).toBe(false);
  });
});

describe("parseContactFormData", () => {
  it("lukee FormDatasta ja validoi", () => {
    const result = parseContactFormData(
      formData({
        name: "Maija",
        email: "maija@esimerkki.fi",
        message: "Tämä on riittävän pitkä viesti.",
        company: "",
      }),
    );
    expect(result.success).toBe(true);
  });

  it("palauttaa virheen puuttuvasta viestistä", () => {
    const result = parseContactFormData(formData({ name: "Maija", email: "maija@esimerkki.fi", company: "" }));
    expect(result.success).toBe(false);
  });
});
