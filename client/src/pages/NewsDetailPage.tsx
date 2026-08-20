import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { absoluteUrl, site } from "../config/site";
import { LF_TYPE } from "../config/lookFeel";
import { fetchPublicNewsArticle } from "../features/news/api";
import type { NewsArticle, NewsListItem } from "../features/news/types";
import { categoryLabel, formatNewsDate, isRtl, newsCover } from "../features/news/utils";
import { Footer } from "../components/Footer";
import { GrowSection } from "../components/GrowSection";
import { LookFeelCanvas } from "../components/LookFeelCanvas";
import { NewsBody } from "../components/NewsBody";
import { NewsCard } from "../components/NewsCard";
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

export function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [related, setRelated] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetchPublicNewsArticle(slug)
      .then((res) => {
        if (cancelled) return;
        setArticle(res.article);
        setRelated(res.related);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!article) return;

    const title = `${article.title} · ${site.defaultTitle}`;
    document.title = title;

    const desc = article.excerpt;
    const canonical = `${site.origin}/news/${article.slug}`;
    const ogImage = absoluteUrl(newsCover(article));

    setMeta("name", "description", desc);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", "article");
    setMeta("property", "og:image", ogImage);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", ogImage);

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

  if (notFound) return <Navigate to="/not-found" replace />;

  if (loading || !article) {
    return (
      <main id="main-content" className="lf-canvas-clip bg-j-black">
        <LookFeelCanvas>
          <NewsPageHeader />
          <div className="animate-pulse bg-j-offwhite px-5 py-16 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            <div className="aspect-[21/9] bg-j-charcoal/10" />
            <div className="mx-auto mt-10 max-w-3xl space-y-4">
              <div className="h-4 w-1/3 bg-j-charcoal/10" />
              <div className="h-10 bg-j-charcoal/10" />
              <div className="h-24 bg-j-charcoal/10" />
            </div>
          </div>
        </LookFeelCanvas>
      </main>
    );
  }

  const rtl = isRtl(article.language);
  const cover = newsCover(article);

  return (
    <main id="main-content" className="lf-canvas-clip bg-j-black">
      <LookFeelCanvas>
        <NewsPageHeader />

        <article dir={rtl ? "rtl" : "ltr"}>
          <div className="relative overflow-hidden bg-j-charcoal">
            <div className="relative aspect-[16/9] max-h-[560px] w-full lg:aspect-[21/9]">
              <img src={cover} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-j-black/80 via-j-black/30 to-j-black/10" />
            </div>
          </div>

          <div className="border-b border-j-charcoal/10 bg-j-offwhite px-5 py-10 text-j-charcoal sm:px-8 md:px-12 lg:px-16 lg:py-14 xl:px-20">
            <GrowSection>
              <Link
                to="/news"
                className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-j-slate hover:text-j-charcoal"
              >
                ← All news
              </Link>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="inline-flex border border-j-slate/50 px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-slate">
                  {categoryLabel(article.category)}
                </span>
                <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-j-slate">{article.source}</span>
                <time dateTime={article.publishedAt} className="font-sans text-[10px] uppercase tracking-[0.16em] text-j-slate">
                  {formatNewsDate(article.publishedAt, "long")}
                </time>
              </div>

              <h1 className="mt-6 max-w-[980px] font-serif text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight tracking-[0.02em] text-j-charcoal">
                {article.title}
              </h1>

              <p className={`mt-6 max-w-[760px] text-j-slate ${LF_TYPE.introBody}`}>{article.excerpt}</p>
            </GrowSection>
          </div>

          <div className="bg-j-footer px-5 py-12 text-j-charcoal sm:px-8 md:px-12 lg:px-16 lg:py-16 xl:px-20">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
              <GrowSection>
                <NewsBody body={article.body} />

                {article.externalUrl ? (
                  <div className="mt-10 max-w-3xl rounded-sm border border-j-charcoal/10 bg-j-offwhite px-6 py-6 sm:px-8">
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-j-slate">
                      Original coverage
                    </p>
                    <p className="mt-3 font-serif text-[15px] leading-relaxed text-j-charcoal">
                      This story was also published by {article.source}. Read the original article for full context.
                    </p>
                    <a
                      href={article.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex min-h-[48px] items-center border border-j-charcoal px-6 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-j-charcoal transition-colors hover:bg-j-charcoal hover:text-j-offwhite"
                    >
                      View on {article.source}
                    </a>
                  </div>
                ) : null}
              </GrowSection>

              {related.length > 0 ? (
                <aside>
                  <h2 className={`mb-5 text-j-charcoal ${LF_TYPE.footerColTitle}`}>More coverage</h2>
                  <div className="space-y-4">
                    {related.map((item) => (
                      <NewsCard key={item.slug} article={item} variant="compact" />
                    ))}
                  </div>
                </aside>
              ) : null}
            </div>
          </div>
        </article>

        <Footer />
      </LookFeelCanvas>
    </main>
  );
}
