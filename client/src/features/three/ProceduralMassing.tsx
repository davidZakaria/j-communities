import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ExperienceTier } from "../motion/types";

export type ProceduralVariant = "home" | "jura" | "jamila";

interface ProceduralMassingProps {
  variant: ProceduralVariant;
  accent: string;
  scrollProgress: number;
  tier?: ExperienceTier;
}

interface BlockConfig {
  pos: [number, number, number];
  size: [number, number, number];
  baseOffset?: number;
  scrollMultiplier?: number;
}

function variantColors(variant: ProceduralVariant) {
  switch (variant) {
    case "jura":
      return { base: "#0A2E40", accent: "#E89130", secondary: "#0A5C5C", glow: "#E89130" };
    case "jamila":
      return { base: "#1A4284", accent: "#20B6B5", secondary: "#0889A7", glow: "#DDFF00" };
    default:
      return { base: "#1a1a1a", accent: "#888888", secondary: "#333333", glow: "#666666" };
  }
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function ProceduralMassing({
  variant,
  accent,
  scrollProgress,
  tier = "full",
}: ProceduralMassingProps) {
  const group = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const colors = variantColors(variant);
  const isFullTier = tier === "full";

  const blocks = useMemo((): BlockConfig[] => {
    if (variant === "jamila") {
      return [
        { pos: [0, 1.2, 0], size: [0.9, 2.4, 0.9], baseOffset: 0, scrollMultiplier: 1.2 },
        { pos: [-1.1, 0.8, 0.2], size: [0.7, 1.6, 0.75], baseOffset: 0.15, scrollMultiplier: 0.9 },
        { pos: [1.05, 0.9, -0.15], size: [0.75, 1.8, 0.8], baseOffset: 0.08, scrollMultiplier: 1.1 },
      ];
    }
    if (variant === "jura") {
      return [
        { pos: [0, 0.35, 0], size: [3.2, 0.25, 2.2], baseOffset: 0, scrollMultiplier: 0.3 },
        { pos: [-0.8, 0.7, 0.3], size: [0.5, 0.6, 0.45], baseOffset: 0.1, scrollMultiplier: 1.4 },
        { pos: [0.6, 0.65, -0.2], size: [0.55, 0.55, 0.5], baseOffset: 0.2, scrollMultiplier: 1.2 },
        { pos: [0.1, 0.75, 0.5], size: [0.4, 0.45, 0.35], baseOffset: 0.05, scrollMultiplier: 1.6 },
      ];
    }
    return [
      { pos: [0, 0, 0], size: [4, 0.08, 2.5], baseOffset: 0, scrollMultiplier: 0.2 },
      { pos: [0, 0.5, -1], size: [6, 0.02, 4], baseOffset: 0.1, scrollMultiplier: 0.4 },
    ];
  }, [variant]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const time = state.clock.elapsedTime;
    const easedProgress = easeOutQuart(scrollProgress);
    const sinProgress = Math.sin(scrollProgress * Math.PI);
    const breathe = Math.sin(time * 0.8) * 0.02;

    const targetRotation = easedProgress * 0.55 + time * 0.03;
    const targetY = sinProgress * 0.18 + breathe;
    const targetTilt = (scrollProgress - 0.5) * 0.06;

    const lerpFactor = isFullTier ? 1 - Math.pow(0.001, delta) : 0.1;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotation,
      lerpFactor,
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      targetY,
      lerpFactor,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetTilt,
      lerpFactor * 0.5,
    );

    if (isFullTier) {
      meshRefs.current.forEach((mesh, i) => {
        if (!mesh) return;
        const config = blocks[i];
        if (!config) return;

        const individualOffset = (config.baseOffset || 0) * Math.sin(time + i);
        const scrollElevation = sinProgress * (config.scrollMultiplier || 1) * 0.08;

        mesh.position.y = THREE.MathUtils.lerp(
          mesh.position.y,
          config.pos[1] + individualOffset + scrollElevation,
          lerpFactor,
        );

        const scaleBreath = 1 + Math.sin(time * 1.2 + i * 0.5) * 0.015;
        mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, scaleBreath, lerpFactor));
      });
    }
  });

  const emissiveIntensity = isFullTier ? 0.25 + scrollProgress * 0.15 : 0.15;
  const groundOpacity = isFullTier ? 0.6 + scrollProgress * 0.2 : 0.5;

  return (
    <group ref={group}>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          color={colors.secondary}
          roughness={0.92}
          metalness={0.02}
          transparent
          opacity={groundOpacity}
        />
      </mesh>

      {blocks.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          position={b.pos}
          castShadow
          receiveShadow
        >
          <boxGeometry args={b.size} />
          <meshStandardMaterial
            color={i === 0 ? colors.base : colors.secondary}
            emissive={i === blocks.length - 1 ? colors.glow : "#000000"}
            emissiveIntensity={i === blocks.length - 1 ? emissiveIntensity : 0}
            roughness={isFullTier ? 0.45 : 0.55}
            metalness={isFullTier ? 0.12 : 0.08}
            envMapIntensity={isFullTier ? 0.8 : 0.3}
          />
        </mesh>
      ))}

      {isFullTier && (
        <>
          <pointLight
            position={[3, 4, 2]}
            intensity={1.4 + scrollProgress * 0.4}
            color={accent}
            distance={12}
            decay={2}
          />
          <pointLight
            position={[-2, 3, -1]}
            intensity={0.5 + scrollProgress * 0.2}
            color={colors.glow}
            distance={8}
            decay={2}
          />
        </>
      )}
    </group>
  );
}
