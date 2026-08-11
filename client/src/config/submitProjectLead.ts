import { leadsApi } from "./leads";
import type { ProjectThemeId } from "../data/projects";

export type LeadSource = "contact" | "popup";

export type LeadHoneypotValues = Partial<Record<(typeof leadsApi.honeypotFields)[number], string>>;

export interface ProjectLeadPayload {
  name: string;
  phone: string;
  message?: string;
  projectName: string;
  projectSlug: string;
  themeId: ProjectThemeId;
  source: LeadSource;
  formReadyAt: number;
  honeypots?: LeadHoneypotValues;
}

export function readLeadHoneypots(form: HTMLFormElement): LeadHoneypotValues {
  const fd = new FormData(form);
  return Object.fromEntries(
    leadsApi.honeypotFields.map((field) => [field, String(fd.get(field) ?? "")]),
  );
}

export async function submitProjectLead(payload: ProjectLeadPayload): Promise<void> {
  const name = payload.name.trim();
  const phone = payload.phone.trim();
  if (!name || !phone) {
    throw new Error("Please enter your name and phone number.");
  }

  if (!Number.isFinite(payload.formReadyAt)) {
    throw new Error("Something went wrong. Please refresh and try again.");
  }

  const body: Record<string, unknown> = {
    name,
    phone,
    message: payload.message?.trim() ?? "",
    projectName: payload.projectName,
    projectSlug: payload.projectSlug,
    themeId: payload.themeId,
    source: payload.source,
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
    formReadyAt: payload.formReadyAt,
  };

  for (const field of leadsApi.honeypotFields) {
    body[field] = payload.honeypots?.[field] ?? "";
  }

  const res = await fetch(leadsApi.endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "Something went wrong. Please try again or email us.");
  }

  if (res.status !== 201) {
    throw new Error("Something went wrong. Please try again or email us.");
  }
}
