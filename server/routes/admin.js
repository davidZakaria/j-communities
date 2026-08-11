import { Router } from "express";
import { prisma } from "../db.js";
import { decryptLeadRecord, encryptField, sanitizeLeadForAdmin, sanitizeLeadsForAdmin } from "../lib/leadData.js";
import { issueCsrfToken, requireCsrf, requireJsonContentType, requireSameOrigin } from "../middleware/security.js";
import { rateLimitAdminLogin } from "../middleware/rateLimit.js";
import { regenerateSession, requireAdmin, verifyAdminCredentials } from "../middleware/auth.js";

export const adminRouter = Router();

const VALID_STATUSES = new Set(["new", "contacted", "qualified", "closed", "spam"]);
const VALID_SOURCES = new Set(["contact", "popup"]);

function escapeCsv(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

adminRouter.post("/login", rateLimitAdminLogin, requireSameOrigin, requireJsonContentType, async (req, res) => {
  const username = String(req.body?.username ?? "").trim();
  const password = String(req.body?.password ?? "");

  if (!username || !password || password.length > 256) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  const valid = await verifyAdminCredentials(username, password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  try {
    await regenerateSession(req);
    req.session.admin = true;
    req.session.adminUsername = username;
    const csrfToken = issueCsrfToken(req);
    return res.json({ ok: true, username, csrfToken });
  } catch {
    return res.status(500).json({ error: "Login failed." });
  }
});

adminRouter.post("/logout", requireAdmin, requireCsrf, requireSameOrigin, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed." });
    res.clearCookie("jc.sid");
    return res.json({ ok: true });
  });
});

adminRouter.get("/me", requireAdmin, (req, res) => {
  const csrfToken = issueCsrfToken(req);
  return res.json({ ok: true, username: req.session.adminUsername ?? "admin", csrfToken });
});

adminRouter.get("/leads", requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    const where = {};
    const projectSlug = String(req.query.projectSlug ?? "").trim();
    const status = String(req.query.status ?? "").trim();
    const source = String(req.query.source ?? "").trim();

    if (projectSlug) where.projectSlug = projectSlug;
    if (status && VALID_STATUSES.has(status)) where.status = status;
    if (source && VALID_SOURCES.has(source)) where.source = source;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    return res.json({
      ok: true,
      leads: sanitizeLeadsForAdmin(leads),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    console.error("GET /api/admin/leads failed:", err?.message || err);
    return res.status(500).json({ error: "Unable to load leads." });
  }
});

adminRouter.get("/leads.csv", requireAdmin, async (req, res) => {
  try {
    const where = {};
    const projectSlug = String(req.query.projectSlug ?? "").trim();
    const status = String(req.query.status ?? "").trim();
    const source = String(req.query.source ?? "").trim();

    if (projectSlug) where.projectSlug = projectSlug;
    if (status && VALID_STATUSES.has(status)) where.status = status;
    if (source && VALID_SOURCES.has(source)) where.source = source;

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 5000,
    });

    const decrypted = leads.map(decryptLeadRecord);

    const header = [
      "id",
      "createdAt",
      "name",
      "phone",
      "message",
      "projectName",
      "projectSlug",
      "themeId",
      "source",
      "status",
      "notes",
      "pageUrl",
    ];

    const rows = decrypted.map((lead) => header.map((key) => escapeCsv(lead[key])).join(","));

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="leads.csv"');
    res.setHeader("Cache-Control", "no-store");
    return res.send([header.join(","), ...rows].join("\n"));
  } catch (err) {
    console.error("GET /api/admin/leads.csv failed:", err?.message || err);
    return res.status(500).json({ error: "Unable to export leads." });
  }
});

adminRouter.patch(
  "/leads/:id",
  requireAdmin,
  requireCsrf,
  requireSameOrigin,
  requireJsonContentType,
  async (req, res) => {
    try {
      const id = String(req.params.id ?? "").trim();
      if (!id || id.length > 40 || !/^[a-z0-9]+$/i.test(id)) {
        return res.status(400).json({ error: "Invalid lead id." });
      }

      const data = {};
      if (req.body?.status != null) {
        const status = String(req.body.status).trim();
        if (!VALID_STATUSES.has(status)) {
          return res.status(400).json({ error: "Invalid status." });
        }
        data.status = status;
      }
      if (req.body?.notes != null) {
        const notes = String(req.body.notes).trim().slice(0, 4000);
        data.notes = notes ? encryptField(notes) : null;
      }

      if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: "No updates provided." });
      }

      const lead = await prisma.lead.update({ where: { id }, data });
      return res.json({ ok: true, lead: sanitizeLeadForAdmin(lead) });
    } catch (err) {
      if (err?.code === "P2025") {
        return res.status(404).json({ error: "Lead not found." });
      }
      console.error("PATCH /api/admin/leads/:id failed:", err?.message || err);
      return res.status(500).json({ error: "Unable to update lead." });
    }
  },
);
