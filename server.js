import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const dist = path.join(__dirname, "client", "dist");
const PORT = Number(process.env.PORT) || 3000;

app.use(express.static(dist));

app.get("*", (req, res, next) => {
  if (req.path.includes(".")) return next();
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`J Communities server listening on port ${PORT}`);
});
