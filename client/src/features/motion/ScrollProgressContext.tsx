import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useMotionScrollY } from "./LenisProvider";

interface ScrollProgressContextValue {
  progress: number;
  heroProgress: number;
  registerHero: (el: HTMLElement | null) => void;
}

const ScrollProgressContext = createContext<ScrollProgressContextValue>({
  progress: 0,
  heroProgress: 0,
  registerHero: () => {},
});

export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const scrollY = useMotionScrollY();
  const [progress, setProgress] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
  const [heroEl, setHeroEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    setProgress(max > 0 ? scrollY / max : 0);

    if (heroEl) {
      const heroH = heroEl.offsetHeight || 1;
      const rect = heroEl.getBoundingClientRect();
      const scrolled = Math.min(Math.max(-rect.top, 0), heroH);
      setHeroProgress(Math.min(scrolled / heroH, 1));
    }
  }, [scrollY, heroEl]);

  useEffect(() => {
    const onResize = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? scrollY / max : 0);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scrollY]);

  return (
    <ScrollProgressContext.Provider
      value={{
        progress,
        heroProgress,
        registerHero: setHeroEl,
      }}
    >
      {children}
    </ScrollProgressContext.Provider>
  );
}

export function useScrollProgress() {
  return useContext(ScrollProgressContext);
}
