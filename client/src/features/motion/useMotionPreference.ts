import { useEffect, useState } from "react";
import type { MotionPreferences } from "./types";
import { probeWebGL } from "./webgl";

const LG_MQ = "(min-width: 1024px)";
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const COARSE_MQ = "(pointer: coarse)";

function readPreferences(): MotionPreferences {
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia(REDUCED_MQ).matches;
  const coarsePointer =
    typeof window !== "undefined" && window.matchMedia(COARSE_MQ).matches;
  const largeViewport =
    typeof window !== "undefined" && window.matchMedia(LG_MQ).matches;
  const finePointer = typeof window !== "undefined" && !coarsePointer;
  const saveData =
    typeof navigator !== "undefined" &&
    "connection" in navigator &&
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

  return {
    reducedMotion,
    coarsePointer,
    saveData,
    largeViewport,
    finePointer,
    webglAvailable: probeWebGL(),
  };
}

export function resolveExperienceTier(prefs: MotionPreferences): ExperienceTier {
  if (prefs.reducedMotion || prefs.saveData) return "static";
  if (prefs.largeViewport && prefs.webglAvailable) return "full";
  if (prefs.largeViewport) return "light";
  return "light";
}

export function useMotionPreference(): MotionPreferences {
  const [prefs, setPrefs] = useState<MotionPreferences>(() =>
    typeof window === "undefined"
      ? {
          reducedMotion: false,
          coarsePointer: true,
          saveData: false,
          largeViewport: false,
          finePointer: false,
          webglAvailable: false,
        }
      : readPreferences(),
  );

  useEffect(() => {
    const update = () => setPrefs(readPreferences());
    update();

    const mqs = [LG_MQ, REDUCED_MQ, COARSE_MQ].map((q) => window.matchMedia(q));
    mqs.forEach((mq) => mq.addEventListener("change", update));
    window.addEventListener("resize", update);

    return () => {
      mqs.forEach((mq) => mq.removeEventListener("change", update));
      window.removeEventListener("resize", update);
    };
  }, []);

  return prefs;
}
