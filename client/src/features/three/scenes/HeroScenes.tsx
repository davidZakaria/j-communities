import { useMemo } from "react";
import { getProjectModelConfig } from "../../../config/projectModels";
import { getProjectTheme } from "../../../config/projectThemes";
import { getStoryConfig } from "../../../config/storyBeats";
import { useExperienceTier } from "../../motion/ExperienceTierContext";
import { AnimatedModel } from "../AnimatedModel";
import { CinematicEffects } from "../CinematicEffects";
import { HeroCanvas } from "../HeroCanvas";
import { HeroParticles } from "../HeroParticles";
import { SceneAtmosphere } from "../SceneAtmosphere";
import { DynamicSceneEnvironment, SceneEnvironment } from "../SceneEnvironment";
import { lerpStoryBeats } from "../scrollCameraRig";

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
  const storyConfig = getStoryConfig("jura");

  const { atmosphere } = useMemo(
    () => lerpStoryBeats(storyConfig.beats, scrollProgress, storyConfig.transitionEasing),
    [storyConfig, scrollProgress],
  );

  const cameraKeyframes = useMemo(
    () => storyConfig.beats.map((beat) => beat.camera),
    [storyConfig],
  );

  const isFullTier = tier === "full";

  return (
    <HeroCanvas
      scrollProgress={scrollProgress}
      cameraKeyframes={cameraKeyframes}
      visible={visible}
      tier={tier}
      reducedMotion={reducedMotion}
      onReady={onReady}
      variant="jura"
    >
      <DynamicSceneEnvironment atmosphere={atmosphere} variant="jura" tier={tier}>
        <AnimatedModel
          glbUrl={config.glbUrl}
          animationClips={config.animationClips}
          useProceduralFallback={config.useProceduralFallback}
          variant="jura"
          accent={theme.colors.accent}
          scrollProgress={scrollProgress}
          tier={tier}
        />
        {isFullTier && (
          <>
            <HeroParticles
              variant="jura"
              scrollProgress={scrollProgress}
              intensity={atmosphere.particleIntensity}
              primaryColor={storyConfig.particleColor}
              secondaryColor={storyConfig.particleColorAlt}
            />
            <SceneAtmosphere
              glowColor={storyConfig.glowColor}
              glowIntensity={atmosphere.glowIntensity}
              scrollProgress={scrollProgress}
            />
          </>
        )}
      </DynamicSceneEnvironment>
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
  const storyConfig = getStoryConfig("jamila");

  const { atmosphere } = useMemo(
    () => lerpStoryBeats(storyConfig.beats, scrollProgress, storyConfig.transitionEasing),
    [storyConfig, scrollProgress],
  );

  const cameraKeyframes = useMemo(
    () => storyConfig.beats.map((beat) => beat.camera),
    [storyConfig],
  );

  const isFullTier = tier === "full";

  return (
    <HeroCanvas
      scrollProgress={scrollProgress}
      cameraKeyframes={cameraKeyframes}
      visible={visible}
      tier={tier}
      reducedMotion={reducedMotion}
      onReady={onReady}
      variant="jamila"
    >
      <DynamicSceneEnvironment atmosphere={atmosphere} variant="jamila" tier={tier}>
        <AnimatedModel
          glbUrl={config.glbUrl}
          animationClips={config.animationClips}
          useProceduralFallback={config.useProceduralFallback}
          variant="jamila"
          accent={theme.colors.accentHover}
          scrollProgress={scrollProgress}
          tier={tier}
        />
        {isFullTier && (
          <>
            <HeroParticles
              variant="jamila"
              scrollProgress={scrollProgress}
              intensity={atmosphere.particleIntensity}
              primaryColor={storyConfig.particleColor}
              secondaryColor={storyConfig.particleColorAlt}
            />
            <SceneAtmosphere
              glowColor={storyConfig.glowColor}
              glowIntensity={atmosphere.glowIntensity}
              scrollProgress={scrollProgress}
            />
          </>
        )}
      </DynamicSceneEnvironment>
      <CinematicEffects
        tier={tier}
        reducedMotion={reducedMotion}
        variant="jamila"
        scrollProgress={scrollProgress}
      />
    </HeroCanvas>
  );
}
