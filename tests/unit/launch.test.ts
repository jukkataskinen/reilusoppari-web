import { afterEach, describe, expect, it } from "vitest";
import { getAppUrl, getLandlordCta, getLaunchMode, isLive, isWaitlistOpen } from "@/lib/launch";

const ORIGINAL_ENV = process.env.LAUNCH_MODE;

afterEach(() => {
  if (ORIGINAL_ENV === undefined) delete process.env.LAUNCH_MODE;
  else process.env.LAUNCH_MODE = ORIGINAL_ENV;
});

describe("launch mode", () => {
  it("oletusarvo on soon – ilman muuttujaa ei koskaan näytetä lomaketta joka ei toimi", () => {
    delete process.env.LAUNCH_MODE;
    expect(getLaunchMode()).toBe("soon");
    expect(isLive()).toBe(false);
    expect(isWaitlistOpen()).toBe(false);
  });

  it("odotuslista näkyy vain waitlist-tilassa", () => {
    process.env.LAUNCH_MODE = "waitlist";
    expect(isWaitlistOpen()).toBe(true);

    process.env.LAUNCH_MODE = "soon";
    expect(isWaitlistOpen()).toBe(false);

    process.env.LAUNCH_MODE = "live";
    expect(isWaitlistOpen()).toBe(false);
  });



  it("lukee live-tilan ympäristömuuttujasta", () => {
    process.env.LAUNCH_MODE = "live";
    expect(getLaunchMode()).toBe("live");
    expect(isLive()).toBe(true);
  });

  it("live-siirto on yksi muuttuja: CTA vaihtuu sovellukseen ilman muita asetuksia", () => {
    const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
    try {
      delete process.env.LAUNCH_MODE;
      expect(getLandlordCta()).toEqual({ label: "Katso miten toimii", href: "/miten-toimii" });

      process.env.LAUNCH_MODE = "live";
      expect(getAppUrl()).toBe("https://app.reilusoppari.fi");
      expect(getLandlordCta()).toEqual({
        label: "Aloita ilmaiseksi",
        href: "https://app.reilusoppari.fi/aloita",
      });
    } finally {
      if (originalAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
      else process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
    }
  });

  it("palautuu oletukseen tuntemattomalla arvolla", () => {
    process.env.LAUNCH_MODE = "jotain-muuta";
    expect(getLaunchMode()).toBe("soon");
  });
});
