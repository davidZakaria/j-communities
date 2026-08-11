import { getAdminCsrfToken, setAdminCsrfToken } from "./csrf";
import type { Lead, LeadFilters, LeadsResponse } from "./types";

const base = "/api/admin";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() || "GET";
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init?.body ? { "Content-Type": "application/json" } : {}),
  };

  if (method !== "GET" && method !== "HEAD") {
    const token = getAdminCsrfToken();
    if (token) headers["X-CSRF-Token"] = token;
  }

  const res = await fetch(`${base}${path}`, {
    credentials: "include",
    headers: { ...headers, ...(init?.headers as Record<string, string> | undefined) },
    ...init,
  });

  const data = (await res.json().catch(() => null)) as { error?: string; csrfToken?: string } & T;
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }

  if (data && typeof data === "object" && "csrfToken" in data && data.csrfToken) {
    setAdminCsrfToken(data.csrfToken);
  }

  return data;
}

export async function adminMe(): Promise<{ ok: boolean; username: string; csrfToken: string }> {
  return request("/me");
}

export async function adminLogin(
  username: string,
  password: string,
): Promise<{ ok: boolean; username: string; csrfToken: string }> {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function adminLogout(): Promise<void> {
  await request("/logout", { method: "POST" });
  setAdminCsrfToken(null);
}

export async function fetchLeads(filters: LeadFilters = {}): Promise<LeadsResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.projectSlug) params.set("projectSlug", filters.projectSlug);
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.includeSpam) params.set("includeSpam", "1");

  const qs = params.toString();
  return request(`/leads${qs ? `?${qs}` : ""}`);
}

export async function updateLead(
  id: string,
  patch: { status?: string; notes?: string },
): Promise<{ ok: boolean; lead: Lead }> {
  return request(`/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function exportLeadsCsv(filters: LeadFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.projectSlug) params.set("projectSlug", filters.projectSlug);
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.includeSpam) params.set("includeSpam", "1");
  const qs = params.toString();
  return `${base}/leads.csv${qs ? `?${qs}` : ""}`;
}
