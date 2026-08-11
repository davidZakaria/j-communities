import { leadsApi } from "./leads";
import type { ProjectThemeId } from "../data/projects";

export type LeadSource = "contact" | "popup";

export interface ProjectLeadPayload {
  name: string;
  phone: string;
  message?: string;
  projectName: string;
  projectSlug: string;
  themeId: ProjectThemeId;
  source: LeadSource;
  honeypot?: string;
}

export async function submitProjectLead(payload: ProjectLeadPayload): Promise<void> {
  const name = payload.name.trim();
  const phone = payload.phone.trim();
  if (!name || !phone) {
    throw new Error("Please enter your name and phone number.");
  }

  const res = await fetch(leadsApi.endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      name,
      phone,
      message: payload.message?.trim() ?? "",
      projectName: payload.projectName,
      projectSlug: payload.projectSlug,
      themeId: payload.themeId,
      source: payload.source,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      [leadsApi.honeypotField]: payload.honeypot ?? "",
    }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "Something went wrong. Please try again or email us.");
  }
}
