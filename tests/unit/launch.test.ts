import { afterEach, describe, expect, it } from "vitest";
import { getLaunchMode, isLive, isWaitlistOpen } from "@/lib/launch";

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

  it("palautuu oletukseen tuntemattomalla arvolla", () => {
    process.env.LAUNCH_MODE = "jotain-muuta";
    expect(getLaunchMode()).toBe("soon");
  });
});
