import { type CSSProperties, type ReactNode, useMemo } from "react";
import { useExperienceTier } from "./ExperienceTierContext";
import { useMotionScrollY } from "./LenisProvider";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  /** Scroll multiplier — higher = more movement */
  speed?: number;
  style?: CSSProperties;
}

export function ParallaxLayer({
  children,
  className = "",
  speed = 0.48,
  style,
}: ParallaxLayerProps) {
  const scrollY = useMotionScrollY();
  const { parallaxMaxPx, tier } = useExperienceTier();

  const translateY = useMemo(() => {
    if (tier === "static" || parallaxMaxPx === 0) return 0;
    const factor = tier === "full" ? speed * 0.55 : speed * 0.45;
    const offset = scrollY * factor;
    return -Math.min(offset, parallaxMaxPx);
  }, [scrollY, parallaxMaxPx, speed, tier]);

  if (tier === "static") {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`j-parallax-layer ${className}`.trim()}
      style={{
        ...style,
        transform: `translate3d(0, ${translateY}px, 0)`,
        willChange: "transform",
      }}
    >
      <div className="j-parallax-layer__inner h-full w-full">{children}</div>
    </div>
  );
}
