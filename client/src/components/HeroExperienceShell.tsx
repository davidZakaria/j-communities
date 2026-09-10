import { useEffect, useRef, useState, type ReactNode } from "react";
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
  const [mediaReady, setMediaReady] = useState(false);
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    registerHero(sectionRef.current);
    return () => registerHero(null);
  }, [registerHero]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;
    const images = section.querySelectorAll<HTMLImageElement>("img");
    
    if (images.length === 0) {
      setMediaReady(true);
      return;
    }

    let loadedCount = 0;
    const checkReady = () => {
      loadedCount++;
      if (loadedCount >= images.length) {
        setMediaReady(true);
      }
    };

    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        checkReady();
      } else {
        img.addEventListener("load", checkReady, { once: true });
        img.addEventListener("error", checkReady, { once: true });
      }
    });

    const fallbackTimer = window.setTimeout(() => setMediaReady(true), 3000);
    return () => window.clearTimeout(fallbackTimer);
  }, [poster]);

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
