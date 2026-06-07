/** Reset window scroll — use on route changes and project page mount. */
export function scrollPageToTop(): void {
  if (typeof window === "undefined") return;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  try {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  } catch {
    try {
      window.scrollTo(0, 0);
    } catch {
      /* jsdom */
    }
  }

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Strip #gallery / #amenities etc. so the browser does not anchor mid-page. */
export function clearProjectUrlHash(): void {
  if (typeof window === "undefined") return;
  if (!window.location.pathname.startsWith("/projects/")) return;
  if (!window.location.hash) return;
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

/** Re-apply scroll reset after layout/images settle. */
export function scheduleScrollToTop(extraDelaysMs: number[] = [50, 150, 400, 800]): () => void {
  scrollPageToTop();
  const raf = requestAnimationFrame(scrollPageToTop);
  const timers = extraDelaysMs.map((ms) => window.setTimeout(scrollPageToTop, ms));
  return () => {
    cancelAnimationFrame(raf);
    timers.forEach((id) => window.clearTimeout(id));
  };
}

export function bootstrapProjectPageScroll(): void {
  clearProjectUrlHash();
  scrollPageToTop();
}

export function attachProjectScrollGuards(): void {
  if (typeof window === "undefined") return;
  if (!window.location.pathname.startsWith("/projects/")) return;

  const top = () => bootstrapProjectPageScroll();
  window.addEventListener("pageshow", top);
  window.addEventListener("load", top);
}
