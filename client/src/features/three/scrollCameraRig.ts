import * as THREE from "three";
import type { AtmosphereState, StoryBeat } from "../../config/storyBeats";

export interface CameraKeyframe {
  position: [number, number, number];
  target: [number, number, number];
}

export type TransitionEasing = "linear" | "easeInOut" | "easeOut";

function applyEasing(t: number, easing: TransitionEasing): number {
  switch (easing) {
    case "easeInOut":
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    case "easeOut":
      return 1 - Math.pow(1 - t, 3);
    default:
      return t;
  }
}

export function lerpKeyframes(
  keyframes: CameraKeyframe[],
  t: number,
): { position: THREE.Vector3; target: THREE.Vector3 } {
  const clamped = Math.min(Math.max(t, 0), 1);
  const segments = keyframes.length - 1;
  const scaled = clamped * segments;
  const index = Math.min(Math.floor(scaled), segments - 1);
  const localT = scaled - index;

  const a = keyframes[index];
  const b = keyframes[index + 1] ?? a;

  const position = new THREE.Vector3(
    THREE.MathUtils.lerp(a.position[0], b.position[0], localT),
    THREE.MathUtils.lerp(a.position[1], b.position[1], localT),
    THREE.MathUtils.lerp(a.position[2], b.position[2], localT),
  );

  const target = new THREE.Vector3(
    THREE.MathUtils.lerp(a.target[0], b.target[0], localT),
    THREE.MathUtils.lerp(a.target[1], b.target[1], localT),
    THREE.MathUtils.lerp(a.target[2], b.target[2], localT),
  );

  return { position, target };
}

function lerpColor(a: string, b: string, t: number): string {
  const colorA = new THREE.Color(a);
  const colorB = new THREE.Color(b);
  colorA.lerp(colorB, t);
  return `#${colorA.getHexString()}`;
}

export function lerpAtmosphere(
  beats: StoryBeat[],
  progress: number,
  easing: TransitionEasing = "easeInOut",
): AtmosphereState {
  const clamped = Math.min(Math.max(progress, 0), 1);

  let prevBeat = beats[0];
  let nextBeat = beats[beats.length - 1];

  for (let i = 0; i < beats.length - 1; i++) {
    if (clamped >= beats[i].progress && clamped <= beats[i + 1].progress) {
      prevBeat = beats[i];
      nextBeat = beats[i + 1];
      break;
    }
  }

  const range = nextBeat.progress - prevBeat.progress;
  const localT = range > 0 ? (clamped - prevBeat.progress) / range : 0;
  const easedT = applyEasing(localT, easing);

  const a = prevBeat.atmosphere;
  const b = nextBeat.atmosphere;

  return {
    fogColor: lerpColor(a.fogColor, b.fogColor, easedT),
    fogNear: THREE.MathUtils.lerp(a.fogNear, b.fogNear, easedT),
    fogFar: THREE.MathUtils.lerp(a.fogFar, b.fogFar, easedT),
    ambientIntensity: THREE.MathUtils.lerp(a.ambientIntensity, b.ambientIntensity, easedT),
    directionalIntensity: THREE.MathUtils.lerp(a.directionalIntensity, b.directionalIntensity, easedT),
    particleIntensity: THREE.MathUtils.lerp(a.particleIntensity, b.particleIntensity, easedT),
    glowIntensity: THREE.MathUtils.lerp(a.glowIntensity, b.glowIntensity, easedT),
  };
}

export function lerpStoryBeats(
  beats: StoryBeat[],
  progress: number,
  easing: TransitionEasing = "easeInOut",
): { position: THREE.Vector3; target: THREE.Vector3; atmosphere: AtmosphereState } {
  const keyframes = beats.map((beat) => beat.camera);
  const { position, target } = lerpKeyframes(keyframes, progress);
  const atmosphere = lerpAtmosphere(beats, progress, easing);
  return { position, target, atmosphere };
}

export function applyScrollCameraRig(
  camera: THREE.PerspectiveCamera,
  keyframes: CameraKeyframe[],
  progress: number,
): void {
  const { position, target } = lerpKeyframes(keyframes, progress);
  camera.position.copy(position);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
}
