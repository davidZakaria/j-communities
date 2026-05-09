import { Link } from "react-router-dom";
import { projects, type ProjectCategory } from "../data/projects";
import { COPY } from "../content/siteCopy";
import { LF, LF_TYPE } from "../config/lookFeel";
import { GrowSection } from "./GrowSection";

function categoryStyle(cat: ProjectCategory): string {
  const map: Record<ProjectCategory, string> = {
    coastal: "border-j-slate/50 text-j-slate",
    residential: "border-j-slate/50 text-j-slate",
    "mixed-use": "border-j-slate/50 text-j-slate",
  };
  return map[cat];
}

function categoryShort(cat: ProjectCategory): string {
  const map: Record<ProjectCategory, string> = {
    residential: "Residential",
    coastal: "Coastal",
    "mixed-use": "Mixed-use",
  };
  return map[cat];
}

export function ProjectsGrid() {
  const { rowMinH } = LF.projects;
  return (
    <section
      id="projects"
      className="w-full scroll-mt-4 border-t border-j-charcoal/10 bg-j-offwhite px-5 py-11 text-j-black sm:px-8 sm:py-12 md:px-10 lg:px-16 lg:pb-14 lg:pt-14 xl:px-20 xl:pb-[72px] xl:pt-[72px]"
    >
      <GrowSection>
        <p className={`mb-4 text-j-slate ${LF_TYPE.projectsKicker}`}>{COPY.projects.kicker}</p>
        <h2 className={`mb-5 text-j-charcoal ${LF_TYPE.projectsTitle}`}>{COPY.projects.title}</h2>
        <p className={`mb-14 max-w-[640px] ${LF_TYPE.projectsLead}`}>{COPY.projects.lead}</p>
      </GrowSection>
      <ul className="grid w-full grid-cols-1 gap-px bg-j-slate/20 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const card = (
            <>
              <span
                className={`mb-5 inline-flex w-fit border px-2 py-1 ${LF_TYPE.cardTag} ${categoryStyle(p.category)}`}
              >
                {categoryShort(p.category)}
              </span>
              <h3 className={`text-j-charcoal ${LF_TYPE.cardTitle}`}>{p.name}</h3>
              {p.location ? (
                <p className="mt-3 font-sans text-[13px] uppercase tracking-[0.14em] text-j-slate">{p.location}</p>
              ) : null}
              <p className="mt-4 font-serif text-[14px] leading-relaxed tracking-[0.02em] text-j-slate">
                {p.summary}
              </p>
            </>
          );

          const shell = p.externalUrl ? (
            <a
              href={p.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full text-inherit no-underline"
            >
              <article className="flex h-full flex-col p-6 transition-colors hover:bg-j-black/[0.03] sm:p-8 xl:p-9">
                {card}
              </article>
            </a>
          ) : (
            <Link to={`/projects/${p.slug}`} className="group block h-full text-inherit no-underline">
              <article className="flex h-full flex-col p-6 transition-colors hover:bg-j-black/[0.03] sm:p-8 xl:p-9">
                {card}
              </article>
            </Link>
          );

          return (
            <GrowSection key={p.slug}>
              <li className="bg-j-offwhite" style={{ minHeight: rowMinH }}>
                {shell}
              </li>
            </GrowSection>
          );
        })}
      </ul>
    </section>
  );
}
