import type { ProjectSplitSection, ProjectGatewaySection } from "../../content/projects/types";

export function ProjectSplit({ section }: { section: ProjectSplitSection }) {
  const imageRight = section.imagePosition !== "left";

  return (
    <section id={section.id} className="border-y border-[var(--project-border)] bg-[var(--project-bg)]">
      <div
        className={`mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 ${imageRight ? "" : "lg:[&>*:first-child]:order-2"}`}
      >
        <div>
          {section.kicker ? (
            <p className="project-body-font project-text-muted mb-3 text-[10px] font-semibold uppercase tracking-[0.3em]">
              {section.kicker}
            </p>
          ) : null}
          <h2 className="project-heading mb-5 text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase leading-[1.2] tracking-[0.06em]">
            {section.title}
          </h2>
          <p className="project-body-font project-text-muted text-sm leading-[1.85] sm:text-base">{section.body}</p>
        </div>
        {section.image ? (
          <div className="overflow-hidden rounded-sm border border-[var(--project-border)]">
            <img src={section.image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ProjectGateway({ section }: { section: ProjectGatewaySection }) {
  return (
    <section id={section.id} className="project-surface px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="project-heading mb-10 text-center text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase tracking-[0.06em]">
          {section.title}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {section.items.map((item) => (
            <article key={item.title} className="project-surface-alt border border-[var(--project-border)] p-6 sm:p-8">
              <h3 className="project-heading mb-4 text-lg font-medium uppercase tracking-[0.08em] text-[var(--project-accent)]">
                {item.title}
              </h3>
              <p className="project-body-font project-text-muted text-sm leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
