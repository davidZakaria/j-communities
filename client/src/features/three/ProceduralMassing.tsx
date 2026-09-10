import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type ProceduralVariant = "home" | "jura" | "jamila";

interface ProceduralMassingProps {
  variant: ProceduralVariant;
  accent: string;
  scrollProgress: number;
}

function variantColors(variant: ProceduralVariant) {
  switch (variant) {
    case "jura":
      return { base: "#0A2E40", accent: "#E89130", secondary: "#0A5C5C" };
    case "jamila":
      return { base: "#1A4284", accent: "#20B6B5", secondary: "#0889A7" };
    default:
      return { base: "#1a1a1a", accent: "#888888", secondary: "#333333" };
  }
}

interface CoastalPavilionProps {
  scrollProgress: number;
  accent: string;
}

function CoastalPavilion({ scrollProgress, accent }: CoastalPavilionProps) {
  const group = useRef<THREE.Group>(null);

  const deckWidth = 4.2;
  const deckDepth = 3.0;
  const deckHeight = 0.12;
  const columnRadius = 0.06;
  const columnHeight = 2.0;
  const roofThickness = 0.08;
  const roofOverhang = 0.6;
  const railingHeight = 0.7;

  const columnPositions: [number, number, number][] = useMemo(
    () => [
      [-deckWidth / 2 + 0.35, deckHeight / 2 + columnHeight / 2, -deckDepth / 2 + 0.35],
      [deckWidth / 2 - 0.35, deckHeight / 2 + columnHeight / 2, -deckDepth / 2 + 0.35],
      [-deckWidth / 2 + 0.35, deckHeight / 2 + columnHeight / 2, deckDepth / 2 - 0.35],
      [deckWidth / 2 - 0.35, deckHeight / 2 + columnHeight / 2, deckDepth / 2 - 0.35],
      [0, deckHeight / 2 + columnHeight / 2, -deckDepth / 2 + 0.35],
      [0, deckHeight / 2 + columnHeight / 2, deckDepth / 2 - 0.35],
    ],
    [deckWidth, deckDepth, deckHeight, columnHeight],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y = scrollProgress * 0.5 + performance.now() * 0.00006;
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      Math.sin(scrollProgress * Math.PI) * 0.12 - 0.3,
      delta * 2.5,
    );
  });

  return (
    <group ref={group}>
      {/* Ground plane - subtle water/sand hint */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.2, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* Deck / Platform - warm wood-like concrete */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[deckWidth, deckHeight, deckDepth]} />
        <meshStandardMaterial color="#3a3632" roughness={0.75} metalness={0.02} />
      </mesh>

      {/* Deck edge detail - subtle step */}
      <mesh position={[0, -deckHeight / 2 - 0.03, deckDepth / 2 + 0.15]} castShadow receiveShadow>
        <boxGeometry args={[deckWidth + 0.3, 0.06, 0.3]} />
        <meshStandardMaterial color="#2d2a27" roughness={0.8} metalness={0.02} />
      </mesh>

      {/* Columns - slender metal */}
      {columnPositions.map((pos, i) => (
        <mesh key={`col-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[columnRadius, columnRadius, columnHeight, 12]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.35} metalness={0.6} />
        </mesh>
      ))}

      {/* Main roof canopy - translucent glass-like */}
      <mesh
        position={[0, deckHeight / 2 + columnHeight + roofThickness / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[deckWidth + roofOverhang, roofThickness, deckDepth + roofOverhang]} />
        <meshStandardMaterial
          color="#e8e4e0"
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Roof beam - front edge accent */}
      <mesh position={[0, deckHeight / 2 + columnHeight - 0.04, deckDepth / 2 + roofOverhang / 2 - 0.1]}>
        <boxGeometry args={[deckWidth + roofOverhang + 0.1, 0.06, 0.12]} />
        <meshStandardMaterial color="#3d3d3d" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Roof beam - back edge */}
      <mesh position={[0, deckHeight / 2 + columnHeight - 0.04, -deckDepth / 2 - roofOverhang / 2 + 0.1]}>
        <boxGeometry args={[deckWidth + roofOverhang + 0.1, 0.06, 0.12]} />
        <meshStandardMaterial color="#3d3d3d" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Back railing - horizontal */}
      <mesh position={[0, deckHeight / 2 + railingHeight, -deckDepth / 2 + 0.1]} castShadow>
        <boxGeometry args={[deckWidth - 0.4, 0.04, 0.04]} />
        <meshStandardMaterial color="#4f4f4f" roughness={0.4} metalness={0.55} />
      </mesh>

      {/* Back railing - lower horizontal */}
      <mesh position={[0, deckHeight / 2 + railingHeight * 0.4, -deckDepth / 2 + 0.1]} castShadow>
        <boxGeometry args={[deckWidth - 0.4, 0.03, 0.03]} />
        <meshStandardMaterial color="#4f4f4f" roughness={0.4} metalness={0.55} />
      </mesh>

      {/* Side railings - left */}
      <mesh position={[-deckWidth / 2 + 0.1, deckHeight / 2 + railingHeight, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, deckDepth - 0.5]} />
        <meshStandardMaterial color="#4f4f4f" roughness={0.4} metalness={0.55} />
      </mesh>

      {/* Side railings - right */}
      <mesh position={[deckWidth / 2 - 0.1, deckHeight / 2 + railingHeight, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, deckDepth - 0.5]} />
        <meshStandardMaterial color="#4f4f4f" roughness={0.4} metalness={0.55} />
      </mesh>

      {/* Minimalist bench/seating silhouette - left side */}
      <mesh position={[-deckWidth / 4 - 0.2, deckHeight / 2 + 0.22, 0]} castShadow>
        <boxGeometry args={[0.8, 0.08, 0.4]} />
        <meshStandardMaterial color="#45403c" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[-deckWidth / 4 - 0.2, deckHeight / 2 + 0.09, 0]} castShadow>
        <boxGeometry args={[0.7, 0.18, 0.35]} />
        <meshStandardMaterial color="#3d3936" roughness={0.75} metalness={0.02} />
      </mesh>

      {/* Small side table silhouette */}
      <mesh position={[deckWidth / 4, deckHeight / 2 + 0.3, 0.3]} castShadow>
        <cylinderGeometry args={[0.25, 0.22, 0.04, 16]} />
        <meshStandardMaterial color="#e0dcd8" roughness={0.25} metalness={0.08} />
      </mesh>
      <mesh position={[deckWidth / 4, deckHeight / 2 + 0.14, 0.3]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.28, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.35} metalness={0.6} />
      </mesh>

      {/* Ambient/accent lighting */}
      <pointLight position={[2, 3, 2]} intensity={0.8} color={accent} />
      <pointLight position={[-2, 2.5, -1]} intensity={0.4} color="#ffffff" />
      <directionalLight position={[-3, 5, 4]} intensity={0.6} castShadow />
    </group>
  );
}

interface BlockData {
  pos: [number, number, number];
  size: [number, number, number];
}

export function ProceduralMassing({ variant, accent, scrollProgress }: ProceduralMassingProps) {
  const group = useRef<THREE.Group>(null);
  const colors = variantColors(variant);

  const blocks = useMemo<BlockData[]>(() => {
    if (variant === "jamila") {
      return [
        { pos: [0, 1.2, 0], size: [0.9, 2.4, 0.9] },
        { pos: [-1.1, 0.8, 0.2], size: [0.7, 1.6, 0.75] },
        { pos: [1.05, 0.9, -0.15], size: [0.75, 1.8, 0.8] },
      ];
    }
    if (variant === "jura") {
      return [
        { pos: [0, 0.35, 0], size: [3.2, 0.25, 2.2] },
        { pos: [-0.8, 0.7, 0.3], size: [0.5, 0.6, 0.45] },
        { pos: [0.6, 0.65, -0.2], size: [0.55, 0.55, 0.5] },
        { pos: [0.1, 0.75, 0.5], size: [0.4, 0.45, 0.35] },
      ];
    }
    return [];
  }, [variant]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y = scrollProgress * 0.35 + performance.now() * 0.00008;
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      Math.sin(scrollProgress * Math.PI) * 0.15,
      delta * 2,
    );
  });

  if (variant === "home") {
    return <CoastalPavilion scrollProgress={scrollProgress} accent={accent} />;
  }

  return (
    <group ref={group}>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={colors.secondary} roughness={0.9} />
      </mesh>
      {blocks.map((b, i) => (
        <mesh key={i} position={b.pos} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshStandardMaterial
            color={i === 0 ? colors.base : colors.secondary}
            emissive={i === blocks.length - 1 ? accent : "#000000"}
            emissiveIntensity={i === blocks.length - 1 ? 0.15 : 0}
            roughness={0.55}
            metalness={0.08}
          />
        </mesh>
      ))}
      <pointLight position={[3, 4, 2]} intensity={1.2} color={accent} />
      <directionalLight position={[-4, 6, 3]} intensity={0.65} castShadow />
    </group>
  );
}
