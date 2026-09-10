import { EffectComposer, Bloom, Vignette, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import type { ExperienceTier } from "../motion/types";

interface CinematicEffectsProps {
  tier: ExperienceTier;
  reducedMotion: boolean;
  variant: "home" | "jura" | "jamila";
  scrollProgress: number;
}

interface EffectProfile {
  bloomIntensity: number;
  bloomLuminanceThreshold: number;
  bloomLuminanceSmoothing: number;
  vignetteOffset: number;
  vignetteDarkness: number;
  enableDOF: boolean;
  dofFocusDistance: number;
  dofFocalLength: number;
  dofBokehScale: number;
}

function getEffectProfile(variant: string, scrollProgress: number): EffectProfile {
  const scrollFactor = Math.sin(scrollProgress * Math.PI);

  switch (variant) {
    case "jura":
      return {
        bloomIntensity: 0.35 + scrollFactor * 0.1,
        bloomLuminanceThreshold: 0.75,
        bloomLuminanceSmoothing: 0.4,
        vignetteOffset: 0.35,
        vignetteDarkness: 0.55 + scrollProgress * 0.15,
        enableDOF: true,
        dofFocusDistance: 0.02 + scrollProgress * 0.01,
        dofFocalLength: 0.05,
        dofBokehScale: 1.5,
      };

    case "jamila":
      return {
        bloomIntensity: 0.45 + scrollFactor * 0.15,
        bloomLuminanceThreshold: 0.65,
        bloomLuminanceSmoothing: 0.5,
        vignetteOffset: 0.3,
        vignetteDarkness: 0.45 + scrollProgress * 0.1,
        enableDOF: true,
        dofFocusDistance: 0.015 + scrollProgress * 0.008,
        dofFocalLength: 0.04,
        dofBokehScale: 2,
      };

    default:
      return {
        bloomIntensity: 0.22 + scrollFactor * 0.08,
        bloomLuminanceThreshold: 0.78,
        bloomLuminanceSmoothing: 0.32,
        vignetteOffset: 0.25,
        vignetteDarkness: 0.45 + scrollProgress * 0.12,
        enableDOF: false,
        dofFocusDistance: 0.012,
        dofFocalLength: 0.038,
        dofBokehScale: 1.2,
      };
  }
}

export function CinematicEffects({
  tier,
  reducedMotion,
  variant,
  scrollProgress,
}: CinematicEffectsProps) {
  if (tier !== "full" || reducedMotion) {
    return null;
  }

  const profile = getEffectProfile(variant, scrollProgress);

  if (profile.enableDOF) {
    return (
      <EffectComposer multisampling={4} enableNormalPass={false}>
        <Bloom
          intensity={profile.bloomIntensity}
          luminanceThreshold={profile.bloomLuminanceThreshold}
          luminanceSmoothing={profile.bloomLuminanceSmoothing}
          kernelSize={KernelSize.MEDIUM}
          blendFunction={BlendFunction.ADD}
        />
        <Vignette
          offset={profile.vignetteOffset}
          darkness={profile.vignetteDarkness}
          blendFunction={BlendFunction.NORMAL}
        />
        <DepthOfField
          focusDistance={profile.dofFocusDistance}
          focalLength={profile.dofFocalLength}
          bokehScale={profile.dofBokehScale}
          height={480}
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom
        intensity={profile.bloomIntensity}
        luminanceThreshold={profile.bloomLuminanceThreshold}
        luminanceSmoothing={profile.bloomLuminanceSmoothing}
        kernelSize={KernelSize.MEDIUM}
        blendFunction={BlendFunction.ADD}
      />
      <Vignette
        offset={profile.vignetteOffset}
        darkness={profile.vignetteDarkness}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
