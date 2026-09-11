/**
 * Story Scroll Beats - narrative thresholds with camera/atmosphere changes.
 * Extends Phase 1 keyframe system with cinematic atmosphere transitions.
 */
import type { CameraKeyframe } from "../features/three/scrollCameraRig";

export interface AtmosphereState {
  fogColor: string;
  fogNear: number;
  fogFar: number;
  ambientIntensity: number;
  directionalIntensity: number;
  particleIntensity: number;
  glowIntensity: number;
}

export interface StoryBeat {
  progress: number;
  camera: CameraKeyframe;
  atmosphere: AtmosphereState;
  label?: string;
}

export interface StoryConfig {
  beats: StoryBeat[];
  particleColor: string;
  particleColorAlt: string;
  glowColor: string;
  transitionEasing: "linear" | "easeInOut" | "easeOut";
}

const homeBeats: StoryBeat[] = [
  {
    progress: 0,
    label: "opening",
    camera: { position: [0, 2.5, 7], target: [0, 0, 0] },
    atmosphere: {
      fogColor: "#0a0a0a",
      fogNear: 8,
      fogFar: 28,
      ambientIntensity: 0.45,
      directionalIntensity: 0.55,
      particleIntensity: 0.3,
      glowIntensity: 0.15,
    },
  },
  {
    progress: 0.25,
    label: "reveal",
    camera: { position: [1.5, 2.2, 5.5], target: [0, -0.1, 0] },
    atmosphere: {
      fogColor: "#0c0c0c",
      fogNear: 6,
      fogFar: 24,
      ambientIntensity: 0.52,
      directionalIntensity: 0.62,
      particleIntensity: 0.5,
      glowIntensity: 0.25,
    },
  },
  {
    progress: 0.5,
    label: "focus",
    camera: { position: [0.5, 1.8, 4.5], target: [0, -0.25, 0] },
    atmosphere: {
      fogColor: "#0d0d0d",
      fogNear: 5,
      fogFar: 20,
      ambientIntensity: 0.58,
      directionalIntensity: 0.68,
      particleIntensity: 0.65,
      glowIntensity: 0.35,
    },
  },
  {
    progress: 0.75,
    label: "intimate",
    camera: { position: [-0.3, 1.5, 3.8], target: [0, -0.35, 0] },
    atmosphere: {
      fogColor: "#0e0e0e",
      fogNear: 4,
      fogFar: 18,
      ambientIntensity: 0.62,
      directionalIntensity: 0.72,
      particleIntensity: 0.75,
      glowIntensity: 0.42,
    },
  },
  {
    progress: 1,
    label: "close",
    camera: { position: [0, 1.2, 4], target: [0, -0.4, 0] },
    atmosphere: {
      fogColor: "#101010",
      fogNear: 3,
      fogFar: 16,
      ambientIntensity: 0.65,
      directionalIntensity: 0.75,
      particleIntensity: 0.6,
      glowIntensity: 0.35,
    },
  },
];

