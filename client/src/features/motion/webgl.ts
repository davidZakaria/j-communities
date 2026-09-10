/**
 * Returns true when WebGL2 or WebGL1 is available.
 * 
 * The URL parameter `?tier=full` forces WebGL detection to succeed when hardware
 * is available, even if the browser would normally block due to performance concerns.
 * 
 * Chrome is stricter than Edge about `failIfMajorPerformanceCaveat`, so we try
 * with the strict flag first, then fall back to a permissive probe if that fails.
 */
export function probeWebGL(): boolean {
  if (typeof document === "undefined") return false;
  if (import.meta.env?.MODE === "test") return false;

  const urlParams = typeof window !== "undefined" 
    ? new URLSearchParams(window.location.search) 
    : null;
  const forceFull = urlParams?.get("tier") === "full";

  try {
    const canvas = document.createElement("canvas");
    const getContext = canvas.getContext?.bind(canvas);
    if (!getContext) return false;

    const strictCtx =
      getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      getContext("webgl", { failIfMajorPerformanceCaveat: true });
    
    if (strictCtx) return true;

    if (forceFull) {
      const permissiveCtx =
        getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ??
        getContext("webgl", { failIfMajorPerformanceCaveat: false });
      return Boolean(permissiveCtx);
    }

    const permissiveCtx =
      getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ??
      getContext("webgl", { failIfMajorPerformanceCaveat: false });
    
    return Boolean(permissiveCtx);
  } catch {
    return false;
  }
}
