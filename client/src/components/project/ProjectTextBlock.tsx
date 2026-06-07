import type { ProjectTextSection } from "../../content/projects/types";

interface ProjectTextSectionProps {
  section: ProjectTextSection;
}

export function ProjectTextBlock({ section }: ProjectTextSectionProps) {
  const bodies = Array.isArray(section.body) ? section.body : [section.body];
  const centered = section.align === "center";

  return (
    <section
      id={section.id}
      className={`mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 ${centered ? "text-center" : ""}`}
    >
      {section.kicker ? (
        <p className="project-body-font project-text-muted mb-3 text-[10px] font-semibold uppercase tracking-[0.3em]">
          {section.kicker}
        </p>
      ) : null}
      {section.title ? (
        <h2
          className={`project-heading mb-6 text-[clamp(1.5rem,3vw,2.25rem)] font-medium uppercase leading-[1.2] tracking-[0.06em] ${centered ? "mx-auto max-w-3xl" : "max-w-3xl"}`}
        >
          {section.title}
        </h2>
      ) : null}
      <div className={`space-y-4 ${centered ? "mx-auto max-w-3xl" : "max-w-3xl"}`}>
        {bodies.map((para) => (
          <p key={para.slice(0, 40)} className="project-body-font project-text-muted text-sm leading-[1.85] sm:text-base">
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}
