import { Link } from "react-router-dom";
import { COPY } from "../content/siteCopy";
import { LF, LF_TYPE } from "../config/lookFeel";
import { GrowSection } from "./GrowSection";
import { Logo } from "./Logo";
import { LookFeelPhoto } from "./LookFeelPhoto";
import { CtaArrow } from "./CtaArrow";

function HeroNav({
  className,
  linkClassName,
}: {
  className?: string;
  linkClassName: string;
}) {
  return (
    <nav className={className} aria-label="Primary">
      {COPY.hero.nav.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className={`${linkClassName} border-b border-transparent pb-px transition-colors hover:border-white/90`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function Hero() {
  const { pad } = LF.hero;

  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden bg-j-black xl:h-[1080px] xl:min-h-0">
      <LookFeelPhoto which="hero" alt="J Communities — hero" />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/38 to-black/[0.72] xl:from-black/52 xl:via-black/30 xl:to-black/[0.58]"
        aria-hidden
      />

      {/* Stacked hero: phones, tablets, and small / medium desktop until xl */}
      <div
        className="relative z-20 flex min-h-[100svh] flex-col xl:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <header className="relative z-30 shrink-0 px-5 pt-[max(1rem,env(safe-area-inset-top,0px))] sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <Link
              to="/"
              className="min-w-0 max-w-[min(46vw,17.5rem)] shrink-0 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <Logo variant="light" heightClass={LF_TYPE.heroHeaderLogo} />
            </Link>
            <HeroNav
              className="relative z-40 j-hero-nav-scroll flex min-w-0 flex-1 flex-nowrap justify-end gap-x-5 gap-y-2 overflow-x-auto overflow-y-visible overscroll-x-contain pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-x-6 [&::-webkit-scrollbar]:hidden"
              linkClassName="shrink-0 whitespace-nowrap py-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_0_20px_rgba(0,0,0,0.45)]"
            />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col justify-center px-5 py-12 sm:px-6 sm:py-14">
          <p className="mx-auto max-w-[34ch] text-balance text-center font-serif text-[0.8125rem] font-normal uppercase leading-[1.92] tracking-[0.1em] text-white sm:max-w-[40ch] sm:text-[0.9375rem] sm:leading-[1.85] sm:tracking-[0.11em] [text-shadow:0_2px_4px_rgba(0,0,0,0.9),0_0_24px_rgba(0,0,0,0.5)]">
            {COPY.hero.center}
          </p>
        </div>

        <div className="shrink-0 space-y-7 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-2 sm:px-6">
          <div className="space-y-2.5 border-t border-white/20 pt-7">
            {COPY.hero.labelsLeft.map((line) => (
              <p
                key={line}
                className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-white sm:text-[11px] [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]"
              >
                {line}
              </p>
            ))}
          </div>
          <Link
            to="/#projects"
            className="inline-flex min-h-[44px] items-center gap-2 border-b border-white/70 pb-1 text-[11px] font-sans font-medium uppercase tracking-[0.32em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]"
          >
            {COPY.hero.ctaExplore}
            <CtaArrow />
          </Link>
          <h1 className="whitespace-pre-line text-balance font-serif text-[clamp(1.7rem,7vw,2.35rem)] font-medium uppercase leading-[1.22] tracking-[0.09em] text-white [text-shadow:0_3px_6px_rgba(0,0,0,0.95),0_0_32px_rgba(0,0,0,0.55)]">
            {COPY.hero.headline}
          </h1>
        </div>
      </div>

      {/* xl+ wide desktop: absolute comp layout; padding follows viewport with clamp */}
      <div className="pointer-events-auto absolute inset-0 z-10 hidden xl:block">
        <header
          className="pointer-events-auto absolute left-0 right-0 top-0 z-30 flex items-center justify-between gap-6"
          style={{
            paddingTop: `max(clamp(12px, 2.2vw, ${pad.t}px), env(safe-area-inset-top, 0px))`,
            paddingLeft: `max(clamp(16px, 3.8vw, ${pad.l}px), env(safe-area-inset-left, 0px))`,
            paddingRight: `max(clamp(16px, 3vw, ${pad.r}px), env(safe-area-inset-right, 0px))`,
          }}
        >
          <Link
            to="/"
            className="min-w-0 max-w-[min(46vw,17.5rem)] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <Logo variant="light" heightClass={LF_TYPE.heroHeaderLogo} />
          </Link>
          <HeroNav
            className={`relative z-40 flex min-w-0 flex-1 flex-wrap justify-end gap-x-8 gap-y-2 text-white ${LF_TYPE.heroNav}`}
            linkClassName={`${LF_TYPE.heroNav} py-px`}
          />
        </header>

        <div
          className="absolute left-0 z-10 max-w-[min(220px,42%)] space-y-3 text-white xl:max-w-[220px]"
          style={{ top: "38%", paddingLeft: `clamp(16px, 3.8vw, ${pad.l}px)` }}
        >
          <GrowSection>
            {COPY.hero.labelsLeft.map((line) => (
              <p key={line} className={LF_TYPE.heroLabels}>
                {line}
              </p>
            ))}
            <Link
              to="/#projects"
              className={`mt-6 inline-flex items-center gap-2 border-b border-white/50 pb-px text-white ${LF_TYPE.heroCta}`}
            >
              {COPY.hero.ctaExplore}
              <CtaArrow />
            </Link>
          </GrowSection>
        </div>

        <div className="absolute left-1/2 top-1/2 z-10 w-full max-w-[52ch] -translate-x-1/2 -translate-y-1/2 px-[clamp(1rem,3vw,2rem)] text-center min-[1400px]:px-12">
          <GrowSection>
            <p className={LF_TYPE.heroCenter}>{COPY.hero.center}</p>
          </GrowSection>
        </div>

        <div
          className="absolute bottom-0 left-0 z-10 max-w-[min(560px,90%)] md:max-w-[min(560px,90vw)]"
          style={{
            paddingBottom: `max(clamp(16px, 3.5vw, ${pad.b}px), env(safe-area-inset-bottom, 0px))`,
            paddingLeft: `max(clamp(16px, 3.8vw, ${pad.l}px), env(safe-area-inset-left, 0px))`,
            paddingRight: `max(clamp(16px, 3vw, ${pad.r}px), env(safe-area-inset-right, 0px))`,
          }}
        >
          <GrowSection>
            <h1 className={`whitespace-pre-line ${LF_TYPE.heroHeadline}`}>{COPY.hero.headline}</h1>
          </GrowSection>
        </div>
      </div>
    </section>
  );
}
