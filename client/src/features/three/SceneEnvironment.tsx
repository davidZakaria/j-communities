import { Environment, ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { ExperienceTier } from "../motion/types";

interface SceneEnvironmentProps {
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  children: ReactNode;
  variant?: "home" | "jura" | "jamila";
  tier?: ExperienceTier;
  scrollProgress?: number;
}

interface LightingProfile {
  ambientIntensity: number;
  mainLightIntensity: number;
  mainLightPosition: [number, number, number];
  mainLightColor: string;
  fillLightIntensity: number;
  fillLightPosition: [number, number, number];
  fillLightColor: string;
  rimLightIntensity: number;
  rimLightPosition: [number, number, number];
  rimLightColor: string;
  enableContactShadows: boolean;
  envPreset: "city" | "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "studio" | "park" | "lobby";
}

function getLightingProfile(variant: string, scrollProgress: number): LightingProfile {
  const breathe = Math.sin(scrollProgress * Math.PI * 2) * 0.05;

  switch (variant) {
    case "jura":
      return {
        ambientIntensity: 0.35 + breathe,
        mainLightIntensity: 0.8,
        mainLightPosition: [5, 8, 4],
        mainLightColor: "#ffedd5",
        fillLightIntensity: 0.25,
        fillLightPosition: [-4, 3, -2],
        fillLightColor: "#0A5C5C",
        rimLightIntensity: 0.5,
        rimLightPosition: [-2, 5, -6],
        rimLightColor: "#E89130",
        enableContactShadows: true,
        envPreset: "sunset",
      };

    case "jamila":
      return {
        ambientIntensity: 0.45 + breathe,
        mainLightIntensity: 0.7,
        mainLightPosition: [4, 7, 5],
        mainLightColor: "#f0f9ff",
        fillLightIntensity: 0.35,
        fillLightPosition: [-5, 4, 2],
        fillLightColor: "#20B6B5",
        rimLightIntensity: 0.45,
        rimLightPosition: [0, 4, -5],
        rimLightColor: "#1A4284",
        enableContactShadows: true,
        envPreset: "city",
      };

    default:
      return {
        ambientIntensity: 0.4 + breathe,
        mainLightIntensity: 0.65,
        mainLightPosition: [4, 6, 3],
        mainLightColor: "#ffffff",
        fillLightIntensity: 0.2,
        fillLightPosition: [-3, 2, -1],
        fillLightColor: "#8888aa",
        rimLightIntensity: 0.3,
        rimLightPosition: [-1, 4, -4],
        rimLightColor: "#aaaacc",
        enableContactShadows: false,
        envPreset: "city",
      };
  }
}

function AnimatedFog({
  color,
  near,
  far,
  scrollProgress,
}: {
  color: string;
  near: number;
  far: number;
  scrollProgress: number;
}) {
  const fogRef = useRef<THREE.Fog>(null);

  useFrame(() => {
    if (!fogRef.current) return;
    const dynamicNear = near - scrollProgress * 2;
    const dynamicFar = far + scrollProgress * 4;
    fogRef.current.near = dynamicNear;
    fogRef.current.far = dynamicFar;
  });

  return <fog ref={fogRef} attach="fog" args={[color, near, far]} />;
}

export function SceneEnvironment({
  fogColor = "#000000",
  fogNear = 8,
  fogFar = 28,
  children,
  variant = "home",
  tier = "full",
  scrollProgress = 0,
}: SceneEnvironmentProps) {
  const profile = useMemo(
    () => getLightingProfile(variant, scrollProgress),
    [variant, scrollProgress],
  );

  const isFullTier = tier === "full";

  return (
    <>
      <AnimatedFog
        color={fogColor}
        near={fogNear}
        far={fogFar}
        scrollProgress={scrollProgress}
      />

      <ambientLight intensity={profile.ambientIntensity} />

      <directionalLight
        position={profile.mainLightPosition}
        intensity={profile.mainLightIntensity}
        color={profile.mainLightColor}
        castShadow={isFullTier}
        shadow-mapSize={isFullTier ? [1024, 1024] : [512, 512]}
        shadow-bias={-0.0001}
      />

      {isFullTier && (
        <>
          <pointLight
            position={profile.fillLightPosition}
            intensity={profile.fillLightIntensity}
            color={profile.fillLightColor}
            distance={15}
            decay={2}
          />

          <spotLight
            position={profile.rimLightPosition}
            intensity={profile.rimLightIntensity}
            color={profile.rimLightColor}
            angle={0.5}
            penumbra={0.8}
            distance={20}
            decay={2}
          />

          <Environment preset={profile.envPreset} background={false} />

          {profile.enableContactShadows && (
            <ContactShadows
              position={[0, -0.1, 0]}
              opacity={0.35}
              scale={12}
              blur={2.5}
              far={4}
              resolution={256}
              color="#000000"
            />
          )}
        </>
      )}

      {children}
    </>
  );
}
