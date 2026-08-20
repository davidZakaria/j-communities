/** Google Ads conversion send_to value, e.g. AW-18364435114/AbCdEfGhIjK */
export const googleAdsConversionSendTo = (import.meta.env.VITE_GOOGLE_ADS_CONVERSION_SEND_TO ?? "").trim();

export const GOOGLE_ADS_ID = "AW-18364435114";

export const isGoogleAdsConversionEnabled = googleAdsConversionSendTo.length > 0;

export type GoogleAdsLeadSource = "contact" | "popup";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire a Google Ads conversion after a lead is saved (non-spam only). */
export function trackLeadConversion(source: GoogleAdsLeadSource): void {
  if (!isGoogleAdsConversionEnabled || typeof window.gtag !== "function") return;

  window.gtag("event", "conversion", {
    send_to: googleAdsConversionSendTo,
    event_category: "lead",
    event_label: source,
  });
}
