import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { scrollPageToTop } from "../../utils/scrollToTop";
import { useExperienceTier } from "./ExperienceTierContext";

interface MotionScrollContextValue {
  scrollY: number;
}

const MotionScrollContext = createContext<MotionScrollContextValue>({ scrollY: 0 });

export function useMotionScrollY(): number {
  return useContext(MotionScrollContext).scrollY;
}

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const { enableLenis } = useExperienceTier();
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!enableLenis) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }

      const onNativeScroll = () => setScrollY(window.scrollY);
      onNativeScroll();
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      window.addEventListener("resize", onNativeScroll);
      return () => {
        window.removeEventListener("scroll", onNativeScroll);
        window.removeEventListener("resize", onNativeScroll);
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 0,
    });
    lenisRef.current = lenis;

    const onLenisScroll = () => setScrollY(lenis.scroll);
    lenis.on("scroll", onLenisScroll);
    onLenisScroll();

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enableLenis]);

  useEffect(() => {
    scrollPageToTop();
    setScrollY(0);
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <MotionScrollContext.Provider value={{ scrollY }}>{children}</MotionScrollContext.Provider>
  );
}
