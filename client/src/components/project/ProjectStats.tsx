import type { ProjectStatsSection } from "../../content/projects/types";

interface ProjectStatsProps {
  section: ProjectStatsSection;
}

export function ProjectStats({ section }: ProjectStatsProps) {
  return (
    <section id={section.id} className="project-surface-alt border-y border-[var(--project-border)]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-[var(--project-border)] sm:grid-cols-4">
        {section.items.map((item) => (
          <div key={item.label} className="project-surface px-5 py-10 text-center sm:px-8 sm:py-12">
            <p className="project-heading project-stat-value text-[clamp(1.5rem,4vw,2.5rem)] font-medium leading-none">
              {item.value}
            </p>
            <p className="project-body-font project-text-muted mt-3 text-[10px] font-medium uppercase tracking-[0.2em]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
