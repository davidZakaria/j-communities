/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_ORIGIN?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  readonly VITE_GOOGLE_ADS_CONVERSION_SEND_TO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
