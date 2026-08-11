import { config } from "../config.js";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileRequired() {
  return config.isProd && Boolean(config.turnstileSecretKey);
}

export async function verifyTurnstileToken(token, remoteIp) {
  if (!config.turnstileSecretKey) {
    return { ok: true, skipped: true };
  }

  const response = String(token ?? "").trim();
  if (!response) {
    return { ok: false, error: "missing-token" };
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: config.turnstileSecretKey,
        response,
        remoteip: remoteIp || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      return { ok: false, error: "verification-failed", codes: data?.["error-codes"] ?? [] };
    }

    return { ok: true };
  } catch (err) {
    console.error("Turnstile verify failed:", err?.message || err);
    return { ok: false, error: "verify-unavailable" };
  }
}
