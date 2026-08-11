import { type ReactNode, useEffect } from "react";
import { getProjectTheme, type ProjectTheme } from "../../config/projectThemes";
import type { ProjectThemeId } from "../../data/projects";

interface ProjectThemeProviderProps {
  themeId: ProjectThemeId;
  children: ReactNode;
}

export function ProjectThemeProvider({ themeId, children }: ProjectThemeProviderProps) {
  const theme = getProjectTheme(themeId);

  useEffect(() => {
    document.body.classList.add("project-page-active");
    document.body.style.setProperty("--project-bg", theme.colors.bg);
    document.body.style.setProperty("--project-text", theme.colors.text);

    const linkIds = theme.fonts.stylesheetUrls.map((_, i) => `project-font-${themeId}-${i}`);
    const links: HTMLLinkElement[] = [];

    theme.fonts.stylesheetUrls.forEach((url, i) => {
      const linkId = linkIds[i];
      let link = document.getElementById(linkId) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      link.href = url;
      links.push(link);
    });

    return () => {
      document.body.classList.remove("project-page-active");
      document.body.style.removeProperty("--project-bg");
      document.body.style.removeProperty("--project-text");
    };
  }, [themeId, theme.colors.bg, theme.colors.text, theme.fonts.stylesheetUrls]);

  return (
    <div
      className="project-theme min-h-screen"
      data-project-theme={themeId}
      style={themeVars(theme)}
    >
      {children}
    </div>
  );
}

function themeVars(theme: ProjectTheme): React.CSSProperties {
  return {
    ["--project-bg" as string]: theme.colors.bg,
    ["--project-surface" as string]: theme.colors.surface,
    ["--project-surface-alt" as string]: theme.colors.surfaceAlt,
    ["--project-text" as string]: theme.colors.text,
    ["--project-muted" as string]: theme.colors.muted,
    ["--project-accent" as string]: theme.colors.accent,
    ["--project-accent-hover" as string]: theme.colors.accentHover,
    ["--project-accent-contrast" as string]: theme.colors.accentContrast,
    ["--project-border" as string]: theme.colors.border,
    ["--project-hero-overlay" as string]: theme.colors.heroOverlay,
    ["--project-accent-alt" as string]: theme.colors.accentAlt ?? theme.colors.accent,
    ["--project-font-heading" as string]: theme.fonts.heading,
    ["--project-font-body" as string]: theme.fonts.body,
    backgroundColor: theme.colors.bg,
    color: theme.colors.text,
    fontFamily: theme.fonts.body,
  };
}
