export type ExperienceTier = "full" | "light" | "static";

export interface MotionPreferences {
  reducedMotion: boolean;
  coarsePointer: boolean;
  saveData: boolean;
  largeViewport: boolean;
  finePointer: boolean;
  webglAvailable: boolean;
}
