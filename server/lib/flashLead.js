const WEBHOOK_TIMEOUT_MS = 12_000;

export function isFlashLeadConfigured() {
  return Boolean(String(process.env.FLASH_LEAD_WEBHOOK_URL ?? "").trim());
}

/** Strip formatting; keep a single leading + then digits. */
export function normalizePhoneForFlashLead(phone) {
  const raw = String(phone ?? "").trim();
  if (!raw) return "";

  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  return hasPlus ? `+${digits}` : digits;
}

function buildFlashLeadPayload(leadData) {
  return {
    name: leadData.name ?? "",
    phone: normalizePhoneForFlashLead(leadData.phone),
    message: leadData.message ?? "",
    projectName: leadData.projectName ?? "",
    projectSlug: leadData.projectSlug ?? "",
    themeId: leadData.themeId ?? "",
    source: leadData.source ?? "",
    pageUrl: leadData.pageUrl ?? "",
    utmSource: leadData.utmSource ?? "",
    utmMedium: leadData.utmMedium ?? "",
    utmCampaign: leadData.utmCampaign ?? "",
    createdAt: leadData.createdAt ? new Date(leadData.createdAt).toISOString() : new Date().toISOString(),
  };
}

/**
 * Push decrypted lead data to Flash Lead webhook.
 * @returns {Promise<boolean>} true on success, false on failure or missing config.
 */
export async function pushToFlashLead(leadData) {
  const webhookUrl = String(process.env.FLASH_LEAD_WEBHOOK_URL ?? "").trim();
  if (!webhookUrl) {
    console.warn("FLASH_LEAD_WEBHOOK_URL not configured; Flash Lead push skipped.");
    return false;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildFlashLeadPayload(leadData)),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.warn("Flash Lead webhook returned HTTP", res.status);
      return false;
    }

    return true;
  } catch (err) {
    const message = err?.name === "AbortError" ? "request timed out" : err?.message || "request failed";
    console.warn("Flash Lead push failed:", message);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
