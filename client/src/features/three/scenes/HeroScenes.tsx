import { getProjectModelConfig } from "../../../config/projectModels";
import { getProjectTheme } from "../../../config/projectThemes";
import { AnimatedModel } from "../AnimatedModel";
import { HeroCanvas } from "../HeroCanvas";
import { SceneEnvironment } from "../SceneEnvironment";

interface HomeHeroSceneProps {
  scrollProgress: number;
  visible: boolean;
}

export function HomeHeroScene({ scrollProgress, visible }: HomeHeroSceneProps) {
  const config = getProjectModelConfig("home");

  return (
    <HeroCanvas
      scrollProgress={scrollProgress}
      cameraKeyframes={config.cameraKeyframes}
      visible={visible}
    >
      <SceneEnvironment fogColor="#0a0a0a">
        <AnimatedModel
          glbUrl={config.glbUrl}
          animationClips={config.animationClips}
          useProceduralFallback={config.useProceduralFallback}
          variant="home"
          accent="#888888"
          scrollProgress={scrollProgress}
        />
      </SceneEnvironment>
    </HeroCanvas>
  );
}

export function JuraHeroScene({ scrollProgress, visible }: HomeHeroSceneProps) {
  const theme = getProjectTheme("jura");
  const config = getProjectModelConfig("jura");

  return (
    <HeroCanvas
      scrollProgress={scrollProgress}
      cameraKeyframes={config.cameraKeyframes}
      visible={visible}
    >
      <SceneEnvironment fogColor={theme.colors.bg}>
        <AnimatedModel
          glbUrl={config.glbUrl}
          animationClips={config.animationClips}
          useProceduralFallback={config.useProceduralFallback}
          variant="jura"
          accent={theme.colors.accent}
          scrollProgress={scrollProgress}
        />
      </SceneEnvironment>
    </HeroCanvas>
  );
}

export function JamilaHeroScene({ scrollProgress, visible }: HomeHeroSceneProps) {
  const theme = getProjectTheme("jamila");
  const config = getProjectModelConfig("jamila");

  return (
    <HeroCanvas
      scrollProgress={scrollProgress}
      cameraKeyframes={config.cameraKeyframes}
      visible={visible}
    >
      <SceneEnvironment fogColor={theme.colors.accent} fogNear={6} fogFar={28}>
        <AnimatedModel
          glbUrl={config.glbUrl}
          animationClips={config.animationClips}
          useProceduralFallback={config.useProceduralFallback}
          variant="jamila"
          accent={theme.colors.accentHover}
          scrollProgress={scrollProgress}
        />
      </SceneEnvironment>
    </HeroCanvas>
  );
}
