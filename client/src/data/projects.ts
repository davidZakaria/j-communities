import { jamilaImages, juraBrochure, juraImages, jamilaBrochure } from "../config/projectAssets";

export type ProjectCategory = "coastal" | "residential" | "mixed-use";
export type ProjectThemeId = "jura" | "jamila";

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  location?: string;
  summary: string;
  themeId: ProjectThemeId;
  tour3dUrl: string;
  cardImage: string;
  heroImage: string;
  brochureUrl?: string;
  contactEmail?: string;
  /** If set, the portfolio card opens this URL in a new tab instead of the on-site detail view. */
  externalUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "jura-sokhna",
    name: "Jura Sokhna",
    category: "coastal",
    location: "Ain Sokhna, Egypt",
    summary:
      "A seaside resort on 10 acres with 200 meters of sandy beach — fully finished, furnished units with direct sea views in Galala City.",
    themeId: "jura",
    tour3dUrl: "https://logica-itech.com/JURA/index.htm",
    cardImage: juraImages.hero,
    heroImage: juraImages.hero,
    brochureUrl: juraBrochure,
    contactEmail: "info@j-communities.com",
  },
  {
    slug: "jamila-north-coast",
    name: "Jamila North Coast",
    category: "coastal",
    location: "North Coast, Egypt",
    summary:
      "A breathtaking coastal retreat with direct sea views, 700 meters of beach front, and holistic living across 130 acres.",
    themeId: "jamila",
    tour3dUrl: "https://njdegypt.com/jamila360/HQ",
    cardImage: jamilaImages.hero,
    heroImage: jamilaImages.hero,
    brochureUrl: jamilaBrochure,
    contactEmail: "info@j-communities.com",
  },
];

export const categoryLabels: Record<
  ProjectCategory,
  { num: string; title: string; blurb: string }
> = {
  residential: {
    num: "01",
    title: "Residential Communities",
    blurb: "Neighborhoods designed for everyday life and lasting connection.",
  },
  coastal: {
    num: "02",
    title: "Coastal Developments",
    blurb: "Seaside living shaped by light, air, and the rhythm of the water.",
  },
  "mixed-use": {
    num: "03",
    title: "Mixed-Use Destinations",
    blurb: "Where residence, work, and culture meet in one vibrant address.",
  },
};

export function projectsByCategory(cat: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === cat);
}

export function getProjectBySlug(slug: string | undefined): Project | undefined {
  if (!slug) return undefined;
  return projects.find((p) => p.slug === slug);
}
