import type { ProjectAmenitiesSection } from "../../content/projects/types";

export function ProjectAmenities({ section }: { section: ProjectAmenitiesSection }) {
  return (
    <section id={section.id} className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <h2 className="project-heading mb-10 text-center text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase tracking-[0.06em]">
        {section.title}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item) => (
          <li key={item.title} className="project-surface border border-[var(--project-border)] px-5 py-6 sm:px-6">
            <h3 className="project-heading text-base font-medium uppercase tracking-[0.06em]">{item.title}</h3>
            {item.body ? (
              <p className="project-body-font project-text-muted mt-2 text-sm leading-relaxed">{item.body}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
