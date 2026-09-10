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

interface RealisticTreeConfig {
  pos: [number, number, number];
  type: "cypress" | "olive" | "palm" | "broadleaf";
  scale: number;
  rotation?: number;
}

interface RealisticVillaConfig {
  pos: [number, number, number];
  width: number;
  depth: number;
  stories: number;
  hasBalcony: boolean;
  balconySide?: "front" | "side" | "both";
  roofStyle: "flat" | "parapet" | "slight-pitch";
  windowRows: number;
  windowCols: number;
  baseOffset: number;
  scrollMultiplier: number;
}

function RealisticCypressTree({ pos, scale, rotation = 0 }: { pos: [number, number, number]; scale: number; rotation?: number }) {
  const colors = variantColors("home");
  const height = 0.8 * scale;
  const baseRadius = 0.08 * scale;
  
  return (
    <group position={pos} rotation-y={rotation}>
      {/* Trunk - tapered cylinder */}
      <mesh position={[0, height * 0.15, 0]} castShadow>
        <cylinderGeometry args={[baseRadius * 0.25, baseRadius * 0.4, height * 0.35, 8]} />
        <meshStandardMaterial color="#4a3d30" roughness={0.9} metalness={0} />
      </mesh>
      {/* Foliage - stacked tapered cones for cypress silhouette */}
      <mesh position={[0, height * 0.5, 0]} castShadow>
        <coneGeometry args={[baseRadius * 1.2, height * 0.7, 8]} />
        <meshStandardMaterial color={colors.foliageDark} roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[0, height * 0.7, 0]} castShadow>
        <coneGeometry args={[baseRadius * 0.85, height * 0.45, 8]} />
        <meshStandardMaterial color={colors.foliage} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0, height * 0.85, 0]} castShadow>
        <coneGeometry args={[baseRadius * 0.5, height * 0.25, 6]} />
        <meshStandardMaterial color={colors.foliageBright} roughness={0.88} metalness={0} />
      </mesh>
    </group>
  );
}

function RealisticOliveTree({ pos, scale, rotation = 0 }: { pos: [number, number, number]; scale: number; rotation?: number }) {
  const colors = variantColors("home");
  const height = 0.5 * scale;
  
  return (
    <group position={pos} rotation-y={rotation}>
      {/* Gnarled trunk */}
      <mesh position={[0, height * 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.04 * scale, 0.06 * scale, height * 0.5, 6]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.95} metalness={0} />
      </mesh>
      {/* Irregular canopy - multiple offset ellipsoids */}
      <mesh position={[0.02 * scale, height * 0.6, 0]} castShadow scale={[1.2, 0.7, 1]}>
        <sphereGeometry args={[0.15 * scale, 10, 8]} />
        <meshStandardMaterial color="#4a5a42" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[-0.03 * scale, height * 0.55, 0.02 * scale]} castShadow scale={[1, 0.65, 0.9]}>
        <sphereGeometry args={[0.12 * scale, 10, 8]} />
        <meshStandardMaterial color={colors.foliage} roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[0.01 * scale, height * 0.68, -0.02 * scale]} castShadow scale={[0.9, 0.6, 1.1]}>
        <sphereGeometry args={[0.1 * scale, 8, 6]} />
        <meshStandardMaterial color="#556b4a" roughness={0.88} metalness={0} />
      </mesh>
    </group>
  );
}

