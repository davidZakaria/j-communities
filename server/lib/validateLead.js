import { config } from "../config.js";
import { validateLocalPhone } from "./phoneValidation.js";

export const MAX_NAME = 15;
const MAX_PHONE = 20;
const MAX_MESSAGE = 2000;
const MAX_PROJECT = 120;
const MAX_URL = 2048;
const MAX_UTM = 120;

function sanitizeUtm(value) {
  const s = String(value ?? "").trim().slice(0, MAX_UTM);
  return s || null;
}

const LEGACY_PHONE_PATTERN = /^[\d\s+\-().]{7,40}$/;

function countDigits(value) {
  return (value.match(/\d/g) || []).length;
}

function isValidLegacyPhone(phone) {
  if (!LEGACY_PHONE_PATTERN.test(phone)) return false;
  return countDigits(phone) >= 7;
}

function isValidPageUrl(page) {
  if (!page) return true;
  try {
    const url = new URL(page);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateLeadInput(body) {
  const errors = [];

  for (const field of config.honeypotFields) {
    if (String(body?.[field] ?? "").trim()) {
      return { ok: false, spam: true, errors: ["Rejected"] };
    }
  }

  const name = String(body?.name ?? "").trim();
  const phone = String(body?.phone ?? "").trim();
  const countryCode = String(body?.countryCode ?? "").trim();
  const message = body?.message != null ? String(body.message).trim() : "";
  const projectName = String(body?.projectName ?? body?.project ?? "").trim();
  const projectSlug = String(body?.projectSlug ?? "").trim();
  const themeId = String(body?.themeId ?? "").trim();
  const source = String(body?.source ?? "contact").trim();
  const pageUrl = body?.pageUrl ?? body?.page;
  const page = pageUrl != null ? String(pageUrl).trim() : "";
  const utmSource = sanitizeUtm(body?.utmSource);
  const utmMedium = sanitizeUtm(body?.utmMedium);
  const utmCampaign = sanitizeUtm(body?.utmCampaign);

  if (!name || name.length > MAX_NAME) errors.push("Invalid name");

  let normalizedPhone = phone;
  if (countryCode) {
    const phoneCheck = validateLocalPhone(countryCode, phone);
    if (!phoneCheck.ok) {
      errors.push("Invalid phone");
    } else {
      normalizedPhone = phoneCheck.fullPhone;
    }
  } else if (!isValidLegacyPhone(phone)) {
    errors.push("Invalid phone");
  }

  if (normalizedPhone.length > MAX_PHONE) errors.push("Invalid phone");
  if (message.length > MAX_MESSAGE) errors.push("Message too long");
  if (!projectName || projectName.length > MAX_PROJECT) errors.push("Invalid project");
  if (!config.allowedProjectSlugs.has(projectSlug)) errors.push("Invalid project");
  if (!config.allowedThemeIds.has(themeId)) errors.push("Invalid project");
  if (source !== "contact" && source !== "popup") errors.push("Invalid source");
  if (page.length > MAX_URL || !isValidPageUrl(page)) errors.push("Invalid page URL");

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      phone: normalizedPhone,
      message: message || null,
      projectName,
      projectSlug,
      themeId,
      source,
      pageUrl: page || null,
      utmSource,
      utmMedium,
      utmCampaign,
    },
  };
}
