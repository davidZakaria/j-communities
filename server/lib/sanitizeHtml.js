import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const window = new JSDOM("").window;
const purify = createDOMPurify(window);

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "blockquote",
  "span",
];

const ALLOWED_ATTR = ["href", "src", "alt", "title", "target", "rel", "class"];

export function sanitizeArticleHtml(html) {
  const raw = String(html ?? "").trim();
  if (!raw) return "";

  return purify.sanitize(raw, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

export function looksLikeHtml(content) {
  return /<\/?[a-z][\s\S]*>/i.test(String(content ?? ""));
}

/** Convert legacy plain-text bodies to safe HTML paragraphs. */
export function plainTextToHtml(text) {
  const raw = String(text ?? "").trim();
  if (!raw) return "";
  if (looksLikeHtml(raw)) return sanitizeArticleHtml(raw);

  return raw
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
