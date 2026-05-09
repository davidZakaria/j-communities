/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  publicDir: path.join(__dirname, "public"),
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
  build: {
    outDir: path.join(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [path.join(__dirname, "src", "test", "setup.ts")],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
