/** Self-hosted project art under `public/assets/projects/`. */

const JURA = "/assets/projects/jura";
const JAMILA = "/assets/projects/jamila";

/** Brochure PDFs (external until hosted locally). */
const NJ = "https://njdegypt.com/wp-content/uploads";

export const juraImages = {
  hero: `${JURA}/hero.webp`,
  galala: `${JURA}/galala.webp`,
  masterplan: `${JURA}/masterplan.webp`,
  location: `${JURA}/location.webp`,
  gallery: [
    `${JURA}/gallery-1.webp`,
    `${JURA}/gallery-2.webp`,
    `${JURA}/gallery-3.webp`,
    `${JURA}/gallery-4.webp`,
    `${JURA}/gallery-5.webp`,
    `${JURA}/gallery-6.webp`,
  ],
} as const;

export const jamilaImages = {
  hero: `${JAMILA}/hero.webp`,
  heroAlt: `${JAMILA}/hero.webp`,
  masterplan: `${JAMILA}/masterplan.webp`,
  location: `${JAMILA}/location.webp`,
  gallery: [
    `${JAMILA}/gallery-1.webp`,
    `${JAMILA}/gallery-2.webp`,
    `${JAMILA}/gallery-3.webp`,
    `${JAMILA}/gallery-4.webp`,
    `${JAMILA}/gallery-5.webp`,
    `${JAMILA}/gallery-6.webp`,
  ],
} as const;

export const juraBrochure = `${NJ}/2024/11/Jura-Brochure.pdf`;
export const jamilaBrochure = `${NJ}/2024/11/Jamila-Brochure-Rev.pdf`;
