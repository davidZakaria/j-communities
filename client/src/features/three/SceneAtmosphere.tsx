import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface SceneAtmosphereProps {
  glowColor: string;
  glowIntensity: number;
  scrollProgress: number;
}

export function SceneAtmosphere({ glowColor, glowIntensity, scrollProgress }: SceneAtmosphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();

  const glowColorVec = useMemo(() => new THREE.Color(glowColor), [glowColor]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uGlowColor: { value: glowColorVec },
        uIntensity: { value: glowIntensity },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScrollProgress;
        uniform vec3 uGlowColor;
        uniform float uIntensity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = length(vUv - center);
          
          float radialGlow = 1.0 - smoothstep(0.0, 0.7, dist);
          radialGlow = pow(radialGlow, 2.5);
          
          float breathe = sin(uTime * 0.5 + uScrollProgress * 2.0) * 0.15 + 0.85;
          float scrollPulse = smoothstep(0.0, 0.4, uScrollProgress) * smoothstep(1.0, 0.6, uScrollProgress);
          
          float n = noise(vUv * 10.0 + uTime * 0.05) * 0.08;
          
          float finalGlow = radialGlow * breathe * uIntensity * (0.6 + scrollPulse * 0.4) + n * uIntensity * 0.3;
          
          gl_FragColor = vec4(uGlowColor, finalGlow * 0.35);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
  }, [glowColorVec, glowIntensity]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    meshRef.current.position.copy(camera.position);
    meshRef.current.quaternion.copy(camera.quaternion);

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uScrollProgress.value = scrollProgress;
    materialRef.current.uniforms.uIntensity.value = glowIntensity;
  });

  if (glowIntensity <= 0.05) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[15, 32, 32]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
