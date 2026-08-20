export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "spam";
export type LeadSource = "contact" | "popup";

export interface Lead {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  message: string | null;
  projectName: string;
  projectSlug: string;
  themeId: string;
  source: LeadSource;
  pageUrl: string | null;
  userAgent: string | null;
  ipHash: string | null;
  status: LeadStatus;
  notes: string | null;
  duplicateOfId: string | null;
}

export interface LeadsResponse {
  ok: boolean;
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    spamHidden?: number;
  };
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  projectSlug?: string;
  status?: LeadStatus | "";
  source?: LeadSource | "";
  includeSpam?: boolean;
}

export interface LeadStats {
  activeTotal: number;
  spamTotal: number;
  newTotal: number;
  last7Days: number;
  bySource: { popup: number; contact: number };
  adsConversionEligible: number;
  byProject: { projectSlug: string; count: number }[];
}

export interface LeadStatsResponse {
  ok: boolean;
  stats: LeadStats;
}

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "closed", "spam"];
export const LEAD_SOURCES: LeadSource[] = ["contact", "popup"];
