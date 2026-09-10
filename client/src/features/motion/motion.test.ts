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

describe("storyBeats config", () => {
  it("has valid story beats for all scenes", async () => {
    const { storyConfigs, getStoryConfig } = await import("../../config/storyBeats");
    
    expect(storyConfigs.home.beats.length).toBeGreaterThan(2);
    expect(storyConfigs.jura.beats.length).toBeGreaterThan(2);
    expect(storyConfigs.jamila.beats.length).toBeGreaterThan(2);
    
    const homeConfig = getStoryConfig("home");
    expect(homeConfig.particleColor).toBeDefined();
    expect(homeConfig.glowColor).toBeDefined();
  });

  it("has beats at correct progress thresholds", async () => {
    const { storyConfigs } = await import("../../config/storyBeats");
    
    const homeBeats = storyConfigs.home.beats;
    expect(homeBeats[0].progress).toBe(0);
    expect(homeBeats[homeBeats.length - 1].progress).toBe(1);
    
    for (let i = 1; i < homeBeats.length; i++) {
      expect(homeBeats[i].progress).toBeGreaterThan(homeBeats[i - 1].progress);
    }
  });

  it("has valid atmosphere states in beats", async () => {
    const { storyConfigs } = await import("../../config/storyBeats");
    
    for (const beat of storyConfigs.jura.beats) {
      expect(beat.atmosphere.fogNear).toBeLessThan(beat.atmosphere.fogFar);
      expect(beat.atmosphere.ambientIntensity).toBeGreaterThan(0);
      expect(beat.atmosphere.particleIntensity).toBeGreaterThanOrEqual(0);
      expect(beat.atmosphere.particleIntensity).toBeLessThanOrEqual(1);
    }
  });
});

describe("scrollCameraRig atmosphere interpolation", () => {
  it("interpolates atmosphere between beats", async () => {
    const { lerpAtmosphere } = await import("../three/scrollCameraRig");
    const { storyConfigs } = await import("../../config/storyBeats");
    
    const beats = storyConfigs.home.beats;
    
    const atStart = lerpAtmosphere(beats, 0);
    const atMiddle = lerpAtmosphere(beats, 0.5);
    const atEnd = lerpAtmosphere(beats, 1);
    
    expect(atStart.fogColor).toBe(beats[0].atmosphere.fogColor);
    expect(atEnd.fogColor).toBe(beats[beats.length - 1].atmosphere.fogColor);
    
    expect(atMiddle.fogNear).toBeGreaterThan(0);
    expect(atMiddle.fogFar).toBeGreaterThan(atMiddle.fogNear);
  });
});
