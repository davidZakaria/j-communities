import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { absoluteUrl, site } from "../config/site";

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

export function DocumentMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname === "/" ? "" : pathname;
    const canonical = `${site.origin}${path}`;

    setMeta("name", "description", site.description);
    setMeta("property", "og:title", site.defaultTitle);
    setMeta("property", "og:description", site.description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:image", absoluteUrl(site.ogImagePath));
    setMeta("property", "og:site_name", site.name);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", site.defaultTitle);
    setMeta("name", "twitter:description", site.description);
    setMeta("name", "twitter:image", absoluteUrl(site.ogImagePath));

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [pathname]);

  useEffect(() => {
    const id = "jsonld-organization";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.name,
      url: site.origin,
      sameAs: [site.social.facebook, site.social.instagram, site.social.linkedin, site.social.youtube],
    });
  }, []);

  return null;
}
