import { COPY } from "../content/siteCopy";
import { LF, LF_TYPE } from "../config/lookFeel";
import { GrowSection } from "./GrowSection";
import { LookFeelPhoto } from "./LookFeelPhoto";
import { CtaArrow } from "./CtaArrow";

export function IntroSection() {
  const { heightPx, pad } = LF.intro;
  return (
    <section id="about-more" className="w-full bg-j-footer text-j-charcoal">
      <div className="grid w-full grid-cols-12 md:min-h-[662px]">
        <div
          className="col-span-12 flex border-b border-j-charcoal/10 md:col-span-2 md:flex-col md:items-center md:justify-center md:border-b-0 md:border-r md:border-j-charcoal/10"
          style={{
            padding: `clamp(${pad.t * 0.5}px, 4vw, ${pad.t}px) 1.5rem`,
          }}
        >
          <p className={`mx-auto max-w-[12em] md:mx-0 ${LF_TYPE.introVertical}`}>{COPY.intro.verticalLeft}</p>
        </div>

        <div
          className="col-span-12 flex flex-col justify-center border-b border-j-charcoal/10 md:col-span-5 md:border-b-0 md:border-r md:border-j-charcoal/10"
          style={{
            padding: `clamp(${pad.t * 0.5}px, 4vw, ${pad.t}px) clamp(1rem, 4vw, ${pad.r}px) clamp(${pad.b * 0.5}px, 4vw, ${pad.b}px) clamp(1rem, 4vw, ${pad.l}px)`,
          }}
        >
          <GrowSection>
            <p className={LF_TYPE.introBody}>{COPY.intro.body}</p>
            <a
              href="#intro-more"
              className={`mt-10 inline-flex items-center gap-2 border-b border-j-charcoal pb-px ${LF_TYPE.heroCta}`}
            >
              {COPY.intro.cta}
              <CtaArrow />
            </a>
          </GrowSection>
        </div>

        <div className="relative col-span-12 min-h-[min(520px,70vw)] bg-j-black md:col-span-5">
          <LookFeelPhoto which="intro" alt="J Communities — introduction" />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/15"
            aria-hidden
          />
          <div className="absolute bottom-10 left-10 z-10 flex h-16 w-16 items-center justify-center bg-j-black font-serif text-2xl font-semibold tracking-tight text-white shadow-lg">
            J
          </div>
        </div>
      </div>

      <div
        id="intro-more"
        className="grid w-full grid-cols-12 gap-y-8 scroll-mt-4 border-t border-j-charcoal/10 bg-j-footer"
        style={{
          padding: `clamp(${pad.b * 0.5}px, 4vw, ${pad.b}px) clamp(1rem, 4vw, ${pad.l}px) clamp(${pad.t * 0.5}px, 4vw, ${pad.t}px) clamp(1rem, 4vw, ${pad.r}px)`,
        }}
      >
        <div className="col-span-12 space-y-3 lg:col-span-6">
          {COPY.intro.microLabels.map((line) => (
            <p key={line} className={LF_TYPE.introMicro}>
              {line}
            </p>
          ))}
        </div>
        <div className="col-span-12 flex items-end lg:col-span-6 lg:justify-end">
          <GrowSection>
            <h2 className={`max-w-[18ch] lg:text-right ${LF_TYPE.introHeadline}`}>{COPY.intro.headline}</h2>
          </GrowSection>
        </div>
      </div>
    </section>
  );
}
