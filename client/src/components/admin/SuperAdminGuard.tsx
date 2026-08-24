import { Navigate } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { adminMe } from "../../features/admin/api";
import { setAdminCsrfToken } from "../../features/admin/csrf";

interface SuperAdminGuardProps {
  children: ReactNode;
}

export function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const [state, setState] = useState<"loading" | "allowed" | "denied">("loading");

  useEffect(() => {
    let cancelled = false;
    adminMe()
      .then((res) => {
        if (!cancelled) {
          setAdminCsrfToken(res.csrfToken);
          setState(res.isSuperAdmin ? "allowed" : "denied");
        }
      })
      .catch(() => {
        if (!cancelled) setState("denied");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 font-sans text-sm text-neutral-600">
        Loading…
      </div>
    );
  }

  if (state === "denied") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
