import { mkdirSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import multer from "multer";
import { config } from "../config.js";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EXT_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

mkdirSync(config.uploadsNewsDir, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, config.uploadsNewsDir);
  },
  filename(_req, file, cb) {
    const ext = EXT_BY_MIME[file.mimetype] ?? path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${randomUUID()}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed."));
    return;
  }
  cb(null, true);
}

export const newsImageUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

export function publicNewsUploadUrl(filename) {
  return `${config.uploadsNewsPublicPath}/${filename}`;
}
