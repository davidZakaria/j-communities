import { COPY } from "../content/siteCopy";
import { LF, LF_TYPE } from "../config/lookFeel";
import { GrowSection } from "./GrowSection";
import { LookFeelPhoto } from "./LookFeelPhoto";
import { CtaArrow } from "./CtaArrow";

export function ValueProp() {
  const { heightPx, pad } = LF.value;
  const points = COPY.value.points;

  return (
    <section
      className="grid w-full grid-cols-1 overflow-hidden bg-white lg:h-[var(--value-h)] lg:grid-cols-2"
      style={{ ['--value-h' as string]: `${heightPx}px` }}
    >
      <div
        className="relative z-10 flex flex-col justify-between bg-white py-10 text-j-charcoal sm:py-12 lg:h-full lg:py-0"
        style={{
          padding: `clamp(1.5rem, 4vw, ${pad.t}px) clamp(1.25rem, 4vw, ${pad.r}px) clamp(1.5rem, 4vw, ${pad.b}px) clamp(1.25rem, 4vw, ${pad.l}px)`,
        }}
      >
        <GrowSection>
          <h2 className={`${LF_TYPE.valueHeading}`}>{COPY.value.listTitle}</h2>
        </GrowSection>
        <GrowSection>
          <ul className="j-grow-in-stagger max-w-[480px] space-y-0">
            {points.map((item) => (
              <GrowSection key={item.num}>
                <li className="flex gap-7 border-t border-j-charcoal/15 py-7 first:border-t-0 first:pt-0">
                  <span className={`w-10 shrink-0 pt-1 ${LF_TYPE.valueNum}`}>{item.num}</span>
                  <div>
                    <h3 className={`mb-2 ${LF_TYPE.valueItemTitle}`}>{item.title}</h3>
                    <p className={`${LF_TYPE.valueItemBody}`}>{item.body}</p>
                  </div>
                </li>
              </GrowSection>
            ))}
          </ul>
        </GrowSection>
      </div>
      <div className="relative min-h-[min(560px,85vw)] bg-j-charcoal lg:min-h-0 lg:h-full">
        <LookFeelPhoto which="silhouette" alt="J Communities — why us" />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/88 via-black/40 to-black/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 z-[1] h-[min(72%,520px)] w-full max-w-[min(520px,100%)] bg-gradient-to-tl from-black/92 via-black/55 to-transparent sm:max-w-[88%] lg:max-w-[72%]"
          aria-hidden
        />
        <div
          className="absolute bottom-0 right-0 z-10 max-w-[min(420px,92%)] rounded-sm bg-black/45 px-4 py-4 backdrop-blur-[3px] sm:max-w-[min(420px,88%)] sm:px-5 sm:py-5 lg:px-8 lg:py-6"
          style={{
            marginRight: `clamp(1rem, 4vw, ${Math.max(pad.r, 56)}px)`,
            marginBottom: `max(clamp(1rem, 4vw, ${pad.b}px), env(safe-area-inset-bottom, 0px))`,
          }}
        >
          <GrowSection>
            <p className={`text-right ${LF_TYPE.valuePhotoLead}`}>{COPY.value.photoLead}</p>
            <a
              href={COPY.value.photoCtaHref}
              className={`mt-8 flex items-center justify-end gap-2 border-b border-white/50 pb-px text-right ${LF_TYPE.valuePhotoCta}`}
            >
              {COPY.value.photoCta}
              <CtaArrow />
            </a>
          </GrowSection>
        </div>
      </div>
    </section>
  );
}
