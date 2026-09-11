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
  variant?: "home" | "jura" | "jamila";
}

function ScrollCamera({
  keyframes,
  scrollProgress,
  pointerOffset,
  reducedMotion,
  enableDamping,
  variant = "home",
}: ScrollCameraProps) {
  const { camera } = useThree();
  const cam = camera as PerspectiveCamera;
  const stateRef = useRef<DampedCameraState>(createDampedCameraState());

  const isHome = variant === "home";

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
        damping: isHome ? 0.96 : 0.93,
        responsiveness: isHome ? 0.08 : 0.12,
        pointerInfluence: isHome ? 0.15 : 0.35,
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
  variant?: "home" | "jura" | "jamila";
}

export function HeroCanvas({
  scrollProgress,
  cameraKeyframes,
  visible,
  children,
  tier = "full",
  reducedMotion = false,
  onReady,
  variant = "home",
}: HeroCanvasProps) {
  const isHome = variant === "home";
  const enableDamping = tier === "full" && !reducedMotion;
  const enablePointerParallax = tier === "full" && !reducedMotion && !isHome;

  const pointerOffset = usePointerParallax({
    enabled: enablePointerParallax && visible,
    sensitivity: isHome ? 0.25 : 0.5,
    smoothing: isHome ? 0.03 : 0.05,
  });

  if (!visible) return null;

  const frameloop = tier === "full" ? "always" : "demand";
  const dpr: [number, number] = isHome ? [1, 1] : tier === "full" ? [1, 1.5] : [1, 1.25];

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
          antialias: tier === "full" && !isHome,
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
            variant={variant}
          />
          {children}
          <ReadyNotifier onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
