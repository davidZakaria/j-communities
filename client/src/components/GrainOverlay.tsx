import { applyGlobalGrain } from "../config/lookFeel";

export function GrainOverlay() {
  if (!applyGlobalGrain) return null;
  return (
    <div className="j-grain" aria-hidden>
      <span className="sr-only">Film grain texture overlay</span>
    </div>
  );
}
