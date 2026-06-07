import { useState } from "react";
import type { ProjectTour3DSection } from "../../content/projects/types";

interface ProjectTour3DProps {
  section: ProjectTour3DSection;
  projectName: string;
}

export function ProjectTour3D({ section, projectName }: ProjectTour3DProps) {
  const [iframeFailed, setIframeFailed] = useState(false);

  return (
    <section id={section.id} className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="mb-8 text-center">
        <h2 className="project-heading text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase tracking-[0.06em]">
          {section.title}
        </h2>
        {section.subtitle ? (
          <p className="project-body-font project-text-muted mt-3 text-sm">{section.subtitle}</p>
        ) : null}
      </div>

      {iframeFailed ? (
        <div className="project-surface flex flex-col items-center justify-center rounded-sm border border-[var(--project-border)] px-6 py-16 text-center">
          <p className="project-body-font project-text-muted mb-6 max-w-md text-sm">
            The 3D tour opens best in a new window on your device.
          </p>
          <a
            href={section.url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-btn-primary project-body-font inline-flex min-h-[44px] items-center border px-8 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            Open 3D tour
          </a>
        </div>
      ) : (
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-[var(--project-border)] bg-[var(--project-surface)]">
          <iframe
            src={section.url}
            title={`${projectName} 3D tour`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            allow="fullscreen; xr-spatial-tracking"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => setIframeFailed(true)}
          />
        </div>
      )}

      <p className="mt-4 text-center">
        <a
          href={section.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-body-font project-text-muted text-[10px] font-medium uppercase tracking-[0.16em] hover:text-[var(--project-accent)]"
        >
          Open tour in new tab ↗
        </a>
      </p>
    </section>
  );
}
