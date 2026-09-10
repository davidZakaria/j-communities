import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type ReactNode } from "react";
import type { PerspectiveCamera } from "three";
import {
  applyDampedCameraRig,
  createDampedCameraState,
  lerpKeyframes,
  type CameraKeyframe,
  type DampedCameraState,
} from "./scrollCameraRig";
import { usePointerParallax } from "./usePointerParallax";

interface ScrollCameraProps {
  keyframes: CameraKeyframe[];
  scrollProgress: number;
  pointerOffset: { x: number; y: number };
  reducedMotion: boolean;
  enableDamping: boolean;
}

function ScrollCamera({
  keyframes,
  scrollProgress,
  pointerOffset,
  reducedMotion,
  enableDamping,
}: ScrollCameraProps) {
  const { camera } = useThree();
  const cam = camera as PerspectiveCamera;
  const stateRef = useRef<DampedCameraState>(createDampedCameraState());

  useFrame((_, delta) => {
    if (!enableDamping) {
      const { position, target } = lerpKeyframes(keyframes, scrollProgress);
      cam.position.copy(position);
      cam.lookAt(target);
      cam.updateProjectionMatrix();
      return;
    }

    applyDampedCameraRig(
      cam,
      keyframes,
      scrollProgress,
      stateRef.current,
      delta,
      pointerOffset,
      {
        damping: 0.88,
        responsiveness: 0.12,
        pointerInfluence: 0.35,
        reducedMotion,
      },
    );
  });

  return null;
}

function ReadyNotifier({ onReady }: { onReady?: () => void }) {
  const calledRef = useRef(false);

  useEffect(() => {
    if (onReady && !calledRef.current) {
      calledRef.current = true;
      const timer = requestAnimationFrame(() => {
        onReady();
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [onReady]);

  return null;
}

interface HeroCanvasProps {
  scrollProgress: number;
  cameraKeyframes: CameraKeyframe[];
  visible: boolean;
  children: ReactNode;
  tier?: "full" | "light" | "static";
  reducedMotion?: boolean;
  onReady?: () => void;

}

export function HeroCanvas({
  scrollProgress,
  cameraKeyframes,
  visible,
  children,
  tier = "full",
  reducedMotion = false,
  onReady,

}: HeroCanvasProps) {
  const enableDamping = tier === "full" && !reducedMotion;
  const enablePointerParallax = tier === "full" && !reducedMotion;

  const pointerOffset = usePointerParallax({
    enabled: enablePointerParallax && visible,
    sensitivity: 0.6,
    smoothing: 0.08,
  });

  if (!visible) return null;

  const frameloop = tier === "full" ? "always" : "demand";
  const dpr: [number, number] = tier === "full" ? [1, 2] : [1, 1.5];

  return (
    <div 
      className="j-hero-canvas pointer-events-none absolute inset-0 z-[5]"
      style={{
        maskImage: "linear-gradient(to right, black 0%, black 50%, rgba(0,0,0,0.4) 72%, transparent 92%)",
        WebkitMaskImage: "linear-gradient(to right, black 0%, black 50%, rgba(0,0,0,0.4) 72%, transparent 92%)",
      }}
    >
      <Canvas
        dpr={dpr}
        frameloop={frameloop}
        gl={{
          antialias: tier === "full",
          alpha: true,
          powerPreference: tier === "full" ? "high-performance" : "default",
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        camera={{ fov: 42, near: 0.1, far: 100, position: [6, 4, 8] }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <ScrollCamera
            keyframes={cameraKeyframes}
            scrollProgress={scrollProgress}
            pointerOffset={pointerOffset}
            reducedMotion={reducedMotion}
            enableDamping={enableDamping}
          />
          {children}
          <ReadyNotifier onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
