/** Self-hosted project art under `public/assets/projects/`. */

const JURA = "/assets/projects/jura";
const JAMILA = "/assets/projects/jamila";

const NJ = "https://njdegypt.com/wp-content/uploads";

/** Jura gallery — construction renders only (matches njdegypt.com/en/jura/). */
export const juraGalleryImages = [
  { src: `${JURA}/gallery-1.webp`, alt: "Jura Sokhna — construction render 1" },
  { src: `${JURA}/gallery-2.webp`, alt: "Jura Sokhna — construction render 2" },
  { src: `${JURA}/gallery-3.webp`, alt: "Jura Sokhna — construction render 3" },
  { src: `${JURA}/gallery-4.webp`, alt: "Jura Sokhna — construction render 4" },
  { src: `${JURA}/gallery-5.webp`, alt: "Jura Sokhna — construction render 5" },
  { src: `${JURA}/gallery-6.webp`, alt: "Jura Sokhna — construction render 6" },
  { src: `${JURA}/gallery-7.webp`, alt: "Jura Sokhna — construction render 7" },
  { src: `${JURA}/gallery-8.webp`, alt: "Jura Sokhna — construction render 8" },
  { src: `${JURA}/gallery-9.webp`, alt: "Jura Sokhna — construction render 9" },
  { src: `${JURA}/gallery-10.webp`, alt: "Jura Sokhna — construction render 10" },
  { src: `${JURA}/gallery-11.webp`, alt: "Jura Sokhna — construction render 11" },
  { src: `${JURA}/gallery-12.webp`, alt: "Jura Sokhna — construction render 12" },
  { src: `${JURA}/gallery-13.webp`, alt: "Jura Sokhna — construction render 13" },
  { src: `${JURA}/gallery-14.webp`, alt: "Jura Sokhna — construction render 14" },
  { src: `${JURA}/gallery-15.webp`, alt: "Jura Sokhna — site progress render" },
  { src: `${JURA}/gallery-16.webp`, alt: "Jura Sokhna — development render" },
  { src: `${JURA}/gallery-17.webp`, alt: "Jura Sokhna — coastal construction render" },
  { src: `${JURA}/gallery-18.webp`, alt: "Jura Sokhna — aerial construction view" },
  { src: `${JURA}/gallery-19.webp`, alt: "Jura Sokhna — building render — cam 04" },
  { src: `${JURA}/gallery-20.webp`, alt: "Jura Sokhna — building render — cam 05" },
  { src: `${JURA}/gallery-21.webp`, alt: "Jura Sokhna — building render — cam 07" },
] as const;

export const juraImages = {
  card: `${JURA}/hero.webp`,
  hero: `${JURA}/ci-extract-21.jpeg`,
  galala: `${JURA}/ci-extract-20.jpeg`,
  masterplan: `${JURA}/masterplan.webp`,
  location: `${JURA}/ci-extract-19.jpeg`,
  gallery: juraGalleryImages.map((item) => item.src),
} as const;

/** Jamila gallery — construction renders only (matches njdegypt.com/en/jamila/). */
export const jamilaGalleryImages = [
  { src: `${JAMILA}/gallery-1.webp`, alt: "Jamila North Coast — zone render" },
  { src: `${JAMILA}/gallery-2.webp`, alt: "Jamila North Coast — building close-up" },
  { src: `${JAMILA}/gallery-3.webp`, alt: "Jamila North Coast — zone render" },
  { src: `${JAMILA}/gallery-4.webp`, alt: "Jamila North Coast — construction render" },
  { src: `${JAMILA}/gallery-6.webp`, alt: "Jamila North Coast — development render" },
  { src: `${JAMILA}/gallery-5.webp`, alt: "Jamila North Coast — amenity render" },
  { src: `${JAMILA}/gallery-7.webp`, alt: "Jamila North Coast — plaza render" },
  { src: `${JAMILA}/gallery-8.webp`, alt: "Jamila North Coast — outdoor gym render" },
  { src: `${JAMILA}/gallery-9.webp`, alt: "Jamila North Coast — lagoon render" },
] as const;

export const jamilaImages = {
  card: `${JAMILA}/gallery-2.webp`,
  /** njdegypt hero — Roof Night aerial render (not CI lifestyle mockups) */
  hero: `${JAMILA}/hero.webp`,
  heroAlt: `${JAMILA}/gallery-9.webp`,
  masterplan: `${JAMILA}/masterplan.webp`,
  location: `${JAMILA}/location.webp`,
  gallery: jamilaGalleryImages.map((item) => item.src),
} as const;

export const juraBrochure = `${NJ}/2024/11/Jura-Brochure.pdf`;
export const jamilaBrochure = `${NJ}/2024/11/Jamila-Brochure-Rev.pdf`;
