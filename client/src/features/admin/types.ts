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

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "closed", "spam"];
export const LEAD_SOURCES: LeadSource[] = ["contact", "popup"];

export type AdminNewsCategory = "press" | "social";
export type AdminNewsLanguage = "en" | "ar";

export interface AdminNewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string;
  source: string;
  externalUrl: string | null;
  category: AdminNewsCategory;
  language: AdminNewsLanguage;
  featured: boolean;
  published: boolean;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNewsResponse {
  ok: boolean;
  articles: AdminNewsArticle[];
}
