import { prisma } from "../db.js";
import { getNewsSeedRecords } from "./newsSeedData.js";

export function serializeNewsArticle(article) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    publishedAt: article.publishedAt.toISOString(),
    source: article.source,
    externalUrl: article.externalUrl,
    category: article.category,
    language: article.language,
    featured: article.featured,
    published: article.published,
    coverImageUrl: article.coverImageUrl,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}

export function serializeNewsListItem(article) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt.toISOString(),
    source: article.source,
    externalUrl: article.externalUrl,
    category: article.category,
    language: article.language,
    featured: article.featured,
    coverImageUrl: article.coverImageUrl,
  };
}

export async function seedNewsArticles() {
  const records = getNewsSeedRecords();
  let created = 0;
  let updated = 0;

  for (const record of records) {
    const existing = await prisma.newsArticle.findUnique({ where: { slug: record.slug } });
    if (existing) {
      await prisma.newsArticle.update({ where: { slug: record.slug }, data: record });
      updated += 1;
    } else {
      await prisma.newsArticle.create({ data: record });
      created += 1;
    }
  }

  return { created, updated, total: records.length };
}
