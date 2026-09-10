import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type ReactNode } from "react";
import type { PerspectiveCamera } from "three";
import { applyScrollCameraRig } from "./scrollCameraRig";
import type { CameraKeyframe } from "./scrollCameraRig";

interface ScrollCameraProps {
  keyframes: CameraKeyframe[];
  scrollProgress: number;
}

function ScrollCamera({ keyframes, scrollProgress }: ScrollCameraProps) {
  const { camera } = useThree();
  const cam = camera as PerspectiveCamera;

  useFrame(() => {
    applyScrollCameraRig(cam, keyframes, scrollProgress);
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
  onReady?: () => void;
}

export function HeroCanvas({
  scrollProgress,
  cameraKeyframes,
  visible,
  children,
  onReady,
}: HeroCanvasProps) {
  if (!visible) return null;

  return (
    <div className="j-hero-canvas pointer-events-none absolute inset-0 z-[5]">
      <Canvas
        dpr={[1, 1.75]}
        frameloop="always"
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        camera={{ fov: 42, near: 0.1, far: 100, position: [6, 4, 8] }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <ScrollCamera keyframes={cameraKeyframes} scrollProgress={scrollProgress} />
          {children}
          <ReadyNotifier onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
