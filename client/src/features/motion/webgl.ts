/** Returns true when WebGL2 or WebGL1 is available. */
export function probeWebGL(): boolean {
  if (typeof document === "undefined") return false;
  if (import.meta.env?.MODE === "test") return false;
  try {
    const canvas = document.createElement("canvas");
    const getContext = canvas.getContext?.bind(canvas);
    if (!getContext) return false;

    // Relax performance caveat check when ?tier=full is set for local review
    const params = new URLSearchParams(window.location.search);
    const forceFullTier = params.get("tier") === "full";
    const failIfMajorPerformanceCaveat = !forceFullTier;

    const ctx =
      getContext("webgl2", { failIfMajorPerformanceCaveat }) ??
      getContext("webgl", { failIfMajorPerformanceCaveat });
    return Boolean(ctx);
  } catch {
    return false;
  }
}
