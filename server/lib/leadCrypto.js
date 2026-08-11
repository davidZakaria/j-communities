import crypto from "crypto";
import { config } from "../config.js";

const ALGO = "aes-256-gcm";
const IV_BYTES = 12;

function getKey() {
  if (!config.leadEncryptionKey) return null;
  return config.leadEncryptionKey;
}

export function isEncryptionEnabled() {
  return Boolean(getKey());
}

/** Encrypt PII before persisting. Returns ciphertext or plaintext if key unset (dev only). */
export function encryptField(value) {
  if (value == null || value === "") return value;
  const key = getKey();
  if (!key) {
    if (config.isProd) {
      throw new Error("LEAD_ENCRYPTION_KEY is required in production");
    }
    return value;
  }

  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

/** Decrypt stored PII for authorized admin reads / notifications. */
export function decryptField(value) {
  if (value == null || value === "") return value;
  const text = String(value);
  if (!text.startsWith("enc:v1:")) return text;

  const key = getKey();
  if (!key) return text;

  const parts = text.split(":");
  if (parts.length !== 5) return text;

  const iv = Buffer.from(parts[2], "hex");
  const tag = Buffer.from(parts[3], "hex");
  const data = Buffer.from(parts[4], "hex");
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString("utf8");
}

export function generateEncryptionKeyHex() {
  return crypto.randomBytes(32).toString("hex");
}
