/** Cloudflare Turnstile site key (public). Set in client/.env as VITE_TURNSTILE_SITE_KEY. */
export const turnstileSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "").trim();

export const isTurnstileEnabled = turnstileSiteKey.length > 0;
