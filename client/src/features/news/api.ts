import type { NewsCategory, NewsDetailResponse, NewsLanguage, NewsListResponse } from "./types";

const base = "/api/news";

export async function fetchPublicNews(options?: {
  category?: NewsCategory;
  language?: NewsLanguage;
  featured?: boolean;
  limit?: number;
}): Promise<NewsListResponse> {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.language) params.set("language", options.language);
  if (options?.featured) params.set("featured", "1");
  if (options?.limit) params.set("limit", String(options.limit));

  const qs = params.toString();
  const res = await fetch(`${base}${qs ? `?${qs}` : ""}`, {
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });
  const data = (await res.json().catch(() => null)) as { error?: string } & NewsListResponse;
  if (!res.ok) throw new Error(data?.error || "Unable to load news.");
  return data;
}

export async function fetchPublicNewsArticle(slug: string): Promise<NewsDetailResponse> {
  const res = await fetch(`${base}/${encodeURIComponent(slug)}`, {
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });
  const data = (await res.json().catch(() => null)) as { error?: string } & NewsDetailResponse;
  if (!res.ok) throw new Error(data?.error || "Unable to load article.");
  return data;
}
