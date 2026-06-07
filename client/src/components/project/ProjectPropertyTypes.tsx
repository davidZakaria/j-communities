import { useState } from "react";
import type { ProjectPropertyTypesSection } from "../../content/projects/types";

export function ProjectPropertyTypes({ section }: { section: ProjectPropertyTypesSection }) {
  const [open, setOpen] = useState(0);

  return (
    <section id={section.id} className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <h2 className="project-heading mb-10 text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase tracking-[0.06em]">
        {section.title}
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {section.items.map((item, i) => (
          <article key={item.title} className="project-surface border border-[var(--project-border)]">
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4 text-left sm:px-6"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <span className="project-heading text-lg font-medium uppercase tracking-[0.06em]">{item.title}</span>
              <span className="project-text-muted">{open === i ? "−" : "+"}</span>
            </button>
            {open === i ? (
              <p className="project-body-font project-text-muted border-t border-[var(--project-border)] px-5 py-4 text-sm leading-relaxed sm:px-6">
                {item.body}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
