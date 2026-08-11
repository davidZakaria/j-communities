import { useEffect, useLayoutEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getProjectContent } from "../content/projects";
import { absoluteUrl, site } from "../config/site";
import { getProjectBySlug } from "../data/projects";
import { ProjectLayout } from "../components/project/ProjectLayout";
import { ProjectSectionRenderer } from "../components/project/ProjectSectionRenderer";
import { ProjectThemeProvider } from "../components/project/ProjectThemeProvider";
import { scheduleScrollToTop, clearProjectUrlHash, scrollPageToTop } from "../utils/scrollToTop";

function setMeta(attr: "name" | "property", key: string, content: string) {
  const selector = attr === "property" ? `meta[property="${key}"]` : `meta[name="${key}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  useLayoutEffect(() => {
    clearProjectUrlHash();
    scrollPageToTop();
    return scheduleScrollToTop([0, 100, 300, 600]);
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    const content = getProjectContent(project.themeId);
    const title = `${content.meta.title} · ${site.defaultTitle}`;
    document.title = title;

    const desc = content.meta.description;
    const ogImage = content.meta.ogImage?.startsWith("http")
      ? content.meta.ogImage
      : content.meta.ogImage
        ? absoluteUrl(content.meta.ogImage)
        : absoluteUrl(site.ogImagePath);
    const canonical = `${site.origin}/projects/${project.slug}`;

    setMeta("name", "description", desc);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", ogImage);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", ogImage);

    return () => {
      document.title = site.defaultTitle;
    };
  }, [project]);

  if (!project) {
    return <Navigate to="/not-found" replace />;
  }

  const content = getProjectContent(project.themeId);

  return (
    <main id="main-content">
      <ProjectThemeProvider themeId={project.themeId}>
        <ProjectLayout
          projectName={project.name}
          projectSlug={project.slug}
          projectThemeId={project.themeId}
          nav={content.nav}
        >
          {content.sections.map((section, i) => (
            <ProjectSectionRenderer
              key={`${section.type}-${"id" in section && section.id ? section.id : i}`}
              section={section}
              projectName={project.name}
              projectSlug={project.slug}
              themeId={project.themeId}
            />
          ))}
        </ProjectLayout>
      </ProjectThemeProvider>
    </main>
  );
}
