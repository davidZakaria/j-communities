/**
 * Official logo files (optional). Paths are under `client/public/`.
 * Leave empty strings to use the text marks in `Logo.tsx`.
 */
export const brand = {
  logoDarkUrl: "",
  /** Empty = text-only mark on the hero (recommended until final logo is ready). */
  logoLightUrl: "",
} as const;

export function brandLogoUrl(variant: "dark" | "light"): string | undefined {
  const url = variant === "dark" ? brand.logoDarkUrl : brand.logoLightUrl;
  const t = url.trim();
  return t.length > 0 ? t : undefined;
}
