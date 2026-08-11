import { lazy, Suspense, useEffect, useState, type ComponentType } from "react";
import { useExperienceTier } from "../motion/ExperienceTierContext";

type SceneProps = { scrollProgress: number; visible: boolean };

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
}

export function HeroWebGLBackground({ scene, scrollProgress }: HeroWebGLBackgroundProps) {
  const { enableWebGL } = useExperienceTier();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (enableWebGL) setMounted(true);
    else setMounted(false);
  }, [enableWebGL]);

  if (!mounted || !enableWebGL) return null;

  const Scene = lazyScenes[scene];

  return (
    <Suspense fallback={null}>
      <Scene scrollProgress={scrollProgress} visible={enableWebGL} />
    </Suspense>
  );
}
