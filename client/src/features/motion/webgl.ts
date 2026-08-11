/** Returns true when WebGL2 or WebGL1 is available. */
export function probeWebGL(): boolean {
  if (typeof document === "undefined") return false;
  if (import.meta.env?.MODE === "test") return false;
  try {
    const canvas = document.createElement("canvas");
    const getContext = canvas.getContext?.bind(canvas);
    if (!getContext) return false;
    const ctx =
      getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      getContext("webgl", { failIfMajorPerformanceCaveat: true });
    return Boolean(ctx);
  } catch {
    return false;
  }
}
