import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from "react";
import { useExperienceTier } from "../motion/ExperienceTierContext";

type SceneProps = { scrollProgress: number; visible: boolean; onReady?: () => void };

const sceneLoaders = {
  home: () => import("./scenes/HeroScenes").then((m) => ({ default: m.HomeHeroScene })),
  jura: () => import("./scenes/HeroScenes").then((m) => ({ default: m.JuraHeroScene })),
  jamila: () => import("./scenes/HeroScenes").then((m) => ({ default: m.JamilaHeroScene })),
} as const;

const lazyScenes: Record<keyof typeof sceneLoaders, React.LazyExoticComponent<ComponentType<SceneProps>>> = {
  home: lazy(sceneLoaders.home),
  jura: lazy(sceneLoaders.jura),
  jamila: lazy(sceneLoaders.jamila),
};

interface HeroWebGLBackgroundProps {
  scene: keyof typeof sceneLoaders;
  scrollProgress: number;
  onReady?: () => void;
}

type TransitionState = "entering" | "visible" | "exiting" | "hidden";

export function HeroWebGLBackground({ scene, scrollProgress, onReady }: HeroWebGLBackgroundProps) {
  const { enableWebGL } = useExperienceTier();
  const [mounted, setMounted] = useState(false);
  const [transitionState, setTransitionState] = useState<TransitionState>("hidden");
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (enableWebGL) {
      setMounted(true);
      setTransitionState("entering");
      timeoutRef.current = setTimeout(() => {
        setTransitionState("visible");
        onReady?.();
      }, 50);
    } else {
      setTransitionState("exiting");
      timeoutRef.current = setTimeout(() => {
        setMounted(false);
        setTransitionState("hidden");
      }, 600);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enableWebGL, onReady]);

  if (!mounted) return null;

  const Scene = lazyScenes[scene];

  const transitionClass =
    transitionState === "entering"
      ? "j-webgl-transition--entering"
      : transitionState === "visible"
        ? "j-webgl-transition--visible"
        : transitionState === "exiting"
          ? "j-webgl-transition--exiting"
          : "j-webgl-transition--hidden";

  return (
    <div
      ref={containerRef}
      className={`j-webgl-transition ${transitionClass}`}
      style={{ position: "absolute", inset: 0, zIndex: 5 }}
    >
      <Suspense fallback={<WebGLLoadingFallback />}>
        <Scene scrollProgress={scrollProgress} visible={enableWebGL} onReady={onReady} />
      </Suspense>
    </div>
  );
}

function WebGLLoadingFallback() {
  return (
    <div className="j-webgl-loading absolute inset-0 flex items-center justify-center">
      <div className="j-webgl-loading-spinner" />
    </div>
  );
}
