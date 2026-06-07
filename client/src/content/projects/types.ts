import type { ProjectThemeId } from "../../data/projects";

export interface ProjectNavItem {
  label: string;
  href: string;
}

export interface ProjectHeroSection {
  type: "hero";
  kicker?: string;
  title: string;
  subtitle?: string;
  body?: string;
  image: string;
  ctas?: { label: string; href: string; primary?: boolean }[];
}

export interface ProjectStatsSection {
  type: "stats";
  id?: string;
  items: { value: string; label: string }[];
}

export interface ProjectTextSection {
  type: "text";
  id?: string;
  kicker?: string;
  title?: string;
  body: string | string[];
  align?: "left" | "center";
}

export interface ProjectSplitSection {
  type: "split";
  id?: string;
  kicker?: string;
  title: string;
  body: string;
  image?: string;
  imagePosition?: "left" | "right";
}

export interface ProjectGatewaySection {
  type: "gateway";
  id?: string;
  title: string;
  items: { title: string; body: string }[];
}

export interface ProjectPropertyTypesSection {
  type: "propertyTypes";
  id?: string;
  title: string;
  items: { title: string; body: string }[];
}

export interface ProjectFloorPlansSection {
  type: "floorPlans";
  id?: string;
  title: string;
  items: { title: string; area: string; ctaLabel?: string }[];
}

export interface ProjectAmenitiesSection {
  type: "amenities";
  id?: string;
  title: string;
  items: { title: string; body?: string }[];
}

export interface ProjectMasterplanSection {
  type: "masterplan";
  id?: string;
  title: string;
  image: string;
  buildings?: { id: string; title: string; body: string }[];
}

export interface ProjectGallerySection {
  type: "gallery";
  id?: string;
  title: string;
  images: { src: string; alt: string }[];
}

export interface ProjectTour3DSection {
  type: "tour3d";
  id?: string;
  title: string;
  subtitle?: string;
  url: string;
}

export interface ProjectPartnersSection {
  type: "partners";
  id?: string;
  title: string;
  names: string[];
}

export interface ProjectContactSection {
  type: "contact";
  id?: string;
  title: string;
  subtitle?: string;
  email: string;
}

export type ProjectSection =
  | ProjectHeroSection
  | ProjectStatsSection
  | ProjectTextSection
  | ProjectSplitSection
  | ProjectGatewaySection
  | ProjectPropertyTypesSection
  | ProjectFloorPlansSection
  | ProjectAmenitiesSection
  | ProjectMasterplanSection
  | ProjectGallerySection
  | ProjectTour3DSection
  | ProjectPartnersSection
  | ProjectContactSection;

export interface ProjectPageContent {
  themeId: ProjectThemeId;
  meta: {
    title: string;
    description: string;
    ogImage?: string;
  };
  nav: ProjectNavItem[];
  sections: ProjectSection[];
}
