import { describe, expect, it } from "vitest";
import { resolveExperienceTier } from "./useMotionPreference";

describe("resolveExperienceTier", () => {
  it("returns static when reduced motion is preferred", () => {
    expect(
      resolveExperienceTier({
        reducedMotion: true,
        coarsePointer: false,
        saveData: false,
        largeViewport: true,
        finePointer: true,
        webglAvailable: true,
      }),
    ).toBe("static");
  });

  it("returns full on large viewport with WebGL", () => {
    expect(
      resolveExperienceTier({
        reducedMotion: false,
        coarsePointer: true,
        saveData: false,
        largeViewport: true,
        finePointer: false,
        webglAvailable: true,
      }),
    ).toBe("full");
  });

  it("returns light on mobile viewport", () => {
    expect(
      resolveExperienceTier({
        reducedMotion: false,
        coarsePointer: true,
        saveData: false,
        largeViewport: false,
        finePointer: false,
        webglAvailable: true,
      }),
    ).toBe("light");
  });

  it("returns light on desktop without WebGL (CSS parallax still enabled)", () => {
    expect(
      resolveExperienceTier({
        reducedMotion: false,
        coarsePointer: false,
        saveData: false,
        largeViewport: true,
        finePointer: true,
        webglAvailable: false,
      }),
    ).toBe("light");
  });
});

describe("projectModels config", () => {
  it("uses procedural fallback until GLB assets are delivered", async () => {
    const { projectModels } = await import("../../config/projectModels");
    expect(projectModels.jura.useProceduralFallback).toBe(true);
    expect(projectModels.jamila.useProceduralFallback).toBe(true);
    expect(projectModels.jura.cameraKeyframes.length).toBeGreaterThan(1);
  });
});
