import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { adminLogout, createAdminUser, fetchAdminUsers, resetAdminUserTotp, setAdminUserActive } from "../../features/admin/api";
import type { AdminUser, TotpSetup } from "../../features/admin/types";
import { TotpSetupPanel } from "../../components/admin/TotpSetupPanel";

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [totpSetup, setTotpSetup] = useState<(TotpSetup & { username: string }) | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminUsers();
      setUsers(res.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleLogout() {
    await adminLogout();
    window.location.href = "/admin/login";
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await createAdminUser({ username, password, isSuperAdmin });
      setTotpSetup({ ...res.totpSetup, username: res.user.username });
      setUsername("");
      setPassword("");
      setIsSuperAdmin(false);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(user: AdminUser) {
    setSavingId(user.id);
    setError(null);
    try {
      await setAdminUserActive(user.id, !user.active);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSavingId(null);
    }
  }

  async function handleResetTotp(user: AdminUser) {
    setSavingId(user.id);
    setError(null);
    try {
      const res = await resetAdminUserTotp(user.id);
      setTotpSetup({ ...res.totpSetup, username: user.username });
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset authenticator");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900">
      <header className="border-b border-neutral-300 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#1A4284]">J Communities</p>
            <h1 className="font-serif text-xl sm:text-2xl">Admin users</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin" className="text-[10px] uppercase tracking-[0.14em] text-neutral-500 hover:text-neutral-900">
              Leads
            </Link>
            <Link to="/admin/news" className="text-[10px] uppercase tracking-[0.14em] text-neutral-500 hover:text-neutral-900">
              News
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-neutral-900 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        {totpSetup ? (
          <TotpSetupPanel
            username={totpSetup.username}
            otpauthUrl={totpSetup.otpauthUrl}
            secret={totpSetup.secret}
            onDone={() => setTotpSetup(null)}
          />
        ) : null}

        <section className="border border-neutral-300 bg-white p-5">
          <h2 className="font-serif text-lg">Add team member</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Each user gets their own password and Google Authenticator setup.
          </p>
          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleCreate}>
            <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-neutral-500">
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={32}
                pattern="[A-Za-z0-9._-]+"
                className="border border-neutral-300 px-3 py-2 text-sm normal-case outline-none focus:border-[#1A4284]"
              />
            </label>
            <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-neutral-500">
              Temporary password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={10}
                maxLength={128}
                className="border border-neutral-300 px-3 py-2 text-sm normal-case outline-none focus:border-[#1A4284]"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700 sm:col-span-2">
              <input
                type="checkbox"
                checked={isSuperAdmin}
                onChange={(e) => setIsSuperAdmin(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-[10px] uppercase tracking-wider text-neutral-500">Super admin (can manage users)</span>
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="bg-[#1A4284] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#15356a] disabled:opacity-60"
              >
                {creating ? "Creating…" : "Create user & show QR"}
              </button>
            </div>
          </form>
        </section>

        {error ? (
          <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}

        <section className="overflow-x-auto border border-neutral-300 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-3 py-3">Username</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">2FA</th>
                <th className="px-3 py-3">Last login</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-neutral-600">
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-neutral-600">
                    No admin users yet. Run <code className="text-xs">npm run admin:seed-from-env</code> or create one above.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-100 align-top">
                    <td className="px-3 py-3 font-medium">{user.username}</td>
                    <td className="px-3 py-3">
                      {user.isSuperAdmin ? (
                        <span className="border border-[#DDFF00]/60 bg-[#DDFF00]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#1A4284]">
                          Super admin
                        </span>
                      ) : (
                        <span className="text-neutral-600">Admin</span>
                      )}
                    </td>
                    <td className="px-3 py-3">{user.hasTotp ? "Enabled" : "Not set"}</td>
                    <td className="px-3 py-3 text-xs text-neutral-600">{formatDate(user.lastLoginAt)}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider ${
                          user.active ? "text-green-700" : "text-neutral-400"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={savingId === user.id}
                          onClick={() => handleResetTotp(user)}
                          className="border border-neutral-300 px-2 py-1 text-[10px] uppercase tracking-wider hover:border-[#1A4284] disabled:opacity-50"
                        >
                          Reset 2FA
                        </button>
                        <button
                          type="button"
                          disabled={savingId === user.id}
                          onClick={() => handleToggleActive(user)}
                          className="border border-neutral-300 px-2 py-1 text-[10px] uppercase tracking-wider hover:border-[#1A4284] disabled:opacity-50"
                        >
                          {user.active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
