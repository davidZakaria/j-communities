import type { ReactNode } from "react";

/**
 * Fluid layout up to the Look & Feel comp width (1920). No CSS zoom — scales cleanly
 * at any window size from phones to ultrawide.
 */
export function LookFeelCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="lf-canvas relative mx-auto box-border w-full min-w-0 max-w-[1920px] bg-j-black text-j-offwhite">
      {children}
    </div>
  );
}
