import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

function parseOrigins(raw) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

const leadEncryptionKeyHex = (process.env.LEAD_ENCRYPTION_KEY || "").trim();
const leadEncryptionKey =
  leadEncryptionKeyHex.length === 64 ? Buffer.from(leadEncryptionKeyHex, "hex") : null;

const allowedOrigins = [
  ...parseOrigins(process.env.ALLOWED_ORIGINS),
  ...parseOrigins(process.env.SITE_ORIGIN),
];

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  sessionSecret: process.env.SESSION_SECRET || "dev-session-secret-change-me",
  sessionMaxAgeMs: Number(process.env.SESSION_MAX_AGE_MS) || 12 * 60 * 60 * 1000,
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPasswordHash: (process.env.ADMIN_PASSWORD_HASH || "").trim().replace(/^['"]|['"]$/g, ""),
  leadEncryptionKeyHex,
  leadEncryptionKey,
  allowedOrigins: [...new Set(allowedOrigins)],
  notifyEmail: process.env.NOTIFY_EMAIL || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  smtp: {
    host: (process.env.SMTP_HOST || "").trim(),
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== "false",
    user: (process.env.SMTP_USER || "").trim(),
    pass: process.env.SMTP_PASS || "",
    from: (process.env.SMTP_FROM || process.env.SMTP_USER || "").trim(),
  },
  distDir: path.join(rootDir, "client", "dist"),
  honeypotField: "_gotcha",
  honeypotFields: ["_gotcha", "_brief"],
  allowedProjectSlugs: new Set(["jura-sokhna", "jamila"]),
  allowedThemeIds: new Set(["jura", "jamila"]),
  /** Same phone + project within this window is stored as duplicate spam. */
  duplicateWindowMs: Number(process.env.DUPLICATE_WINDOW_HOURS || 24) * 60 * 60 * 1000,
  /** Minimum ms after form opens before a submission is accepted. */
  minFormSubmitMs: Number(process.env.LEAD_MIN_SUBMIT_MS || 2500),
  /** Reject submissions with stale client timestamps. */
  maxFormSubmitMs: Number(process.env.LEAD_MAX_SUBMIT_MS || 2 * 60 * 60 * 1000),
  /** Max submissions per phone fingerprint per hour (all projects). */
  leadPhoneMaxPerHour: Number(process.env.LEAD_PHONE_MAX_PER_HOUR || 3),
  turnstileSecretKey: (process.env.TURNSTILE_SECRET_KEY || "").trim(),
};
