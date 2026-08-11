import bcrypt from "bcrypt";
import { config } from "../config.js";

/** Precomputed hash so failed username lookups still run bcrypt (timing-safe). */
const DUMMY_PASSWORD_HASH = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36CgAIcmOF.MGr/jA.5K.K";

export function requireAdmin(req, res, next) {
  if (req.session?.admin === true) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

export async function verifyAdminCredentials(username, password) {
  const hash =
    username === config.adminUsername && config.adminPasswordHash
      ? config.adminPasswordHash
      : DUMMY_PASSWORD_HASH;
  return bcrypt.compare(password, hash);
}

export function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
