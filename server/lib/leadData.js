import { decryptField, encryptField } from "./leadCrypto.js";

const PII_FIELDS = ["name", "phone", "message", "notes"];

export function encryptLeadPayload(data) {
  const out = { ...data };
  for (const field of PII_FIELDS) {
    if (out[field] != null && out[field] !== "") {
      out[field] = encryptField(out[field]);
    }
  }
  return out;
}

export function decryptLeadRecord(lead) {
  if (!lead) return lead;
  const out = { ...lead };
  for (const field of PII_FIELDS) {
    if (out[field] != null) {
      out[field] = decryptField(out[field]);
    }
  }
  return out;
}

export function decryptLeadRecords(leads) {
  return leads.map(decryptLeadRecord);
}

/** Strip internal fields from public API responses. */
export function sanitizeLeadForAdmin(lead) {
  const { ipHash, userAgent, phoneFingerprint, ...rest } = decryptLeadRecord(lead);
  return rest;
}

export function sanitizeLeadsForAdmin(leads) {
  return leads.map(sanitizeLeadForAdmin);
}
