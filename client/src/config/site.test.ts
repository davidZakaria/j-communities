import { describe, expect, it } from "vitest";
import { absoluteUrl } from "./site";

describe("site", () => {
  it("absoluteUrl joins origin and path", () => {
    expect(absoluteUrl("/favicon.svg")).toMatch(/^https?:\/\//);
    expect(absoluteUrl("/favicon.svg")).toContain("/favicon.svg");
  });

  it("absoluteUrl preserves full URLs", () => {
    expect(absoluteUrl("https://example.com/a")).toBe("https://example.com/a");
  });
});
