import { type CSSProperties, type ReactNode } from "react";

interface GrowSectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Scroll-reveal wrapper. Content stays visible; motion is transform-only (see `.j-grow-in`).
 */
export function GrowSection({ children, className = "", style }: GrowSectionProps) {
  return (
    <div className={`j-grow-in opacity-100 ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
