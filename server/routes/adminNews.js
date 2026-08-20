import { Router } from "express";
import { prisma } from "../db.js";
import { serializeNewsArticle } from "../lib/newsArticles.js";
import { newsImageUpload, publicNewsUploadUrl } from "../lib/newsUpload.js";
import { plainTextToHtml, sanitizeArticleHtml } from "../lib/sanitizeHtml.js";
import { requireCsrf, requireJsonContentType, requireSameOrigin } from "../middleware/security.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminNewsRouter = Router();

const VALID_CATEGORIES = new Set(["press", "social"]);
const VALID_LANGUAGES = new Set(["en", "ar"]);

function parseSlug(raw) {
  const slug = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug || slug.length > 120) return null;
  return slug;
}

function validateArticleInput(body, { partial = false } = {}) {
  const errors = [];
  const data = {};

  if (!partial || body?.slug != null) {
    const slug = parseSlug(body?.slug);
    if (!slug) errors.push("Invalid slug.");
    else data.slug = slug;
  }

  if (!partial || body?.title != null) {
    const title = String(body?.title ?? "").trim();
    if (!title || title.length > 300) errors.push("Invalid title.");
    else data.title = title;
  }

  if (!partial || body?.excerpt != null) {
    const excerpt = String(body?.excerpt ?? "").trim();
    if (!excerpt || excerpt.length > 600) errors.push("Invalid excerpt.");
    else data.excerpt = excerpt;
  }

  if (!partial || body?.body != null) {
    const articleBody = String(body?.body ?? "").trim();
    if (!articleBody || articleBody.length > 50000) errors.push("Invalid body.");
    else data.body = sanitizeArticleHtml(plainTextToHtml(articleBody));
  }

  if (!partial || body?.publishedAt != null) {
    const publishedAt = new Date(String(body?.publishedAt ?? ""));
    if (Number.isNaN(publishedAt.getTime())) errors.push("Invalid published date.");
    else data.publishedAt = publishedAt;
  }

  if (!partial || body?.source != null) {
    const source = String(body?.source ?? "").trim();
    if (!source || source.length > 120) errors.push("Invalid source.");
    else data.source = source;
  }

  if (!partial || body?.externalUrl != null) {
    const externalUrl = String(body?.externalUrl ?? "").trim();
    if (externalUrl) {
      try {
        const url = new URL(externalUrl);
        if (!["http:", "https:"].includes(url.protocol)) errors.push("Invalid external URL.");
        else data.externalUrl = url.toString();
      } catch {
        errors.push("Invalid external URL.");
      }
    } else {
      data.externalUrl = null;
    }
  }

  if (!partial || body?.category != null) {
    const category = String(body?.category ?? "").trim();
    if (!VALID_CATEGORIES.has(category)) errors.push("Invalid category.");
    else data.category = category;
  }

  if (!partial || body?.language != null) {
    const language = String(body?.language ?? "").trim();
    if (!VALID_LANGUAGES.has(language)) errors.push("Invalid language.");
    else data.language = language;
  }

  if (body?.featured != null) data.featured = Boolean(body.featured);
  if (body?.published != null) data.published = Boolean(body.published);

  if (!partial || body?.coverImageUrl != null) {
    const coverImageUrl = String(body?.coverImageUrl ?? "").trim();
    if (coverImageUrl && coverImageUrl.length > 500) errors.push("Invalid cover image URL.");
    else data.coverImageUrl = coverImageUrl || null;
  }

  return { ok: errors.length === 0, errors, data };
}

adminNewsRouter.get("/", requireAdmin, async (_req, res) => {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    return res.json({ ok: true, articles: articles.map(serializeNewsArticle) });
  } catch (err) {
    console.error("GET /api/admin/news failed:", err?.message || err);
    return res.status(500).json({ error: "Unable to load news articles." });
  }
});

adminNewsRouter.post(
  "/upload",
  requireAdmin,
  requireCsrf,
  requireSameOrigin,
  (req, res) => {
    newsImageUpload.single("image")(req, res, (err) => {
      if (err) {
        const message =
          err?.code === "LIMIT_FILE_SIZE"
            ? "Image must be 5 MB or smaller."
            : err?.message || "Upload failed.";
        return res.status(400).json({ error: message });
      }
      if (!req.file) return res.status(400).json({ error: "No image provided." });
      return res.status(201).json({
        ok: true,
        url: publicNewsUploadUrl(req.file.filename),
      });
    });
  },
);

adminNewsRouter.get("/:id", requireAdmin, async (req, res) => {
  try {
    const id = String(req.params.id ?? "").trim();
    const article = await prisma.newsArticle.findUnique({ where: { id } });
    if (!article) return res.status(404).json({ error: "Article not found." });
    return res.json({ ok: true, article: serializeNewsArticle(article) });
  } catch (err) {
    console.error("GET /api/admin/news/:id failed:", err?.message || err);
    return res.status(500).json({ error: "Unable to load article." });
  }
});

adminNewsRouter.post(
  "/",
  requireAdmin,
  requireCsrf,
  requireSameOrigin,
  requireJsonContentType,
  async (req, res) => {
    try {
      const parsed = validateArticleInput(req.body);
      if (!parsed.ok) return res.status(400).json({ error: parsed.errors[0] });

      const article = await prisma.newsArticle.create({ data: parsed.data });
      return res.status(201).json({ ok: true, article: serializeNewsArticle(article) });
    } catch (err) {
      if (err?.code === "P2002") return res.status(409).json({ error: "Slug already exists." });
      console.error("POST /api/admin/news failed:", err?.message || err);
      return res.status(500).json({ error: "Unable to create article." });
    }
  },
);

adminNewsRouter.patch(
  "/:id",
  requireAdmin,
  requireCsrf,
  requireSameOrigin,
  requireJsonContentType,
  async (req, res) => {
    try {
      const id = String(req.params.id ?? "").trim();
      const parsed = validateArticleInput(req.body, { partial: true });
      if (!parsed.ok) return res.status(400).json({ error: parsed.errors[0] });
      if (Object.keys(parsed.data).length === 0) {
        return res.status(400).json({ error: "No updates provided." });
      }

      const article = await prisma.newsArticle.update({ where: { id }, data: parsed.data });
      return res.json({ ok: true, article: serializeNewsArticle(article) });
    } catch (err) {
      if (err?.code === "P2025") return res.status(404).json({ error: "Article not found." });
      if (err?.code === "P2002") return res.status(409).json({ error: "Slug already exists." });
      console.error("PATCH /api/admin/news/:id failed:", err?.message || err);
      return res.status(500).json({ error: "Unable to update article." });
    }
  },
);

adminNewsRouter.delete(
  "/:id",
  requireAdmin,
  requireCsrf,
  requireSameOrigin,
  async (req, res) => {
    try {
      const id = String(req.params.id ?? "").trim();
      await prisma.newsArticle.delete({ where: { id } });
      return res.json({ ok: true });
    } catch (err) {
      if (err?.code === "P2025") return res.status(404).json({ error: "Article not found." });
      console.error("DELETE /api/admin/news/:id failed:", err?.message || err);
      return res.status(500).json({ error: "Unable to delete article." });
    }
  },
);
