import * as THREE from "three";
import type { AtmosphereState, StoryBeat } from "../../config/storyBeats";

export interface CameraKeyframe {
  position: [number, number, number];
  target: [number, number, number];
}

export interface DampedCameraState {
  currentPosition: THREE.Vector3;
  currentTarget: THREE.Vector3;
  velocity: THREE.Vector3;
  targetVelocity: THREE.Vector3;
}

export interface CameraRigOptions {
  damping?: number;
  responsiveness?: number;
  pointerInfluence?: number;
  reducedMotion?: boolean;
}

const DEFAULT_OPTIONS: Required<CameraRigOptions> = {
  damping: 0.92,
  responsiveness: 0.08,
  pointerInfluence: 0.4,
  reducedMotion: false,
};

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

export function createDampedCameraState(): DampedCameraState {
  return {
    currentPosition: new THREE.Vector3(),
    currentTarget: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    targetVelocity: new THREE.Vector3(),
  };
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
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

  const easedT = easeOutCubic(localT);

  const position = new THREE.Vector3(
    THREE.MathUtils.lerp(a.position[0], b.position[0], easedT),
    THREE.MathUtils.lerp(a.position[1], b.position[1], easedT),
    THREE.MathUtils.lerp(a.position[2], b.position[2], easedT),
  );

  const target = new THREE.Vector3(
    THREE.MathUtils.lerp(a.target[0], b.target[0], easedT),
    THREE.MathUtils.lerp(a.target[1], b.target[1], easedT),
    THREE.MathUtils.lerp(a.target[2], b.target[2], easedT),
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

export function applyDampedCameraRig(
  camera: THREE.PerspectiveCamera,
  keyframes: CameraKeyframe[],
  progress: number,
  state: DampedCameraState,
  delta: number,
  pointerOffset: { x: number; y: number } = { x: 0, y: 0 },
  options: CameraRigOptions = {},
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { position: goalPos, target: goalTarget } = lerpKeyframes(keyframes, progress);

  if (opts.reducedMotion) {
    camera.position.copy(goalPos);
    camera.lookAt(goalTarget);
    camera.updateProjectionMatrix();
    return;
  }

  if (state.currentPosition.lengthSq() === 0) {
    state.currentPosition.copy(goalPos);
    state.currentTarget.copy(goalTarget);
  }

  const pointerX = pointerOffset.x * opts.pointerInfluence;
  const pointerY = pointerOffset.y * opts.pointerInfluence * 0.5;

  const targetWithPointer = goalPos.clone();
  targetWithPointer.x += pointerX;
  targetWithPointer.y += pointerY * 0.3;

  const smoothFactor = 1 - Math.pow(opts.damping, delta * 60);
  const responseFactor = opts.responsiveness * delta * 60;

  const posDiff = targetWithPointer.clone().sub(state.currentPosition);
  state.velocity.lerp(posDiff.multiplyScalar(responseFactor), smoothFactor);
  state.currentPosition.add(state.velocity);

  const targetDiff = goalTarget.clone().sub(state.currentTarget);
  state.targetVelocity.lerp(targetDiff.multiplyScalar(responseFactor * 1.2), smoothFactor);
  state.currentTarget.add(state.targetVelocity);

  camera.position.copy(state.currentPosition);
  camera.lookAt(state.currentTarget);
  camera.updateProjectionMatrix();
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
