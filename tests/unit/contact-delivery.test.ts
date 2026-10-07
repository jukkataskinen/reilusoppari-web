import { afterEach, describe, expect, it } from "vitest";
import { isContactDeliveryMock } from "@/lib/resend";

const KEYS = ["CONTACT_DELIVERY", "RESEND_API_KEY", "VERCEL_ENV"] as const;
const original = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of KEYS) {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  }
});

function setEnv(values: Partial<Record<(typeof KEYS)[number], string>>) {
  for (const key of KEYS) delete process.env[key];
  Object.assign(process.env, values);
}

describe("yhteydenottolomakkeen testitila", () => {
  it("on päällä paikallisesti ilman Resend-avainta", () => {
    setEnv({});
    expect(isContactDeliveryMock()).toBe(true);
  });

  it("on pois, kun avain on olemassa", () => {
    setEnv({ RESEND_API_KEY: "re_test" });
    expect(isContactDeliveryMock()).toBe(false);
  });

  it("CONTACT_DELIVERY=mock ohittaa avaimen", () => {
    setEnv({ RESEND_API_KEY: "re_test", CONTACT_DELIVERY: "mock" });
    expect(isContactDeliveryMock()).toBe(true);
  });

  it("Vercelin tuotannossa puuttuva avain ei muutu hiljaiseksi testitilaksi", () => {
    setEnv({ VERCEL_ENV: "production" });
    expect(isContactDeliveryMock()).toBe(false);
  });
});
