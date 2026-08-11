import type { ProjectThemeId } from "../../data/projects";
import { getProjectBrandGuidelines } from "../../config/projectBrandGuidelines";

interface ProjectLogoProps {
  themeId: ProjectThemeId;
  className?: string;
}

export function ProjectLogo({ themeId, className = "" }: ProjectLogoProps) {
  const brand = getProjectBrandGuidelines(themeId);
  const label = themeId === "jura" ? "Jura" : "Jamila";
  /** Both project headers are dark — use the on-dark lockup when available. */
  const src = brand.logo.onDarkUrl ?? brand.logo.markUrl;

  return (
    <img
      src={src}
      alt={`${label} logo`}
      className={`j-project-logo j-project-logo--${themeId} ${className}`.trim()}
      decoding="async"
    />
  );
}
