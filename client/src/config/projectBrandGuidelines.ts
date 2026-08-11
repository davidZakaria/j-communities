/**
 * Official Jura & Jamila brand tokens extracted from PDF guidelines
 * (`docs/brand/` and `client/public/brand/guidelines/`).
 *
 * Typography note: Cabrito Serif, Cosmica, and Metropolis are licensed commercial
 * faces. We load Metropolis (OFL) from CDN; headings use documented fallbacks until
 * WOFF files are supplied.
 */
import type { ProjectThemeId } from "../data/projects";

export interface BrandColorSwatch {
  name: string;
  hex: string;
}

export interface ProjectBrandGuidelines {
  id: ProjectThemeId;
  sourcePdf: string;
  typography: {
    primary: string;
    secondary?: string;
    notes: string;
  };
  palette: BrandColorSwatch[];
  logo: {
    markUrl: string;
    onDarkUrl?: string;
    clearSpace: string;
  };
}

/** Jura Brand Guidelines — page 14 LOGO COLOR PALETTE (RGB/HEX for web) */
export const juraBrandGuidelines: ProjectBrandGuidelines = {
  id: "jura",
  sourcePdf: "Jura Brand Guidelines.pdf",
  typography: {
    primary: "Cabrito Serif",
    secondary: "Metropolis",
    notes: "Headings: Cabrito Serif Ext. Body: Metropolis Light/Regular/Semi Bold.",
  },
  palette: [
    { name: "Bluish Cyan", hex: "#0A2E40" },
    { name: "Deep Sea", hex: "#0A5C5C" },
    { name: "Dark Jungle", hex: "#1F211F" },
    { name: "Hemlock", hex: "#5E5929" },
    { name: "Red Fox", hex: "#C7521C" },
    { name: "Tiger Eye", hex: "#E89130" },
    { name: "White", hex: "#FFFFFF" },
  ],
  logo: {
    markUrl: "/brand/jura/logo-mark.png",
    onDarkUrl: "/brand/jura/logo-on-dark.png",
    clearSpace: "Separation on all sides ≈ letter width of the logotype.",
  },
};

/** Jamila Brand Guidelines — page 13 LOGO COLOR PALETTE (RGB/HEX for web) */
export const jamilaBrandGuidelines: ProjectBrandGuidelines = {
  id: "jamila",
  sourcePdf: "JAMILA Brand Guidelines.pdf",
  typography: {
    primary: "Cosmica",
    notes: "Single primary face — Light, Regular, Bold for headlines and body.",
  },
  palette: [
    { name: "Yale Blue", hex: "#1A4284" },
    { name: "Lemon Glacier", hex: "#DDFF00" },
    { name: "Blue-Green", hex: "#0889A7" },
    { name: "Orange-Red", hex: "#FF3C26" },
    { name: "Maximum Blue Green", hex: "#20B6B5" },
    { name: "Red (RYB)", hex: "#E43620" },
    { name: "White", hex: "#FFFFFF" },
  ],
  logo: {
    /** Official lockup — Lemon Glacier + NORTH COAST (Asset-3 from brand materials) */
    markUrl: "/brand/jamila/logo-on-dark.webp",
    onDarkUrl: "/brand/jamila/logo-on-dark.webp",
    clearSpace: "Separation on all sides ≈ letter width of the logotype.",
  },
};

export const projectBrandGuidelines: Record<ProjectThemeId, ProjectBrandGuidelines> = {
  jura: juraBrandGuidelines,
  jamila: jamilaBrandGuidelines,
};

export function getProjectBrandGuidelines(id: ProjectThemeId): ProjectBrandGuidelines {
  return projectBrandGuidelines[id];
}
