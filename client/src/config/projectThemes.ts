import type { ProjectThemeId } from "../data/projects";

export interface ProjectTheme {
  id: ProjectThemeId;
  label: string;
  fonts: {
    heading: string;
    body: string;
    googleUrl: string;
  };
  colors: {
    bg: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    muted: string;
    accent: string;
    accentHover: string;
    accentContrast: string;
    border: string;
    heroOverlay: string;
  };
}

export const projectThemes: Record<ProjectThemeId, ProjectTheme> = {
  jura: {
    id: "jura",
    label: "Jura Sokhna",
    fonts: {
      heading: "'Cormorant Garamond', Georgia, serif",
      body: "'Lato', system-ui, sans-serif",
      googleUrl:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap",
    },
    colors: {
      bg: "#14100c",
      surface: "#1c1610",
      surfaceAlt: "#261e16",
      text: "#faf6f2",
      muted: "#b8a898",
      accent: "#e07a3a",
      accentHover: "#c96828",
      accentContrast: "#ffffff",
      border: "rgba(255,255,255,0.12)",
      heroOverlay:
        "linear-gradient(180deg, rgba(20,12,6,0.5) 0%, rgba(20,12,6,0.78) 100%)",
    },
  },
  jamila: {
    id: "jamila",
    label: "Jamila North Coast",
    fonts: {
      heading: "'Playfair Display', Georgia, serif",
      body: "'Montserrat', system-ui, sans-serif",
      googleUrl:
        "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
    },
    colors: {
      bg: "#f2f7fc",
      surface: "#ffffff",
      surfaceAlt: "#e3eef8",
      text: "#0f1a28",
      muted: "#5a7088",
      accent: "#2b6cb0",
      accentHover: "#1e5590",
      accentContrast: "#ffffff",
      border: "rgba(15,26,40,0.12)",
      heroOverlay:
        "linear-gradient(180deg, rgba(8,24,48,0.35) 0%, rgba(8,24,48,0.65) 100%)",
    },
  },
};

export function getProjectTheme(id: ProjectThemeId): ProjectTheme {
  return projectThemes[id];
}
