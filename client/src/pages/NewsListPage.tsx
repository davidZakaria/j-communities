import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { COPY } from "../content/siteCopy";
import { site } from "../config/site";
import { LF_TYPE } from "../config/lookFeel";
import { fetchPublicNews } from "../features/news/api";
import type { NewsCategory, NewsLanguage, NewsListItem } from "../features/news/types";
import { Footer } from "../components/Footer";
import { GrowSection } from "../components/GrowSection";
import { LookFeelCanvas } from "../components/LookFeelCanvas";
import { NewsCard } from "../components/NewsCard";
import { NewsPageHeader } from "../components/NewsPageHeader";

type CategoryFilter = "all" | NewsCategory;
type LanguageFilter = "all" | NewsLanguage;

const categoryFilters: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All types" },
  { id: "press", label: "Press" },
  { id: "social", label: "Social" },
];

const languageFilters: { id: LanguageFilter; label: string }[] = [
  { id: "all", label: "All languages" },
  { id: "en", label: "English" },
  { id: "ar", label: "Arabic" },
];

function filterButtonClass(active: boolean) {
  return active
    ? "border-j-charcoal bg-j-charcoal text-j-offwhite"
    : "border-j-charcoal/20 bg-transparent text-j-charcoal hover:border-j-charcoal/40";
}

export function NewsListPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("all");
  const [articles, setArticles] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${COPY.news.title} · ${site.defaultTitle}`;
    return () => {
      document.title = site.defaultTitle;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPublicNews({
      category: categoryFilter === "all" ? undefined : categoryFilter,
      language: languageFilter === "all" ? undefined : languageFilter,
    })
      .then((res) => {
        if (!cancelled) setArticles(res.articles);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load news.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryFilter, languageFilter]);

  const hero = useMemo(() => articles.find((article) => article.featured) ?? articles[0], [articles]);
  const rest = useMemo(() => articles.filter((article) => article.slug !== hero?.slug), [articles, hero]);

  return (
    <main id="main-content" className="lf-canvas-clip bg-j-black">
      <LookFeelCanvas>
        <NewsPageHeader />

        <section className="border-b border-j-charcoal/10 bg-j-offwhite px-5 py-12 text-j-charcoal sm:px-8 md:px-12 lg:px-16 lg:py-16 xl:px-20 xl:py-[72px]">
          <GrowSection>
            <p className={`mb-4 text-j-slate ${LF_TYPE.projectsKicker}`}>{COPY.news.kicker}</p>
            <h1 className={`mb-5 max-w-[980px] text-j-charcoal ${LF_TYPE.projectsTitle}`}>{COPY.news.title}</h1>
            <p className={`max-w-[720px] ${LF_TYPE.projectsLead}`}>{COPY.news.lead}</p>
          </GrowSection>

          <GrowSection className="mt-10 space-y-4">
            <div>
              <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-slate">
                {COPY.news.filterCategory}
              </p>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter news by category">
                {categoryFilters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={categoryFilter === item.id}
                    onClick={() => setCategoryFilter(item.id)}
                    className={`border px-3 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${filterButtonClass(categoryFilter === item.id)}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-slate">
                {COPY.news.filterLanguage}
              </p>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter news by language">
                {languageFilters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={languageFilter === item.id}
                    onClick={() => setLanguageFilter(item.id)}
                    className={`border px-3 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${filterButtonClass(languageFilter === item.id)}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </GrowSection>
        </section>

        {error ? (
          <section className="border-b border-red-200 bg-red-50 px-5 py-6 text-sm text-red-800 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            {error}
          </section>
        ) : null}

        {loading ? (
          <section className="bg-j-black px-5 py-12 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            <div className="mx-auto max-w-[1200px] animate-pulse space-y-6">
              <div className="aspect-[21/9] bg-j-charcoal/50" />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <div className="h-72 bg-j-charcoal/40" />
                <div className="h-72 bg-j-charcoal/40" />
                <div className="h-72 bg-j-charcoal/40" />
              </div>
            </div>
          </section>
        ) : (
          <>
            {hero ? (
              <section className="border-b border-j-charcoal/10 bg-j-black px-5 py-10 sm:px-8 md:px-12 lg:px-16 lg:py-12 xl:px-20">
                <GrowSection>
                  <NewsCard article={hero} variant="hero" />
                </GrowSection>
              </section>
            ) : null}

            <section className="bg-j-offwhite px-5 py-12 text-j-charcoal sm:px-8 md:px-12 lg:px-16 lg:py-14 xl:px-20 xl:pb-[72px]">
              {rest.length > 0 ? (
                <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {rest.map((article) => (
                    <GrowSection key={article.slug}>
                      <li>
                        <NewsCard article={article} variant={article.featured ? "featured" : "default"} />
                      </li>
                    </GrowSection>
                  ))}
                </ul>
              ) : !hero ? (
                <p className="text-center font-serif text-j-slate">No stories match these filters yet.</p>
              ) : null}

              <GrowSection className="mt-12 border-t border-j-charcoal/10 pt-8 text-center">
                <Link
                  to="/#projects"
                  className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-charcoal hover:text-j-slate"
                >
                  Explore our projects
                </Link>
              </GrowSection>
            </section>
          </>
        )}

        <Footer />
      </LookFeelCanvas>
    </main>
  );
}
