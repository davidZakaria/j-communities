import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { adminLogin } from "../../features/admin/api";
import { setAdminCsrfToken } from "../../features/admin/csrf";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminLogin(username, password);
      setAdminCsrfToken(res.csrfToken);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 font-sans">
      <div className="w-full max-w-sm border border-neutral-300 bg-white p-8 shadow-sm">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">J Communities</p>
        <h1 className="mt-2 font-serif text-2xl text-neutral-900">Lead dashboard</h1>
        <p className="mt-2 text-sm text-neutral-600">Sign in to view and manage project inquiries.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
              placeholder="admin"
              className="w-full border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-900"
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
                className="w-full border border-neutral-300 px-3 py-2 pr-16 text-sm text-neutral-900 outline-none focus:border-neutral-900"
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
          {error ? (
            <p className="text-xs text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/" className="text-xs uppercase tracking-wider text-neutral-500 hover:text-neutral-900">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
