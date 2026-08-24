import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface TotpSetupPanelProps {
  username: string;
  otpauthUrl: string;
  secret: string;
  onDone: () => void;
}

export function TotpSetupPanel({ username, otpauthUrl, secret, onDone }: TotpSetupPanelProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(otpauthUrl, { margin: 1, width: 220 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [otpauthUrl]);

  return (
    <div className="border border-[#1A4284]/20 bg-[#1A4284]/5 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1A4284]">
        Scan authenticator QR — {username}
      </p>
      <p className="mt-2 text-sm text-neutral-700">
        Open Google Authenticator, scan this code, then sign in with the 6-digit code.
      </p>
      <div className="mt-4 flex flex-col items-center gap-3">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt={`Authenticator setup for ${username}`} className="border border-neutral-200 bg-white p-2" />
        ) : (
          <p className="text-xs text-neutral-500">Generating QR code…</p>
        )}
        <p className="max-w-full break-all text-center font-mono text-[10px] text-neutral-500">{secret}</p>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="mt-4 w-full bg-[#1A4284] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#15356a]"
      >
        Done — I scanned the code
      </button>
    </div>
  );
}
