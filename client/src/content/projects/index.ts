import type { ProjectThemeId } from "../../data/projects";
import { jamilaContent } from "./jamila";
import { juraContent } from "./jura";
import type { ProjectPageContent } from "./types";

const contentByTheme: Record<ProjectThemeId, ProjectPageContent> = {
  jura: juraContent,
  jamila: jamilaContent,
};

export function getProjectContent(themeId: ProjectThemeId): ProjectPageContent {
  return contentByTheme[themeId];
}

export type { ProjectPageContent, ProjectSection } from "./types";
