import { Route, Routes } from "react-router-dom";
import { DocumentMeta } from "./components/DocumentMeta";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GrainOverlay } from "./components/GrainOverlay";
import { HashScrollHandler } from "./components/HashScrollHandler";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectPage } from "./pages/ProjectPage";

export default function App() {
  return (
    <>
      <a href="#main-content" className="j-skip-link">
        Skip to main content
      </a>
      <GrainOverlay />
      <DocumentMeta />
      <HashScrollHandler />
      <div className="relative z-10 min-h-screen">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </>
  );
}
