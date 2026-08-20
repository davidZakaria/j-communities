import { Router } from "express";
import { prisma } from "../db.js";
import { getClientIp, hashIp } from "../lib/ipHash.js";
import { assessLeadSubmission, duplicateNote, findDuplicateLead, spamNote } from "../lib/leadDedup.js";
import { encryptLeadPayload } from "../lib/leadData.js";
import { encryptField } from "../lib/leadCrypto.js";
import { notifyNewLead } from "../lib/notify.js";
import { validateLeadInput } from "../lib/validateLead.js";
import { verifyTurnstileToken, isTurnstileRequired, readTurnstileToken, turnstileActionForSource } from "../lib/turnstile.js";
import { requireJsonContentType, requireSameOrigin } from "../middleware/security.js";
import { rateLimitLeads, checkLeadPhoneRateLimit } from "../middleware/rateLimit.js";
import { config } from "../config.js";

export const leadsRouter = Router();

leadsRouter.post(
  "/",
  requireSameOrigin,
  requireJsonContentType,
  rateLimitLeads,
  async (req, res) => {
    try {
      const ip = getClientIp(req);
      const source = String(req.body?.source ?? "contact").trim();
      const turnstile = await verifyTurnstileToken(
        readTurnstileToken(req.body),
        ip,
        turnstileActionForSource(source),
      );

      if (!turnstile.ok) {
        if (isTurnstileRequired() || config.turnstileSecretKey) {
          console.warn(
            "Lead rejected (turnstile):",
            turnstile.error,
            turnstile.codes ?? turnstile.hostname ?? turnstile.action ?? "",
            req.get("referer") || ip,
          );
          return res.status(400).json({ error: "Security verification failed. Please try again." });
        }
      }

      const parsed = validateLeadInput(req.body);
      if (!parsed.ok) {
        if (parsed.spam) {
          console.warn("Lead rejected (honeypot):", req.get("referer") || req.ip);
          return res.status(200).json({ ok: true });
        }
        console.warn("Lead validation failed:", parsed.errors.join(", "));
        return res.status(400).json({ error: "Invalid submission." });
      }

      const ipHash = hashIp(ip);
      const assessment = assessLeadSubmission({
        ...parsed.data,
        formReadyAt: req.body?.formReadyAt,
        userAgent: req.headers["user-agent"],
      });

      if (!assessment.isLikelySpam) {
        const phoneLimit = checkLeadPhoneRateLimit(assessment.phoneFingerprint);
        if (!phoneLimit.allowed) {
          res.setHeader("Retry-After", String(phoneLimit.retryAfterSec));
          return res.status(429).json({ error: "Too many submissions for this number. Please try again later." });
        }
      }

      let status = "new";
      let duplicateOfId = null;
      let notes = null;

      if (assessment.isLikelySpam) {
        status = "spam";
        notes = spamNote(assessment.spamReason);
        console.warn("Lead flagged as spam:", assessment.spamReason, req.get("referer") || req.ip);
      } else {
        const prior = await findDuplicateLead({
          phoneFingerprint: assessment.phoneFingerprint,
          projectSlug: parsed.data.projectSlug,
        });

        if (prior) {
          status = "spam";
          duplicateOfId = prior.duplicateOfId ?? prior.id;
          notes = duplicateNote();
          console.warn("Lead duplicate rejected:", parsed.data.projectSlug, req.get("referer") || req.ip);
        }
      }

      const lead = await prisma.lead.create({
        data: encryptLeadPayload({
          ...parsed.data,
          status,
          duplicateOfId,
          notes,
          phoneFingerprint: assessment.phoneFingerprint,
          userAgent: req.headers["user-agent"]?.slice(0, 512) ?? null,
          ipHash,
        }),
      });

      if (status !== "spam") {
        notifyNewLead(lead).catch(() => {});
      }

      return res.status(201).json({ ok: true, trackConversion: status !== "spam" });
    } catch (err) {
      console.error("POST /api/leads failed:", err?.code, err?.message || err);
      return res.status(500).json({ error: "Unable to save your inquiry. Please try again." });
    }
  },
);
