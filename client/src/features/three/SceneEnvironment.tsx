import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { AtmosphereState } from "../../config/storyBeats";

interface SceneEnvironmentProps {
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  ambientIntensity?: number;
  directionalIntensity?: number;
  children: ReactNode;
}

interface DynamicSceneEnvironmentProps {
  atmosphere: AtmosphereState;
  children: ReactNode;
}

/** Transparent WebGL scene — hero photo stays visible behind the canvas. */
export function SceneEnvironment({
  fogColor = "#000000",
  fogNear = 8,
  fogFar = 28,
  ambientIntensity = 0.45,
  directionalIntensity = 0.55,
  children,
}: SceneEnvironmentProps) {
  return (
    <>
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[4, 6, 3]} intensity={directionalIntensity} />
      {children}
    </>
  );
}

export function DynamicSceneEnvironment({
  atmosphere,
  children,
}: DynamicSceneEnvironmentProps) {
  const { scene } = useThree();
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  const fogColorRef = useRef(new THREE.Color(atmosphere.fogColor));

  useEffect(() => {
    scene.fog = new THREE.Fog(atmosphere.fogColor, atmosphere.fogNear, atmosphere.fogFar);
  }, [scene]);

  useFrame(() => {
    if (scene.fog instanceof THREE.Fog) {
      fogColorRef.current.set(atmosphere.fogColor);
      scene.fog.color.lerp(fogColorRef.current, 0.1);
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, atmosphere.fogNear, 0.1);
      scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, atmosphere.fogFar, 0.1);
    }

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        atmosphere.ambientIntensity,
        0.1,
      );
    }

    if (directionalRef.current) {
      directionalRef.current.intensity = THREE.MathUtils.lerp(
        directionalRef.current.intensity,
        atmosphere.directionalIntensity,
        0.1,
      );
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={atmosphere.ambientIntensity} />
      <directionalLight
        ref={directionalRef}
        position={[4, 6, 3]}
        intensity={atmosphere.directionalIntensity}
      />
      {children}
    </>
  );
}
