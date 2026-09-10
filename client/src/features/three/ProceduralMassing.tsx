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

interface ArchitecturalGatewayProps {
  scrollProgress: number;
  accent: string;
  tier?: ExperienceTier;
}

function ArchitecturalGateway({ scrollProgress, accent, tier = "full" }: ArchitecturalGatewayProps) {
  const group = useRef<THREE.Group>(null);
  const isFullTier = tier === "full";

  const pillarWidth = 0.7;
  const pillarDepth = 0.5;
  const pillarHeight = 4.0;
  const gatewaySpan = 3.2;
  const lintelHeight = 0.5;
  const lintelDepth = 0.8;
  const plinthHeight = 0.25;
  const plinthWidth = gatewaySpan + pillarWidth * 2 + 0.6;
  const plinthDepth = pillarDepth + 1.2;

  useFrame((state, delta) => {
    if (!group.current) return;

    const time = state.clock.elapsedTime;
    const easedProgress = easeOutQuart(scrollProgress);

    const targetRotation = easedProgress * 0.4 + time * 0.02;
    const floatY = Math.sin(scrollProgress * Math.PI) * 0.12 + Math.sin(time * 0.6) * 0.015;
    const targetTilt = (scrollProgress - 0.5) * 0.04;

    const lerpFactor = isFullTier ? 1 - Math.pow(0.001, delta) : 0.1;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotation,
      lerpFactor,
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      floatY - 0.8,
      lerpFactor,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetTilt,
      lerpFactor * 0.5,
    );
  });

  const stoneColor = "#2d2d2d";
  const stoneLightColor = "#3a3a3a";
  const metalColor = "#4a4a4a";
  const glassColor = "#d8d8d8";
  const groundColor = "#1a1a1a";

  const emissiveIntensity = isFullTier ? 0.08 + scrollProgress * 0.06 : 0.05;
  const groundOpacity = isFullTier ? 0.65 + scrollProgress * 0.15 : 0.55;

  return (
    <group ref={group}>
      {/* Ground plane - dark editorial base */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial
          color={groundColor}
          roughness={0.95}
          metalness={0.02}
          transparent
          opacity={groundOpacity}
        />
      </mesh>

      {/* ===== BASE PLINTH - Stepped platform for arrival ===== */}
      {/* Lower plinth step */}
      <mesh position={[0, plinthHeight * 0.5, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[plinthWidth + 0.8, plinthHeight, plinthDepth + 0.8]} />
        <meshStandardMaterial
          color="#252525"
          roughness={0.88}
          metalness={0.03}
        />
      </mesh>

      {/* Upper plinth step */}
      <mesh position={[0, plinthHeight * 1.5, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[plinthWidth, plinthHeight, plinthDepth + 0.3]} />
        <meshStandardMaterial
          color={stoneColor}
          roughness={0.82}
          metalness={0.04}
        />
      </mesh>

      {/* Top plinth - main platform */}
      <mesh position={[0, plinthHeight * 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[plinthWidth - 0.4, plinthHeight, plinthDepth]} />
        <meshStandardMaterial
          color={stoneLightColor}
          roughness={0.78}
          metalness={0.05}
        />
      </mesh>

      {/* ===== LEFT PILLAR - Portal frame ===== */}
      <group position={[-(gatewaySpan / 2 + pillarWidth / 2), plinthHeight * 3, 0]}>
        {/* Main pillar mass */}
        <mesh position={[0, pillarHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[pillarWidth, pillarHeight, pillarDepth]} />
          <meshStandardMaterial
            color={stoneColor}
            roughness={0.75}
            metalness={0.06}
            envMapIntensity={isFullTier ? 0.5 : 0.2}
          />
        </mesh>

        {/* Inner recessed panel */}
        <mesh position={[pillarWidth * 0.35, pillarHeight / 2, 0]} castShadow>
          <boxGeometry args={[0.08, pillarHeight - 0.6, pillarDepth - 0.12]} />
          <meshStandardMaterial
            color={stoneLightColor}
            roughness={0.7}
            metalness={0.08}
          />
        </mesh>

        {/* Vertical metal accent strip */}
        <mesh position={[pillarWidth * 0.48, pillarHeight / 2, 0]}>
          <boxGeometry args={[0.025, pillarHeight - 0.3, 0.06]} />
          <meshStandardMaterial
            color={metalColor}
            roughness={0.35}
            metalness={0.65}
            emissive={accent}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>

        {/* Pillar cap */}
        <mesh position={[0, pillarHeight + 0.08, 0]} castShadow>
          <boxGeometry args={[pillarWidth + 0.1, 0.16, pillarDepth + 0.1]} />
          <meshStandardMaterial
            color={metalColor}
            roughness={0.4}
            metalness={0.55}
          />
        </mesh>

        {/* Pillar base detail */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[pillarWidth + 0.08, 0.2, pillarDepth + 0.08]} />
          <meshStandardMaterial
            color="#262626"
            roughness={0.8}
            metalness={0.04}
          />
        </mesh>
      </group>

      {/* ===== RIGHT PILLAR - Portal frame ===== */}
      <group position={[gatewaySpan / 2 + pillarWidth / 2, plinthHeight * 3, 0]}>
        {/* Main pillar mass */}
        <mesh position={[0, pillarHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[pillarWidth, pillarHeight, pillarDepth]} />
          <meshStandardMaterial
            color={stoneColor}
            roughness={0.75}
            metalness={0.06}
            envMapIntensity={isFullTier ? 0.5 : 0.2}
          />
        </mesh>

        {/* Inner recessed panel */}
        <mesh position={[-pillarWidth * 0.35, pillarHeight / 2, 0]} castShadow>
          <boxGeometry args={[0.08, pillarHeight - 0.6, pillarDepth - 0.12]} />
          <meshStandardMaterial
            color={stoneLightColor}
            roughness={0.7}
            metalness={0.08}
          />
        </mesh>

        {/* Vertical metal accent strip */}
        <mesh position={[-pillarWidth * 0.48, pillarHeight / 2, 0]}>
          <boxGeometry args={[0.025, pillarHeight - 0.3, 0.06]} />
          <meshStandardMaterial
            color={metalColor}
            roughness={0.35}
            metalness={0.65}
            emissive={accent}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>

        {/* Pillar cap */}
        <mesh position={[0, pillarHeight + 0.08, 0]} castShadow>
          <boxGeometry args={[pillarWidth + 0.1, 0.16, pillarDepth + 0.1]} />
          <meshStandardMaterial
            color={metalColor}
            roughness={0.4}
            metalness={0.55}
          />
        </mesh>

        {/* Pillar base detail */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[pillarWidth + 0.08, 0.2, pillarDepth + 0.08]} />
          <meshStandardMaterial
            color="#262626"
            roughness={0.8}
            metalness={0.04}
          />
        </mesh>
      </group>

      {/* ===== LINTEL / CANOPY - Horizontal threshold beam ===== */}
      <group position={[0, plinthHeight * 3 + pillarHeight, 0]}>
        {/* Main lintel beam */}
        <mesh position={[0, lintelHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[gatewaySpan + pillarWidth * 2 + 0.3, lintelHeight, lintelDepth]} />
          <meshStandardMaterial
            color={stoneColor}
            roughness={0.72}
            metalness={0.08}
            envMapIntensity={isFullTier ? 0.6 : 0.25}
          />
        </mesh>

        {/* Lintel top cap - subtle crown */}
        <mesh position={[0, lintelHeight + 0.06, 0]} castShadow>
          <boxGeometry args={[gatewaySpan + pillarWidth * 2 + 0.5, 0.12, lintelDepth + 0.15]} />
          <meshStandardMaterial
            color={metalColor}
            roughness={0.38}
            metalness={0.6}
          />
        </mesh>

        {/* Underside accent beam */}
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[gatewaySpan + 0.1, 0.06, 0.1]} />
          <meshStandardMaterial
            color={metalColor}
            roughness={0.4}
            metalness={0.5}
            emissive={accent}
            emissiveIntensity={emissiveIntensity * 1.5}
          />
        </mesh>

        {/* Translucent canopy extension - glass accent */}
        <mesh position={[0, lintelHeight + 0.2, lintelDepth * 0.7]} castShadow>
          <boxGeometry args={[gatewaySpan + pillarWidth * 2 - 0.2, 0.04, 0.5]} />
          <meshStandardMaterial
            color={glassColor}
            roughness={0.12}
            metalness={0.08}
            transparent
            opacity={0.45}
          />
        </mesh>
      </group>

      {/* ===== PASSAGE THRESHOLD - Floor detail inside gateway ===== */}
      <mesh position={[0, plinthHeight * 3 + 0.02, 0]} receiveShadow>
        <boxGeometry args={[gatewaySpan - 0.2, 0.04, pillarDepth + 0.4]} />
        <meshStandardMaterial
          color={stoneLightColor}
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>

      {/* Center threshold accent line */}
      <mesh position={[0, plinthHeight * 3 + 0.045, 0]}>
        <boxGeometry args={[gatewaySpan - 0.4, 0.015, 0.08]} />
        <meshStandardMaterial
          color={metalColor}
          roughness={0.35}
          metalness={0.7}
          emissive={accent}
          emissiveIntensity={emissiveIntensity * 0.8}
        />
      </mesh>

      {/* ===== AMBIENT LIGHTING ===== */}
      {isFullTier && (
        <>
          <pointLight
            position={[0, plinthHeight * 3 + pillarHeight * 0.6, 2.5]}
            intensity={1.0 + scrollProgress * 0.3}
            color={accent}
            distance={10}
            decay={2}
          />
          <pointLight
            position={[3, 3, -1]}
            intensity={0.5 + scrollProgress * 0.15}
            color="#ffffff"
            distance={8}
            decay={2}
          />
          <pointLight
            position={[-3, 2.5, 1]}
            intensity={0.35}
            color="#cccccc"
            distance={7}
            decay={2}
          />
          <directionalLight
            position={[-4, 6, 4]}
            intensity={0.6}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
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

  if (variant === "home") {
    return <ArchitecturalGateway scrollProgress={scrollProgress} accent={accent} tier={tier} />;
  }

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
