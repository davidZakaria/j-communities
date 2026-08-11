/** Public lead capture API (same origin on VPS). */
export const leadsApi = {
  endpoint: "/api/leads",
  /** Honeypot field — leave empty; bots that fill it are rejected server-side. */
  honeypotField: "_gotcha",
} as const;
