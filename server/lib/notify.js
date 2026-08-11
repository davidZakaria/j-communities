import nodemailer from "nodemailer";
import { decryptLeadRecord } from "./leadData.js";
import { config } from "../config.js";

function buildLeadEmail(lead) {
  const plain = decryptLeadRecord(lead);

  const subject =
    plain.source === "popup"
      ? `Callback request · ${plain.projectName}`
      : `Inquiry · ${plain.projectName}`;

  const text = [
    `Name: ${plain.name}`,
    `Phone: ${plain.phone}`,
    plain.message ? `Message: ${plain.message}` : null,
    `Project: ${plain.projectName} (${plain.projectSlug})`,
    `Source: ${plain.source}`,
    plain.pageUrl ? `Page: ${plain.pageUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, text };
}

async function sendViaSmtp(subject, text) {
  const transport = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  await transport.sendMail({
    from: config.smtp.from || config.smtp.user,
    to: config.notifyEmail,
    subject,
    text,
  });
}

async function sendViaResend(subject, text) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.smtp.from || "J Communities <onboarding@resend.dev>",
      to: [config.notifyEmail],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend HTTP ${res.status}`);
  }
}

export async function notifyNewLead(lead) {
  if (!config.notifyEmail || lead.status === "spam") return;

  const { subject, text } = buildLeadEmail(lead);
  const hasSmtp = config.smtp.host && config.smtp.user && config.smtp.pass;
  const hasResend = Boolean(config.resendApiKey);

  if (!hasSmtp && !hasResend) return;

  try {
    if (hasSmtp) {
      await sendViaSmtp(subject, text);
    } else {
      await sendViaResend(subject, text);
    }
  } catch (err) {
    console.error("Lead notify failed:", err?.message || err);
  }
}
