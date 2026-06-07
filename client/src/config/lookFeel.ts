/**
 * Look & Feel: raster art + type scales from `siteCopy` / `LF_TYPE`.
 * Page shell is fluid (`max-w-[1920px]`) for all viewports — no CSS zoom.
 */

/** Reference width for the original comp; layout is fluid with `max-w-[1920px]`. */
export const CANVAS_W = 1920;

const LOOK_FEEL_DIR = "/assets/look-feel";

export const LOOK_FEEL_EXT = ".webp";

const lf = (basename: string) => `${LOOK_FEEL_DIR}/${basename}${LOOK_FEEL_EXT}`;

/**
 * Basenames without extension — files in `public/assets/look-feel/` use hyphens (e.g. section-2.webp).
 * intro = gray band · lifestyle = lifestyle strip · silhouette = why us
 */
export const lookFeelBasenames = {
  hero: "hero",
  intro: "section-2",
  lifestyle: "section-3",
  silhouette: "section-5",
} as const;

export const lookFeelImageFallback = `${LOOK_FEEL_DIR}/fallback.svg`;

export const lookFeelImages = {
  hero: lf(lookFeelBasenames.hero),
  lifestyle: lf(lookFeelBasenames.lifestyle),
  intro: lf(lookFeelBasenames.intro),
  silhouette: lf(lookFeelBasenames.silhouette),
} as const;

export const applyGlobalGrain = true;
export const applyPhotoGrainOverlay = true;
export const applyEditorialImageCss = true;

export const LF = {
  hero: { heightPx: 1080, pad: { t: 44, r: 56, b: 64, l: 72 } },
  intro: { heightPx: 920, pad: { t: 72, r: 72, b: 72, l: 72 } },
  lifestyle: { heightPx: 648, copyPadLeft: 80, copyPadBottom: 56, copyPadRight: 80 },
  pillars: { heightPx: 920, padX: 56, padY: 40 },
  value: { heightPx: 1000, pad: { t: 72, r: 72, b: 72, l: 72 } },
  projects: { padX: 80, padY: 72, rowMinH: 168 },
  footer: { padX: 80, padT: 72, padB: 48, wordmarkPadT: 24 },
} as const;

export const imageObjectPosition: Record<keyof typeof lookFeelImages, string> = {
  hero: "center 28%",
  lifestyle: "50% 45%",
  intro: "center center",
  silhouette: "70% center",
};

/**
 * Focal point for narrow viewports (portrait phones). `object-cover` + tall `svh`
 * crops differently than the 1920×1080 comp; these keep the subject in frame.
 */
export const imageObjectPositionNarrow: Partial<Record<keyof typeof lookFeelImages, string>> = {
  hero: "62% 56%",
  silhouette: "58% center",
};

export const LF_TYPE = {
  heroNav: "font-sans text-[10px] font-medium uppercase tracking-[0.22em]",
  /** Hero header lockup — sized via `.j-hero-header-logo` (see index.css). */
  heroHeaderLogo: "j-hero-header-logo",
  heroLabels: "font-sans text-[10px] font-medium uppercase tracking-[0.32em]",
  heroCenter:
    "font-serif text-[13px] font-normal uppercase leading-[1.75] tracking-[0.14em] text-white/95 sm:text-[14px]",
  heroHeadline:
    "font-serif text-[clamp(1.5rem,2.4vw,2.35rem)] font-medium uppercase leading-[1.25] tracking-[0.12em] text-white",
  heroCta: "font-sans text-[11px] font-medium uppercase tracking-[0.34em]",
  introVertical:
    "font-sans text-[10px] font-medium uppercase tracking-[0.28em] [writing-mode:vertical-rl] rotate-180 text-j-charcoal",
  introBody:
    "font-serif text-[17px] font-normal uppercase leading-[1.7] tracking-[0.06em] text-j-charcoal max-w-[38ch]",
  introMicro: "font-sans text-[9px] font-medium uppercase tracking-[0.26em] text-j-slate",
  introHeadline:
    "font-serif text-[clamp(1.75rem,2.5vw,2.35rem)] font-medium uppercase leading-[1.2] tracking-[0.1em] text-j-charcoal",
  lifestyleVertical: "font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-j-offwhite/85",
  lifestyleBanner:
    "font-serif text-[clamp(2rem,3.2vw,2.75rem)] font-medium uppercase leading-[1.1] tracking-[0.12em] text-j-offwhite",
  pillarsCategory: "font-sans text-[10px] font-semibold uppercase tracking-[0.22em]",
  pillarsCenter:
    "font-serif text-[clamp(1rem,2vw,1.65rem)] font-medium uppercase leading-[1.5] tracking-[0.08em] text-j-charcoal",
  pillarsCta: "font-sans text-[11px] font-medium uppercase tracking-[0.3em]",
  valueHeading:
    "font-serif text-[clamp(1.85rem,2.5vw,2.5rem)] font-medium uppercase leading-[1.15] tracking-[0.06em] text-j-charcoal",
  valueNum: "font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-j-slate",
  valueItemTitle:
    "font-serif text-[15px] font-medium uppercase leading-[1.35] tracking-[0.07em] text-j-charcoal lg:text-[16px]",
  valueItemBody:
    "font-serif text-[12px] font-normal uppercase leading-[1.65] tracking-[0.08em] text-j-slate lg:text-[13px]",
  valuePhotoLead:
    "font-serif text-[13px] font-normal uppercase leading-[1.7] tracking-[0.07em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.85)] lg:text-[15px]",
  valuePhotoCta:
    "font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]",
  projectsKicker: "font-sans text-[10px] font-medium uppercase tracking-[0.36em]",
  projectsTitle:
    "font-serif text-[clamp(2rem,3vw,2.625rem)] font-medium uppercase leading-[1.1] tracking-[0.05em] text-j-charcoal",
  projectsLead: "font-serif text-[16px] font-normal leading-[1.65] tracking-[0.03em] text-j-slate",
  cardTitle:
    "font-serif text-[21px] font-medium leading-[1.3] tracking-[0.02em] text-j-charcoal lg:text-[22px]",
  cardTag: "font-sans text-[10px] font-semibold uppercase tracking-[0.28em]",
  footerJourney:
    "font-serif text-[clamp(1.65rem,2.8vw,2.5rem)] font-medium uppercase leading-[1.2] tracking-[0.07em] text-j-charcoal",
  footerColTitle: "font-sans text-[10px] font-semibold uppercase tracking-[0.34em]",
  footerLink: "font-sans text-[13px] font-normal uppercase leading-[1.85] tracking-[0.12em] text-j-charcoal",
  footerWordmark:
    "font-serif text-[clamp(4rem,12vw,8.25rem)] font-medium uppercase leading-[0.95] tracking-[0.06em]",
  /** Footer lockup — width-led so the wide PNG has no empty vertical bands. */
  footerWordmarkLogo: "j-footer-wordmark-logo",
  footerLegal: "font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-j-slate",
} as const;
