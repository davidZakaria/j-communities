/**
 * Final Look & Feel — copy aligned to the approved full-page comp.
 */

export const PILLAR_CATEGORIES = [
  { num: "01", label: "Jura Sokhna", to: "/projects/jura-sokhna" as const },
  { num: "02", label: "Jamila North Coast", to: "/projects/jamila" as const },
  { num: "03", label: "Coastal living", to: "/#projects" as const },
] as const;

export const COPY = {
  hero: {
    nav: [
      { label: "Home", to: "/" as const },
      { label: "About us", to: "/#about-more" as const },
      { label: "Projects", to: "/#projects" as const },
      { label: "Lifestyle", to: "/#lifestyle" as const },
      { label: "News", to: "/#footer-contact" as const },
      { label: "Contact", to: "/#footer-contact" as const },
    ],
    labelsLeft: ["It starts with J", "Purpose into everything", "UK"],
    center:
      "At J Communities, we design destinations where lifestyle, architecture, and community come together in a new way.",
    headline: "BUILDING MORE THAN HOMES.\nCREATING LIVING EXPERIENCES.",
    ctaExplore: "Explore our projects",
  },

  intro: {
    verticalLeft: "Every project is crafted with",
    body:
      "J Communities is a forward-thinking real estate developer committed to making vibrant, sustainable communities.",
    cta: "More about us",
    microLabels: ["Purpose, building, philosophy, design", "Prime locations and purposeful spaces", "UK"],
    headline: "Building better communities",
  },

  lifestyle: {
    headline: "Spaces designed for every lifestyle",
    labelsRight: ["UK", "Purpose into everything", "It starts with J"],
  },

  pillars: {
    headline:
      "From luxury residences to innovative commercial spaces, we are dedicated to delivering excellence.",
    cta: "View all projects",
  },

  value: {
    listTitle: "Why J Communities?",
    points: [
      {
        num: "01",
        title: "Prime locations",
        body: "Carefully selected locations with high growth potential.",
      },
      {
        num: "02",
        title: "Smart design",
        body: "Driven by a balance of functionality, beauty, and comfort.",
      },
      {
        num: "03",
        title: "Quality you can trust",
        body: "Built with attention to every detail.",
      },
      {
        num: "04",
        title: "Community first",
        body: "Designed to foster connection, vitality, and a sense of belonging.",
      },
    ],
    photoLead:
      "Whether you are looking for your new home or a smart investment, J Communities is your trusted partner.",
    photoCta: "Download brochure",
    photoCtaHref: "mailto:info@j-communities.com?subject=Brochure%20request",
  },

  projects: {
    kicker: "Portfolio",
    title: "Our projects",
    lead:
      "Two flagship coastal destinations — Jura Sokhna on the Red Sea and Jamila on the North Coast — each with its own character, amenities, and immersive 3D experience.",
  },

  footer: {
    journey: "Start your journey today",
    quickLinks: "Quick links",
    social: "Social media",
    contact: "Contact us",
    terms: "Terms & conditions",
    privacy: "Privacy policy",
    copyright: "© 2026 J Communities Developer. All rights reserved.",
    quickItems: [
      { label: "Home", to: "/" as const },
      { label: "About us", to: "/#about-more" as const },
      { label: "Projects", to: "/#projects" as const },
      { label: "Lifestyle", to: "/#lifestyle" as const },
      { label: "News", to: "/#footer-contact" as const },
    ],
    socialItems: [
      { label: "Facebook", href: "https://www.facebook.com/jcommunitiesofficial/" },
      { label: "Instagram", href: "https://www.instagram.com/jcommunities_/" },
      { label: "YouTube", href: "https://www.youtube.com/@jcommunities" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/jcommunities/" },
    ],
    email: "info@j-communities.com",
  },
} as const;
