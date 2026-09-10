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

interface LifestyleElementConfig {
  pos: [number, number, number];
  size: [number, number, number];
  type: "tree" | "shrub" | "pool" | "seating" | "terrace" | "greenEdge" | "steppingStone";
  rotation?: number;
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
        stone: "#4a4540",
        stoneWarm: "#524a42",
        woodTrim: "#3d3530",
        glass: "#5a5550",
        roof: "#2a2520",
        roofWarm: "#352f28",
        ground: "#3a3632",
        courtyard: "#454038",
        path: "#4d4840",
        pathLight: "#5a544c",
        planter: "#3a4038",
        foliage: "#3d4a3a",
        foliageBright: "#4a5a45",
        foliageDark: "#2d3a2a",
        water: "#3a4a55",
        waterGlow: "#4a5a68",
        seating: "#4a4540",
        terrace: "#484340",
        warmGlow: "#6a5a4a",
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
      bodyPos: [0, 0.38, 0.25],
      bodySize: [0.95, 0.76, 0.8],
      roofPos: [0, 0.82, 0.25],
      roofSize: [1.05, 0.08, 0.9],
      hasWindow: true,
      windowPos: [0.48, 0.4, 0.25],
      windowSize: [0.02, 0.32, 0.3],
      baseOffset: 0,
      scrollMultiplier: 1.0,
    },
    {
      bodyPos: [-1.15, 0.32, -0.1],
      bodySize: [0.75, 0.64, 0.65],
      roofPos: [-1.15, 0.68, -0.1],
      roofSize: [0.85, 0.06, 0.75],
      hasWindow: true,
      windowPos: [-0.77, 0.34, -0.1],
      windowSize: [0.02, 0.26, 0.24],
      baseOffset: 0.06,
      scrollMultiplier: 1.15,
    },
    {
      bodyPos: [1.2, 0.35, -0.05],
      bodySize: [0.8, 0.7, 0.7],
      roofPos: [1.2, 0.74, -0.05],
      roofSize: [0.9, 0.06, 0.8],
      hasWindow: true,
      windowPos: [0.8, 0.36, -0.05],
      windowSize: [0.02, 0.28, 0.26],
      baseOffset: 0.04,
      scrollMultiplier: 1.1,
    },
    {
      bodyPos: [-0.55, 0.28, -0.85],
      bodySize: [0.6, 0.56, 0.55],
      roofPos: [-0.55, 0.6, -0.85],
      roofSize: [0.7, 0.05, 0.65],
      hasWindow: true,
      windowPos: [-0.25, 0.3, -0.85],
      windowSize: [0.02, 0.22, 0.2],
      baseOffset: 0.08,
      scrollMultiplier: 1.2,
    },
    {
      bodyPos: [0.65, 0.3, -0.8],
      bodySize: [0.65, 0.6, 0.58],
      roofPos: [0.65, 0.64, -0.8],
      roofSize: [0.75, 0.05, 0.68],
      hasWindow: true,
      windowPos: [0.32, 0.32, -0.8],
      windowSize: [0.02, 0.24, 0.22],
      baseOffset: 0.06,
      scrollMultiplier: 1.18,
    },
  ], []);

  const connections = useMemo((): ConnectionConfig[] => [
    { pos: [-0.55, 0.08, 0.08], size: [0.35, 0.16, 0.05], type: "wall" },
    { pos: [0.58, 0.07, 0.1], size: [0.32, 0.14, 0.04], type: "wall" },
    { pos: [-0.85, 0.06, -0.48], size: [0.04, 0.12, 0.5], type: "wall" },
    { pos: [0.92, 0.06, -0.42], size: [0.04, 0.12, 0.45], type: "wall" },
  ], []);

  const lifestyleElements = useMemo((): LifestyleElementConfig[] => [
    { pos: [-1.7, 0.28, 0.35], size: [0.12, 0.56, 0.12], type: "tree" },
    { pos: [-1.55, 0.24, -0.65], size: [0.1, 0.48, 0.1], type: "tree" },
    { pos: [1.75, 0.26, 0.2], size: [0.11, 0.52, 0.11], type: "tree" },
    { pos: [1.6, 0.22, -0.55], size: [0.09, 0.44, 0.09], type: "tree" },
    { pos: [-0.05, 0.2, -1.25], size: [0.1, 0.4, 0.1], type: "tree" },
    { pos: [0.55, 0.18, -1.2], size: [0.08, 0.36, 0.08], type: "tree" },
    { pos: [-1.4, 0.1, 0.55], size: [0.18, 0.2, 0.16], type: "shrub" },
    { pos: [1.5, 0.09, 0.45], size: [0.16, 0.18, 0.14], type: "shrub" },
    { pos: [-0.95, 0.08, -0.95], size: [0.2, 0.16, 0.18], type: "shrub" },
    { pos: [1.0, 0.08, -1.0], size: [0.18, 0.16, 0.16], type: "shrub" },
    { pos: [-0.3, 0.1, 0.7], size: [0.22, 0.2, 0.18], type: "shrub" },
    { pos: [0.35, 0.1, 0.65], size: [0.2, 0.2, 0.16], type: "shrub" },
    { pos: [0, 0.12, -0.35], size: [0.28, 0.24, 0.24], type: "shrub" },
    { pos: [-0.35, 0.1, -0.45], size: [0.2, 0.2, 0.18], type: "shrub" },
    { pos: [0.3, 0.1, -0.4], size: [0.18, 0.2, 0.16], type: "shrub" },
    { pos: [0, 0.025, -0.35], size: [0.55, 0.05, 0.4], type: "pool" },
    { pos: [-0.45, 0.05, 0.45], size: [0.3, 0.1, 0.22], type: "seating" },
    { pos: [0.5, 0.05, 0.42], size: [0.28, 0.1, 0.2], type: "seating" },
    { pos: [-0.15, 0.04, 0.55], size: [0.22, 0.08, 0.18], type: "seating" },
    { pos: [0, 0.86, 0.6], size: [0.4, 0.04, 0.18], type: "terrace" },
    { pos: [1.2, 0.78, 0.28], size: [0.32, 0.04, 0.22], type: "terrace" },
    { pos: [-1.15, 0.72, 0.22], size: [0.28, 0.04, 0.2], type: "terrace" },
    { pos: [0, 0.015, 1.15], size: [3.8, 0.03, 0.12], type: "greenEdge" },
    { pos: [-1.85, 0.015, -0.15], size: [0.1, 0.03, 2.5], type: "greenEdge" },
    { pos: [1.9, 0.015, -0.15], size: [0.1, 0.03, 2.5], type: "greenEdge" },
    { pos: [0, 0.015, -1.35], size: [3.5, 0.03, 0.1], type: "greenEdge" },
    { pos: [0, 0.025, 0.15], size: [0.22, 0.05, 0.9], type: "path" },
    { pos: [-0.5, 0.025, -0.15], size: [0.7, 0.05, 0.18], type: "path" },
    { pos: [0.45, 0.025, -0.1], size: [0.65, 0.05, 0.18], type: "path" },
    { pos: [-0.25, 0.025, 0.55], size: [0.5, 0.05, 0.15], type: "path" },
    { pos: [0.3, 0.025, 0.5], size: [0.45, 0.05, 0.15], type: "path" },
    { pos: [-0.65, 0.03, 0.12], size: [0.07, 0.06, 0.07], type: "steppingStone" },
    { pos: [-0.5, 0.03, -0.05], size: [0.06, 0.06, 0.06], type: "steppingStone" },
    { pos: [0.6, 0.03, 0.15], size: [0.07, 0.06, 0.07], type: "steppingStone" },
    { pos: [0.48, 0.03, -0.02], size: [0.06, 0.06, 0.06], type: "steppingStone" },
    { pos: [-0.12, 0.03, -0.65], size: [0.06, 0.06, 0.06], type: "steppingStone" },
    { pos: [0.15, 0.03, -0.6], size: [0.06, 0.06, 0.06], type: "steppingStone" },
  ], []);

  useFrame((state, delta) => {
    if (!group.current) return;

    const time = state.clock.elapsedTime;
    const easedProgress = easeOutQuart(scrollProgress);
    const sinProgress = Math.sin(scrollProgress * Math.PI);
    const breathe = Math.sin(time * 0.5) * 0.012;

    const targetRotation = easedProgress * 0.55 + time * 0.018;
    const targetY = sinProgress * 0.1 + breathe;
    const targetTilt = (scrollProgress - 0.5) * 0.035;

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

        const individualOffset = config.baseOffset * Math.sin(time * 0.7 + i * 0.6);
        const scrollElevation = sinProgress * config.scrollMultiplier * 0.05;

        residenceGroup.position.y = THREE.MathUtils.lerp(
          residenceGroup.position.y,
          individualOffset + scrollElevation,
          lerpFactor,
        );

        const scaleBreath = 1 + Math.sin(time * 0.8 + i * 0.35) * 0.006;
        residenceGroup.scale.setScalar(
          THREE.MathUtils.lerp(residenceGroup.scale.x, scaleBreath, lerpFactor)
        );
      });
    }
  });

  const groundOpacity = isFullTier ? 0.82 + scrollProgress * 0.1 : 0.72;
  const windowEmissive = isFullTier ? 0.35 + scrollProgress * 0.45 : 0.2;
  const waterEmissive = isFullTier ? 0.12 + scrollProgress * 0.15 : 0.08;

  return (
    <group ref={group}>
      {/* Main ground plinth - warm earth tone */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -0.1]} receiveShadow>
        <planeGeometry args={[4.2, 3.0]} />
        <meshStandardMaterial
          color={colors.ground}
          roughness={0.78}
          metalness={0.02}
          transparent
          opacity={groundOpacity}
        />
      </mesh>

      {/* Elevated courtyard - tighter, warmer */}
      <mesh position={[0, 0.02, -0.15]} receiveShadow>
        <boxGeometry args={[2.6, 0.04, 2.0]} />
        <meshStandardMaterial
          color={colors.courtyard}
          roughness={0.75}
          metalness={0.02}
        />
      </mesh>

      {/* Green edges around plinth */}
      {lifestyleElements
        .filter((e) => e.type === "greenEdge")
        .map((e, i) => (
          <mesh key={`green-edge-${i}`} position={e.pos} receiveShadow>
            <boxGeometry args={e.size} />
            <meshStandardMaterial
              color={colors.foliageDark}
              roughness={0.85}
              metalness={0.01}
            />
          </mesh>
        ))}

      {/* Main paths - warm stone */}
      {lifestyleElements
        .filter((e) => e.type === "path")
        .map((e, i) => (
          <mesh key={`path-${i}`} position={e.pos} receiveShadow>
            <boxGeometry args={e.size} />
            <meshStandardMaterial
              color={colors.pathLight}
              roughness={0.8}
              metalness={0.01}
            />
          </mesh>
        ))}

      {/* Stepping stones */}
      {lifestyleElements
        .filter((e) => e.type === "steppingStone")
        .map((e, i) => (
          <mesh key={`stone-${i}`} position={e.pos} receiveShadow>
            <boxGeometry args={e.size} />
            <meshStandardMaterial
              color={colors.path}
              roughness={0.7}
              metalness={0.02}
            />
          </mesh>
        ))}

      {/* Pool / water feature */}
      {lifestyleElements
        .filter((e) => e.type === "pool")
        .map((e, i) => (
          <mesh key={`pool-${i}`} position={e.pos} receiveShadow>
            <boxGeometry args={e.size} />
            <meshStandardMaterial
              color={colors.water}
              roughness={0.2}
              metalness={0.1}
              emissive={colors.waterGlow}
              emissiveIntensity={waterEmissive}
            />
          </mesh>
        ))}

      {/* Outdoor seating */}
      {lifestyleElements
        .filter((e) => e.type === "seating")
        .map((e, i) => (
          <mesh key={`seat-${i}`} position={e.pos} castShadow receiveShadow>
            <boxGeometry args={e.size} />
            <meshStandardMaterial
              color={colors.seating}
              roughness={0.65}
              metalness={0.03}
            />
          </mesh>
        ))}

      {/* Residences - warm stone materials */}
      {residences.map((r, i) => (
        <group
          key={`residence-${i}`}
          ref={(el) => {
            residenceRefs.current[i] = el;
          }}
        >
          {/* House body - warm stone */}
          <mesh position={r.bodyPos} castShadow receiveShadow>
            <boxGeometry args={r.bodySize} />
            <meshStandardMaterial
              color={i % 2 === 0 ? colors.stone : colors.stoneWarm}
              roughness={isFullTier ? 0.7 : 0.78}
              metalness={isFullTier ? 0.03 : 0.01}
              envMapIntensity={isFullTier ? 0.4 : 0.15}
            />
          </mesh>

          {/* Wood trim accent */}
          <mesh
            position={[r.bodyPos[0], r.bodyPos[1] - r.bodySize[1] / 2 + 0.03, r.bodyPos[2] + r.bodySize[2] / 2 + 0.01]}
            castShadow
          >
            <boxGeometry args={[r.bodySize[0] * 0.9, 0.06, 0.02]} />
            <meshStandardMaterial
              color={colors.woodTrim}
              roughness={0.6}
              metalness={0.02}
            />
          </mesh>

          {/* Warm roof */}
          <mesh position={r.roofPos} castShadow receiveShadow>
            <boxGeometry args={r.roofSize} />
            <meshStandardMaterial
              color={i % 2 === 0 ? colors.roof : colors.roofWarm}
              roughness={0.6}
              metalness={isFullTier ? 0.05 : 0.02}
              envMapIntensity={isFullTier ? 0.3 : 0.1}
            />
          </mesh>

          {/* Terrace on select homes */}
          {lifestyleElements
            .filter((e) => e.type === "terrace")
            .filter((_, ti) => ti === i && i < 3)
            .map((e, ti) => (
              <mesh key={`terrace-${i}-${ti}`} position={e.pos} castShadow>
                <boxGeometry args={e.size} />
                <meshStandardMaterial
                  color={colors.terrace}
                  roughness={0.7}
                  metalness={0.02}
                />
              </mesh>
            ))}

          {/* Window - warm glow */}
          {r.hasWindow && r.windowPos && r.windowSize && (
            <mesh position={r.windowPos}>
              <boxGeometry args={r.windowSize} />
              <meshStandardMaterial
                color={colors.glass}
                roughness={0.25}
                metalness={0.08}
                emissive={colors.warmGlow}
                emissiveIntensity={windowEmissive}
                transparent
                opacity={0.9}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Low walls */}
      {connections.map((c, i) => (
        <mesh key={`wall-${i}`} position={c.pos} castShadow receiveShadow>
          <boxGeometry args={c.size} />
          <meshStandardMaterial
            color={colors.stone}
            roughness={0.72}
            metalness={0.02}
          />
        </mesh>
      ))}

      {/* Trees - trunks + canopy */}
      {lifestyleElements
        .filter((e) => e.type === "tree")
        .map((e, i) => (
          <group key={`tree-${i}`}>
            {/* Trunk */}
            <mesh position={[e.pos[0], e.pos[1] * 0.4, e.pos[2]]} castShadow>
              <cylinderGeometry args={[e.size[0] * 0.3, e.size[0] * 0.4, e.size[1] * 0.5, 6]} />
              <meshStandardMaterial
                color={colors.woodTrim}
                roughness={0.8}
                metalness={0.01}
              />
            </mesh>
            {/* Canopy */}
            <mesh position={[e.pos[0], e.pos[1] + e.size[1] * 0.35, e.pos[2]]} castShadow>
              <sphereGeometry args={[e.size[0] * 1.8, 8, 6]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? colors.foliage : colors.foliageBright}
                roughness={0.85}
                metalness={0.01}
              />
            </mesh>
          </group>
        ))}

      {/* Shrubs / planters */}
      {lifestyleElements
        .filter((e) => e.type === "shrub")
        .map((e, i) => (
          <mesh key={`shrub-${i}`} position={e.pos} castShadow receiveShadow>
            <sphereGeometry args={[Math.max(e.size[0], e.size[2]) * 0.6, 6, 5]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? colors.foliageBright : i % 3 === 1 ? colors.foliage : colors.foliageDark}
              roughness={0.88}
              metalness={0.01}
            />
          </mesh>
        ))}

      {/* Warm ambient lighting */}
      {isFullTier && (
        <>
          <pointLight
            position={[0, 2.0, 0.2]}
            intensity={1.0 + scrollProgress * 0.4}
            color="#f5e8d8"
            distance={6}
            decay={2}
          />
          <pointLight
            position={[-1.2, 1.2, -0.3]}
            intensity={0.5 + scrollProgress * 0.2}
            color="#e8dcd0"
            distance={4}
            decay={2}
          />
          <pointLight
            position={[1.2, 1.2, -0.3]}
            intensity={0.5 + scrollProgress * 0.2}
            color="#e8dcd0"
            distance={4}
            decay={2}
          />
          {/* Warm courtyard accent */}
          <pointLight
            position={[0, 0.5, -0.3]}
            intensity={0.3 + scrollProgress * 0.15}
            color="#d4c8b8"
            distance={3}
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
