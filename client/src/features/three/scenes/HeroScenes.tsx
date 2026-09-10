import { useMemo } from "react";
import { getProjectModelConfig } from "../../../config/projectModels";
import { getProjectTheme } from "../../../config/projectThemes";
import { getStoryConfig } from "../../../config/storyBeats";
import { AnimatedModel } from "../AnimatedModel";
import { HeroCanvas } from "../HeroCanvas";
import { HeroParticles } from "../HeroParticles";
import { SceneAtmosphere } from "../SceneAtmosphere";
import { DynamicSceneEnvironment } from "../SceneEnvironment";
import { lerpStoryBeats } from "../scrollCameraRig";

interface HomeHeroSceneProps {
  scrollProgress: number;
  visible: boolean;
}

export function HomeHeroScene({ scrollProgress, visible }: HomeHeroSceneProps) {
  const config = getProjectModelConfig("home");
  const storyConfig = getStoryConfig("home");

  const { atmosphere } = useMemo(
    () => lerpStoryBeats(storyConfig.beats, scrollProgress, storyConfig.transitionEasing),
    [storyConfig, scrollProgress],
  );

  const cameraKeyframes = useMemo(
    () => storyConfig.beats.map((beat) => beat.camera),
    [storyConfig],
  );

  return (
    <HeroCanvas
      scrollProgress={scrollProgress}
      cameraKeyframes={cameraKeyframes}
      visible={visible}
    >
      <DynamicSceneEnvironment atmosphere={atmosphere}>
        <AnimatedModel
          glbUrl={config.glbUrl}
          animationClips={config.animationClips}
          useProceduralFallback={config.useProceduralFallback}
          variant="home"
          accent="#888888"
          scrollProgress={scrollProgress}
        />
        <HeroParticles
          variant="home"
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
      </DynamicSceneEnvironment>
    </HeroCanvas>
  );
}

export function JuraHeroScene({ scrollProgress, visible }: HomeHeroSceneProps) {
  const theme = getProjectTheme("jura");
  const config = getProjectModelConfig("jura");
  const storyConfig = getStoryConfig("jura");

  const { atmosphere } = useMemo(
    () => lerpStoryBeats(storyConfig.beats, scrollProgress, storyConfig.transitionEasing),
    [storyConfig, scrollProgress],
  );

  const cameraKeyframes = useMemo(
    () => storyConfig.beats.map((beat) => beat.camera),
    [storyConfig],
  );

  return (
    <HeroCanvas
      scrollProgress={scrollProgress}
      cameraKeyframes={cameraKeyframes}
      visible={visible}
    >
      <DynamicSceneEnvironment atmosphere={atmosphere}>
        <AnimatedModel
          glbUrl={config.glbUrl}
          animationClips={config.animationClips}
          useProceduralFallback={config.useProceduralFallback}
          variant="jura"
          accent={theme.colors.accent}
          scrollProgress={scrollProgress}
        />
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
      </DynamicSceneEnvironment>
    </HeroCanvas>
  );
}

export function JamilaHeroScene({ scrollProgress, visible }: HomeHeroSceneProps) {
  const theme = getProjectTheme("jamila");
  const config = getProjectModelConfig("jamila");
  const storyConfig = getStoryConfig("jamila");

  const { atmosphere } = useMemo(
    () => lerpStoryBeats(storyConfig.beats, scrollProgress, storyConfig.transitionEasing),
    [storyConfig, scrollProgress],
  );

  const cameraKeyframes = useMemo(
    () => storyConfig.beats.map((beat) => beat.camera),
    [storyConfig],
  );

  return (
    <HeroCanvas
      scrollProgress={scrollProgress}
      cameraKeyframes={cameraKeyframes}
      visible={visible}
    >
      <DynamicSceneEnvironment atmosphere={atmosphere}>
        <AnimatedModel
          glbUrl={config.glbUrl}
          animationClips={config.animationClips}
          useProceduralFallback={config.useProceduralFallback}
          variant="jamila"
          accent={theme.colors.accentHover}
          scrollProgress={scrollProgress}
        />
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
      </DynamicSceneEnvironment>
    </HeroCanvas>
  );
}
