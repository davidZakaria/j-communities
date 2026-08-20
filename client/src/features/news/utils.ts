import type { NewsCategory, NewsLanguage, NewsListItem } from "./types";
import { DEFAULT_NEWS_COVER } from "./types";

export function newsCover(article: Pick<NewsListItem, "coverImageUrl">): string {
  return article.coverImageUrl || DEFAULT_NEWS_COVER;
}

export function formatNewsDate(iso: string, style: "medium" | "long" = "medium") {
  return new Intl.DateTimeFormat(undefined, { dateStyle: style }).format(new Date(iso));
}

export function categoryLabel(category: NewsCategory): string {
  return category === "social" ? "Social" : "Press";
}

export function languageLabel(language: NewsLanguage): string {
  return language === "ar" ? "Arabic" : "English";
}

export function isRtl(language: NewsLanguage): boolean {
  return language === "ar";
}

export function splitNewsBody(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
