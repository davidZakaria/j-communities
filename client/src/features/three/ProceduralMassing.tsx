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

export function ProceduralMassing({ variant, accent, scrollProgress }: ProceduralMassingProps) {
  const group = useRef<THREE.Group>(null);
  const colors = variantColors(variant);

  const blocks = useMemo(() => {
    if (variant === "jamila") {
      return [
        { pos: [0, 1.2, 0] as [number, number, number], size: [0.9, 2.4, 0.9] as [number, number, number] },
        { pos: [-1.1, 0.8, 0.2] as [number, number, number], size: [0.7, 1.6, 0.75] as [number, number, number] },
        { pos: [1.05, 0.9, -0.15] as [number, number, number], size: [0.75, 1.8, 0.8] as [number, number, number] },
      ];
    }
    if (variant === "jura") {
      return [
        { pos: [0, 0.35, 0] as [number, number, number], size: [3.2, 0.25, 2.2] as [number, number, number] },
        { pos: [-0.8, 0.7, 0.3] as [number, number, number], size: [0.5, 0.6, 0.45] as [number, number, number] },
        { pos: [0.6, 0.65, -0.2] as [number, number, number], size: [0.55, 0.55, 0.5] as [number, number, number] },
        { pos: [0.1, 0.75, 0.5] as [number, number, number], size: [0.4, 0.45, 0.35] as [number, number, number] },
      ];
    }
    return [
      { pos: [0, 0, 0] as [number, number, number], size: [4, 0.08, 2.5] as [number, number, number] },
      { pos: [0, 0.5, -1] as [number, number, number], size: [6, 0.02, 4] as [number, number, number] },
    ];
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
