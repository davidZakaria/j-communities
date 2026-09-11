import { getProjectModelConfig } from "../../../config/projectModels";
import { getProjectTheme } from "../../../config/projectThemes";
import { useExperienceTier } from "../../motion/ExperienceTierContext";
import { AnimatedModel } from "../AnimatedModel";
import { CinematicEffects } from "../CinematicEffects";
import { HeroCanvas } from "../HeroCanvas";
import { SceneEnvironment } from "../SceneEnvironment";

interface HeroSceneProps {
  scrollProgress: number;
  visible: boolean;
  onReady?: () => void;
}

function useReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HomeHeroScene({ scrollProgress, visible, onReady }: HeroSceneProps) {
  const config = getProjectModelConfig("home");
  const { tier } = useExperienceTier();
  const reducedMotion = useReducedMotion();

  return (
    <HeroCanvas
      scrollProgress={scrollProgress}
      cameraKeyframes={config.cameraKeyframes}
      visible={visible}
      tier={tier}
      reducedMotion={reducedMotion}
      onReady={onReady}
      variant="home"
    >
      <SceneEnvironment
        fogColor="#0a0a0a"
        variant="home"
        tier={tier}
        scrollProgress={scrollProgress}
      >
        <AnimatedModel
          glbUrl={config.glbUrl}
          animationClips={config.animationClips}
          useProceduralFallback={config.useProceduralFallback}
          variant="home"
          accent="#888888"
          scrollProgress={scrollProgress}
          tier={tier}
        />
      </SceneEnvironment>
      <CinematicEffects
        tier={tier}
        reducedMotion={reducedMotion}
        variant="home"
        scrollProgress={scrollProgress}
      />
    </HeroCanvas>
  );
}

export function JuraHeroScene({ scrollProgress, visible, onReady }: HeroSceneProps) {
  const theme = getProjectTheme("jura");
  const config = getProjectModelConfig("jura");
  const { tier } = useExperienceTier();
  const reducedMotion = useReducedMotion();

  return (
    <HeroCanvas
      scrollProgress={scrollProgress}
      cameraKeyframes={config.cameraKeyframes}
      visible={visible}
      tier={tier}
      reducedMotion={reducedMotion}
      onReady={onReady}
      variant="jura"
    >
      <SceneEnvironment
        fogColor={theme.colors.bg}
        variant="jura"
        tier={tier}
        scrollProgress={scrollProgress}
      >
        <AnimatedModel
          glbUrl={config.glbUrl}
          animationClips={config.animationClips}
          useProceduralFallback={config.useProceduralFallback}
          variant="jura"
          accent={theme.colors.accent}
          scrollProgress={scrollProgress}
          tier={tier}
        />
      </SceneEnvironment>
      <CinematicEffects
        tier={tier}
        reducedMotion={reducedMotion}
        variant="jura"
        scrollProgress={scrollProgress}
      />
    </HeroCanvas>
  );
}

export function JamilaHeroScene({ scrollProgress, visible, onReady }: HeroSceneProps) {
  const theme = getProjectTheme("jamila");
  const config = getProjectModelConfig("jamila");
  const { tier } = useExperienceTier();
  const reducedMotion = useReducedMotion();

  return (
    <HeroCanvas
      scrollProgress={scrollProgress}
      cameraKeyframes={config.cameraKeyframes}
      visible={visible}
      tier={tier}
      reducedMotion={reducedMotion}
      onReady={onReady}
      variant="jamila"
    >
      <SceneEnvironment
        fogColor={theme.colors.accent}
        fogNear={6}
        fogFar={28}
        variant="jamila"
        tier={tier}
        scrollProgress={scrollProgress}
      >
        <AnimatedModel
          glbUrl={config.glbUrl}
          animationClips={config.animationClips}
          useProceduralFallback={config.useProceduralFallback}
          variant="jamila"
          accent={theme.colors.accentHover}
          scrollProgress={scrollProgress}
          tier={tier}
        />
      </SceneEnvironment>
      <CinematicEffects
        tier={tier}
        reducedMotion={reducedMotion}
        variant="jamila"
        scrollProgress={scrollProgress}
      />
    </HeroCanvas>
  );
}
