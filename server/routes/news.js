import { Router } from "express";
import { prisma } from "../db.js";
import { serializeNewsArticle, serializeNewsListItem } from "../lib/newsArticles.js";

export const newsRouter = Router();

const VALID_CATEGORIES = new Set(["press", "social"]);

newsRouter.get("/", async (req, res) => {
  try {
    const category = String(req.query.category ?? "").trim();
    const featuredOnly = req.query.featured === "1";
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 100));

    const where = { published: true };
    if (category && VALID_CATEGORIES.has(category)) where.category = category;
    if (featuredOnly) where.featured = true;

    const articles = await prisma.newsArticle.findMany({
      where,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: limit,
    });

    return res.json({ ok: true, articles: articles.map(serializeNewsListItem) });
  } catch (err) {
    console.error("GET /api/news failed:", err?.message || err);
    return res.status(500).json({ error: "Unable to load news." });
  }
});

newsRouter.get("/:slug", async (req, res) => {
  try {
    const slug = String(req.params.slug ?? "").trim();
    if (!slug || slug.length > 120 || !/^[a-z0-9-]+$/i.test(slug)) {
      return res.status(400).json({ error: "Invalid article slug." });
    }

    const article = await prisma.newsArticle.findFirst({
      where: { slug, published: true },
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found." });
    }

    const related = await prisma.newsArticle.findMany({
      where: { published: true, slug: { not: slug } },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: 4,
    });

    return res.json({
      ok: true,
      article: serializeNewsArticle(article),
      related: related.map(serializeNewsListItem),
    });
  } catch (err) {
    console.error("GET /api/news/:slug failed:", err?.message || err);
    return res.status(500).json({ error: "Unable to load article." });
  }
});
