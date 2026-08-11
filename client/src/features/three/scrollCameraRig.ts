import * as THREE from "three";

export interface CameraKeyframe {
  position: [number, number, number];
  target: [number, number, number];
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
