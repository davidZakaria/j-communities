import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface GrowSectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function useNarrowViewport(): boolean {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 1023px)").matches : false,
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return narrow;
}

export function GrowSection({ children, className = "", style }: GrowSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const narrow = useNarrowViewport();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.visualViewport?.height ?? window.innerHeight;
    if (rect.top < vh * 1.05 && rect.bottom > -vh * 0.1) {
      setShown(true);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px 20% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  const motionClass =
    shown ? (narrow ? "opacity-100" : "j-grow-in") : "opacity-0 max-lg:!opacity-100 max-lg:!translate-y-0 max-lg:!scale-100";

  return (
    <div ref={ref} className={`${motionClass} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
