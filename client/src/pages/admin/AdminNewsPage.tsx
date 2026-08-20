import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  adminLogout,
  createAdminNewsArticle,
  deleteAdminNewsArticle,
  fetchAdminNews,
  updateAdminNewsArticle,
} from "../../features/admin/api";
import type { AdminNewsArticle, AdminNewsCategory, AdminNewsLanguage } from "../../features/admin/types";

const emptyDraft = (): Omit<AdminNewsArticle, "id" | "createdAt" | "updatedAt"> => ({
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  source: "",
  externalUrl: "",
  category: "press",
  language: "en",
  featured: false,
  published: true,
  coverImageUrl: "/assets/projects/jamila/hero.webp",
});

function toDraft(article: AdminNewsArticle) {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    publishedAt: article.publishedAt.slice(0, 10),
    source: article.source,
    externalUrl: article.externalUrl ?? "",
    category: article.category,
    language: article.language,
    featured: article.featured,
    published: article.published,
    coverImageUrl: article.coverImageUrl ?? "",
  };
}

export function AdminNewsPage() {
  const [articles, setArticles] = useState<AdminNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft());

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminNews();
      setArticles(res.articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  function startCreate() {
    setSelectedId(null);
    setDraft(emptyDraft());
  }

  function startEdit(article: AdminNewsArticle) {
    setSelectedId(article.id);
    setDraft(toDraft(article));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...draft,
        externalUrl: draft.externalUrl.trim() || null,
        coverImageUrl: draft.coverImageUrl.trim() || null,
        publishedAt: `${draft.publishedAt}T12:00:00.000Z`,
      };

      if (selectedId) {
        await updateAdminNewsArticle(selectedId, payload);
      } else {
        await createAdminNewsArticle(payload);
      }
      await loadArticles();
      if (!selectedId) startCreate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this article?")) return;
    setSaving(true);
    setError(null);
    try {
      await deleteAdminNewsArticle(id);
      if (selectedId === id) startCreate();
      await loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await adminLogout();
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900">
      <header className="border-b border-neutral-300 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">J Communities</p>
            <h1 className="font-serif text-xl sm:text-2xl">News & press</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin" className="text-[10px] uppercase tracking-[0.14em] text-neutral-500 hover:text-neutral-900">
              Leads
            </Link>
            <Link to="/news" className="text-[10px] uppercase tracking-[0.14em] text-neutral-500 hover:text-neutral-900">
              View site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-neutral-900 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_420px] sm:px-6">
        <section className="border border-neutral-300 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Articles</h2>
            <button
              type="button"
              onClick={startCreate}
              className="border border-neutral-300 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] hover:border-neutral-900"
            >
              New article
            </button>
          </div>

          {error ? (
            <p className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}

          {loading ? (
            <p className="px-4 py-8 text-sm text-neutral-600">Loading articles…</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {articles.map((article) => (
                <li key={article.id} className="px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <button type="button" onClick={() => startEdit(article)} className="text-left">
                      <p className="font-medium">{article.title}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {article.slug} · {article.source} · {article.published ? "Published" : "Draft"}
                      </p>
                    </button>
                    <div className="flex gap-2">
                      <a
                        href={`/news/${article.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] uppercase tracking-wider text-neutral-500 hover:text-neutral-900"
                      >
                        Preview
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(article.id)}
                        className="text-[10px] uppercase tracking-wider text-red-700 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-neutral-300 bg-white p-4">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            {selectedId ? "Edit article" : "New article"}
          </h2>
          <form className="space-y-3" onSubmit={handleSave}>
            {(
              [
                ["slug", "Slug"],
                ["title", "Title"],
                ["source", "Source"],
                ["externalUrl", "External URL"],
                ["coverImageUrl", "Cover image URL"],
                ["publishedAt", "Published date"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-[10px] uppercase tracking-wider text-neutral-500">
                {label}
                <input
                  value={draft[key]}
                  onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="mt-1 w-full border border-neutral-300 px-2 py-2 text-sm normal-case text-neutral-900"
                  required={key === "slug" || key === "title" || key === "source" || key === "publishedAt"}
                />
              </label>
            ))}

            <label className="block text-[10px] uppercase tracking-wider text-neutral-500">
              Category
              <select
                value={draft.category}
                onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value as AdminNewsCategory }))}
                className="mt-1 w-full border border-neutral-300 px-2 py-2 text-sm normal-case"
              >
                <option value="press">Press</option>
                <option value="social">Social</option>
              </select>
            </label>

            <label className="block text-[10px] uppercase tracking-wider text-neutral-500">
              Language
              <select
                value={draft.language}
                onChange={(e) => setDraft((prev) => ({ ...prev, language: e.target.value as AdminNewsLanguage }))}
                className="mt-1 w-full border border-neutral-300 px-2 py-2 text-sm normal-case"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </label>

            <label className="block text-[10px] uppercase tracking-wider text-neutral-500">
              Excerpt
              <textarea
                rows={3}
                value={draft.excerpt}
                onChange={(e) => setDraft((prev) => ({ ...prev, excerpt: e.target.value }))}
                className="mt-1 w-full border border-neutral-300 px-2 py-2 text-sm normal-case"
                required
              />
            </label>

            <label className="block text-[10px] uppercase tracking-wider text-neutral-500">
              Body
              <textarea
                rows={10}
                value={draft.body}
                onChange={(e) => setDraft((prev) => ({ ...prev, body: e.target.value }))}
                className="mt-1 w-full border border-neutral-300 px-2 py-2 text-sm normal-case"
                required
              />
            </label>

            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft((prev) => ({ ...prev, featured: e.target.checked }))}
                />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => setDraft((prev) => ({ ...prev, published: e.target.checked }))}
                />
                Published
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-neutral-900 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : selectedId ? "Update article" : "Create article"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
