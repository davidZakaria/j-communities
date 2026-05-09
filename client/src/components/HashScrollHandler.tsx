import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router often skips scrolling when only the hash changes (or after async layout).
 * Ensures in-page targets (e.g. /#projects) come into view on the home page.
 */
export function HashScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash || pathname !== "/") return;
    const id = hash.replace(/^#/, "");
    if (!id) return;

    const scroll = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    scroll();
    const raf = requestAnimationFrame(scroll);
    const t1 = window.setTimeout(scroll, 0);
    const t2 = window.setTimeout(scroll, 120);
    const t3 = window.setTimeout(scroll, 400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [pathname, hash]);

  return null;
}
