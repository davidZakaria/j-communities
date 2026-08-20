import { Link } from "react-router-dom";
import { LF_TYPE } from "../config/lookFeel";
import type { NewsListItem } from "../features/news/types";
import { categoryLabel, formatNewsDate, isRtl, newsCover } from "../features/news/utils";

interface NewsCardProps {
  article: NewsListItem;
  variant?: "default" | "featured" | "hero" | "compact";
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  const rtl = isRtl(article.language);
  const cover = newsCover(article);

  if (variant === "hero") {
    return (
      <article dir={rtl ? "rtl" : "ltr"} className="group relative overflow-hidden bg-j-charcoal">
        <Link to={`/news/${article.slug}`} className="block text-inherit no-underline">
          <div className="relative aspect-[16/9] max-h-[520px] w-full overflow-hidden lg:aspect-[21/9]">
            <img
              src={cover}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-j-black/85 via-j-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex border border-j-offwhite/40 px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-offwhite">
                  {categoryLabel(article.category)}
                </span>
                <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-j-offwhite/75">
                  {article.source}
                </span>
              </div>
              <h2 className="max-w-4xl font-serif text-[clamp(1.5rem,4vw,2.75rem)] font-medium leading-tight tracking-[0.02em] text-j-offwhite">
                {article.title}
              </h2>
              <p className="mt-4 max-w-3xl font-serif text-[15px] leading-relaxed text-j-offwhite/85">{article.excerpt}</p>
              <p className="mt-5 font-sans text-[10px] uppercase tracking-[0.16em] text-j-offwhite/70">
                {formatNewsDate(article.publishedAt)} · Read story
              </p>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article dir={rtl ? "rtl" : "ltr"} className="group overflow-hidden border border-j-charcoal/10 bg-j-offwhite">
        <Link to={`/news/${article.slug}`} className="grid grid-cols-[112px_1fr] text-inherit no-underline sm:grid-cols-[140px_1fr]">
          <div className="relative h-full min-h-[112px] overflow-hidden">
            <img src={cover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" loading="lazy" />
          </div>
          <div className="flex flex-col justify-center p-4 sm:p-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-j-slate">
              {formatNewsDate(article.publishedAt)} · {article.source}
            </p>
            <h3 className="mt-2 font-serif text-[1rem] font-medium leading-snug tracking-[0.02em] text-j-charcoal group-hover:text-j-black">
              {article.title}
            </h3>
          </div>
        </Link>
      </article>
    );
  }

  const isFeatured = variant === "featured";

  return (
    <article
      dir={rtl ? "rtl" : "ltr"}
      className={`group flex h-full flex-col overflow-hidden border border-j-charcoal/10 bg-j-offwhite transition-shadow hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)] ${
        isFeatured ? "lg:flex-row" : ""
      }`}
    >
      <Link to={`/news/${article.slug}`} className={`block overflow-hidden text-inherit no-underline ${isFeatured ? "lg:w-[52%]" : ""}`}>
        <div className={`relative overflow-hidden ${isFeatured ? "h-full min-h-[240px] lg:min-h-[320px]" : "aspect-[16/10]"}`}>
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-j-black/50 via-transparent to-transparent opacity-80" />
        </div>
      </Link>

      <div className={`flex flex-1 flex-col p-6 sm:p-7 ${isFeatured ? "lg:p-9" : ""}`}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex border px-2 py-1 ${LF_TYPE.cardTag} border-j-slate/50 text-j-slate`}>
            {categoryLabel(article.category)}
          </span>
          <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-j-slate">{article.source}</span>
        </div>

        <h3 className={`text-j-charcoal ${isFeatured ? LF_TYPE.cardTitle : "font-serif text-[clamp(1.05rem,2.2vw,1.35rem)] font-medium leading-snug tracking-[0.02em]"}`}>
          <Link to={`/news/${article.slug}`} className="border-b border-transparent hover:border-j-charcoal">
            {article.title}
          </Link>
        </h3>

        <p className="mt-4 flex-1 font-serif text-[14px] leading-relaxed tracking-[0.02em] text-j-slate">{article.excerpt}</p>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-j-charcoal/10 pt-4">
          <time dateTime={article.publishedAt} className="font-sans text-[10px] uppercase tracking-[0.14em] text-j-slate">
            {formatNewsDate(article.publishedAt)}
          </time>
          <Link
            to={`/news/${article.slug}`}
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-charcoal hover:text-j-slate"
          >
            Read story
          </Link>
        </div>
      </div>
    </article>
  );
}
