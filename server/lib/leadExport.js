import * as XLSX from "xlsx";
import { prisma } from "../db.js";
import { decryptLeadRecord } from "./leadData.js";

export const LEAD_EXPORT_COLUMNS = [
  "id",
  "createdAt",
  "name",
  "phone",
  "message",
  "projectName",
  "projectSlug",
  "themeId",
  "source",
  "status",
  "notes",
  "duplicateOfId",
  "pageUrl",
];

export function escapeCsv(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function leadToExportRow(lead) {
  return Object.fromEntries(LEAD_EXPORT_COLUMNS.map((key) => [key, lead[key] ?? ""]));
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
  const rows = leads.map((lead) => LEAD_EXPORT_COLUMNS.map((key) => escapeCsv(lead[key])).join(","));
  return [LEAD_EXPORT_COLUMNS.join(","), ...rows].join("\n");
}

export function leadsToXlsxBuffer(leads) {
  const worksheet = XLSX.utils.json_to_sheet(leads.map(leadToExportRow), { header: LEAD_EXPORT_COLUMNS });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}
