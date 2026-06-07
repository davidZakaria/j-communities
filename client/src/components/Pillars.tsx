import { Link } from "react-router-dom";
import { PILLAR_CATEGORIES, COPY } from "../content/siteCopy";
import { LF, LF_TYPE } from "../config/lookFeel";
import { GrowSection } from "./GrowSection";
import { CtaArrow } from "./CtaArrow";
import { ProjectRouteLink } from "./ProjectLink";

export function Pillars() {
  const { heightPx, padX, padY } = LF.pillars;
  const padXClamped = `clamp(1.25rem, 3.5vw, ${padX}px)`;
  const padYClamped = `clamp(1rem, 2.5vw, ${padY}px)`;

  return (
    <section
      className="relative flex w-full min-h-0 flex-col bg-j-sky text-j-charcoal lg:min-h-[920px] lg:h-[var(--pillars-h)]"
      style={{ ['--pillars-h' as string]: `${heightPx}px` }}
    >
      <div
        className="grid w-full shrink-0 grid-cols-1 border-b border-j-charcoal/15 lg:grid-cols-3"
        style={{ paddingLeft: padXClamped, paddingRight: padXClamped, paddingTop: padYClamped, paddingBottom: padYClamped }}
      >
        {PILLAR_CATEGORIES.map((item, idx) => {
          const align =
            idx === 0
              ? "justify-start lg:justify-start"
              : idx === 1
                ? "justify-start lg:justify-center"
                : "justify-start lg:justify-end";
          return (
            <div
              key={item.label}
              className={`flex border-b border-j-charcoal/15 py-3 last:border-b-0 lg:border-b-0 lg:py-0 ${align}`}
            >
              {item.to.startsWith("/projects/") ? (
                <ProjectRouteLink
                  to={item.to}
                  className={`inline-flex min-h-[44px] items-center gap-2 py-2 text-j-charcoal transition-opacity hover:opacity-80 lg:items-baseline lg:min-h-0 lg:py-0 ${LF_TYPE.pillarsCategory}`}
                >
                  <span className="text-j-slate">{item.num}.</span>
                  <span className="font-semibold uppercase">{item.label}</span>
                  <CtaArrow />
                </ProjectRouteLink>
              ) : (
                <Link
                  to={item.to}
                  className={`inline-flex min-h-[44px] items-center gap-2 py-2 text-j-charcoal transition-opacity hover:opacity-80 lg:items-baseline lg:min-h-0 lg:py-0 ${LF_TYPE.pillarsCategory}`}
                >
                  <span className="text-j-slate">{item.num}.</span>
                  <span className="font-semibold uppercase">{item.label}</span>
                  <CtaArrow />
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center sm:px-8 lg:px-14 lg:py-12">
        <GrowSection>
          <p className={`mx-auto max-w-[56ch] ${LF_TYPE.pillarsCenter}`}>{COPY.pillars.headline}</p>
          <Link
            to="/#projects"
            className={`mt-12 inline-flex items-center gap-2 border-b border-j-charcoal/40 pb-px text-j-charcoal hover:border-j-charcoal ${LF_TYPE.pillarsCta}`}
          >
            {COPY.pillars.cta}
            <CtaArrow />
          </Link>
        </GrowSection>
      </div>
    </section>
  );
}
