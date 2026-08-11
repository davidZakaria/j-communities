import { Router } from "express";
import { prisma } from "../db.js";
import { getClientIp, hashIp } from "../lib/ipHash.js";
import { encryptLeadPayload } from "../lib/leadData.js";
import { notifyNewLead } from "../lib/notify.js";
import { validateLeadInput } from "../lib/validateLead.js";
import { requireJsonContentType, requireSameOrigin } from "../middleware/security.js";
import { rateLimitLeads } from "../middleware/rateLimit.js";

export const leadsRouter = Router();

leadsRouter.post(
  "/",
  requireSameOrigin,
  requireJsonContentType,
  rateLimitLeads,
  async (req, res) => {
    try {
      const parsed = validateLeadInput(req.body);
      if (!parsed.ok) {
        if (parsed.spam) {
          return res.status(200).json({ ok: true });
        }
        return res.status(400).json({ error: "Invalid submission." });
      }

      const ip = getClientIp(req);
      const lead = await prisma.lead.create({
        data: encryptLeadPayload({
          ...parsed.data,
          userAgent: req.headers["user-agent"]?.slice(0, 512) ?? null,
          ipHash: hashIp(ip),
        }),
      });

      notifyNewLead(lead).catch(() => {});

      return res.status(201).json({ ok: true });
    } catch (err) {
      console.error("POST /api/leads failed:", err?.message || err);
      return res.status(500).json({ error: "Unable to save your inquiry. Please try again." });
    }
  },
);
