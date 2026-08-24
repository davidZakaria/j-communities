const STORAGE_KEY = "jc:utm";

export interface UtmParams {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

function readStoredUtm(): UtmParams {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { utmSource: null, utmMedium: null, utmCampaign: null };
    }
    const parsed = JSON.parse(raw) as Partial<UtmParams>;
    return {
      utmSource: parsed.utmSource ?? null,
      utmMedium: parsed.utmMedium ?? null,
      utmCampaign: parsed.utmCampaign ?? null,
    };
  } catch {
    return { utmSource: null, utmMedium: null, utmCampaign: null };
  }
}

/** Call once on app load to persist marketing UTMs for the session. */
export function captureUtmFromUrl(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source")?.trim() || null;
  const utmMedium = params.get("utm_medium")?.trim() || null;
  const utmCampaign = params.get("utm_campaign")?.trim() || null;

  if (!utmSource && !utmMedium && !utmCampaign) return;

  const next: UtmParams = { ...readStoredUtm() };
  if (utmSource) next.utmSource = utmSource.slice(0, 120);
  if (utmMedium) next.utmMedium = utmMedium.slice(0, 120);
  if (utmCampaign) next.utmCampaign = utmCampaign.slice(0, 120);

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") {
    return { utmSource: null, utmMedium: null, utmCampaign: null };
  }
  return readStoredUtm();
}
