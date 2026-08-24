import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AdminLoginError, adminLogin } from "../../features/admin/api";
import { setAdminCsrfToken } from "../../features/admin/csrf";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [requiresTotp, setRequiresTotp] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminLogin(username, password, requiresTotp ? totpCode : undefined);
      setAdminCsrfToken(res.csrfToken);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof AdminLoginError && err.requireTotp) {
        setRequiresTotp(true);
        setTotpCode("");
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setRequiresTotp(false);
    setTotpCode("");
    setError(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 font-sans">
      <div className="w-full max-w-sm border border-neutral-300 bg-white p-8 shadow-sm">
        <div className="mb-6 h-1 w-12 bg-[#DDFF00]" aria-hidden />
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#1A4284]">J Communities</p>
        <h1 className="mt-2 font-serif text-2xl text-neutral-900">Lead dashboard</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {requiresTotp
            ? "Enter the 6-digit code from your authenticator app."
            : "Sign in to view and manage project inquiries."}
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {!requiresTotp ? (
            <>
              <div>
                <label htmlFor="admin-username" className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="esraa"
                  className="w-full border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#1A4284]"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2 pr-16 text-sm text-neutral-900 outline-none focus:border-[#1A4284]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="admin-totp" className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
                6-digit authenticator code
              </label>
              <input
                id="admin-totp"
                name="totp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full border border-[#1A4284]/30 px-3 py-3 text-center font-mono text-lg tracking-[0.35em] text-neutral-900 outline-none focus:border-[#1A4284]"
              />
              <button
                type="button"
                onClick={handleBack}
                className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-[#1A4284] hover:underline"
              >
                Back
              </button>
            </div>
          )}

          {error ? (
            <p className="text-xs text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || (requiresTotp && totpCode.length !== 6)}
            className="w-full bg-[#1A4284] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#15356a] disabled:opacity-60"
          >
            {loading ? "Signing in…" : requiresTotp ? "Verify code" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/" className="text-xs uppercase tracking-wider text-neutral-500 hover:text-[#1A4284]">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
