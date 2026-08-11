import crypto from "crypto";
import { config } from "../config.js";

export function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHmac("sha256", config.sessionSecret).update(ip).digest("hex").slice(0, 32);
}

export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? null;
}
