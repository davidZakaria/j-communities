import { describe, expect, it } from "vitest";
import { splitNewsBody } from "../features/news/utils";

describe("news utils", () => {
  it("splits body paragraphs", () => {
    const parts = splitNewsBody("First paragraph.\n\nSecond paragraph.");
    expect(parts).toEqual(["First paragraph.", "Second paragraph."]);
  });
});