function RealisticVilla({
  config,
  colors,
  isFullTier,
  windowEmissive,
}: {
  config: RealisticVillaConfig;
  colors: ReturnType<typeof variantColors>;
  isFullTier: boolean;
  windowEmissive: number;
}) {
  const storyHeight = 0.28;
  const totalHeight = config.stories * storyHeight;
  const wallThickness = 0.03;
  
  const windowWidth = 0.08;
  const windowHeight = 0.12;
  const windowDepth = 0.02;
  const windowSpacingX = config.width / (config.windowCols + 1);
  const windowSpacingY = storyHeight * 0.65;
  
  return (
    <group position={config.pos}>
      {/* Main building mass */}
      <mesh position={[0, totalHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[config.width, totalHeight, config.depth]} />
        <meshStandardMaterial
          color={colors.stone}
          roughness={isFullTier ? 0.75 : 0.82}
          metalness={isFullTier ? 0.02 : 0.01}
          envMapIntensity={isFullTier ? 0.35 : 0.12}
        />
      </mesh>
      
      {/* Base/foundation - slightly darker */}
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[config.width + 0.02, 0.06, config.depth + 0.02]} />
        <meshStandardMaterial color={colors.secondary} roughness={0.85} metalness={0.01} />
      </mesh>
      
      {/* Roof based on style */}
      {config.roofStyle === "parapet" && (
        <>
          {/* Parapet walls */}
          <mesh position={[0, totalHeight + 0.025, config.depth / 2 + wallThickness / 2]} castShadow>
            <boxGeometry args={[config.width + wallThickness * 2, 0.05, wallThickness]} />
            <meshStandardMaterial color={colors.stoneWarm} roughness={0.8} metalness={0.01} />
          </mesh>
          <mesh position={[0, totalHeight + 0.025, -config.depth / 2 - wallThickness / 2]} castShadow>
            <boxGeometry args={[config.width + wallThickness * 2, 0.05, wallThickness]} />
            <meshStandardMaterial color={colors.stoneWarm} roughness={0.8} metalness={0.01} />
          </mesh>
          <mesh position={[config.width / 2 + wallThickness / 2, totalHeight + 0.025, 0]} castShadow>
            <boxGeometry args={[wallThickness, 0.05, config.depth]} />
            <meshStandardMaterial color={colors.stoneWarm} roughness={0.8} metalness={0.01} />
          </mesh>
          <mesh position={[-config.width / 2 - wallThickness / 2, totalHeight + 0.025, 0]} castShadow>
            <boxGeometry args={[wallThickness, 0.05, config.depth]} />
            <meshStandardMaterial color={colors.stoneWarm} roughness={0.8} metalness={0.01} />
          </mesh>
          {/* Flat roof surface */}
          <mesh position={[0, totalHeight + 0.005, 0]} receiveShadow>
            <boxGeometry args={[config.width, 0.01, config.depth]} />
            <meshStandardMaterial color={colors.roof} roughness={0.7} metalness={0.02} />
          </mesh>
        </>
      )}
      
      {config.roofStyle === "flat" && (
        <mesh position={[0, totalHeight + 0.015, 0]} castShadow receiveShadow>
          <boxGeometry args={[config.width + 0.04, 0.03, config.depth + 0.04]} />
          <meshStandardMaterial color={colors.roof} roughness={0.65} metalness={0.03} />
        </mesh>
      )}
      
      {/* Windows - recessed for realism */}
      {Array.from({ length: config.stories }).map((_, story) =>
        Array.from({ length: config.windowCols }).map((_, col) => {
          const x = -config.width / 2 + windowSpacingX * (col + 1);
          const y = story * storyHeight + windowSpacingY;
          return (
            <group key={`window-${story}-${col}`}>
              {/* Window recess */}
              <mesh position={[x, y, config.depth / 2 + 0.001]}>
                <boxGeometry args={[windowWidth + 0.02, windowHeight + 0.02, 0.02]} />
                <meshStandardMaterial color={colors.secondary} roughness={0.85} metalness={0.01} />
              </mesh>
              {/* Window glass */}
              <mesh position={[x, y, config.depth / 2 + 0.012]}>
                <boxGeometry args={[windowWidth, windowHeight, windowDepth]} />
                <meshStandardMaterial
                  color="#3a4550"
                  roughness={0.15}
                  metalness={0.1}
                  emissive={colors.warmGlow}
                  emissiveIntensity={windowEmissive * 0.7}
                  transparent
                  opacity={0.85}
                />
              </mesh>
              {/* Window frame */}
              <mesh position={[x, y, config.depth / 2 + 0.018]}>
                <boxGeometry args={[windowWidth + 0.01, windowHeight + 0.01, 0.005]} />
                <meshStandardMaterial color={colors.woodTrim} roughness={0.6} metalness={0.02} transparent opacity={0.0} />
              </mesh>
            </group>
          );
        })
      )}
      
      {/* Balcony */}
      {config.hasBalcony && (config.balconySide === "front" || config.balconySide === "both") && (
        <group position={[0, totalHeight - storyHeight + 0.05, config.depth / 2 + 0.08]}>
          {/* Balcony floor */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[config.width * 0.6, 0.03, 0.15]} />
            <meshStandardMaterial color={colors.terrace} roughness={0.72} metalness={0.02} />
          </mesh>
          {/* Balcony railing - glass panels */}
          <mesh position={[0, 0.05, 0.06]}>
            <boxGeometry args={[config.width * 0.58, 0.08, 0.01]} />
            <meshStandardMaterial color="#5a6570" roughness={0.1} metalness={0.15} transparent opacity={0.4} />
          </mesh>
          {/* Railing posts */}
          <mesh position={[-config.width * 0.28, 0.045, 0.06]} castShadow>
            <boxGeometry args={[0.015, 0.09, 0.015]} />
            <meshStandardMaterial color={colors.glass} roughness={0.35} metalness={0.3} />
          </mesh>
          <mesh position={[config.width * 0.28, 0.045, 0.06]} castShadow>
            <boxGeometry args={[0.015, 0.09, 0.015]} />
            <meshStandardMaterial color={colors.glass} roughness={0.35} metalness={0.3} />
          </mesh>
          {/* Top rail */}
          <mesh position={[0, 0.09, 0.06]} castShadow>
            <boxGeometry args={[config.width * 0.6, 0.012, 0.02]} />
            <meshStandardMaterial color={colors.glass} roughness={0.3} metalness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
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
  const villaRefs = useRef<(THREE.Group | null)[]>([]);
  const isFullTier = tier === "full";

  const colors = variantColors("home");

  const villas = useMemo((): RealisticVillaConfig[] => [
    {
      pos: [0, 0, 0.15],
      width: 0.55,
      depth: 0.45,
      stories: 3,
      hasBalcony: true,
      balconySide: "front",
      roofStyle: "parapet",
      windowRows: 3,
      windowCols: 3,
      baseOffset: 0,
      scrollMultiplier: 1.0,
    },
    {
      pos: [-0.65, 0, -0.05],
      width: 0.45,
      depth: 0.38,
      stories: 2,
      hasBalcony: true,
      balconySide: "front",
      roofStyle: "flat",
      windowRows: 2,
      windowCols: 2,
      baseOffset: 0.04,
      scrollMultiplier: 1.12,
    },
    {
      pos: [0.68, 0, -0.02],
      width: 0.48,
      depth: 0.4,
      stories: 2,
      hasBalcony: true,
      balconySide: "both",
      roofStyle: "parapet",
      windowRows: 2,
      windowCols: 3,
      baseOffset: 0.03,
      scrollMultiplier: 1.08,
    },
    {
      pos: [-0.32, 0, -0.52],
      width: 0.38,
      depth: 0.32,
      stories: 2,
      hasBalcony: false,
      roofStyle: "flat",
      windowRows: 2,
      windowCols: 2,
      baseOffset: 0.05,
      scrollMultiplier: 1.15,
    },
    {
      pos: [0.35, 0, -0.48],
      width: 0.4,
      depth: 0.34,
      stories: 2,
      hasBalcony: true,
      balconySide: "front",
      roofStyle: "parapet",
      windowRows: 2,
      windowCols: 2,
      baseOffset: 0.04,
      scrollMultiplier: 1.1,
    },
  ], []);

  const trees = useMemo((): RealisticTreeConfig[] => [
    { pos: [-1.05, 0, 0.25], type: "cypress", scale: 1.1, rotation: 0.1 },
    { pos: [-0.95, 0, -0.42], type: "cypress", scale: 0.95, rotation: -0.15 },
    { pos: [1.0, 0, 0.18], type: "cypress", scale: 1.0, rotation: 0.05 },
    { pos: [0.92, 0, -0.38], type: "cypress", scale: 0.88, rotation: -0.08 },
    { pos: [-0.02, 0, -0.78], type: "olive", scale: 0.9, rotation: 0.2 },
    { pos: [0.58, 0, -0.72], type: "olive", scale: 0.8, rotation: -0.1 },
    { pos: [-0.55, 0, -0.75], type: "olive", scale: 0.85, rotation: 0.15 },
  ], []);

  const landscapeFeatures = useMemo(() => ({
    paths: [
      { pos: [0, 0.012, 0.42] as [number, number, number], size: [0.18, 0.025, 0.55] as [number, number, number] },
      { pos: [-0.28, 0.012, 0.05] as [number, number, number], size: [0.4, 0.025, 0.14] as [number, number, number] },
      { pos: [0.32, 0.012, 0.08] as [number, number, number], size: [0.38, 0.025, 0.14] as [number, number, number] },
    ],
    hedges: [
      { pos: [-0.82, 0.04, 0.08] as [number, number, number], size: [0.08, 0.08, 0.35] as [number, number, number] },
      { pos: [0.85, 0.04, 0.1] as [number, number, number], size: [0.08, 0.08, 0.32] as [number, number, number] },
      { pos: [0, 0.035, -0.25] as [number, number, number], size: [0.5, 0.07, 0.06] as [number, number, number] },
    ],
    poolArea: {
      pos: [0, 0.015, -0.18] as [number, number, number],
      poolSize: [0.32, 0.03, 0.2] as [number, number, number],
      deckSize: [0.45, 0.015, 0.28] as [number, number, number],
    },
  }), []);

  useFrame((state, delta) => {
    if (!group.current) return;

    const time = state.clock.elapsedTime;
    const easedProgress = easeOutQuart(scrollProgress);
    const sinProgress = Math.sin(scrollProgress * Math.PI);
    const breathe = Math.sin(time * 0.5) * 0.015;

    const targetRotation = easedProgress * 0.7 + time * 0.02;
    const targetY = sinProgress * 0.12 + breathe;
    const targetTilt = (scrollProgress - 0.5) * 0.045;

    const lerpFactor = isFullTier ? 1 - Math.pow(0.0008, delta) : 0.12;

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
      lerpFactor * 0.6,
    );

    if (isFullTier) {
      villaRefs.current.forEach((villaGroup, i) => {
        if (!villaGroup) return;
        const config = villas[i];
        if (!config) return;

        const individualOffset = config.baseOffset * Math.sin(time * 0.6 + i * 0.5);
        const scrollElevation = sinProgress * config.scrollMultiplier * 0.04;

        villaGroup.position.y = THREE.MathUtils.lerp(
          villaGroup.position.y,
          individualOffset + scrollElevation,
          lerpFactor,
        );

        const scaleBreath = 1 + Math.sin(time * 0.6 + i * 0.25) * 0.003;
        villaGroup.scale.setScalar(
          THREE.MathUtils.lerp(villaGroup.scale.x, scaleBreath, lerpFactor)
        );
      });
    }
  });

  const groundOpacity = isFullTier ? 0.75 + scrollProgress * 0.08 : 0.68;
  const windowEmissive = isFullTier ? 0.25 + scrollProgress * 0.35 : 0.15;
  const waterEmissive = isFullTier ? 0.08 + scrollProgress * 0.1 : 0.05;

  return (
    <group ref={group}>
      {/* Main ground - subtle warm earth */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -0.15]} receiveShadow>
        <planeGeometry args={[2.8, 2.2]} />
        <meshStandardMaterial
          color={colors.ground}
          roughness={0.82}
          metalness={0.01}
          transparent
          opacity={groundOpacity}
        />
      </mesh>

      {/* Paved courtyard area */}
      <mesh position={[0, 0.008, -0.05]} receiveShadow>
        <boxGeometry args={[1.6, 0.016, 1.2]} />
        <meshStandardMaterial
          color={colors.courtyard}
          roughness={0.78}
          metalness={0.01}
        />
      </mesh>

      {/* Stone pathways */}
      {landscapeFeatures.paths.map((p, i) => (
        <mesh key={`path-${i}`} position={p.pos} receiveShadow>
          <boxGeometry args={p.size} />
          <meshStandardMaterial color={colors.pathLight} roughness={0.75} metalness={0.01} />
        </mesh>
      ))}

      {/* Pool deck */}
      <mesh position={landscapeFeatures.poolArea.pos} receiveShadow>
        <boxGeometry args={landscapeFeatures.poolArea.deckSize} />
        <meshStandardMaterial color={colors.terrace} roughness={0.7} metalness={0.02} />
      </mesh>

      {/* Pool water */}
      <mesh position={[landscapeFeatures.poolArea.pos[0], landscapeFeatures.poolArea.pos[1] + 0.008, landscapeFeatures.poolArea.pos[2]]} receiveShadow>
        <boxGeometry args={landscapeFeatures.poolArea.poolSize} />
        <meshStandardMaterial
          color={colors.water}
          roughness={0.12}
          metalness={0.08}
          emissive={colors.waterGlow}
          emissiveIntensity={waterEmissive}
        />
      </mesh>

      {/* Hedges - low rectangular green masses */}
      {landscapeFeatures.hedges.map((h, i) => (
        <mesh key={`hedge-${i}`} position={h.pos} castShadow receiveShadow>
          <boxGeometry args={h.size} />
          <meshStandardMaterial
            color={i % 2 === 0 ? colors.foliage : colors.foliageDark}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      ))}

      {/* Villas */}
      {villas.map((villa, i) => (
        <group
          key={`villa-${i}`}
          ref={(el) => {
            villaRefs.current[i] = el;
          }}
        >
          <RealisticVilla
            config={villa}
            colors={colors}
            isFullTier={isFullTier}
            windowEmissive={windowEmissive}
          />
        </group>
      ))}

      {/* Trees */}
      {trees.map((tree, i) => (
        tree.type === "cypress" ? (
          <RealisticCypressTree key={`tree-${i}`} pos={tree.pos} scale={tree.scale} rotation={tree.rotation} />
        ) : (
          <RealisticOliveTree key={`tree-${i}`} pos={tree.pos} scale={tree.scale} rotation={tree.rotation} />
        )
      ))}

      {/* Subtle ambient lighting */}
      {isFullTier && (
        <>
          <pointLight
            position={[0, 1.5, 0.1]}
            intensity={0.7 + scrollProgress * 0.25}
            color="#f8f0e8"
            distance={4}
            decay={2}
          />
          <pointLight
            position={[-0.7, 0.8, -0.2]}
            intensity={0.35 + scrollProgress * 0.12}
            color="#f0e8e0"
            distance={2.5}
            decay={2}
          />
          <pointLight
            position={[0.7, 0.8, -0.2]}
            intensity={0.35 + scrollProgress * 0.12}
            color="#f0e8e0"
            distance={2.5}
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
