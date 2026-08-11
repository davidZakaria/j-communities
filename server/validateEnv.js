import crypto from "crypto";
import { config } from "./config.js";

const INSECURE_SECRETS = new Set([
  "dev-session-secret-change-me",
  "change-me-to-a-long-random-string",
  "",
]);

export function validateProductionEnv() {
  if (!config.isProd) return;

  const errors = [];

  if (!config.sessionSecret || config.sessionSecret.length < 32 || INSECURE_SECRETS.has(config.sessionSecret)) {
    errors.push("SESSION_SECRET must be a unique string of at least 32 characters");
  }

  if (!config.adminPasswordHash) {
    errors.push("ADMIN_PASSWORD_HASH is required (npm run admin:set-password -- 'your-password')");
  } else if (!/^\$2[aby]\$/.test(config.adminPasswordHash)) {
    errors.push(
      "ADMIN_PASSWORD_HASH looks corrupted (bcrypt hashes must start with $2a$, $2b$, or $2y$). Run: npm run admin:set-password -- 'your-password'",
    );
  }

  if (!config.leadEncryptionKeyHex || config.leadEncryptionKeyHex.length !== 64) {
    errors.push("LEAD_ENCRYPTION_KEY must be a 64-character hex string (npm run admin:generate-key)");
  }

  if (config.allowedOrigins.length === 0) {
    errors.push("SITE_ORIGIN or ALLOWED_ORIGINS must be set for origin validation");
  }

  if (errors.length > 0) {
    throw new Error(`Production security configuration invalid:\n- ${errors.join("\n- ")}`);
  }
}

export function assertSecureStartup() {
  validateProductionEnv();
}

/** Constant-time string compare for CSRF tokens. */
export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}
