import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { isTurnstileEnabled, turnstileSiteKey } from "../../config/turnstile";

type TurnstileSize = "normal" | "compact";

export interface LeadTurnstileHandle {
  reset: () => void;
}

interface LeadTurnstileProps {
  onTokenChange: (token: string | null) => void;
  size?: TurnstileSize;
}

interface TurnstileRenderOptions {
  sitekey: string;
  size?: TurnstileSize;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  theme?: "light" | "auto";
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Turnstile failed to load")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Turnstile failed to load"));
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export const LeadTurnstile = forwardRef<LeadTurnstileHandle, LeadTurnstileProps>(function LeadTurnstile(
  { onTokenChange, size = "normal" },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  onTokenChangeRef.current = onTokenChange;

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
      onTokenChangeRef.current(null);
    },
  }));

  useEffect(() => {
    if (!isTurnstileEnabled || !containerRef.current) return;

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: turnstileSiteKey,
          size,
          theme: "light",
          callback: (token) => onTokenChangeRef.current(token),
          "expired-callback": () => onTokenChangeRef.current(null),
          "error-callback": () => onTokenChangeRef.current(null),
        });
      })
      .catch(() => onTokenChangeRef.current(null));

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      onTokenChangeRef.current(null);
    };
  }, [size]);

  if (!isTurnstileEnabled) return null;

  return <div ref={containerRef} className="min-h-[65px]" aria-label="Security verification" />;
});
