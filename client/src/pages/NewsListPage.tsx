import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { COPY } from "../content/siteCopy";
import { site } from "../config/site";
import { LF_TYPE } from "../config/lookFeel";
import { getNewsArticles, type NewsCategory } from "../data/news";
import { Footer } from "../components/Footer";
import { GrowSection } from "../components/GrowSection";
import { LookFeelCanvas } from "../components/LookFeelCanvas";
import { NewsCard } from "../components/NewsCard";
import { NewsPageHeader } from "../components/NewsPageHeader";

type Filter = "all" | NewsCategory;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "press", label: "Press" },
  { id: "social", label: "Social" },
];

export function NewsListPage() {
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    document.title = `${COPY.news.title} · ${site.defaultTitle}`;
    return () => {
      document.title = site.defaultTitle;
    };
  }, []);
  const articles = useMemo(() => getNewsArticles(), []);
  const visible = useMemo(
    () => (filter === "all" ? articles : articles.filter((article) => article.category === filter)),
    [articles, filter],
  );
  const featured = visible.filter((article) => article.featured);
  const rest = visible.filter((article) => !article.featured);

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

          <GrowSection className="mt-10">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter news">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === item.id}
                  onClick={() => setFilter(item.id)}
                  className={`border px-3 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    filter === item.id
                      ? "border-j-charcoal bg-j-charcoal text-j-offwhite"
                      : "border-j-charcoal/20 bg-transparent text-j-charcoal hover:border-j-charcoal/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </GrowSection>
        </section>

        {featured.length > 0 ? (
          <section className="border-b border-j-charcoal/10 bg-j-footer px-5 py-12 text-j-charcoal sm:px-8 md:px-12 lg:px-16 lg:py-14 xl:px-20">
            <GrowSection>
              <h2 className={`mb-8 text-j-charcoal ${LF_TYPE.footerColTitle}`}>{COPY.news.featured}</h2>
            </GrowSection>
            <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {featured.map((article) => (
                <GrowSection key={article.slug}>
                  <li>
                    <NewsCard article={article} featured />
                  </li>
                </GrowSection>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="bg-j-offwhite px-5 py-12 text-j-charcoal sm:px-8 md:px-12 lg:px-16 lg:py-14 xl:px-20 xl:pb-[72px]">
          {rest.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((article) => (
                <GrowSection key={article.slug}>
                  <li>
                    <NewsCard article={article} />
                  </li>
                </GrowSection>
              ))}
            </ul>
          ) : (
            <p className="text-center font-serif text-j-slate">No stories match this filter yet.</p>
          )}

          <GrowSection className="mt-12 border-t border-j-charcoal/10 pt-8 text-center">
            <Link
              to="/#projects"
              className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-charcoal hover:text-j-slate"
            >
              Explore our projects
            </Link>
          </GrowSection>
        </section>

        <Footer />
      </LookFeelCanvas>
    </main>
  );
}
