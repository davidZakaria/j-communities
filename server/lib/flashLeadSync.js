import { decryptLeadRecord } from "./leadData.js";
import { isFlashLeadConfigured, pushToFlashLead } from "./flashLead.js";

/**
 * Attempt Flash Lead sync for a valid (non-spam) lead record.
 * @returns {"skipped" | "pending" | "success" | "failed"}
 */
export async function resolveFlashLeadSyncStatus(leadRecord, { status }) {
  if (status === "spam") return "skipped";
  if (!isFlashLeadConfigured()) return "pending";

  try {
    const decrypted = decryptLeadRecord(leadRecord);
    const ok = await pushToFlashLead(decrypted);
    return ok ? "success" : "failed";
  } catch (err) {
    console.warn("Flash Lead sync error:", err?.message || "unknown");
    return "failed";
  }
}
