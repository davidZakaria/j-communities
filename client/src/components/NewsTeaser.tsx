import { Link } from "react-router-dom";
import { COPY } from "../content/siteCopy";
import { LF_TYPE } from "../config/lookFeel";
import { getFeaturedNews } from "../data/news";
import { GrowSection } from "./GrowSection";
import { NewsCardCompact } from "./NewsCard";

export function NewsTeaser() {
  const featured = getFeaturedNews(3);

  return (
    <section
      id="news"
      className="w-full scroll-mt-4 border-t border-j-charcoal/10 bg-j-footer px-5 py-11 text-j-charcoal sm:px-8 sm:py-12 md:px-10 lg:px-16 lg:py-14 xl:px-20"
    >
      <GrowSection>
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={`mb-4 text-j-slate ${LF_TYPE.projectsKicker}`}>{COPY.news.kicker}</p>
            <h2 className={`text-j-charcoal ${LF_TYPE.projectsTitle}`}>{COPY.news.title}</h2>
          </div>
          <Link
            to="/news"
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-charcoal hover:text-j-slate"
          >
            {COPY.news.viewAll}
          </Link>
        </div>
      </GrowSection>

      <div className="max-w-3xl">
        {featured.map((article) => (
          <GrowSection key={article.slug}>
            <NewsCardCompact article={article} />
          </GrowSection>
        ))}
      </div>
    </section>
  );
}
