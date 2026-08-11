import type { ProjectThemeId } from "../data/projects";
import { getProjectBrandGuidelines } from "./projectBrandGuidelines";

export interface ProjectTheme {
  id: ProjectThemeId;
  label: string;
  fonts: {
    heading: string;
    body: string;
    stylesheetUrls: string[];
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
    accentAlt?: string;
  };
}

const JURA = getProjectBrandGuidelines("jura").palette;
const JAMILA = getProjectBrandGuidelines("jamila").palette;

const juraDarkJungle = JURA.find((c) => c.name === "Dark Jungle")!.hex;
const juraBluishCyan = JURA.find((c) => c.name === "Bluish Cyan")!.hex;
const juraDeepSea = JURA.find((c) => c.name === "Deep Sea")!.hex;
const juraHemlock = JURA.find((c) => c.name === "Hemlock")!.hex;
const juraRedFox = JURA.find((c) => c.name === "Red Fox")!.hex;
const juraTigerEye = JURA.find((c) => c.name === "Tiger Eye")!.hex;
const juraWhite = JURA.find((c) => c.name === "White")!.hex;

const jamilaYale = JAMILA.find((c) => c.name === "Yale Blue")!.hex;
const jamilaLemon = JAMILA.find((c) => c.name === "Lemon Glacier")!.hex;
const jamilaBlueGreen = JAMILA.find((c) => c.name === "Blue-Green")!.hex;
const jamilaOrangeRed = JAMILA.find((c) => c.name === "Orange-Red")!.hex;
const jamilaMaxBlueGreen = JAMILA.find((c) => c.name === "Maximum Blue Green")!.hex;
const jamilaWhite = JAMILA.find((c) => c.name === "White")!.hex;

/** Jura CI — Dark Jungle base, Deep Sea / Bluish Cyan surfaces, Tiger Eye accent (brand guidelines p.14–15) */
export const projectThemes: Record<ProjectThemeId, ProjectTheme> = {
  jura: {
    id: "jura",
    label: "Jura Sokhna",
    fonts: {
      heading: "'Cabrito Serif', 'Fraunces', Georgia, serif",
      body: "'Metropolis', 'DM Sans', system-ui, sans-serif",
      stylesheetUrls: [
        "https://fonts.cdnfonts.com/css/metropolis-2",
        "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&display=swap",
      ],
    },
    colors: {
      bg: juraDarkJungle,
      surface: juraBluishCyan,
      surfaceAlt: juraDeepSea,
      text: juraWhite,
      muted: "#c9bfb0",
      accent: juraTigerEye,
      accentHover: juraRedFox,
      accentContrast: juraWhite,
      accentAlt: juraHemlock,
      border: "rgba(232, 145, 48, 0.22)",
      heroOverlay:
        "linear-gradient(180deg, rgba(31,33,31,0.15) 0%, rgba(10,46,64,0.55) 45%, rgba(10,92,92,0.82) 100%)",
    },
  },
  jamila: {
    id: "jamila",
    label: "Jamila North Coast",
    fonts: {
      heading: "'Cosmica', 'Plus Jakarta Sans', system-ui, sans-serif",
      body: "'Cosmica', 'Plus Jakarta Sans', system-ui, sans-serif",
      stylesheetUrls: [
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
      ],
    },
    colors: {
      bg: "#F5F9FD",
      surface: jamilaWhite,
      surfaceAlt: "#E8F1FA",
      text: jamilaYale,
      muted: "#5A7088",
      accent: jamilaYale,
      accentHover: jamilaBlueGreen,
      accentContrast: jamilaWhite,
      accentAlt: jamilaOrangeRed,
      border: "rgba(26,66,132,0.14)",
      heroOverlay: `linear-gradient(180deg, color-mix(in srgb, ${jamilaYale} 35%, transparent) 0%, color-mix(in srgb, ${jamilaYale} 68%, transparent) 100%)`,
    },
  },
};

export const jamilaHighlightColor = jamilaLemon;
export const jamilaTealAccent = jamilaMaxBlueGreen;

export function getProjectTheme(id: ProjectThemeId): ProjectTheme {
  return projectThemes[id];
}
