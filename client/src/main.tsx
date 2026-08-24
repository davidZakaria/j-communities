import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./styles/project.css";

import { bootstrapProjectPageScroll, attachProjectScrollGuards } from "./utils/scrollToTop";
import { captureUtmFromUrl } from "./features/utm";

if (typeof history !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

captureUtmFromUrl();

if (typeof window !== "undefined" && window.location.pathname.startsWith("/projects/")) {
  bootstrapProjectPageScroll();
  attachProjectScrollGuards();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
