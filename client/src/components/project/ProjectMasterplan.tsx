import type { ProjectMasterplanSection } from "../../content/projects/types";

export function ProjectMasterplan({ section }: { section: ProjectMasterplanSection }) {
  return (
    <section id={section.id} className="border-y border-[var(--project-border)] bg-[var(--project-bg)] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="project-heading mb-8 text-center text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase tracking-[0.06em]">
          {section.title}
        </h2>
        <div className="overflow-hidden rounded-sm border border-[var(--project-border)] bg-[var(--project-surface)]">
          <img src={section.image} alt={`${section.title} map`} className="w-full object-contain" loading="lazy" />
        </div>
        {section.buildings && section.buildings.length > 0 ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.buildings.map((b) => (
              <article key={b.id} className="project-surface border border-[var(--project-border)] p-4">
                <h3 className="project-heading text-sm font-medium uppercase tracking-[0.08em]">{b.title}</h3>
                <p className="project-body-font project-text-muted mt-2 text-xs leading-relaxed">{b.body}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
