import type { ProjectFloorPlansSection } from "../../content/projects/types";

export function ProjectFloorPlans({ section }: { section: ProjectFloorPlansSection }) {
  return (
    <section id={section.id} className="project-surface-alt px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="project-heading mb-10 text-center text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase tracking-[0.06em]">
          {section.title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.items.map((item) => (
            <article key={item.title} className="project-surface flex flex-col border border-[var(--project-border)] p-6">
              <h3 className="project-heading text-xl font-medium uppercase tracking-[0.06em]">{item.title}</h3>
              <p className="project-body-font project-text-muted mt-2 text-sm">{item.area}</p>
              <a
                href="#contact"
                className="project-body-font mt-auto inline-flex min-h-[44px] items-center pt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--project-accent)] hover:underline"
              >
                {item.ctaLabel ?? "Reserve your unit"}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
