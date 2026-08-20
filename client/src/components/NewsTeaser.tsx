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
      className="w-full scroll-mt-4 border-t border-j-charcoal/10 bg-j-black px-5 py-11 text-j-offwhite sm:px-8 sm:py-12 md:px-10 lg:px-16 lg:py-16 xl:px-20"
    >
      <GrowSection>
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={`mb-4 text-j-offwhite/60 ${LF_TYPE.projectsKicker}`}>{COPY.news.kicker}</p>
            <h2 className={`text-j-offwhite ${LF_TYPE.projectsTitle}`}>{COPY.news.title}</h2>
            <p className={`mt-4 max-w-[640px] text-j-offwhite/75 ${LF_TYPE.projectsLead}`}>{COPY.news.lead}</p>
          </div>
          <Link
            to="/news"
            className="inline-flex min-h-[44px] items-center border border-j-offwhite/30 px-5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-offwhite transition-colors hover:border-j-offwhite hover:bg-j-offwhite hover:text-j-black"
          >
            {COPY.news.viewAll}
          </Link>
        </div>
      </GrowSection>

      {loading ? (
        <div className="grid animate-pulse gap-6 lg:grid-cols-2">
          <div className="aspect-[16/9] bg-j-charcoal/60" />
          <div className="space-y-4">
            <div className="h-28 bg-j-charcoal/60" />
            <div className="h-28 bg-j-charcoal/60" />
          </div>
        </div>
      ) : articles.length === 0 ? (
        <p className="font-serif text-j-offwhite/70">News will appear here soon.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {hero ? (
            <GrowSection>
              <NewsCard article={hero} variant="hero" />
            </GrowSection>
          ) : null}
          <div className="flex flex-col gap-4">
            {side.map((article) => (
              <GrowSection key={article.slug}>
                <NewsCard article={article} variant="compact" />
              </GrowSection>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
