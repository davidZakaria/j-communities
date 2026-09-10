import { useCallback, useEffect, useState } from "react";

export interface PointerOffset {
  x: number;
  y: number;
}

export interface UsePointerParallaxOptions {
  enabled?: boolean;
  sensitivity?: number;
  smoothing?: number;
}

const DEFAULT_OPTIONS: Required<UsePointerParallaxOptions> = {
  enabled: true,
  sensitivity: 1,
  smoothing: 0.1,
};

export function usePointerParallax(
  options: UsePointerParallaxOptions = {},
): PointerOffset {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [offset, setOffset] = useState<PointerOffset>({ x: 0, y: 0 });
  const [target, setTarget] = useState<PointerOffset>({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!opts.enabled) return;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const normalizedX = ((e.clientX - centerX) / centerX) * opts.sensitivity;
      const normalizedY = ((e.clientY - centerY) / centerY) * opts.sensitivity;

      setTarget({ x: normalizedX, y: normalizedY });
    },
    [opts.enabled, opts.sensitivity],
  );

  const handlePointerLeave = useCallback(() => {
    setTarget({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!opts.enabled) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [opts.enabled, handlePointerMove, handlePointerLeave]);

  useEffect(() => {
    if (!opts.enabled) return;

    let rafId: number;
    const animate = () => {
      setOffset((prev) => ({
        x: prev.x + (target.x - prev.x) * opts.smoothing,
        y: prev.y + (target.y - prev.y) * opts.smoothing,
      }));
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [opts.enabled, opts.smoothing, target]);

  return offset;
}
