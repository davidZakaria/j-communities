import { regenerateSession } from "./auth.js";

export function requireAdmin(req, res, next) {
  if (req.session?.admin === true) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

export function requireSuperAdmin(req, res, next) {
  if (req.session?.admin === true && req.session?.isSuperAdmin === true) return next();
  return res.status(403).json({ error: "Forbidden" });
}

export { regenerateSession };
