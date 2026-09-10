import { afterEach, describe, expect, it } from "vitest";
import { getLaunchMode, isLive } from "@/lib/launch";

const ORIGINAL_ENV = process.env.LAUNCH_MODE;

afterEach(() => {
  if (ORIGINAL_ENV === undefined) delete process.env.LAUNCH_MODE;
  else process.env.LAUNCH_MODE = ORIGINAL_ENV;
});

describe("launch mode", () => {
  it("oletusarvo on waitlist", () => {
    delete process.env.LAUNCH_MODE;
    expect(getLaunchMode()).toBe("waitlist");
    expect(isLive()).toBe(false);
  });

  it("lukee live-tilan ympäristömuuttujasta", () => {
    process.env.LAUNCH_MODE = "live";
    expect(getLaunchMode()).toBe("live");
    expect(isLive()).toBe(true);
  });

  it("palautuu oletukseen tuntemattomalla arvolla", () => {
    process.env.LAUNCH_MODE = "jotain-muuta";
    expect(getLaunchMode()).toBe("waitlist");
  });
});
