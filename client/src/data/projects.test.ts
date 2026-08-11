import { describe, expect, it } from "vitest";
import { getProjectBySlug, projects, projectsByCategory } from "./projects";

describe("projects", () => {
  it("finds by slug", () => {
    expect(getProjectBySlug("jura-sokhna")?.name).toBe("Jura Sokhna");
    expect(getProjectBySlug("jamila")?.name).toBe("Jamila North Coast");
    expect(getProjectBySlug("missing")).toBeUndefined();
    expect(getProjectBySlug(undefined)).toBeUndefined();
  });

  it("has only Jura and Jamila", () => {
    expect(projects).toHaveLength(2);
    expect(projects.map((p) => p.slug)).toEqual(["jura-sokhna", "jamila"]);
  });

  it("filters by category", () => {
    expect(projectsByCategory("coastal").length).toBe(2);
    expect(projectsByCategory("residential").length).toBe(0);
    expect(projectsByCategory("mixed-use").length).toBe(0);
  });

  it("each project has required fields", () => {
    for (const p of projects) {
      expect(p.summary.length).toBeGreaterThan(10);
      expect(p.tour3dUrl).toMatch(/^https:\/\//);
      expect(p.themeId).toMatch(/^(jura|jamila)$/);
      expect(p.cardImage).toMatch(/^(\/assets\/|https:\/\/)/);
    }
  });
});
