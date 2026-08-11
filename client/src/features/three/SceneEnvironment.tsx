import type { ReactNode } from "react";

interface SceneEnvironmentProps {
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  children: ReactNode;
}

/** Transparent WebGL scene — hero photo stays visible behind the canvas. */
export function SceneEnvironment({
  fogColor = "#000000",
  fogNear = 8,
  fogFar = 28,
  children,
}: SceneEnvironmentProps) {
  return (
    <>
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 3]} intensity={0.55} />
      {children}
    </>
  );
}
