import { useEffect, useRef, type ReactNode } from "react";
import { useExperienceTier } from "./ExperienceTierContext";
import { useMotionScrollY } from "./LenisProvider";

interface SectionAtmosphereProps {
  children: ReactNode;
  className?: string;
  fromColor?: string;
  toColor?: string;
  fromOpacity?: number;
  toOpacity?: number;
  gradientDirection?: "to-b" | "to-t" | "radial";
  transitionThreshold?: number;
}

export function SectionAtmosphere({
  children,
  className = "",
  fromColor = "transparent",
  toColor = "rgba(0,0,0,0.15)",
  fromOpacity = 0,
  toOpacity = 1,
  gradientDirection = "to-b",
  transitionThreshold = 0.3,
}: SectionAtmosphereProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollY = useMotionScrollY();
  const { tier } = useExperienceTier();

  useEffect(() => {
    if (!sectionRef.current || !overlayRef.current || tier === "static") return;

    const section = sectionRef.current;
    const overlay = overlayRef.current;
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const visibleTop = Math.max(0, -rect.top);
    const visibleBottom = Math.min(rect.height, viewportHeight - rect.top);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibilityRatio = visibleHeight / viewportHeight;

    const entryProgress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight * transitionThreshold)));
    const exitProgress = Math.min(1, Math.max(0, (rect.bottom) / (viewportHeight * transitionThreshold)));

    const combinedProgress = Math.min(entryProgress, exitProgress);
    const currentOpacity = fromOpacity + (toOpacity - fromOpacity) * combinedProgress;

    overlay.style.opacity = String(currentOpacity);

    if (visibilityRatio > 0.5) {
      section.classList.add("j-section-atmosphere--active");
    } else {
      section.classList.remove("j-section-atmosphere--active");
    }
  }, [scrollY, tier, fromOpacity, toOpacity, transitionThreshold]);

  if (tier === "static") {
    return (
      <div ref={sectionRef} className={`j-section-atmosphere ${className}`.trim()}>
        {children}
      </div>
    );
  }

  const gradientStyle =
    gradientDirection === "radial"
      ? `radial-gradient(ellipse at center, ${fromColor} 0%, ${toColor} 100%)`
      : gradientDirection === "to-t"
        ? `linear-gradient(to top, ${fromColor} 0%, ${toColor} 100%)`
        : `linear-gradient(to bottom, ${fromColor} 0%, ${toColor} 100%)`;

  return (
    <div ref={sectionRef} className={`j-section-atmosphere relative ${className}`.trim()}>
      <div
        ref={overlayRef}
        className="j-section-atmosphere-overlay pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: gradientStyle,
          opacity: fromOpacity,
          transition: "opacity 0.3s ease-out",
        }}
        aria-hidden
      />
      <div className="j-section-atmosphere-content relative z-[2]">{children}</div>
    </div>
  );
}

interface AtmosphereTransitionProps {
  children: ReactNode;
  className?: string;
  direction?: "down" | "up";
  intensity?: "subtle" | "medium" | "strong";
}

export function AtmosphereTransition({
  children,
  className = "",
  direction = "down",
  intensity = "medium",
}: AtmosphereTransitionProps) {
  const { tier } = useExperienceTier();

  if (tier === "static") {
    return <div className={className}>{children}</div>;
  }

  const opacityMap = { subtle: 0.08, medium: 0.15, strong: 0.25 };
  const maxOpacity = opacityMap[intensity];

  return (
    <SectionAtmosphere
      className={className}
      fromColor="transparent"
      toColor={`rgba(0,0,0,${maxOpacity})`}
      fromOpacity={0}
      toOpacity={1}
      gradientDirection={direction === "down" ? "to-b" : "to-t"}
      transitionThreshold={0.4}
    >
      {children}
    </SectionAtmosphere>
  );
}
