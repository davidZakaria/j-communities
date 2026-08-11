import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DocumentMeta } from "./components/DocumentMeta";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GrainOverlay } from "./components/GrainOverlay";
import { HashScrollHandler } from "./components/HashScrollHandler";
import { ScrollToTop } from "./components/ScrollToTop";
import { AdminGuard } from "./components/admin/AdminGuard";
import { ExperienceTierProvider } from "./features/motion/ExperienceTierContext";
import { LenisProvider } from "./features/motion/LenisProvider";
import { ScrollProgressProvider } from "./features/motion/ScrollProgressContext";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectPage } from "./pages/ProjectPage";

function ProjectPageRoute() {
  const { pathname } = useLocation();
  return <ProjectPage key={pathname} />;
}

function MarketingApp() {
  return (
    <ExperienceTierProvider>
      <LenisProvider>
        <ScrollProgressProvider>
          <GrainOverlay />
          <DocumentMeta />
          <ScrollToTop />
          <HashScrollHandler />
          <div className="relative z-10 min-h-screen">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects/jamila-north-coast" element={<Navigate to="/projects/jamila" replace />} />
                <Route path="/projects/:slug" element={<ProjectPageRoute />} />
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ErrorBoundary>
          </div>
        </ScrollProgressProvider>
      </LenisProvider>
    </ExperienceTierProvider>
  );
}

function AdminApp() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminDashboardPage />
          </AdminGuard>
        }
      />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <a href="#main-content" className="j-skip-link">
        Skip to main content
      </a>
      {isAdmin ? <AdminApp /> : <MarketingApp />}
    </>
  );
}
