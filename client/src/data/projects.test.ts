import { describe, expect, it } from "vitest";
import { getProjectBySlug, projects, projectsByCategory } from "./projects";

describe("projects", () => {
  it("finds by slug", () => {
    expect(getProjectBySlug("jura-sokhna")?.name).toBe("Jura Sokhna");
    expect(getProjectBySlug("missing")).toBeUndefined();
    expect(getProjectBySlug(undefined)).toBeUndefined();
  });

  it("filters by category", () => {
    expect(projectsByCategory("coastal").length).toBe(3);
    expect(projectsByCategory("residential").length).toBe(2);
    expect(projectsByCategory("mixed-use").length).toBe(2);
  });

  it("each project has a summary", () => {
    for (const p of projects) {
      expect(p.summary.length).toBeGreaterThan(10);
    }
  });
});
