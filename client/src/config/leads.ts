/** Public lead capture API (same origin on VPS). */
export const leadsApi = {
  endpoint: "/api/leads",
  /** Honeypot fields — leave empty; bots that fill any are rejected server-side. */
  honeypotFields: ["_gotcha", "_brief"] as const,
  honeypotField: "_gotcha",
} as const;
