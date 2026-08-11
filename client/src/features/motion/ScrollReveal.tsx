import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useExperienceTier } from "./ExperienceTierContext";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  staggerIndex?: number;
  /** Always visible immediately (e.g. hero copy) */
  immediate?: boolean;
}

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

export function ScrollReveal({
  children,
  className = "",
  style,
  staggerIndex = 0,
  immediate = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { tier } = useExperienceTier();

  useEffect(() => {
    const el = ref.current;
    if (!el || tier === "static" || immediate) {
      el?.classList.add("j-scroll-reveal--visible");
      return;
    }

    if (typeof IntersectionObserver === "undefined" || isInViewport(el)) {
      el.classList.add("j-scroll-reveal--visible");
      if (typeof IntersectionObserver === "undefined") return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("j-scroll-reveal--visible");
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [tier, immediate]);

  const tierClass =
    tier === "full" ? "j-scroll-reveal--full" : tier === "light" ? "j-scroll-reveal--light" : "j-scroll-reveal--static";

  const visibleNow = tier === "static" || immediate;

  return (
    <div
      ref={ref}
      className={`j-scroll-reveal ${tierClass} ${visibleNow ? "j-scroll-reveal--visible" : ""} ${className}`.trim()}
      style={{
        ...style,
        ["--j-reveal-stagger" as string]: `${staggerIndex * 0.07}s`,
      }}
    >
      {children}
    </div>
  );
}
