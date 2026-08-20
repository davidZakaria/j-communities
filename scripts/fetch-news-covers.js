/**
 * Fetch og:image from each press article URL and save under client/public/assets/news/covers/.
 * Run: node scripts/fetch-news-covers.js
 */
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getNewsSeedRecords } from "../server/lib/newsSeedData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const outDir = path.join(rootDir, "client", "public", "assets", "news", "covers");
const manifestPath = path.join(rootDir, "server", "lib", "newsCoverManifest.json");

mkdirSync(outDir, { recursive: true });

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function pickImage(html) {
  const patterns = [
    /property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image:secure_url["']/i,
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/&amp;/g, "&").trim();
    }
  }

  const scontent = html.match(/https:\/\/scontent[^"'\\]+?\.(?:jpg|jpeg|webp|png)/i);
  if (scontent?.[0]) return scontent[0].replace(/\\u0026/g, "&").replace(/\\\//g, "/");

  return null;
}

function extFromUrl(imageUrl, contentType) {
  try {
    const pathname = new URL(imageUrl).pathname.toLowerCase();
    if (pathname.endsWith(".webp")) return ".webp";
    if (pathname.endsWith(".png")) return ".png";
    if (pathname.endsWith(".gif")) return ".gif";
    if (pathname.endsWith(".jpeg") || pathname.endsWith(".jpg")) return ".jpg";
  } catch {
    /* ignore */
  }
  if (contentType?.includes("webp")) return ".webp";
  if (contentType?.includes("png")) return ".png";
  if (contentType?.includes("gif")) return ".gif";
  return ".jpg";
}

async function fetchHtml(url, extraHeaders = {}) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", ...extraHeaders },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function resolveImageUrl(slug, pageUrl) {
  if (slug === "akhbarelyom-jamila-handover") {
    const lower = pageUrl.replace("/news/NewDetails/", "/news/newdetails/");
    const html = await fetchHtml(lower, { Referer: "https://akhbarelyom.com/", "Accept-Language": "ar" });
    return pickImage(html);
  }

  const html = await fetchHtml(pageUrl);
  let imageUrl = pickImage(html);

  if (!imageUrl && pageUrl.includes("nabd.cc")) {
    const linkMatch = html.match(/href=["'](https?:\/\/[^"']+)["']/i);
    if (linkMatch?.[1]) {
      const sourceHtml = await fetchHtml(linkMatch[1]);
      imageUrl = pickImage(sourceHtml);
    }
  }

  return imageUrl;
}

async function downloadImage(imageUrl, destPath) {
  const res = await fetch(imageUrl, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Image HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(destPath, buf);
  return { bytes: buf.length, contentType: res.headers.get("content-type") || "" };
}

const records = getNewsSeedRecords().filter((r) => r.externalUrl);
const manifest = {};

for (const record of records) {
  const slug = record.slug;
  const pageUrl = record.externalUrl;
  process.stdout.write(`${slug}… `);

  try {
    let imageUrl = await resolveImageUrl(slug, pageUrl);

    if (!imageUrl) {
      console.log("no og:image");
      manifest[slug] = null;
      continue;
    }

    const probe = await fetch(imageUrl, { method: "HEAD", headers: { "User-Agent": UA } }).catch(() => null);
    const contentType = probe?.headers.get("content-type") || "";
    const ext = extFromUrl(imageUrl, contentType);
    const filename = `${slug}${ext}`;
    const absPath = path.join(outDir, filename);
    const { bytes } = await downloadImage(imageUrl, absPath);

    const publicPath = `/assets/news/covers/${filename}`;
    manifest[slug] = publicPath;
    console.log(`ok (${bytes} bytes) → ${publicPath}`);
  } catch (err) {
    console.log(`failed: ${err.message}`);
    manifest[slug] = null;
  }
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nWrote manifest: ${manifestPath}`);
