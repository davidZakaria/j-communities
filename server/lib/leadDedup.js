import { prisma } from "../db.js";
import { config } from "../config.js";
import { hashPhoneFingerprint } from "./phoneFingerprint.js";

const AUTO_DUPLICATE_NOTE = "Auto: duplicate submission (same phone and project within 24h).";
const AUTO_SPAM_NOTE = "Auto: flagged as likely spam.";

export function assessLeadSubmission({ phone, name }) {
  const phoneFingerprint = hashPhoneFingerprint(phone);
  const trimmedName = String(name ?? "").trim();

  if (!phoneFingerprint) {
    return { phoneFingerprint: null, isLikelySpam: true, spamReason: "invalid phone fingerprint" };
  }

  const digits = phone.replace(/\D/g, "");
  const uniqueDigits = new Set(digits).size;
  if (uniqueDigits <= 1) {
    return { phoneFingerprint, isLikelySpam: true, spamReason: "repeated digits in phone" };
  }

  if (trimmedName.length < 2) {
    return { phoneFingerprint, isLikelySpam: true, spamReason: "name too short" };
  }

  if (/^\d+$/.test(trimmedName)) {
    return { phoneFingerprint, isLikelySpam: true, spamReason: "numeric name" };
  }

  return { phoneFingerprint, isLikelySpam: false, spamReason: null };
}

export async function findDuplicateLead({ phoneFingerprint, projectSlug }) {
  if (!phoneFingerprint || !projectSlug) return null;

  const windowStart = new Date(Date.now() - config.duplicateWindowMs);

  return prisma.lead.findFirst({
    where: {
      phoneFingerprint,
      projectSlug,
      createdAt: { gte: windowStart },
    },
    orderBy: { createdAt: "asc" },
    select: { id: true, duplicateOfId: true, status: true },
  });
}

export function duplicateNote() {
  return AUTO_DUPLICATE_NOTE;
}

export function spamNote(reason) {
  return reason ? `${AUTO_SPAM_NOTE} (${reason})` : AUTO_SPAM_NOTE;
}
