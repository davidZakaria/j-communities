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

interface ResidenceConfig {
  bodyPos: [number, number, number];
  bodySize: [number, number, number];
  roofPos: [number, number, number];
  roofSize: [number, number, number];
  hasWindow?: boolean;
  windowPos?: [number, number, number];
  windowSize?: [number, number, number];
  baseOffset: number;
  scrollMultiplier: number;
}

interface ConnectionConfig {
  pos: [number, number, number];
  size: [number, number, number];
  type: "wall" | "path" | "planter";
}

function variantColors(variant: ProceduralVariant) {
  switch (variant) {
    case "jura":
      return { base: "#0A2E40", accent: "#E89130", secondary: "#0A5C5C", glow: "#E89130" };
    case "jamila":
      return { base: "#1A4284", accent: "#20B6B5", secondary: "#0889A7", glow: "#DDFF00" };
    default:
      return {
        base: "#2a2a2a",
        accent: "#666666",
        secondary: "#1f1f1f",
        glow: "#444444",
        concrete: "#3d3d3d",
        glass: "#4a4a4a",
        roof: "#1a1a1a",
        ground: "#252525",
        path: "#333333",
        planter: "#2d2d2d",
      };
  }
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function CommunityClusterHome({
  scrollProgress,
  tier,
  accent: _accent,
}: {
  scrollProgress: number;
  tier: ExperienceTier;
  accent: string;
}) {
  const group = useRef<THREE.Group>(null);
  const residenceRefs = useRef<(THREE.Group | null)[]>([]);
  const isFullTier = tier === "full";

  const colors = variantColors("home");

  const residences = useMemo((): ResidenceConfig[] => [
    {
      bodyPos: [0, 0.55, 0.3],
      bodySize: [1.1, 1.1, 0.9],
      roofPos: [0, 1.18, 0.3],
      roofSize: [1.2, 0.08, 1.0],
      hasWindow: true,
      windowPos: [0.56, 0.55, 0.3],
      windowSize: [0.02, 0.4, 0.35],
      baseOffset: 0,
      scrollMultiplier: 1.0,
    },
    {
      bodyPos: [-1.5, 0.42, -0.2],
      bodySize: [0.85, 0.84, 0.75],
      roofPos: [-1.5, 0.9, -0.2],
      roofSize: [0.95, 0.06, 0.85],
      hasWindow: true,
      windowPos: [-1.07, 0.42, -0.2],
      windowSize: [0.02, 0.32, 0.28],
      baseOffset: 0.08,
      scrollMultiplier: 1.2,
    },
    {
      bodyPos: [1.6, 0.48, -0.15],
      bodySize: [0.9, 0.96, 0.8],
      roofPos: [1.6, 1.02, -0.15],
      roofSize: [1.0, 0.06, 0.9],
      hasWindow: true,
      windowPos: [1.15, 0.48, -0.15],
      windowSize: [0.02, 0.35, 0.3],
      baseOffset: 0.05,
      scrollMultiplier: 1.15,
    },
    {
      bodyPos: [-0.7, 0.35, -1.1],
      bodySize: [0.7, 0.7, 0.65],
      roofPos: [-0.7, 0.76, -1.1],
      roofSize: [0.8, 0.05, 0.75],
      baseOffset: 0.1,
      scrollMultiplier: 1.3,
    },
    {
      bodyPos: [0.85, 0.38, -0.95],
      bodySize: [0.75, 0.76, 0.68],
      roofPos: [0.85, 0.82, -0.95],
      roofSize: [0.85, 0.05, 0.78],
      hasWindow: true,
      windowPos: [0.47, 0.38, -0.95],
      windowSize: [0.02, 0.28, 0.25],
      baseOffset: 0.07,
      scrollMultiplier: 1.25,
    },
  ], []);

  const connections = useMemo((): ConnectionConfig[] => [
    { pos: [-0.75, 0.12, 0.05], size: [0.6, 0.24, 0.08], type: "wall" },
    { pos: [0.8, 0.1, 0.08], size: [0.5, 0.2, 0.06], type: "wall" },
    { pos: [-1.1, 0.1, -0.65], size: [0.08, 0.2, 0.7], type: "wall" },
    { pos: [1.2, 0.1, -0.55], size: [0.08, 0.2, 0.6], type: "wall" },
    { pos: [0.1, 0.02, -0.35], size: [0.8, 0.04, 0.5], type: "path" },
    { pos: [-0.4, 0.02, 0.7], size: [0.5, 0.04, 0.3], type: "path" },
    { pos: [0.5, 0.02, 0.65], size: [0.4, 0.04, 0.25], type: "path" },
    { pos: [0, 0.15, -0.5], size: [0.35, 0.3, 0.35], type: "planter" },
    { pos: [-0.5, 0.12, 0.55], size: [0.25, 0.24, 0.25], type: "planter" },
  ], []);

  useFrame((state, delta) => {
    if (!group.current) return;

    const time = state.clock.elapsedTime;
    const easedProgress = easeOutQuart(scrollProgress);
    const sinProgress = Math.sin(scrollProgress * Math.PI);
    const breathe = Math.sin(time * 0.6) * 0.015;

    const targetRotation = easedProgress * 0.5 + time * 0.02;
    const targetY = sinProgress * 0.12 + breathe;
    const targetTilt = (scrollProgress - 0.5) * 0.04;

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
      residenceRefs.current.forEach((residenceGroup, i) => {
        if (!residenceGroup) return;
        const config = residences[i];
        if (!config) return;

        const individualOffset = config.baseOffset * Math.sin(time * 0.8 + i * 0.7);
        const scrollElevation = sinProgress * config.scrollMultiplier * 0.06;

        residenceGroup.position.y = THREE.MathUtils.lerp(
          residenceGroup.position.y,
          individualOffset + scrollElevation,
          lerpFactor,
        );

        const scaleBreath = 1 + Math.sin(time * 0.9 + i * 0.4) * 0.008;
        residenceGroup.scale.setScalar(
          THREE.MathUtils.lerp(residenceGroup.scale.x, scaleBreath, lerpFactor)
        );
      });
    }
  });

  const groundOpacity = isFullTier ? 0.75 + scrollProgress * 0.15 : 0.65;
  const windowEmissive = isFullTier ? 0.15 + scrollProgress * 0.2 : 0.1;

  return (
    <group ref={group}>
      {/* Main ground plinth - shared community base */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -0.2]} receiveShadow>
        <planeGeometry args={[5.5, 4]} />
        <meshStandardMaterial
          color={colors.ground}
          roughness={0.88}
          metalness={0.02}
          transparent
          opacity={groundOpacity}
        />
      </mesh>

      {/* Elevated courtyard area */}
      <mesh position={[0, 0.03, -0.3]} receiveShadow>
        <boxGeometry args={[3.2, 0.06, 2.4]} />
        <meshStandardMaterial
          color={colors.path}
          roughness={0.85}
          metalness={0.03}
        />
      </mesh>

      {/* Residences */}
      {residences.map((r, i) => (
        <group
          key={`residence-${i}`}
          ref={(el) => {
            residenceRefs.current[i] = el;
          }}
        >
          {/* House body - warm concrete */}
          <mesh position={r.bodyPos} castShadow receiveShadow>
            <boxGeometry args={r.bodySize} />
            <meshStandardMaterial
              color={colors.concrete}
              roughness={isFullTier ? 0.72 : 0.8}
              metalness={isFullTier ? 0.05 : 0.02}
              envMapIntensity={isFullTier ? 0.5 : 0.2}
            />
          </mesh>

          {/* Flat roof - darker */}
          <mesh position={r.roofPos} castShadow receiveShadow>
            <boxGeometry args={r.roofSize} />
            <meshStandardMaterial
              color={colors.roof}
              roughness={0.65}
              metalness={isFullTier ? 0.08 : 0.04}
              envMapIntensity={isFullTier ? 0.4 : 0.15}
            />
          </mesh>

          {/* Window - soft glass with subtle glow */}
          {r.hasWindow && r.windowPos && r.windowSize && (
            <mesh position={r.windowPos}>
              <boxGeometry args={r.windowSize} />
              <meshStandardMaterial
                color={colors.glass}
                roughness={0.3}
                metalness={0.15}
                emissive="#555555"
                emissiveIntensity={windowEmissive}
                transparent
                opacity={0.85}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Connections - walls, paths, planters */}
      {connections.map((c, i) => (
        <mesh
          key={`connection-${i}`}
          position={c.pos}
          castShadow={c.type === "wall" || c.type === "planter"}
          receiveShadow
        >
          <boxGeometry args={c.size} />
          <meshStandardMaterial
            color={
              c.type === "wall"
                ? colors.concrete
                : c.type === "planter"
                ? colors.planter
                : colors.path
            }
            roughness={c.type === "path" ? 0.9 : 0.75}
            metalness={0.02}
            envMapIntensity={isFullTier ? 0.3 : 0.1}
          />
        </mesh>
      ))}

      {/* Ambient lighting for community feel */}
      {isFullTier && (
        <>
          <pointLight
            position={[0, 2.5, 0.5]}
            intensity={0.8 + scrollProgress * 0.3}
            color="#e8e4df"
            distance={8}
            decay={2}
          />
          <pointLight
            position={[-1.5, 1.5, -0.5]}
            intensity={0.4 + scrollProgress * 0.15}
            color="#d4d0cb"
            distance={5}
            decay={2}
          />
          <pointLight
            position={[1.5, 1.5, -0.5]}
            intensity={0.4 + scrollProgress * 0.15}
            color="#d4d0cb"
            distance={5}
            decay={2}
          />
        </>
      )}
    </group>
  );
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

  if (variant === "home") {
    return (
      <CommunityClusterHome
        scrollProgress={scrollProgress}
        tier={tier}
        accent={accent}
      />
    );
  }

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
    return [];
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
