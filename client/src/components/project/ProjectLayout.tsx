import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { ProjectNavItem } from "../../content/projects/types";

export interface ProjectLayoutProps {
  projectName: string;
  nav: ProjectNavItem[];
  children: ReactNode;
}

export function ProjectLayout({ projectName, nav, children }: ProjectLayoutProps) {

  return (
    <div className="project-layout">
      <header className="project-header sticky top-0 z-50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <Link
              to="/"
              className="project-body-font shrink-0 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--project-muted)] transition-colors hover:text-[var(--project-text)]"
            >
              &larr; J Communities
            </Link>
            <span className="hidden h-4 w-px bg-[var(--project-border)] sm:block" aria-hidden />
            <span className="project-heading truncate text-sm font-medium uppercase tracking-[0.14em] text-[var(--project-accent)] sm:text-base">
              {projectName}
            </span>
          </div>
          <nav className="hidden items-center gap-5 lg:flex" aria-label={`${projectName} sections`}>
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="project-body-font whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--project-muted)] transition-colors hover:text-[var(--project-accent)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <details className="relative lg:hidden">
            <summary className="project-body-font cursor-pointer list-none text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--project-text)] [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="project-surface absolute right-0 top-full z-50 mt-2 min-w-[12rem] rounded-sm border border-[var(--project-border)] py-2 shadow-lg">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="project-body-font block px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-[var(--project-text)] hover:text-[var(--project-accent)]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </details>
        </div>
      </header>
      <div className="project-main">{children}</div>
      <footer className="border-t border-[var(--project-border)] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link
            to="/#projects"
            className="project-body-font text-[10px] uppercase tracking-[0.16em] text-[var(--project-muted)] hover:text-[var(--project-accent)]"
          >
            &larr; All projects
          </Link>
          <p className="project-body-font text-[10px] uppercase tracking-[0.12em] text-[var(--project-muted)]">
            &copy; J Communities &middot; {projectName}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ProjectLayout;
