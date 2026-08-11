import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminLogout, exportLeadsCsv, fetchLeads, updateLead } from "../../features/admin/api";
import { LEAD_SOURCES, LEAD_STATUSES, type Lead, type LeadFilters, type LeadStatus } from "../../features/admin/types";
import { projects } from "../../data/projects";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function AdminDashboardPage() {
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, limit: 50 });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLeads(filters);
      setLeads(res.leads);
      setTotal(res.pagination.total);
      setPages(res.pagination.pages);
      setDraftNotes(
        Object.fromEntries(res.leads.map((lead) => [lead.id, lead.notes ?? ""])),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  async function handleLogout() {
    await adminLogout();
    window.location.href = "/admin/login";
  }

  async function handleStatusChange(lead: Lead, status: LeadStatus) {
    setSavingId(lead.id);
    try {
      const res = await updateLead(lead.id, { status });
      setLeads((prev) => prev.map((item) => (item.id === lead.id ? res.lead : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSavingId(null);
    }
  }

  async function handleSaveNotes(lead: Lead) {
    setSavingId(lead.id);
    try {
      const res = await updateLead(lead.id, { notes: draftNotes[lead.id] ?? "" });
      setLeads((prev) => prev.map((item) => (item.id === lead.id ? res.lead : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save notes");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900">
      <header className="border-b border-neutral-300 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">J Communities</p>
            <h1 className="font-serif text-xl sm:text-2xl">Leads</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={exportLeadsCsv(filters)}
              className="border border-neutral-300 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] hover:border-neutral-900"
            >
              Export CSV
            </a>
            <Link to="/" className="text-[10px] uppercase tracking-[0.14em] text-neutral-500 hover:text-neutral-900">
              Site
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

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap gap-3 border border-neutral-300 bg-white p-4">
          <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-neutral-500">
            Project
            <select
              value={filters.projectSlug ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, page: 1, projectSlug: e.target.value }))}
              className="min-w-[160px] border border-neutral-300 px-2 py-2 text-sm normal-case"
            >
              <option value="">All</option>
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-neutral-500">
            Status
            <select
              value={filters.status ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  status: e.target.value as LeadFilters["status"],
                }))
              }
              className="min-w-[140px] border border-neutral-300 px-2 py-2 text-sm normal-case"
            >
              <option value="">All</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-neutral-500">
            Source
            <select
              value={filters.source ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  source: e.target.value as LeadFilters["source"],
                }))
              }
              className="min-w-[120px] border border-neutral-300 px-2 py-2 text-sm normal-case"
            >
              <option value="">All</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <p className="text-sm text-neutral-600">{total} lead{total === 1 ? "" : "s"}</p>
          </div>
        </div>

        {error ? (
          <p className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-neutral-600">Loading leads…</p>
        ) : leads.length === 0 ? (
          <p className="border border-neutral-300 bg-white px-4 py-8 text-center text-sm text-neutral-600">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto border border-neutral-300 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-3 py-3">When</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3">Project</th>
                  <th className="px-3 py-3">Source</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-neutral-100 align-top">
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-neutral-600">{formatDate(lead.createdAt)}</td>
                    <td className="px-3 py-3">
                      <p className="font-medium">{lead.name}</p>
                      {lead.message ? <p className="mt-1 max-w-xs text-xs text-neutral-600">{lead.message}</p> : null}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <a href={`tel:${lead.phone}`} className="hover:underline">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-3 py-3">
                      <p>{lead.projectName}</p>
                      {lead.pageUrl ? (
                        <a href={lead.pageUrl} className="mt-1 block max-w-[180px] truncate text-xs text-neutral-500 hover:underline" target="_blank" rel="noreferrer">
                          page
                        </a>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 capitalize">{lead.source}</td>
                    <td className="px-3 py-3">
                      <select
                        value={lead.status}
                        disabled={savingId === lead.id}
                        onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)}
                        className="border border-neutral-300 px-2 py-1 text-xs capitalize"
                      >
                        {LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="min-w-[220px] px-3 py-3">
                      <textarea
                        rows={2}
                        value={draftNotes[lead.id] ?? ""}
                        onChange={(e) => setDraftNotes((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                        className="w-full border border-neutral-300 px-2 py-1 text-xs"
                        placeholder="Internal notes"
                      />
                      <button
                        type="button"
                        disabled={savingId === lead.id}
                        onClick={() => handleSaveNotes(lead)}
                        className="mt-1 text-[10px] uppercase tracking-wider text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
                      >
                        Save notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 ? (
          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              disabled={(filters.page ?? 1) <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))}
              className="border border-neutral-300 bg-white px-3 py-2 text-xs uppercase tracking-wider disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-neutral-600">
              Page {filters.page ?? 1} of {pages}
            </span>
            <button
              type="button"
              disabled={(filters.page ?? 1) >= pages}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              className="border border-neutral-300 bg-white px-3 py-2 text-xs uppercase tracking-wider disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
