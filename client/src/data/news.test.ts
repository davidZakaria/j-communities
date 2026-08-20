import { describe, expect, it } from "vitest";
import { getNewsArticles, getNewsBySlug } from "./news";

describe("news data", () => {
  it("includes all seeded articles with unique slugs", () => {
    const articles = getNewsArticles();
    expect(articles.length).toBe(15);
    expect(new Set(articles.map((a) => a.slug)).size).toBe(15);
  });

  it("resolves articles by slug", () => {
    expect(getNewsBySlug("tadawul-news-en-jamila-handover")?.source).toBe("Tadawul News");
    expect(getNewsBySlug("missing-slug")).toBeUndefined();
  });
});
