import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatedMobileMenu } from "../AnimatedMobileMenu";
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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-8 sm:py-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="project-body-font shrink-0 text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--project-muted)] transition-colors hover:text-[var(--project-text)] sm:text-[10px] sm:tracking-[0.18em]"
            >
              <span className="sm:hidden">&larr; Home</span>
              <span className="hidden sm:inline">&larr; J Communities</span>
            </Link>
            <span className="hidden h-4 w-px shrink-0 bg-[var(--project-border)] sm:block" aria-hidden />
            <span className="project-heading min-w-0 truncate text-xs font-medium uppercase tracking-[0.12em] text-[var(--project-accent)] sm:text-base sm:tracking-[0.14em]">
              {projectName}
            </span>
          </div>
          <nav className="hidden shrink-0 items-center gap-5 lg:flex" aria-label={`${projectName} sections`}>
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
          <AnimatedMobileMenu
            className="lg:hidden"
            variant="project"
            ariaLabel={`${projectName} sections`}
            items={nav.map((item) => ({ label: item.label, href: item.href }))}
          />
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
