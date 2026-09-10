import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
  const [webglReady, setWebglReady] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const handleWebGLReady = useCallback(() => {
    setWebglReady(true);
  }, []);

  useEffect(() => {
    registerHero(sectionRef.current);
    return () => registerHero(null);
  }, [registerHero]);

  useEffect(() => {
    if (!enableScene3D) {
      setInitialLoadComplete(true);
      return;
    }
    if (tier === "static" || tier === "light") {
      setInitialLoadComplete(true);
    } else if (webglReady) {
      setInitialLoadComplete(true);
    }
  }, [tier, webglReady, enableScene3D]);

  const showSkeleton = enableScene3D && !initialLoadComplete;

  return (
    <section
      ref={sectionRef}
      className={`j-hero-experience relative w-full overflow-hidden ${className}`.trim()}
      data-motion-tier={tier}
    >
      {/* Loading skeleton - shows before media is ready */}
      <div
        className={`j-hero-skeleton absolute inset-0 z-[1] ${mediaReady ? "j-hero-skeleton--hidden" : ""}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f24] via-[#0d1012] to-[#0a0c0e]" />
        {!reducedMotion && (
          <div className="j-hero-skeleton-shimmer absolute inset-0 opacity-[0.08]" />
        )}
      </div>

      <ParallaxLayer
        className={`absolute inset-0 z-0 h-[118%] -top-[9%] j-hero-media ${mediaReady ? "j-hero-media--ready" : ""}`}
        speed={0.52}
      >
        {poster}
      </ParallaxLayer>

      {enableScene3D && (
        <div
          className={`j-hero-skeleton ${!showSkeleton ? "j-hero-skeleton--hidden" : ""}`}
          aria-hidden="true"
        />
      )}

      {show3d ? (
        <HeroWebGLBackground
          scene={scene}
          scrollProgress={heroProgress}
          onReady={handleWebGLReady}
        />
      ) : null}

      {overlay}

      <div className="relative z-20 min-h-[100svh] w-full xl:absolute xl:inset-0 xl:min-h-0">
        {children}
      </div>
    </section>
  );
}
