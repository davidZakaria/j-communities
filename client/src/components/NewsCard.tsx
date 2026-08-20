import { Link } from "react-router-dom";
import { LF_TYPE } from "../config/lookFeel";
import type { NewsListItem } from "../features/news/types";
import { categoryLabel, formatNewsDate, isRtl, newsCover } from "../features/news/utils";

interface NewsCardProps {
  article: NewsListItem;
  variant?: "default" | "featured" | "hero" | "compact" | "teaserFeatured" | "teaserSide";
}

function NewsCategoryBadge({ category }: { category: NewsListItem["category"] }) {
  return (
    <span className="inline-flex border border-jamila-blue/30 bg-jamila-blue px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-jamila-lemon">
      {categoryLabel(category)}
    </span>
  );
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  const rtl = isRtl(article.language);
  const cover = newsCover(article);

  if (variant === "teaserFeatured") {
    return (
      <article dir={rtl ? "rtl" : "ltr"} className="group flex h-full w-full min-w-0 flex-col overflow-hidden">
        <Link to={`/news/${article.slug}`} className="block overflow-hidden text-inherit no-underline">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-j-charcoal/5">
            <img
              src={cover}
              alt=""
              className="absolute inset-0 block h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-jamila-lemon" aria-hidden />
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-j-black/55 via-j-black/10 to-transparent opacity-90" />
            <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6">
              <NewsCategoryBadge category={article.category} />
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[10px] uppercase tracking-[0.14em] text-j-slate">
            <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{article.source}</span>
            {article.language === "ar" ? (
              <>
                <span aria-hidden>·</span>
                <span className="border border-jamila-teal/40 px-1.5 py-0.5 text-[9px] text-jamila-teal">Arabic</span>
              </>
            ) : null}
          </div>

          <h3 className={`text-j-charcoal ${LF_TYPE.cardTitle}`}>
            <Link to={`/news/${article.slug}`} className="border-b border-transparent text-inherit no-underline hover:border-jamila-blue">
              {article.title}
            </Link>
          </h3>

          <p className="mt-4 line-clamp-3 flex-1 font-serif text-[15px] leading-relaxed tracking-[0.02em] text-j-slate">
            {article.excerpt}
          </p>

          <Link
            to={`/news/${article.slug}`}
            className="mt-6 inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-jamila-blue no-underline transition-colors hover:text-j-charcoal"
          >
            Read story
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </article>
    );
  }

  if (variant === "teaserSide") {
    return (
      <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden transition-colors hover:bg-j-black/[0.02]">
        <Link to={`/news/${article.slug}`} className="flex h-full min-w-0 flex-col text-inherit no-underline">
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-j-charcoal/5">
            <img
              src={cover}
              alt=""
              className="absolute inset-0 block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 bg-jamila-lemon" aria-hidden />
          </div>

          <div
            dir={rtl ? "rtl" : "ltr"}
            className="flex min-h-0 flex-1 flex-col justify-center border-t border-j-charcoal/8 px-4 py-4 sm:px-5 sm:py-5"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <NewsCategoryBadge category={article.category} />
              {article.language === "ar" ? (
                <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-jamila-teal">AR</span>
              ) : null}
            </div>
            <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-j-slate">
              {formatNewsDate(article.publishedAt)} · {article.source}
            </p>
            <h3
              className={`mt-2 line-clamp-2 font-serif text-[0.95rem] font-medium leading-snug tracking-[0.02em] text-j-charcoal group-hover:text-jamila-blue sm:line-clamp-3 sm:text-[1.05rem] ${
                rtl ? "text-right" : "text-left"
              }`}
            >
              {article.title}
            </h3>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "hero") {
    return (
      <article dir={rtl ? "rtl" : "ltr"} className="group grid overflow-hidden border border-j-charcoal/10 bg-j-offwhite lg:grid-cols-12">
        <Link
          to={`/news/${article.slug}`}
          className="relative block overflow-hidden text-inherit no-underline lg:col-span-7"
        >
          <div className="relative aspect-[16/10] w-full lg:aspect-auto lg:min-h-[420px] lg:h-full">
            <img
              src={cover}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="eager"
            />
            <div className="absolute inset-x-0 top-0 h-1 bg-jamila-lemon" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-t from-j-black/60 via-j-black/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-j-black/20" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:hidden">
              <NewsCategoryBadge category={article.category} />
            </div>
          </div>
        </Link>

        <div className="flex flex-col justify-center border-t border-j-charcoal/10 p-6 sm:p-8 lg:col-span-5 lg:border-t-0 lg:border-s lg:p-10 xl:p-12">
          <div className="mb-4 hidden lg:block">
            <NewsCategoryBadge category={article.category} />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[10px] uppercase tracking-[0.14em] text-j-slate">
            <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{article.source}</span>
            {article.language === "ar" ? (
              <>
                <span aria-hidden>·</span>
                <span className="border border-jamila-teal/40 px-1.5 py-0.5 text-[9px] text-jamila-teal">Arabic</span>
              </>
            ) : null}
          </div>

          <h2 className="font-serif text-[clamp(1.65rem,3.2vw,2.5rem)] font-medium leading-tight tracking-[0.02em] text-j-charcoal">
            <Link to={`/news/${article.slug}`} className="border-b border-transparent text-inherit no-underline hover:border-jamila-blue">
              {article.title}
            </Link>
          </h2>

          <p className="mt-4 max-w-xl font-serif text-[16px] leading-relaxed tracking-[0.02em] text-j-slate">{article.excerpt}</p>

          <Link
            to={`/news/${article.slug}`}
            className="mt-8 inline-flex min-h-[44px] items-center gap-2 border border-j-charcoal/20 px-5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-j-charcoal no-underline transition-colors hover:border-jamila-blue hover:bg-jamila-blue hover:text-jamila-lemon"
          >
            Read story
            <span aria-hidden>→</span>
          </Link>
        </div>
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
          <div className="absolute inset-x-0 top-0 h-0.5 bg-jamila-lemon opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
        </div>
      </Link>

      <div className={`flex flex-1 flex-col p-6 sm:p-7 ${isFeatured ? "lg:p-9" : ""}`}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <NewsCategoryBadge category={article.category} />
          <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-j-slate">{article.source}</span>
        </div>

        <h3 className={`text-j-charcoal ${isFeatured ? LF_TYPE.cardTitle : "font-serif text-[clamp(1.05rem,2.2vw,1.35rem)] font-medium leading-snug tracking-[0.02em]"}`}>
          <Link to={`/news/${article.slug}`} className="border-b border-transparent text-inherit no-underline hover:border-jamila-blue">
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
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-jamila-blue no-underline hover:text-j-charcoal"
          >
            Read story
          </Link>
        </div>
      </div>
    </article>
  );
}
