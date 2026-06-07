import { useCallback, useEffect, useState } from "react";
import type { ProjectGallerySection } from "../../content/projects/types";

export function ProjectGallery({ section }: { section: ProjectGallerySection }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + section.images.length) % section.images.length));
  }, [section.images.length]);
  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % section.images.length));
  }, [section.images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, prev, next]);

  return (
    <section id={section.id} className="project-surface px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="project-heading mb-8 text-center text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase tracking-[0.06em]">
          {section.title}
        </h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {section.images.map((img, i) => (
            <li key={img.src}>
              <button type="button" className="group block w-full overflow-hidden rounded-sm" onClick={() => setLightbox(i)}>
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {lightbox !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          onClick={close}
        >
          <button type="button" className="absolute right-4 top-4 z-10 px-3 py-2 text-white/80 hover:text-white" onClick={close} aria-label="Close gallery">
            ✕
          </button>
          <button type="button" className="absolute left-4 top-1/2 z-10 -translate-y-1/2 px-3 py-2 text-2xl text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous image">
            ‹
          </button>
          <img src={section.images[lightbox]?.src} alt={section.images[lightbox]?.alt ?? ""} className="max-h-[85vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" className="absolute right-4 top-1/2 z-10 -translate-y-1/2 px-3 py-2 text-2xl text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next image">
            ›
          </button>
        </div>
      ) : null}
    </section>
  );
}
