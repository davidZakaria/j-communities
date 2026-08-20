import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COPY } from "../content/siteCopy";
import { LF_TYPE } from "../config/lookFeel";
import { fetchPublicNews } from "../features/news/api";
import type { NewsListItem } from "../features/news/types";
import { GrowSection } from "./GrowSection";
import { NewsCard } from "./NewsCard";

export function NewsTeaser() {
  const [articles, setArticles] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPublicNews({ limit: 3 })
      .then((res) => {
        if (!cancelled) setArticles(res.articles.slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setArticles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [hero, ...side] = articles;

  return (
    <section
      id="news"
      className="j-news-teaser w-full scroll-mt-4 border-t border-j-charcoal/10 bg-j-offwhite px-5 py-11 text-j-charcoal sm:px-8 sm:py-12 md:px-10 lg:px-16 lg:py-16 xl:px-20"
    >
      <GrowSection>
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-jamila-lemon" aria-hidden />
              <p className={`text-jamila-blue ${LF_TYPE.projectsKicker}`}>{COPY.news.kicker}</p>
            </div>
            <h2 className={`text-j-charcoal ${LF_TYPE.projectsTitle}`}>{COPY.news.title}</h2>
            <p className={`mt-4 max-w-[640px] ${LF_TYPE.projectsLead}`}>{COPY.news.lead}</p>
          </div>
          <Link to="/news" className="j-news-teaser-cta group inline-flex min-h-[48px] shrink-0 items-center gap-3 no-underline">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-charcoal transition-colors group-hover:text-jamila-blue">
              {COPY.news.viewAll}
            </span>
            <span
              className="inline-flex h-10 w-10 items-center justify-center border border-j-charcoal/25 bg-j-charcoal text-j-offwhite transition-colors group-hover:border-jamila-blue group-hover:bg-jamila-blue"
              aria-hidden
            >
              →
            </span>
          </Link>
        </div>
      </GrowSection>

      {loading ? (
        <div className="grid gap-px bg-j-slate/15 lg:grid-cols-12">
          <div className="animate-pulse bg-j-offwhite lg:col-span-7">
            <div className="aspect-[16/10] bg-j-charcoal/10" />
            <div className="space-y-3 p-6 sm:p-8">
              <div className="h-3 w-24 bg-j-charcoal/10" />
              <div className="h-8 w-full bg-j-charcoal/10" />
              <div className="h-16 w-full bg-j-charcoal/10" />
            </div>
          </div>
          <div className="flex flex-col gap-px bg-j-slate/15 lg:col-span-5">
            <div className="min-h-[168px] animate-pulse bg-j-offwhite" />
            <div className="min-h-[168px] animate-pulse bg-j-offwhite" />
          </div>
        </div>
      ) : articles.length === 0 ? (
        <p className="font-serif text-j-slate">News will appear here soon.</p>
      ) : (
        <div className="grid gap-px bg-j-slate/15 lg:grid-cols-12 lg:items-stretch">
          {hero ? (
            <GrowSection className="flex bg-j-offwhite lg:col-span-7">
              <NewsCard article={hero} variant="teaserFeatured" />
            </GrowSection>
          ) : null}
          <div className="grid gap-px bg-j-slate/15 lg:col-span-5 lg:grid-rows-2 lg:self-stretch">
            {side.map((article) => (
              <GrowSection key={article.slug} className="flex min-h-[180px] bg-j-offwhite lg:min-h-0">
                <NewsCard article={article} variant="teaserSide" />
              </GrowSection>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
