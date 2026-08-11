import { config } from "../config.js";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_TOKEN_LENGTH = 2048;

export const TURNSTILE_ACTIONS = {
  popup: "lead-popup",
  contact: "lead-contact",
};

export function turnstileActionForSource(source) {
  return source === "popup" ? TURNSTILE_ACTIONS.popup : TURNSTILE_ACTIONS.contact;
}

export function readTurnstileToken(body) {
  const token = body?.turnstileToken ?? body?.["cf-turnstile-response"];
  return String(token ?? "").trim();
}

export function isTurnstileRequired() {
  return config.isProd && Boolean(config.turnstileSecretKey);
}

export async function verifyTurnstileToken(token, remoteIp, expectedAction) {
  if (!config.turnstileSecretKey) {
    return { ok: true, skipped: true };
  }

  const response = String(token ?? "").trim();
  if (!response || response.length > MAX_TOKEN_LENGTH) {
    return { ok: false, error: "missing-token" };
  }

  if (config.isProd && config.turnstileHostnames.size === 0) {
    return { ok: false, error: "hostname-config-missing" };
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret: config.turnstileSecretKey,
        response,
        remoteip: remoteIp || "",
      }),
    });

    if (!res.ok) {
      return { ok: false, error: "verify-http-error", status: res.status };
    }

    const data = await res.json();
    if (!data?.success) {
      return { ok: false, error: "verification-failed", codes: data?.["error-codes"] ?? [] };
    }

    if (expectedAction && data.action !== expectedAction) {
      return { ok: false, error: "action-mismatch", action: data.action };
    }

    if (config.isProd && data.hostname && !config.turnstileHostnames.has(data.hostname)) {
      return { ok: false, error: "hostname-mismatch", hostname: data.hostname };
    }

    return { ok: true };
  } catch (err) {
    console.error("Turnstile verify failed:", err?.message || err);
    return { ok: false, error: "verify-unavailable" };
  }
}
