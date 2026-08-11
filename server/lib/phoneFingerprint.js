import crypto from "crypto";
import { config } from "../config.js";

/** Digits-only phone for deduplication (e.g. 01012345678). */
export function normalizePhoneDigits(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  return digits.length >= 7 ? digits : null;
}

/** One-way fingerprint for duplicate lookups without storing plain phone twice. */
export function hashPhoneFingerprint(phone) {
  const digits = normalizePhoneDigits(phone);
  if (!digits) return null;
  return crypto.createHmac("sha256", config.sessionSecret).update(`phone:${digits}`).digest("hex").slice(0, 32);
}
