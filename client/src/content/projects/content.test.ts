import { describe, expect, it } from "vitest";
import { getProjectContent } from "./index";

describe("project content", () => {
  it("loads jura and jamila content with tour3d sections", () => {
    const jura = getProjectContent("jura");
    const jamila = getProjectContent("jamila");

    expect(jura.sections.some((s) => s.type === "tour3d")).toBe(true);
    expect(jamila.sections.some((s) => s.type === "tour3d")).toBe(true);

    const juraTour = jura.sections.find((s) => s.type === "tour3d");
    expect(juraTour && "url" in juraTour && juraTour.url).toContain("logica-itech.com");

    const jamilaTour = jamila.sections.find((s) => s.type === "tour3d");
    expect(jamilaTour && "url" in jamilaTour && jamilaTour.url).toContain("jamila360");
  });
});
