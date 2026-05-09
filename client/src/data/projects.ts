export type ProjectCategory = "coastal" | "residential" | "mixed-use";

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  location?: string;
  summary: string;
  /** If set, the portfolio card opens this URL in a new tab instead of the on-site detail view. */
  externalUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "jura-sokhna",
    name: "Jura Sokhna",
    category: "coastal",
    location: "Ain Sokhna, Egypt",
    summary: "A waterfront rhythm of terraces, sea air, and calmer day-to-day living along the Red Sea coast.",
  },
  {
    slug: "jamila-north-coast",
    name: "Jamila North Coast",
    category: "coastal",
    location: "North Coast, Egypt",
    summary: "Summer-residence energy with generous setbacks, club conveniences, and long Mediterranean views.",
  },
  {
    slug: "reiki-beach",
    name: "Reiki Beach",
    category: "coastal",
    location: "Egypt",
    summary: "Low, layered architecture and soft landscaping designed to keep the shoreline in focus.",
  },
  {
    slug: "green-avenue",
    name: "Green Avenue",
    category: "residential",
    location: "Egypt",
    summary: "Tree-lined avenues, walkable blocks, and family-scaled homes within one coherent community fabric.",
  },
  {
    slug: "soul-nasr-city",
    name: "Soul Nasr City",
    category: "residential",
    location: "Nasr City, Cairo",
    summary: "Urban residential calibrated for proximity to work, schools, and daily rituals without losing quiet.",
  },
  {
    slug: "green-icon",
    name: "Green Icon",
    category: "mixed-use",
    location: "Egypt",
    summary: "Retail frontage, office daylight, and residences stacked with clear circulation and shared amenity.",
  },
  {
    slug: "genesis-tower",
    name: "Genesis Tower",
    category: "mixed-use",
    location: "Egypt",
    summary: "A vertical address mixing hospitality cues, workspace, and residences above a lively arrival base.",
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
