import { Router } from "express";
import {
  createAdminUser,
  listAdminUsers,
  resetAdminUserTotp,
  setAdminUserActive,
} from "../lib/adminUsers.js";
import { requireCsrf, requireJsonContentType, requireSameOrigin } from "../middleware/security.js";
import { requireAdmin, requireSuperAdmin } from "../middleware/auth.js";

export const adminUsersRouter = Router();

adminUsersRouter.get("/", requireAdmin, requireSuperAdmin, async (_req, res) => {
  try {
    const users = await listAdminUsers();
    return res.json({ ok: true, users });
  } catch (err) {
    console.error("GET /api/admin/users failed:", err?.message || err);
    return res.status(500).json({ error: "Unable to load admin users." });
  }
});

adminUsersRouter.post(
  "/",
  requireAdmin,
  requireSuperAdmin,
  requireCsrf,
  requireSameOrigin,
  requireJsonContentType,
  async (req, res) => {
    try {
      const result = await createAdminUser({
        username: req.body?.username,
        password: req.body?.password,
        isSuperAdmin: Boolean(req.body?.isSuperAdmin),
      });

      if (!result.ok) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(201).json({
        ok: true,
        user: result.user,
        totpSetup: result.totpSetup,
      });
    } catch (err) {
      console.error("POST /api/admin/users failed:", err?.message || err);
      return res.status(500).json({ error: "Unable to create admin user." });
    }
  },
);

adminUsersRouter.patch(
  "/:id",
  requireAdmin,
  requireSuperAdmin,
  requireCsrf,
  requireSameOrigin,
  requireJsonContentType,
  async (req, res) => {
    try {
      const id = String(req.params.id ?? "").trim();
      if (!id || !/^[a-z0-9]+$/i.test(id)) {
        return res.status(400).json({ error: "Invalid user id." });
      }

      if (req.body?.active != null) {
        if (id === req.session.adminUserId && req.body.active === false) {
          return res.status(400).json({ error: "You cannot deactivate your own account." });
        }

        const result = await setAdminUserActive(id, req.body.active);
        if (!result.ok) {
          return res.status(400).json({ error: result.error });
        }
        return res.json({ ok: true, user: result.user });
      }

      return res.status(400).json({ error: "No updates provided." });
    } catch (err) {
      console.error("PATCH /api/admin/users/:id failed:", err?.message || err);
      return res.status(500).json({ error: "Unable to update admin user." });
    }
  },
);

adminUsersRouter.post(
  "/:id/reset-totp",
  requireAdmin,
  requireSuperAdmin,
  requireCsrf,
  requireSameOrigin,
  requireJsonContentType,
  async (req, res) => {
    try {
      const id = String(req.params.id ?? "").trim();
      if (!id || !/^[a-z0-9]+$/i.test(id)) {
        return res.status(400).json({ error: "Invalid user id." });
      }

      const result = await resetAdminUserTotp(id);
      if (!result.ok) {
        return res.status(404).json({ error: result.error });
      }

      return res.json({
        ok: true,
        user: result.user,
        totpSetup: result.totpSetup,
      });
    } catch (err) {
      console.error("POST /api/admin/users/:id/reset-totp failed:", err?.message || err);
      return res.status(500).json({ error: "Unable to reset authenticator." });
    }
  },
);
