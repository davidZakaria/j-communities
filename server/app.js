import express from "express";
import helmet from "helmet";
import session from "express-session";
import path from "path";
import { config } from "./config.js";
import { adminRouter } from "./routes/admin.js";
import { leadsRouter } from "./routes/leads.js";
import { apiSecurityHeaders, noStoreApi } from "./middleware/security.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(apiSecurityHeaders);

  app.use(express.json({ limit: "16kb" }));

  app.use(
    session({
      name: "jc.sid",
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: config.isProd,
        sameSite: config.isProd ? "strict" : "lax",
        maxAge: config.sessionMaxAgeMs,
        path: "/",
      },
    }),
  );

  app.use("/api/admin", noStoreApi, adminRouter);
  app.use("/api/leads", noStoreApi, leadsRouter);

  app.use(
    express.static(config.distDir, {
      index: false,
      setHeaders(res, filePath) {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-store");
        }
      },
    }),
  );

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    if (req.path.includes(".")) return next();
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(path.join(config.distDir, "index.html"));
  });

  app.use((req, res) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(404).send("Not found");
  });

  return app;
}
