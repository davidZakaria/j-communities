import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { LF_TYPE } from "../config/lookFeel";
import { site } from "../config/site";
import { getProjectBySlug, type ProjectCategory } from "../data/projects";
import { Footer } from "../components/Footer";
import { GrowSection } from "../components/GrowSection";
import { LookFeelCanvas } from "../components/LookFeelCanvas";


function categoryShort(cat: ProjectCategory): string {
  const map: Record<ProjectCategory, string> = {
    residential: "Residential",
    coastal: "Coastal",
    "mixed-use": "Mixed-use",
  };
  return map[cat];
}

export function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    if (!project) return;
    document.title = `${project.name} · ${site.defaultTitle}`;
    return () => {
      document.title = site.defaultTitle;
    };
  }, [project]);

  if (!project) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <main id="main-content" className="lf-canvas-clip bg-j-black">
      <LookFeelCanvas>
        <section className="border-b border-j-charcoal/15 bg-j-offwhite px-5 py-10 text-j-black sm:px-8 sm:py-12 md:px-10 lg:px-16 xl:px-20 xl:py-[72px]">
          <GrowSection>
            <p className={`mb-4 font-medium text-j-slate ${LF_TYPE.projectsKicker}`}>Portfolio</p>
            <Link
              to="/#projects"
              className={`mb-10 inline-block border-b border-transparent font-normal text-j-slate transition-colors hover:border-j-charcoal ${LF_TYPE.footerLink}`}
            >
              ← Back to all projects
            </Link>
            <p className={`mb-3 font-medium uppercase tracking-[0.28em] text-j-slate ${LF_TYPE.cardTag}`}>
              {categoryShort(project.category)}
            </p>
            <h1 className={`mb-4 font-serif font-medium text-j-charcoal ${LF_TYPE.projectsTitle}`}>{project.name}</h1>
            {project.location ? (
              <p className={`mb-10 text-j-slate ${LF_TYPE.projectsLead}`}>{project.location}</p>
            ) : null}
            <p className={`max-w-[640px] font-normal text-j-slate ${LF_TYPE.projectsLead}`}>{project.summary}</p>
          </GrowSection>
        </section>
        <Footer />
      </LookFeelCanvas>
    </main>
  );
}
