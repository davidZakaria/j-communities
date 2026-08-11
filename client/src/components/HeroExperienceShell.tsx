import { useEffect, useRef, type ReactNode } from "react";
import { useExperienceTier } from "../features/motion/ExperienceTierContext";
import { ParallaxLayer } from "../features/motion/ParallaxLayer";
import { useScrollProgress } from "../features/motion/ScrollProgressContext";
import { HeroWebGLBackground } from "../features/three/HeroWebGLBackground";

interface HeroExperienceShellProps {
  scene: "home" | "jura" | "jamila";
  poster: ReactNode;
  overlay: ReactNode;
  children: ReactNode;
  className?: string;
  /** Project pages: photo + parallax only — no WebGL color overlay */
  enableScene3D?: boolean;
}

export function HeroExperienceShell({
  scene,
  poster,
  overlay,
  children,
  className = "",
  enableScene3D = true,
}: HeroExperienceShellProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { registerHero, heroProgress } = useScrollProgress();
  const { enableWebGL, tier } = useExperienceTier();
  const show3d = enableWebGL && enableScene3D;

  useEffect(() => {
    registerHero(sectionRef.current);
    return () => registerHero(null);
  }, [registerHero]);

  return (
    <section
      ref={sectionRef}
      className={`j-hero-experience relative w-full overflow-hidden ${className}`.trim()}
      data-motion-tier={tier}
    >
      <ParallaxLayer className="absolute inset-0 z-0 h-[118%] -top-[9%]" speed={0.52}>
        {poster}
      </ParallaxLayer>

      {show3d ? (
        <HeroWebGLBackground scene={scene} scrollProgress={heroProgress} />
      ) : null}

      {overlay}

      <div className="relative z-20 min-h-[100svh] w-full xl:absolute xl:inset-0 xl:min-h-0">
        {children}
      </div>
    </section>
  );
}
