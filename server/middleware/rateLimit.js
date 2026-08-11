const buckets = new Map();

function makeLimiter({ windowMs, maxRequests, keyPrefix }) {
  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    const entry = buckets.get(key);

    if (!entry || now - entry.start > windowMs) {
      buckets.set(key, { start: now, count: 1 });
      return next();
    }

    if (entry.count >= maxRequests) {
      res.setHeader("Retry-After", String(Math.ceil((entry.start + windowMs - now) / 1000)));
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    entry.count += 1;
    return next();
  };
}

/** Public lead form: 5 submissions per 10 minutes per IP. */
export const rateLimitLeads = makeLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 5,
  keyPrefix: "leads",
});

/** Admin login: 10 attempts per 15 minutes per IP. */
export const rateLimitAdminLogin = makeLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  keyPrefix: "admin-login",
});

/** Periodic cleanup so the in-memory map does not grow forever. */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of buckets.entries()) {
    if (now - entry.start > 60 * 60 * 1000) buckets.delete(key);
  }
}, 15 * 60 * 1000).unref();
