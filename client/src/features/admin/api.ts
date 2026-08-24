import { getAdminCsrfToken, setAdminCsrfToken } from "./csrf";
import type { AdminUser, Lead, LeadFilters, LeadsResponse, TotpSetup } from "./types";

const base = "/api/admin";
const usersBase = "/api/admin/users";

async function usersRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() || "GET";
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init?.body ? { "Content-Type": "application/json" } : {}),
  };

  if (method !== "GET" && method !== "HEAD") {
    const token = getAdminCsrfToken();
    if (token) headers["X-CSRF-Token"] = token;
  }

  const res = await fetch(`${usersBase}${path}`, {
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

export async function adminMe(): Promise<{
  ok: boolean;
  username: string;
  csrfToken: string;
  isSuperAdmin: boolean;
  userId: string | null;
}> {
  return request("/me");
}

export class AdminLoginError extends Error {
  readonly requireTotp: boolean;

  constructor(message: string, options?: { requireTotp?: boolean }) {
    super(message);
    this.name = "AdminLoginError";
    this.requireTotp = options?.requireTotp ?? false;
  }
}

export async function adminLogin(
  username: string,
  password: string,
  totpCode?: string,
): Promise<{ ok: boolean; username: string; csrfToken: string; isSuperAdmin?: boolean }> {
  const payload: Record<string, string> = { username, password };
  if (totpCode) payload.totpCode = totpCode;

  const res = await fetch(`${base}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => null)) as {
    error?: string;
    message?: string;
    requireTotp?: boolean;
    csrfToken?: string;
    username?: string;
    ok?: boolean;
  } | null;

  if (res.status === 403 && data?.requireTotp) {
    throw new AdminLoginError(data.message || "Two-factor authentication required", { requireTotp: true });
  }

  if (!res.ok) {
    throw new AdminLoginError(data?.message || data?.error || "Login failed");
  }

  if (data?.csrfToken) setAdminCsrfToken(data.csrfToken);
  return data as { ok: boolean; username: string; csrfToken: string };
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

export async function retryLeadFlashSync(id: string): Promise<{ ok: boolean; lead: Lead }> {
  return request(`/leads/${id}/sync`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function fetchAdminUsers(): Promise<{ ok: boolean; users: AdminUser[] }> {
  return usersRequest("");
}

export async function createAdminUser(payload: {
  username: string;
  password: string;
  isSuperAdmin?: boolean;
}): Promise<{ ok: boolean; user: AdminUser; totpSetup: TotpSetup }> {
  return usersRequest("", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function setAdminUserActive(id: string, active: boolean): Promise<{ ok: boolean; user: AdminUser }> {
  return usersRequest(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
}

export async function resetAdminUserTotp(id: string): Promise<{ ok: boolean; user: AdminUser; totpSetup: TotpSetup }> {
  return usersRequest(`/${id}/reset-totp`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function buildLeadExportQuery(filters: LeadFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.projectSlug) params.set("projectSlug", filters.projectSlug);
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.includeSpam) params.set("includeSpam", "1");
  if (filters.exportFrom) params.set("exportFrom", filters.exportFrom);
  if (filters.exportTo) params.set("exportTo", filters.exportTo);
  return params.toString();
}

export function exportLeadsCsv(filters: LeadFilters = {}): string {
  const qs = buildLeadExportQuery(filters);
  return `${base}/leads.csv${qs ? `?${qs}` : ""}`;
}

export function exportLeadsXlsx(filters: LeadFilters = {}): string {
  const qs = buildLeadExportQuery(filters);
  return `${base}/leads.xlsx${qs ? `?${qs}` : ""}`;
}

const newsBase = "/api/admin/news";

async function newsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() || "GET";
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init?.body ? { "Content-Type": "application/json" } : {}),
  };

  if (method !== "GET" && method !== "HEAD") {
    const token = getAdminCsrfToken();
    if (token) headers["X-CSRF-Token"] = token;
  }

  const res = await fetch(`${newsBase}${path}`, {
    credentials: "include",
    headers: { ...headers, ...(init?.headers as Record<string, string> | undefined) },
    ...init,
  });

  const data = (await res.json().catch(() => null)) as { error?: string; csrfToken?: string } & T;
  if (!res.ok) throw new Error(data?.error || "Request failed");
  if (data && typeof data === "object" && "csrfToken" in data && data.csrfToken) {
    setAdminCsrfToken(data.csrfToken);
  }
  return data;
}

export async function fetchAdminNews(): Promise<import("./types").AdminNewsResponse> {
  return newsRequest("/");
}

export async function createAdminNewsArticle(
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; article: import("./types").AdminNewsArticle }> {
  return newsRequest("/", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateAdminNewsArticle(
  id: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; article: import("./types").AdminNewsArticle }> {
  return newsRequest(`/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function deleteAdminNewsArticle(id: string): Promise<{ ok: boolean }> {
  return newsRequest(`/${id}`, { method: "DELETE" });
}

export async function uploadAdminNewsImage(file: File): Promise<{ ok: boolean; url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const token = getAdminCsrfToken();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers["X-CSRF-Token"] = token;

  const res = await fetch(`${newsBase}/upload`, {
    method: "POST",
    credentials: "include",
    headers,
    body: formData,
  });

  const data = (await res.json().catch(() => null)) as { error?: string; url?: string; ok?: boolean };
  if (!res.ok) throw new Error(data?.error || "Upload failed.");
  if (!data?.url) throw new Error("Upload failed.");
  return { ok: true, url: data.url };
}
