import type { ReactNode } from "react";

interface ProjectLinkProps {
  slug: string;
  className?: string;
  children: ReactNode;
}

/**
 * Full document navigation — guarantees scroll at top (SPA client routing kept
 * the homepage scroll depth, which landed on #gallery / #amenities etc.).
 */
export function ProjectLink({ slug, className, children }: ProjectLinkProps) {
  return (
    <a href={`/projects/${slug}`} className={className}>
      {children}
    </a>
  );
}

interface ProjectRouteLinkProps {
  to: string;
  className?: string;
  children: ReactNode;
}

export function ProjectRouteLink({ to, className, children }: ProjectRouteLinkProps) {
  if (!to.startsWith("/projects/")) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }

  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}
