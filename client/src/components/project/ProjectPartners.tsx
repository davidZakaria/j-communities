import type { ProjectPartnersSection } from "../../content/projects/types";

export function ProjectPartners({ section }: { section: ProjectPartnersSection }) {
  return (
    <section id={section.id} className="border-t border-[var(--project-border)] px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="project-heading mb-8 text-[clamp(1.2rem,2.5vw,1.75rem)] font-medium uppercase tracking-[0.08em]">
          {section.title}
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {section.names.map((name) => (
            <li key={name} className="project-body-font project-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
