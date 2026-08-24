import * as XLSX from "xlsx";
import { prisma } from "../db.js";
import { decryptLeadRecord } from "./leadData.js";

export const LEAD_EXPORT_COLUMNS = [
  "id",
  "createdDate",
  "createdTime",
  "name",
  "phone",
  "message",
  "projectName",
  "projectSlug",
  "themeId",
  "source",
  "status",
  "flashLeadSync",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "notes",
  "duplicateOfId",
  "pageUrl",
];

function pad(value) {
  return String(value).padStart(2, "0");
}

export function formatExportDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { createdDate: "", createdTime: "" };
  }

  return {
    createdDate: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    createdTime: `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
  };
}

export function escapeCsv(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function leadToExportRow(lead) {
  const { createdDate, createdTime } = formatExportDateTime(lead.createdAt);
  const row = { createdDate, createdTime };

  for (const key of LEAD_EXPORT_COLUMNS) {
    if (key === "createdDate" || key === "createdTime") continue;
    row[key] = lead[key] ?? "";
  }

  return row;
}

export async function fetchLeadsForExport(where) {
  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  return leads.map(decryptLeadRecord);
}

export function leadsToCsv(leads) {
  const rows = leads.map((lead) =>
    LEAD_EXPORT_COLUMNS.map((key) => escapeCsv(leadToExportRow(lead)[key])).join(","),
  );
  return [LEAD_EXPORT_COLUMNS.join(","), ...rows].join("\n");
}

export function leadsToXlsxBuffer(leads) {
  const rows = leads.map(leadToExportRow);
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: LEAD_EXPORT_COLUMNS });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

export function applyExportDateRange(where, query) {
  const from = String(query.exportFrom ?? "").trim();
  const to = String(query.exportTo ?? "").trim();
  if (!from && !to) return where;

  const createdAt = {};
  if (from) {
    const start = new Date(from);
    if (!Number.isNaN(start.getTime())) createdAt.gte = start;
  }
  if (to) {
    const end = new Date(to);
    if (!Number.isNaN(end.getTime())) createdAt.lte = end;
  }

  if (Object.keys(createdAt).length === 0) return where;
  return { ...where, createdAt };
}
