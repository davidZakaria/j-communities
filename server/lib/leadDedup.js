import { prisma } from "../db.js";
import { config } from "../config.js";
import { hashPhoneFingerprint } from "./phoneFingerprint.js";

const AUTO_DUPLICATE_NOTE = "Auto: duplicate submission (same phone and project within 24h).";
const AUTO_SPAM_NOTE = "Auto: flagged as likely spam.";

const SPAM_KEYWORDS =
  /\b(viagra|cialis|casino|forex|bitcoin|crypto airdrop|seo service|backlink|click here|buy now|lottery|prize winner)\b/i;
const URL_PATTERN = /https?:\/\/|www\.\w/i;
const LETTER_PATTERN = /[a-zA-Z\u0600-\u06FF]/;

function hasSpamText(value) {
  const text = String(value ?? "").trim();
  if (!text) return false;
  if (URL_PATTERN.test(text)) return true;
  if (SPAM_KEYWORDS.test(text)) return true;
  if (/(.)\1{6,}/.test(text)) return true;
  return false;
}

function hasValidFormTiming(formReadyAt) {
  const readyAt = Number(formReadyAt);
  if (!Number.isFinite(readyAt) || readyAt <= 0) return false;
  const elapsed = Date.now() - readyAt;
  return elapsed >= config.minFormSubmitMs && elapsed <= config.maxFormSubmitMs;
}

export function assessLeadSubmission({ phone, name, message, formReadyAt, userAgent }) {
  const phoneFingerprint = hashPhoneFingerprint(phone);
  const trimmedName = String(name ?? "").trim();
  const trimmedMessage = String(message ?? "").trim();

  if (!hasValidFormTiming(formReadyAt)) {
    return { phoneFingerprint, isLikelySpam: true, spamReason: "invalid form timing" };
  }

  if (config.isProd && !String(userAgent ?? "").trim()) {
    return { phoneFingerprint, isLikelySpam: true, spamReason: "missing user agent" };
  }

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

  if (!LETTER_PATTERN.test(trimmedName)) {
    return { phoneFingerprint, isLikelySpam: true, spamReason: "name missing letters" };
  }

  if (hasSpamText(trimmedName) || hasSpamText(trimmedMessage)) {
    return { phoneFingerprint, isLikelySpam: true, spamReason: "blocked content" };
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
