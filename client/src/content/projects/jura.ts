import { juraBrochure, juraImages } from "../../config/projectAssets";
import type { ProjectPageContent } from "./types";

export const juraContent: ProjectPageContent = {
  themeId: "jura",
  meta: {
    title: "Jura Sokhna",
    description:
      "Live where the sea is your horizon. Jura Sokhna — a unique seaside resort on 10 acres with 200 meters of sandy beach in Galala City, Ain Sokhna.",
    ogImage: juraImages.hero,
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Location", href: "#location" },
    { label: "Units", href: "#units" },
    { label: "Amenities", href: "#amenities" },
    { label: "Gallery", href: "#gallery" },
    { label: "3D Tour", href: "#tour3d" },
    { label: "Contact", href: "#contact" },
  ],
  sections: [
    {
      type: "hero",
      title: "LIVE WHERE THE SEA IS YOUR HORIZON",
      subtitle: "Jura Sokhna",
      body:
        "One of the most unique projects in Egypt — directly by the sea with a sandy beach. Fully finished, furnished, and air-conditioned units with hotel service and direct sea views.",
      image: juraImages.hero,
      ctas: [
        { label: "Download brochure", href: juraBrochure, primary: true },
        { label: "Contact us", href: "#contact" },
      ],
    },
    {
      type: "text",
      id: "about",
      kicker: "Jura Sokhna",
      title: "A world beyond the shoreline",
      body: [
        "Jura overlooks the Red Sea coast on 10 acres and 200 meters of beach. Just 121 km from Cairo — a 90-minute drive to one of the most beautiful spots by the seaside.",
        "Imagine a life where your daily view is an endless expanse of sea. Nestled on prime land with an exclusive sandy beach, Jura creates a symbiotic relationship between modern living and nature's purest elements.",
      ],
    },
    {
      type: "text",
      kicker: "About the developer",
      title: "J-Communities Developments",
      body:
        "J-Communities Developments has redefined real estate in Egypt by delivering high-tech smart homes that promise an elevated lifestyle. As one of the Arab world's most renowned developers, we bring world-class expertise to every project — embodying the highest standards in construction and design with Jura, an iconic destination for refined seaside living.",
    },
    {
      type: "gateway",
      id: "gateway",
      title: "Your gateway to the world",
      items: [
        {
          title: "By Sea",
          body: "A short distance from El Sokhna International Port and the Suez Canal — a getaway for global travelers.",
        },
        {
          title: "By Land",
          body: "Just 4 hours from Europe, West & Southern Africa, and all major cities of the Middle East and Asia. Well-connected highways including Cairo–Suez, Katameya–Sokhna, Zaafrana, and Suez Sokhna roads.",
        },
        {
          title: "By Air",
          body: "Nearby airports: Cairo International, Hurghada International, and New Egyptian Capital City Airport.",
        },
      ],
    },
    {
      type: "split",
      kicker: "Galala City",
      title: "Prime position in Galala City",
      body:
        "Perched on Egypt's highest mountain plateau, Galala City blends natural beauty with modern luxury. Between Ain Sokhna and Zaafrana, this visionary coastal retreat offers stunning Red Sea views and cooler year-round temperatures. Next to the international marina with easy access by land, sea, or air.",
      image: juraImages.galala,
      imagePosition: "right",
    },
    {
      type: "stats",
      id: "location",
      items: [
        { value: "550 M", label: "To El Galala Resort" },
        { value: "5 min", label: "To the international marina" },
        { value: "5 min", label: "To the international yacht marina" },
        { value: "5 min", label: "To the cable car station and aqua park" },
      ],
    },
    {
      type: "propertyTypes",
      id: "units",
      title: "Property types",
      items: [
        {
          title: "Duplex",
          body: "Spaces from 160 m² to 220 m², 2 bedrooms, American kitchen. Fully finished with private entrance and direct sea view. Near resort facilities, pools, aqua park, spa, and infinity pool.",
        },
        {
          title: "Chalet",
          body: "Fully finished with direct sea view from 110 m². Two bedrooms and American kitchen. Access to beach club, golf car, health club, spa, and infinity pool.",
        },
        {
          title: "Sky Villa",
          body: "460 m² signature villa with 6 master bedrooms, high ceilings, and private cabins on a sandy beach with unique panoramic sea views.",
        },
        {
          title: "Hotel Apartment",
          body: "Fully finished and serviced sea-view units, air-conditioned and managed by The First Group Collection.",
        },
      ],
    },
    {
      type: "amenities",
      id: "amenities",
      title: "Facilities and amenities",
      items: [
        { title: "Security concierge" },
        { title: "Indoor pool" },
        { title: "Spa, beauty and health" },
        { title: "Club house" },
        { title: "Fitness center" },
        { title: "Food and beverage restaurants" },
        { title: "Water features" },
      ],
    },
    {
      type: "masterplan",
      title: "Master plan",
      image: juraImages.masterplan,
    },
    {
      type: "gallery",
      id: "gallery",
      title: "Gallery",
      images: juraImages.gallery.map((src, i) => ({
        src,
        alt: `Jura Sokhna — view ${i + 1}`,
      })),
    },
    {
      type: "tour3d",
      id: "tour3d",
      title: "360° virtual tour",
      subtitle: "Explore Jura Sokhna in immersive 3D",
      url: "https://logica-itech.com/JURA/index.htm",
    },
    {
      type: "contact",
      id: "contact",
      title: "Contact us for Jura",
      subtitle: "Reach out for brochures, viewings, and availability.",
      email: "info@j-communities.com",
    },
  ],
};
