import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { resolveExperienceTier, useMotionPreference } from "./useMotionPreference";
import type { ExperienceTier } from "./types";

interface ExperienceTierContextValue {
  tier: ExperienceTier;
  enableLenis: boolean;
  enableWebGL: boolean;
  parallaxMaxPx: number;
}

const ExperienceTierContext = createContext<ExperienceTierContextValue>({
  tier: "light",
  enableLenis: false,
  enableWebGL: false,
  parallaxMaxPx: 8,
});

export function ExperienceTierProvider({ children }: { children: ReactNode }) {
  const prefs = useMotionPreference();
  const tier = resolveExperienceTier(prefs);

  const value = useMemo<ExperienceTierContextValue>(() => {
    const enableWebGL = tier === "full";
    const enableLenis = tier === "full";
    const parallaxMaxPx = tier === "full" ? 160 : tier === "light" ? 64 : 0;
    return { tier, enableLenis, enableWebGL, parallaxMaxPx };
  }, [tier]);

  return (
    <ExperienceTierContext.Provider value={value}>{children}</ExperienceTierContext.Provider>
  );
}

export function useExperienceTier(): ExperienceTierContextValue {
  return useContext(ExperienceTierContext);
}
