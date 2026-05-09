import { COPY } from "../content/siteCopy";
import { LF, LF_TYPE } from "../config/lookFeel";
import { GrowSection } from "./GrowSection";
import { LookFeelPhoto } from "./LookFeelPhoto";

export function LifestyleBanner() {
  const { copyPadLeft, copyPadBottom, copyPadRight } = LF.lifestyle;
  return (
    <section
      id="lifestyle"
      className="relative w-full min-h-[40svh] bg-j-black xl:h-[648px] xl:min-h-0"
    >
      <LookFeelPhoto which="lifestyle" alt="J Communities — lifestyle" />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-j-black/75 via-j-black/35 to-black/25 xl:from-j-black/65 xl:via-j-black/15 xl:to-transparent"
        aria-hidden
      />
      <div className="relative flex min-h-[40svh] w-full xl:min-h-0 xl:h-full">
        <div
          className="mt-auto flex max-w-[min(640px,92%)] flex-col justify-end sm:max-w-[min(640px,85%)]"
          style={{
            paddingLeft: `clamp(1.25rem, 4.2vw, ${copyPadLeft}px)`,
            paddingBottom: `clamp(1.25rem, 3vw, ${copyPadBottom}px)`,
          }}
        >
          <GrowSection>
            <h2
              className={`${LF_TYPE.lifestyleBanner} max-xl:[text-shadow:0_2px_14px_rgba(0,0,0,0.85),0_0_24px_rgba(0,0,0,0.45)]`}
            >
              {COPY.lifestyle.headline}
            </h2>
          </GrowSection>
        </div>
        <div
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-8 text-right text-white xl:flex"
          style={{ paddingRight: `clamp(1rem, 4.5vw, ${copyPadRight}px)` }}
        >
          {COPY.lifestyle.labelsRight.map((label) => (
            <span
              key={label}
              className={`${LF_TYPE.lifestyleVertical} [writing-mode:vertical-rl] rotate-180`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
