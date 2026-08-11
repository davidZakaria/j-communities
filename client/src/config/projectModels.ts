/**
 * Hero 3D model paths and camera rigs.
 * When NJD delivers final GLBs: drop files in public/assets/models/ and update paths here.
 * Run: npm run compress:models (after installing @gltf-transform/cli)
 */
import type { ProjectThemeId } from "../../data/projects";
import type { CameraKeyframe } from "../features/three/scrollCameraRig";

export interface ProjectModelConfig {
  /** Optional GLB — procedural mesh used when empty or missing */
  glbUrl: string;
  animationClips: string[];
  cameraKeyframes: CameraKeyframe[];
  useProceduralFallback: boolean;
}

const defaultOrbit: CameraKeyframe[] = [
  { position: [6, 4, 8], target: [0, 0.5, 0] },
  { position: [3.5, 2.2, 4.5], target: [0, 0.4, 0] },
  { position: [2, 1.6, 3], target: [0, 0.35, 0] },
];

export const projectModels: Record<ProjectThemeId | "home", ProjectModelConfig> = {
  home: {
    glbUrl: "/assets/models/home/hero.glb",
    animationClips: ["HeroLoop"],
    cameraKeyframes: [
      { position: [0, 2.5, 7], target: [0, 0, 0] },
      { position: [0, 1.8, 5], target: [0, -0.2, 0] },
      { position: [0, 1.2, 4], target: [0, -0.4, 0] },
    ],
    useProceduralFallback: true,
  },
  jura: {
    glbUrl: "/assets/models/jura/hero.glb",
    animationClips: ["Idle", "Orbit"],
    cameraKeyframes: defaultOrbit,
    useProceduralFallback: true,
  },
  jamila: {
    glbUrl: "/assets/models/jamila/hero.glb",
    animationClips: ["Idle", "Reveal"],
    cameraKeyframes: [
      { position: [7, 5, 9], target: [0, 1, 0] },
      { position: [4, 2.8, 5], target: [0, 0.8, 0] },
      { position: [2.5, 2, 3.5], target: [0, 0.6, 0] },
    ],
    useProceduralFallback: true,
  },
};

export function getProjectModelConfig(id: ProjectThemeId | "home"): ProjectModelConfig {
  return projectModels[id];
}
