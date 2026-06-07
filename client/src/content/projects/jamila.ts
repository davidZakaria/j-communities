import { jamilaBrochure, jamilaImages } from "../../config/projectAssets";
import type { ProjectPageContent } from "./types";

export const jamilaContent: ProjectPageContent = {
  themeId: "jamila",
  meta: {
    title: "Jamila North Coast",
    description:
      "The beauty within Jamila — a breathtaking North Coast retreat with direct sea views, 700m beach front, and holistic living across 130 acres.",
    ogImage: jamilaImages.hero,
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Location", href: "#location" },
    { label: "Master plan", href: "#masterplan" },
    { label: "Floor plans", href: "#floorplans" },
    { label: "Amenities", href: "#amenities" },
    { label: "Gallery", href: "#gallery" },
    { label: "3D Tour", href: "#tour3d" },
    { label: "Contact", href: "#contact" },
  ],
  sections: [
    {
      type: "hero",
      title: "The Beauty Within Jamila",
      body:
        "Jamila North Coast — everyone stands in unity with one common certainty: the definition of beauty and its discovery within Jamila.",
      image: jamilaImages.hero,
      ctas: [
        { label: "Download brochure", href: jamilaBrochure, primary: true },
        { label: "Book now", href: "#contact", primary: false },
      ],
    },
    {
      type: "stats",
      id: "about",
      items: [
        { value: "130 M", label: "Acres land area" },
        { value: "9%", label: "Footprint" },
        { value: "700 M", label: "Beach front" },
        { value: "91%", label: "Green spaces & water features" },
      ],
    },
    {
      type: "text",
      id: "location",
      title: "Location of Jamila",
      body:
        "Experience a breathtaking retreat located in the North Coast of Egypt. Jamila by J-Communities Developments is distinguished by its unique building design — ensuring all units have direct sea views, combining luxurious amenities with stunning landscapes for an unparalleled experience of beauty and holistic living.",
      align: "center",
    },
    {
      type: "stats",
      items: [
        { value: "2.5 hrs", label: "From Cairo gates" },
        { value: "15 min", label: "To Almaza Bay" },
        { value: "25 km", label: "From Ras El Hekma" },
      ],
    },
    {
      type: "split",
      title: "Coastal setting",
      body:
        "Jamila sits on the North Coast with expansive beach frontage, lagoon landscapes, and architecture designed so every unit captures the sea.",
      image: jamilaImages.location,
      imagePosition: "left",
    },
    {
      type: "masterplan",
      id: "masterplan",
      title: "Master plan — phase one",
      image: jamilaImages.masterplan,
      buildings: [
        { id: "H", title: "Building H", body: "Ground and five floor building. See brochure for details." },
        { id: "I", title: "Building I", body: "Ground and five floor building. See brochure for details." },
        { id: "J", title: "Building J", body: "Ground and five floor building. See brochure for details." },
        { id: "K", title: "Building K", body: "Ground and five floor building. See brochure for details." },
        { id: "L", title: "Building L", body: "Ground and four floor building. See brochure for details." },
        { id: "M", title: "Building M", body: "Ground and four floor building. See brochure for details." },
      ],
    },
    {
      type: "tour3d",
      id: "tour3d",
      title: "360° panoramic view",
      subtitle: "Explore Jamila in immersive 3D",
      url: "https://njdegypt.com/jamila360/HQ",
    },
    {
      type: "gallery",
      id: "gallery",
      title: "Gallery preview",
      images: jamilaImages.gallery.map((src, i) => ({
        src,
        alt: `Jamila North Coast — view ${i + 1}`,
      })),
    },
    {
      type: "floorPlans",
      id: "floorplans",
      title: "Floor plans",
      items: [
        { title: "Studio", area: "51 to 65 m²", ctaLabel: "Reserve your unit" },
        { title: "One bedroom", area: "57 to 79 m²", ctaLabel: "Reserve your unit" },
        { title: "Two bedrooms", area: "87 to 123 m²", ctaLabel: "Reserve your unit" },
        { title: "Three bedrooms", area: "138 to 175 m²", ctaLabel: "Reserve your unit" },
        { title: "Duplex", area: "147 to 219 m²", ctaLabel: "Reserve your unit" },
        { title: "D-Villa", area: "167 to 260 m²", ctaLabel: "Reserve your unit" },
      ],
    },
    {
      type: "amenities",
      id: "amenities",
      title: "Facilities and amenities",
      items: [
        { title: "Indoor pool", body: "A serene indoor pool oasis where relaxation meets elegance." },
        { title: "Spa, beauty and health", body: "Soothing massages and rejuvenating treatments." },
        { title: "Club house", body: "Lounges, fitness areas, and recreational amenities." },
        { title: "Fitness center", body: "State-of-the-art facilities for every fitness goal." },
        { title: "Food and beverage restaurants", body: "Gourmet cuisine to casual bites." },
        { title: "Water features", body: "Refreshing and tranquil atmosphere throughout the resort." },
        { title: "Gated community", body: "Secure, controlled access with round-the-clock security." },
        { title: "Underground parking", body: "Convenient sheltered parking for all guests." },
      ],
    },
    {
      type: "text",
      title: "Time stops. Beauty starts.",
      body: "Check out Jamila's magnificent view — a coastal destination designed for beauty, balance, and belonging.",
      align: "center",
    },
    {
      type: "partners",
      title: "Our partnership",
      names: ["Aland F&B", "Balance", "Eternity", "Goro", "Reiki", "Thale", "Un Levant"],
    },
    {
      type: "contact",
      id: "contact",
      title: "Contact us for Jamila",
      subtitle: "Reserve your unit or request a brochure.",
      email: "info@j-communities.com",
    },
  ],
};
