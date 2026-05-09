import { brandLogoUrl } from "../config/brand";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  heightClass?: string;
  /** Tighter mark for small headers (e.g. mobile hero). */
  compact?: boolean;
}

/**
 * Uses `brand.ts` image URLs when set; otherwise a text mark (no stretch).
 */
export function Logo({
  variant = "dark",
  className = "",
  heightClass = "h-[var(--logo-height)]",
  compact = false,
}: LogoProps) {
  const src = brandLogoUrl(variant);
  const text = variant === "dark" ? "text-j-black" : "text-j-offwhite";
  const pad = compact ? "0.25rem 0.375rem" : `var(--logo-clear-min) var(--logo-clear-std)`;

  if (src) {
    return (
      <div
        className={`inline-flex items-center ${className}`}
        style={{
          padding: pad,
        }}
      >
        <img
          src={src}
          alt="J Communities"
          className={`j-logo ${heightClass} w-auto max-w-none object-contain object-left`}
        />
      </div>
    );
  }

  const textMark = compact
    ? `font-semibold tracking-[0.28em] ${text} font-serif text-[10px] drop-shadow-md sm:text-[11px]`
    : `font-semibold tracking-[0.34em] ${text} font-serif text-[11px] drop-shadow-md md:text-[12px]`;

  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{
        padding: pad,
      }}
    >
      <span className={`j-logo ${heightClass} w-auto select-none ${textMark}`} aria-label="J Communities">
        J COMMUNITIES
      </span>
    </div>
  );
}
