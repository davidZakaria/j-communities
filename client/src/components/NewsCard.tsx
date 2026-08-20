import { Link } from "react-router-dom";
import type { NewsArticle, NewsCategory } from "../data/news";
import { LF_TYPE } from "../config/lookFeel";

function formatNewsDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
}

function categoryLabel(category: NewsCategory): string {
  return category === "social" ? "Social" : "Press";
}

function categoryStyle(category: NewsCategory): string {
  return category === "social"
    ? "border-j-charcoal/30 text-j-charcoal"
    : "border-j-slate/50 text-j-slate";
}

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const isRtl = article.language === "ar";

  return (
    <article
      className={`flex h-full flex-col border border-j-charcoal/10 bg-j-offwhite p-6 transition-colors hover:border-j-charcoal/25 hover:bg-j-black/[0.02] sm:p-8 ${
        featured ? "lg:p-9" : ""
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className={`inline-flex border px-2 py-1 ${LF_TYPE.cardTag} ${categoryStyle(article.category)}`}>
          {categoryLabel(article.category)}
        </span>
        <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-j-slate">{article.source}</span>
      </div>

      <h3
        className={`text-j-charcoal ${featured ? LF_TYPE.cardTitle : "font-serif text-[clamp(1.05rem,2.2vw,1.35rem)] font-medium leading-snug tracking-[0.02em]"}`}
      >
        <Link to={`/news/${article.slug}`} className="border-b border-transparent hover:border-j-charcoal">
          {article.title}
        </Link>
      </h3>

      <p className="mt-4 flex-1 font-serif text-[14px] leading-relaxed tracking-[0.02em] text-j-slate">{article.excerpt}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-j-charcoal/10 pt-4">
        <time dateTime={article.publishedAt} className="font-sans text-[10px] uppercase tracking-[0.14em] text-j-slate">
          {formatNewsDate(article.publishedAt)}
        </time>
        <Link
          to={`/news/${article.slug}`}
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-charcoal hover:text-j-slate"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}

export function NewsCardCompact({ article }: { article: NewsArticle }) {
  const isRtl = article.language === "ar";

  return (
    <article dir={isRtl ? "rtl" : "ltr"} className="border-t border-j-charcoal/10 py-4 first:border-t-0 first:pt-0">
      <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-j-slate">
        {formatNewsDate(article.publishedAt)} · {article.source}
      </p>
      <h3 className="mt-2 font-serif text-[1rem] font-medium leading-snug tracking-[0.02em] text-j-charcoal">
        <Link to={`/news/${article.slug}`} className="border-b border-transparent hover:border-j-charcoal">
          {article.title}
        </Link>
      </h3>
    </article>
  );
}
