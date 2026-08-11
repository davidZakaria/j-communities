import type { ProjectThemeId } from "../../data/projects";
import type { ProjectHeroSection } from "../../content/projects/types";
import { HeroExperienceShell } from "../HeroExperienceShell";

interface ProjectHeroProps {
  section: ProjectHeroSection;
  themeId: ProjectThemeId;
}

export function ProjectHero({ section, themeId }: ProjectHeroProps) {
  return (
    <HeroExperienceShell
      scene={themeId}
      enableScene3D={false}
      className="min-h-[72svh] scroll-mt-0"
      poster={
        <img
          src={section.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      }
      overlay={<div className="project-hero-overlay absolute inset-0 z-[1]" aria-hidden />}
    >
      <div
        id="project-hero"
        className="relative mx-auto flex min-h-[72svh] max-w-7xl flex-col justify-center px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-28"
      >
        {section.kicker ? (
          <p className="project-body-font mb-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-white/85">
            {section.kicker}
          </p>
        ) : null}
        {section.subtitle ? (
          <p className="project-heading mb-2 text-lg uppercase tracking-[0.12em] text-white/95 sm:text-xl">
            {section.subtitle}
          </p>
        ) : null}
        <h1 className="project-heading max-w-4xl text-[clamp(1.75rem,5vw,3.25rem)] font-medium uppercase leading-[1.12] tracking-[0.06em] text-white">
          {section.title}
        </h1>
        {section.body ? (
          <p className="project-body-font mt-5 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
            {section.body}
          </p>
        ) : null}
        {section.ctas && section.ctas.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {section.ctas.map((cta) => {
              const external = cta.href.startsWith("http");
              const className = cta.primary
                ? "project-btn-primary project-body-font inline-flex min-h-[44px] items-center border px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors"
                : "project-body-font inline-flex min-h-[44px] items-center border border-white/70 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white";
              return (
                <a
                  key={cta.label}
                  href={cta.href}
                  className={className}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {cta.label}
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </HeroExperienceShell>
  );
}
