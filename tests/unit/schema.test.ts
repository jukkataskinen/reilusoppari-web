import { describe, expect, it } from "vitest";
import { faqPageSchema, breadcrumbListSchema, organizationSchema } from "@/lib/schema";
import { company } from "@content/company";

describe("faqPageSchema", () => {
  it("muodostaa FAQPage-skeeman kysymyksistä", () => {
    const schema = faqPageSchema([{ question: "Kysymys?", answer: "Vastaus." }]);
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0].name).toBe("Kysymys?");
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe("Vastaus.");
  });
});

describe("breadcrumbListSchema", () => {
  it("numeroi murupolun kohteet järjestyksessä alkaen ykkösestä", () => {
    const schema = breadcrumbListSchema([
      { name: "Etusivu", path: "/" },
      { name: "Hinnat", path: "/hinnat" },
    ]);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].position).toBe(2);
    expect(schema.itemListElement[1].item).toContain("/hinnat");
  });
});

describe("organizationSchema", () => {
  it("sisältää nimen ja emo-organisaation", () => {
    const schema = organizationSchema();
    expect(schema.name).toBe("Reilusoppari");
    expect(schema.parentOrganization.name).toBe(company.name);
    expect(schema.parentOrganization.identifier).toBe(company.businessId);
  });
});
