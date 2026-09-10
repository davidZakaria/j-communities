import { useGLTF, useAnimations, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { ProceduralMassing, type ProceduralVariant } from "./ProceduralMassing";
import type { ExperienceTier } from "../motion/types";

interface AnimatedModelProps {
  glbUrl: string;
  animationClips: string[];
  useProceduralFallback: boolean;
  variant: ProceduralVariant;
  accent: string;
  scrollProgress: number;
  tier?: ExperienceTier;
}

interface ScrollAnimationConfig {
  rotationRange: number;
  elevationAmplitude: number;
  scaleRange: [number, number];
  tiltFactor: number;
}

function getScrollAnimationConfig(variant: string): ScrollAnimationConfig {
  switch (variant) {
    case "jura":
      return {
        rotationRange: 0.6,
        elevationAmplitude: 0.12,
        scaleRange: [1.15, 1.25],
        tiltFactor: 0.08,
      };
    case "jamila":
      return {
        rotationRange: 0.5,
        elevationAmplitude: 0.18,
        scaleRange: [1.1, 1.22],
        tiltFactor: 0.1,
      };
    default:
      return {
        rotationRange: 0.45,
        elevationAmplitude: 0.1,
        scaleRange: [1.18, 1.28],
        tiltFactor: 0.06,
      };
  }
}

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function GltfModel({
  glbUrl,
  animationClips,
  scrollProgress,
  variant,
  tier = "full",
}: {
  glbUrl: string;
  animationClips: string[];
  scrollProgress: number;
  variant: string;
  tier?: ExperienceTier;
}) {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF(glbUrl);
  const { actions, mixer } = useAnimations(gltf.animations, group);
  const config = useMemo(() => getScrollAnimationConfig(variant), [variant]);

  const targetState = useRef({
    rotationY: 0,
    positionY: 0,
    scale: 1,
    rotationX: 0,
  });

  useEffect(() => {
    const clip = animationClips.find((name) => actions[name]) ?? Object.keys(actions)[0];
    const action = clip ? actions[clip] : null;
    if (action) {
      action.reset().fadeIn(0.4).play();
      action.setLoop(THREE.LoopRepeat, Infinity);
    }
    return () => {
      action?.fadeOut(0.3);
    };
  }, [actions, animationClips]);

  useFrame((_, delta) => {
    if (!group.current) return;

    const easedProgress = easeInOutSine(scrollProgress);
    const sinProgress = Math.sin(scrollProgress * Math.PI);

    targetState.current.rotationY = easedProgress * config.rotationRange;
    targetState.current.positionY = sinProgress * config.elevationAmplitude;
    targetState.current.scale = THREE.MathUtils.lerp(
      config.scaleRange[0],
      config.scaleRange[1],
      easedProgress,
    );
    targetState.current.rotationX = (scrollProgress - 0.5) * config.tiltFactor;

    const lerpFactor = tier === "full" ? 1 - Math.pow(0.001, delta) : 0.15;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetState.current.rotationY,
      lerpFactor,
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      targetState.current.positionY,
      lerpFactor,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetState.current.rotationX,
      lerpFactor * 0.5,
    );

    const currentScale = group.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetState.current.scale, lerpFactor);
    group.current.scale.setScalar(newScale);

    if (mixer && tier === "full") {
      const timeScale = 0.6 + scrollProgress * 0.8;
      mixer.timeScale = THREE.MathUtils.lerp(mixer.timeScale, timeScale, lerpFactor);
    }
  });

  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

function getVariantScaleAndPosition(variant: string): { scale: number; position: [number, number, number] } {
  if (variant === "home") {
    return { scale: 1.2, position: [-1.0, -0.3, 0] };
  }
  return { scale: 1, position: [0, 0, 0] };
}

export function AnimatedModel({
  glbUrl,
  animationClips,
  useProceduralFallback,
  variant,
  accent,
  scrollProgress,
  tier = "full",
}: AnimatedModelProps) {
  const enableFloat = tier === "full";
  const { scale: variantScale, position: variantPosition } = getVariantScaleAndPosition(variant);

  if (useProceduralFallback) {
    const proceduralContent = (
      <group scale={variantScale} position={variantPosition}>
        <ProceduralMassing
          variant={variant}
          accent={accent}
          scrollProgress={scrollProgress}
          tier={tier}
        />
      </group>
    );

    if (enableFloat) {
      return (
        <Float
          speed={1.4}
          rotationIntensity={0.15}
          floatIntensity={0.18}
          floatingRange={[-0.04, 0.04]}
        >
          {proceduralContent}
        </Float>
      );
    }
    return proceduralContent;
  }

  if (enableFloat) {
    return (
      <Float
        speed={1.2}
        rotationIntensity={0.1}
        floatIntensity={0.15}
        floatingRange={[-0.03, 0.03]}
      >
        <GltfModel
          glbUrl={glbUrl}
          animationClips={animationClips}
          scrollProgress={scrollProgress}
          variant={variant}
          tier={tier}
        />
      </Float>
    );
  }

  return (
    <GltfModel
      glbUrl={glbUrl}
      animationClips={animationClips}
      scrollProgress={scrollProgress}
      variant={variant}
      tier={tier}
    />
  );
}
