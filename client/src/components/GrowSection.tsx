import { type CSSProperties, type ReactNode } from "react";

interface GrowSectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Hero / above-fold blocks — always visible, uses legacy grow-in animation. */
export function GrowSection({ children, className = "", style }: GrowSectionProps) {
  return (
    <div className={`j-grow-in opacity-100 ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
