import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type ParticleVariant = "home" | "jura" | "jamila";

interface HeroParticlesProps {
  variant: ParticleVariant;
  scrollProgress: number;
  intensity: number;
  primaryColor: string;
  secondaryColor: string;
}

interface ParticleData {
  positions: Float32Array;
  velocities: Float32Array;
  sizes: Float32Array;
  colors: Float32Array;
  phases: Float32Array;
}

function generateParticles(count: number, variant: ParticleVariant): ParticleData {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  const spreadX = variant === "jamila" ? 12 : 10;
  const spreadY = variant === "jamila" ? 10 : 8;
  const spreadZ = variant === "jura" ? 14 : 12;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    positions[i3] = (Math.random() - 0.5) * spreadX;
    positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
    positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;

    velocities[i3] = (Math.random() - 0.5) * 0.002;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.003 + 0.001;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;

    sizes[i] = Math.random() * 0.06 + 0.02;
    phases[i] = Math.random() * Math.PI * 2;

    const colorMix = Math.random();
    colors[i3] = colorMix;
    colors[i3 + 1] = colorMix;
    colors[i3 + 2] = colorMix;
  }

  return { positions, velocities, sizes, colors, phases };
}

export function HeroParticles({
  variant,
  scrollProgress,
  intensity,
  primaryColor,
  secondaryColor,
}: HeroParticlesProps) {
  const particleCount = variant === "home" ? 80 : 60;
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, velocities, sizes, phases } = useMemo(
    () => generateParticles(particleCount, variant),
    [particleCount, variant],
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes.slice(), 1));
    geo.setAttribute("phase", new THREE.BufferAttribute(phases.slice(), 1));
    return geo;
  }, [positions, sizes, phases]);

  const primaryColorVec = useMemo(() => new THREE.Color(primaryColor), [primaryColor]);
  const secondaryColorVec = useMemo(() => new THREE.Color(secondaryColor), [secondaryColor]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uIntensity: { value: intensity },
        uPrimaryColor: { value: primaryColorVec },
        uSecondaryColor: { value: secondaryColorVec },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute float phase;
        
        uniform float uTime;
        uniform float uScrollProgress;
        uniform float uIntensity;
        uniform float uPixelRatio;
        
        varying float vAlpha;
        varying float vColorMix;
        
        void main() {
          vec3 pos = position;
          
          float wave = sin(uTime * 0.5 + phase) * 0.3;
          float scrollWave = sin(uScrollProgress * 3.14159 + phase * 0.5) * 0.5;
          
          pos.y += wave + scrollWave * uScrollProgress;
          pos.x += sin(uTime * 0.3 + phase * 2.0) * 0.15;
          pos.z += cos(uTime * 0.4 + phase) * 0.1;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          float distanceFade = smoothstep(20.0, 5.0, -mvPosition.z);
          float scrollFade = smoothstep(0.0, 0.3, uScrollProgress) * smoothstep(1.0, 0.7, uScrollProgress);
          
          vAlpha = distanceFade * uIntensity * (0.4 + scrollFade * 0.6);
          vColorMix = sin(phase + uScrollProgress * 2.0) * 0.5 + 0.5;
          
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z) * (0.8 + uIntensity * 0.4);
        }
      `,
      fragmentShader: `
        uniform vec3 uPrimaryColor;
        uniform vec3 uSecondaryColor;
        
        varying float vAlpha;
        varying float vColorMix;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float softEdge = 1.0 - smoothstep(0.2, 0.5, dist);
          vec3 color = mix(uPrimaryColor, uSecondaryColor, vColorMix);
          
          gl_FragColor = vec4(color, vAlpha * softEdge);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [primaryColorVec, secondaryColorVec, intensity]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return;

    const positionAttr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const posArray = positionAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      posArray[i3] += velocities[i3] + Math.sin(state.clock.elapsedTime * 0.2 + phases[i]) * 0.001;
      posArray[i3 + 1] += velocities[i3 + 1] + scrollProgress * 0.002;
      posArray[i3 + 2] += velocities[i3 + 2];

      const spreadX = variant === "jamila" ? 6 : 5;
      const spreadY = variant === "jamila" ? 5 : 4;
      const spreadZ = variant === "jura" ? 7 : 6;

      if (posArray[i3] > spreadX) posArray[i3] = -spreadX;
      if (posArray[i3] < -spreadX) posArray[i3] = spreadX;
      if (posArray[i3 + 1] > spreadY) posArray[i3 + 1] = -spreadY;
      if (posArray[i3 + 1] < -spreadY) posArray[i3 + 1] = spreadY;
      if (posArray[i3 + 2] > spreadZ) posArray[i3 + 2] = -spreadZ;
      if (posArray[i3 + 2] < -spreadZ) posArray[i3 + 2] = spreadZ;
    }

    positionAttr.needsUpdate = true;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uScrollProgress.value = scrollProgress;
    materialRef.current.uniforms.uIntensity.value = intensity;
  });

  if (intensity <= 0.05) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </points>
  );
}