const juraBeats: StoryBeat[] = [
  {
    progress: 0,
    label: "coastal-vista",
    camera: { position: [6, 4, 8], target: [0, 0.5, 0] },
    atmosphere: {
      fogColor: "#0A2E40",
      fogNear: 10,
      fogFar: 32,
      ambientIntensity: 0.4,
      directionalIntensity: 0.6,
      particleIntensity: 0.4,
      glowIntensity: 0.2,
    },
  },
  {
    progress: 0.25,
    label: "approach",
    camera: { position: [4.5, 3.2, 6], target: [0, 0.45, 0] },
    atmosphere: {
      fogColor: "#0A3848",
      fogNear: 8,
      fogFar: 28,
      ambientIntensity: 0.48,
      directionalIntensity: 0.65,
      particleIntensity: 0.55,
      glowIntensity: 0.3,
    },
  },
  {
    progress: 0.5,
    label: "warmth",
    camera: { position: [3.5, 2.4, 4.8], target: [0, 0.4, 0] },
    atmosphere: {
      fogColor: "#0A4550",
      fogNear: 6,
      fogFar: 24,
      ambientIntensity: 0.55,
      directionalIntensity: 0.7,
      particleIntensity: 0.7,
      glowIntensity: 0.45,
    },
  },
  {
    progress: 0.75,
    label: "golden-hour",
    camera: { position: [2.8, 1.9, 3.8], target: [0, 0.38, 0] },
    atmosphere: {
      fogColor: "#0A5058",
      fogNear: 5,
      fogFar: 20,
      ambientIntensity: 0.6,
      directionalIntensity: 0.78,
      particleIntensity: 0.8,
      glowIntensity: 0.55,
    },
  },
  {
    progress: 1,
    label: "arrival",
    camera: { position: [2, 1.6, 3], target: [0, 0.35, 0] },
    atmosphere: {
      fogColor: "#0A5C5C",
      fogNear: 4,
      fogFar: 18,
      ambientIntensity: 0.62,
      directionalIntensity: 0.8,
      particleIntensity: 0.65,
      glowIntensity: 0.4,
    },
  },
];

const jamilaBeats: StoryBeat[] = [
  {
    progress: 0,
    label: "skyline",
    camera: { position: [7, 5, 9], target: [0, 1, 0] },
    atmosphere: {
      fogColor: "#1A4284",
      fogNear: 8,
      fogFar: 30,
      ambientIntensity: 0.5,
      directionalIntensity: 0.58,
      particleIntensity: 0.35,
      glowIntensity: 0.25,
    },
  },
  {
    progress: 0.25,
    label: "ascent",
    camera: { position: [5.5, 4, 7], target: [0, 0.9, 0] },
    atmosphere: {
      fogColor: "#1D4A90",
      fogNear: 7,
      fogFar: 26,
      ambientIntensity: 0.55,
      directionalIntensity: 0.65,
      particleIntensity: 0.5,
      glowIntensity: 0.35,
    },
  },
  {
    progress: 0.5,
    label: "elevation",
    camera: { position: [4, 3, 5], target: [0, 0.82, 0] },
    atmosphere: {
      fogColor: "#20529C",
      fogNear: 6,
      fogFar: 22,
      ambientIntensity: 0.6,
      directionalIntensity: 0.72,
      particleIntensity: 0.65,
      glowIntensity: 0.48,
    },
  },
  {
    progress: 0.75,
    label: "pinnacle",
    camera: { position: [3.2, 2.4, 4.2], target: [0, 0.72, 0] },
    atmosphere: {
      fogColor: "#235AA8",
      fogNear: 5,
      fogFar: 20,
      ambientIntensity: 0.65,
      directionalIntensity: 0.78,
      particleIntensity: 0.78,
      glowIntensity: 0.58,
    },
  },
  {
    progress: 1,
    label: "embrace",
    camera: { position: [2.5, 2, 3.5], target: [0, 0.6, 0] },
    atmosphere: {
      fogColor: "#2662B4",
      fogNear: 4,
      fogFar: 18,
      ambientIntensity: 0.68,
      directionalIntensity: 0.82,
      particleIntensity: 0.6,
      glowIntensity: 0.42,
    },
  },
];

export const storyConfigs: Record<"home" | "jura" | "jamila", StoryConfig> = {
  home: {
    beats: homeBeats,
    particleColor: "#f5f5f5",
    particleColorAlt: "#888888",
    glowColor: "#444444",
    transitionEasing: "easeInOut",
  },
  jura: {
    beats: juraBeats,
    particleColor: "#E89130",
    particleColorAlt: "#0A5C5C",
    glowColor: "#C7521C",
    transitionEasing: "easeOut",
  },
  jamila: {
    beats: jamilaBeats,
    particleColor: "#DDFF00",
    particleColorAlt: "#20B6B5",
    glowColor: "#1A4284",
    transitionEasing: "easeInOut",
  },
};

export function getStoryConfig(scene: "home" | "jura" | "jamila"): StoryConfig {
  return storyConfigs[scene];
}
