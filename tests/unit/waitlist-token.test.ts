import { describe, expect, it } from "vitest";
import { createWaitlistToken, verifyWaitlistToken } from "@/lib/waitlist-token";

describe("waitlist-token", () => {
  it("luo tokenin, joka menee läpi omalla verifioinnilla", () => {
    const token = createWaitlistToken({ email: "a@b.fi", party: "vuokranantaja", apartments: 3 });
    const result = verifyWaitlistToken(token);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.payload.email).toBe("a@b.fi");
      expect(result.payload.party).toBe("vuokranantaja");
      expect(result.payload.apartments).toBe(3);
    }
  });

  it("hylkää väärennetyn allekirjoituksen", () => {
    const token = createWaitlistToken({ email: "a@b.fi", party: "vuokranantaja", apartments: 3 });
    const [payload] = token.split(".");
    const tampered = `${payload}.vaarennettu`;
    const result = verifyWaitlistToken(tampered);
    expect(result.valid).toBe(false);
  });

  it("hylkää epämuodollisen tokenin", () => {
    const result = verifyWaitlistToken("ei-kelvollinen-token");
    expect(result.valid).toBe(false);
  });
});
