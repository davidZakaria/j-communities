import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { adminMe } from "../../features/admin/api";
import { setAdminCsrfToken } from "../../features/admin/csrf";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const location = useLocation();
  const [state, setState] = useState<"loading" | "authed" | "guest">("loading");

  useEffect(() => {
    let cancelled = false;
    adminMe()
      .then((res) => {
        if (!cancelled) {
          setAdminCsrfToken(res.csrfToken);
          setState("authed");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAdminCsrfToken(null);
          setState("guest");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 font-sans text-sm text-neutral-600">
        Loading…
      </div>
    );
  }

  if (state === "guest") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
