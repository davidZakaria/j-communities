import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { absoluteUrl, site } from "../config/site";
import { LF_TYPE } from "../config/lookFeel";
import { getNewsBySlug, getRelatedNews } from "../data/news";
import { Footer } from "../components/Footer";
import { GrowSection } from "../components/GrowSection";
import { LookFeelCanvas } from "../components/LookFeelCanvas";
import { NewsCardCompact } from "../components/NewsCard";
import { NewsPageHeader } from "../components/NewsPageHeader";

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

function formatNewsDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(new Date(iso));
}

export function NewsDetailPage() {
  const { slug } = useParams();
  const article = getNewsBySlug(slug);
  const related = article ? getRelatedNews(article.slug, 4) : [];

  useEffect(() => {
    if (!article) return;

    const title = `${article.title} · ${site.defaultTitle}`;
    document.title = title;

    const desc = article.excerpt;
    const canonical = `${site.origin}/news/${article.slug}`;

    setMeta("name", "description", desc);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", "article");
    setMeta("property", "og:image", absoluteUrl(site.ogImagePath));
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", absoluteUrl(site.ogImagePath));

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    return () => {
      document.title = site.defaultTitle;
    };
  }, [article]);

  if (!article) {
    return <Navigate to="/not-found" replace />;
  }

  const isRtl = article.language === "ar";
  const categoryLabel = article.category === "social" ? "Social media" : "Press coverage";
  const ctaLabel = article.category === "social" ? "View original post" : "Read full article";

  return (
    <main id="main-content" className="lf-canvas-clip bg-j-black">
      <LookFeelCanvas>
        <NewsPageHeader />

        <article
          className="border-b border-j-charcoal/10 bg-j-offwhite px-5 py-12 text-j-charcoal sm:px-8 md:px-12 lg:px-16 lg:py-16 xl:px-20"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <GrowSection>
            <Link
              to="/news"
              className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-j-slate hover:text-j-charcoal"
            >
              ← All news
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex border border-j-slate/50 px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-slate">
                {categoryLabel}
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-j-slate">{article.source}</span>
              <time dateTime={article.publishedAt} className="font-sans text-[10px] uppercase tracking-[0.16em] text-j-slate">
                {formatNewsDate(article.publishedAt)}
              </time>
            </div>

            <h1 className="mt-6 max-w-[980px] font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-tight tracking-[0.02em] text-j-charcoal">
              {article.title}
            </h1>

            <p className={`mt-8 max-w-[760px] ${LF_TYPE.introBody}`}>{article.excerpt}</p>

            <div className="mt-10 max-w-[760px] rounded-sm border border-j-charcoal/10 bg-j-footer px-6 py-6 sm:px-8">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-j-slate">
                Published on {article.source}
              </p>
              <p className="mt-3 font-serif text-[15px] leading-relaxed text-j-charcoal">
                This story appears on an external {article.category === "social" ? "social platform" : "publication"}. Open
                the original link below for the full {article.category === "social" ? "post" : "article"}.
              </p>
              <a
                href={article.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[48px] items-center border border-j-charcoal bg-j-charcoal px-6 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-j-offwhite transition-colors hover:bg-j-black"
              >
                {ctaLabel}
              </a>
            </div>
          </GrowSection>
        </article>

        {related.length > 0 ? (
          <section className="bg-j-footer px-5 py-12 text-j-charcoal sm:px-8 md:px-12 lg:px-16 lg:py-14 xl:px-20">
            <GrowSection>
              <h2 className={`mb-6 text-j-charcoal ${LF_TYPE.footerColTitle}`}>More coverage</h2>
              <div className="max-w-3xl">
                {related.map((item) => (
                  <NewsCardCompact key={item.slug} article={item} />
                ))}
              </div>
            </GrowSection>
          </section>
        ) : null}

        <Footer />
      </LookFeelCanvas>
    </main>
  );
}
