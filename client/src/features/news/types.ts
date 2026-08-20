export type NewsCategory = "press" | "social";
export type NewsLanguage = "en" | "ar";

export interface NewsListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  source: string;
  externalUrl: string | null;
  category: NewsCategory;
  language: NewsLanguage;
  featured: boolean;
  coverImageUrl: string | null;
}

export interface NewsArticle extends NewsListItem {
  body: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsListResponse {
  ok: boolean;
  articles: NewsListItem[];
}

export interface NewsDetailResponse {
  ok: boolean;
  article: NewsArticle;
  related: NewsListItem[];
}

export const DEFAULT_NEWS_COVER = "/assets/projects/jamila/hero.webp";
