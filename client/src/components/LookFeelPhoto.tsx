import { useState, type CSSProperties } from "react";
import {
  applyEditorialImageCss,
  applyPhotoGrainOverlay,
  imageObjectPosition,
  imageObjectPositionNarrow,
  lookFeelImageFallback,
  lookFeelImages,
} from "../config/lookFeel";

type Key = keyof typeof lookFeelImages;

interface LookFeelPhotoProps {
  which: Key;
  alt: string;
  extraClass?: string;
}

function photoDims(which: Key): { w: number; h: number } {
  if (which === "hero" || which === "lifestyle") return { w: 1920, h: which === "lifestyle" ? 648 : 1080 };
  if (which === "intro") return { w: 1200, h: 920 };
  return { w: 960, h: 1000 };
}

export function LookFeelPhoto(props: LookFeelPhotoProps) {
  const { which, alt, extraClass = "" } = props;
  const primary = lookFeelImages[which];
  const [src, setSrc] = useState(primary);
  const wrap = applyPhotoGrainOverlay
    ? "j-photo-grain pointer-events-none absolute inset-0 overflow-hidden"
    : "pointer-events-none absolute inset-0 overflow-hidden";
  const editorial = applyEditorialImageCss ? "j-img-editorial" : "";
  const { w, h } = photoDims(which);
  const narrowPos = imageObjectPositionNarrow[which];
  const focusVars: CSSProperties | undefined = narrowPos
    ? ({
        ["--lf-img-object-desktop"]: imageObjectPosition[which],
        ["--lf-img-object-narrow"]: narrowPos,
      } as CSSProperties)
    : undefined;

  return (
    <div
      className={`${wrap} ${narrowPos ? "lf-photo-responsive-focus" : ""}`.trim()}
      style={focusVars}
    >
      <img
        src={src}
        alt={alt}
        className={`lf-photo-img absolute inset-0 h-full w-full max-w-none object-cover object-center ${editorial} ${extraClass}`.trim()}
        style={narrowPos ? undefined : { objectPosition: imageObjectPosition[which] }}
        loading={which === "hero" ? "eager" : "lazy"}
        decoding="async"
        width={w}
        height={h}
        onError={() => {
          setSrc((curr) => (curr === lookFeelImageFallback ? curr : lookFeelImageFallback));
        }}
      />
    </div>
  );
}
