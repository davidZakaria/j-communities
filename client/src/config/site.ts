/**
 * Public site defaults. Set VITE_SITE_ORIGIN in .env (e.g. https://www.yourdomain.com)
 * so Open Graph and canonical URLs resolve correctly in production.
 */
const raw = import.meta.env.VITE_SITE_ORIGIN as string | undefined;
export const siteOrigin = (raw?.replace(/\/$/, "") || "https://www.j-communities.com").trim();

export const site = {
  origin: siteOrigin,
  name: "J Communities",
  defaultTitle: "J Communities",
  description:
    "J Communities — forward-thinking real estate creating vibrant, human-centered living experiences across Egypt and New Jersey.",
  /** Swap for your live company profiles when ready. */
  social: {
    facebook: "https://www.facebook.com/jcommunitiesofficial/",
    instagram: "https://www.instagram.com/jcommunities_/",
    linkedin: "https://www.linkedin.com/company/j-communities/",
  },
  /** Used for og:image; absolute URL built at runtime in DocumentMeta. */
  ogImagePath: "/favicon.svg",
} as const;

export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteOrigin}${path}`;
}
