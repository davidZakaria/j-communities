import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ProceduralMassing, type ProceduralVariant } from "./ProceduralMassing";

interface AnimatedModelProps {
  glbUrl: string;
  animationClips: string[];
  useProceduralFallback: boolean;
  variant: ProceduralVariant;
  accent: string;
  scrollProgress: number;
}

function GltfModel({
  glbUrl,
  animationClips,
  scrollProgress,
}: {
  glbUrl: string;
  animationClips: string[];
  scrollProgress: number;
}) {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF(glbUrl);
  const { actions } = useAnimations(gltf.animations, group);

  useEffect(() => {
    const clip = animationClips.find((name) => actions[name]) ?? Object.keys(actions)[0];
    const action = clip ? actions[clip] : null;
    if (action) {
      action.reset().fadeIn(0.4).play();
    }
    return () => {
      action?.fadeOut(0.3);
    };
  }, [actions, animationClips]);

  useEffect(() => {
    if (group.current) {
      group.current.rotation.y = scrollProgress * 0.4;
    }
  }, [scrollProgress]);

  return (
    <group ref={group}>
      <primitive object={gltf.scene.clone()} scale={1.2} />
    </group>
  );
}

export function AnimatedModel({
  glbUrl,
  animationClips,
  useProceduralFallback,
  variant,
  accent,
  scrollProgress,
}: AnimatedModelProps) {
  if (useProceduralFallback) {
    return <ProceduralMassing variant={variant} accent={accent} scrollProgress={scrollProgress} />;
  }

  return (
    <GltfModel glbUrl={glbUrl} animationClips={animationClips} scrollProgress={scrollProgress} />
  );
}
