import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useExperienceTier } from "./ExperienceTierContext";
import { useScrollProgress } from "./ScrollProgressContext";

interface StoryRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  revealAt?: number;
  fadeAt?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  duration?: "fast" | "normal" | "slow";
  staggerIndex?: number;
  syncWithHero?: boolean;
}

export function StoryReveal({
  children,
  className = "",
  style,
  revealAt = 0.1,
  fadeAt,
  direction = "up",
  duration = "normal",
  staggerIndex = 0,
  syncWithHero = false,
}: StoryRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { tier } = useExperienceTier();
  const { heroProgress, progress } = useScrollProgress();
  const hasRevealedRef = useRef(false);

  const currentProgress = syncWithHero ? heroProgress : progress;

  useEffect(() => {
    const el = ref.current;
    if (!el || tier === "static") {
      el?.classList.add("j-story-reveal--visible");
      return;
    }

    if (currentProgress >= revealAt && !hasRevealedRef.current) {
      const delay = staggerIndex * 80;
      setTimeout(() => {
        el.classList.add("j-story-reveal--visible");
      }, delay);
      hasRevealedRef.current = true;
    }

    if (fadeAt !== undefined && currentProgress >= fadeAt) {
      el.classList.add("j-story-reveal--fading");
    } else {
      el.classList.remove("j-story-reveal--fading");
    }
  }, [currentProgress, revealAt, fadeAt, tier, staggerIndex]);

  if (tier === "static") {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const directionClass = `j-story-reveal--${direction}`;
  const durationClass = `j-story-reveal--${duration}`;

  return (
    <div
      ref={ref}
      className={`j-story-reveal ${directionClass} ${durationClass} ${className}`.trim()}
      style={{
        ...style,
        ["--j-story-stagger" as string]: `${staggerIndex * 0.08}s`,
      }}
    >
      {children}
    </div>
  );
}

interface StoryTextProps {
  children: ReactNode;
  className?: string;
  variant?: "headline" | "body" | "label";
  revealAt?: number;
  staggerIndex?: number;
  syncWithHero?: boolean;
}

export function StoryText({
  children,
  className = "",
  variant = "body",
  revealAt = 0.15,
  staggerIndex = 0,
  syncWithHero = false,
}: StoryTextProps) {
  const variantClass = `j-story-text--${variant}`;

  return (
    <StoryReveal
      className={`j-story-text ${variantClass} ${className}`.trim()}
      revealAt={revealAt}
      staggerIndex={staggerIndex}
      syncWithHero={syncWithHero}
      direction={variant === "headline" ? "scale" : "up"}
      duration={variant === "headline" ? "slow" : "normal"}
    >
      {children}
    </StoryReveal>
  );
}

interface StoryProgressIndicatorProps {
  className?: string;
  showLabels?: boolean;
  beatLabels?: string[];
}

export function StoryProgressIndicator({
  className = "",
  showLabels = false,
  beatLabels = ["Start", "Reveal", "Focus", "Intimate", "Close"],
}: StoryProgressIndicatorProps) {
  const { heroProgress } = useScrollProgress();
  const { tier } = useExperienceTier();

  if (tier !== "full") return null;

  const beats = [0, 0.25, 0.5, 0.75, 1];
  const currentBeatIndex = beats.findIndex((beat, i) => {
    const nextBeat = beats[i + 1] ?? 1;
    return heroProgress >= beat && heroProgress < nextBeat;
  });

  return (
    <div
      className={`j-story-progress pointer-events-none fixed right-4 top-1/2 z-50 -translate-y-1/2 ${className}`.trim()}
      aria-hidden
    >
      <div className="flex flex-col items-end gap-3">
        {beats.map((beat, i) => {
          const isActive = i === currentBeatIndex || (i === beats.length - 1 && heroProgress >= 1);
          const isPast = heroProgress > beat && i !== currentBeatIndex;

          return (
            <div key={beat} className="flex items-center gap-2">
              {showLabels && (
                <span
                  className={`j-story-progress-label text-[9px] font-medium uppercase tracking-[0.2em] transition-opacity duration-300 ${
                    isActive ? "opacity-80" : "opacity-0"
                  }`}
                >
                  {beatLabels[i] ?? ""}
                </span>
              )}
              <div
                className={`j-story-progress-dot h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "scale-150 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    : isPast
                      ? "bg-white/60"
                      : "bg-white/25"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
