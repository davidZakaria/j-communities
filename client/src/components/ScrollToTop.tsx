import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { clearProjectUrlHash, scheduleScrollToTop, scrollPageToTop } from "../utils/scrollToTop";

/**
 * New routes start at the top. Home hash links (/#projects) use HashScrollHandler.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    if (pathname.startsWith("/projects/")) {
      clearProjectUrlHash();
      scrollPageToTop();
      return scheduleScrollToTop();
    }

    if (pathname === "/" && hash) return;

    return scheduleScrollToTop();
  }, [pathname, hash]);

  return null;
}
