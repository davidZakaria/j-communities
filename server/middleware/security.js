import { config } from "../config.js";
import { createCsrfToken, safeEqual } from "../validateEnv.js";

export function issueCsrfToken(req) {
  const token = createCsrfToken();
  req.session.csrfToken = token;
  return token;
}

export function requireCsrf(req, res, next) {
  const expected = req.session?.csrfToken;
  const provided = req.get("x-csrf-token") || "";
  if (!expected || !safeEqual(provided, expected)) {
    return res.status(403).json({ error: "Invalid or missing CSRF token." });
  }
  return next();
}

function normalizeOrigin(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

function requestOrigin(req) {
  const origin = normalizeOrigin(req.get("origin"));
  if (origin) return origin;
  const referer = req.get("referer");
  if (!referer) return null;
  try {
    const url = new URL(referer);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

/** Reject cross-site POST/PATCH when production origins are configured. */
export function requireSameOrigin(req, res, next) {
  if (!config.isProd || config.allowedOrigins.length === 0) return next();

  const origin = requestOrigin(req);
  if (!origin) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!config.allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  return next();
}

export function requireJsonContentType(req, res, next) {
  const type = req.get("content-type") || "";
  if (!type.includes("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json" });
  }
  return next();
}

export function noStoreApi(req, res, next) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
}

export function apiSecurityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
}
