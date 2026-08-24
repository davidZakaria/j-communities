# J Communities — Full Application Guide

> **Purpose:** Shareable reference for the J Communities marketing website, lead capture system, news CMS, and admin dashboard.  
> **Repository:** [github.com/davidZakaria/j-communities](https://github.com/davidZakaria/j-communities)  
> **Production:** [https://www.j-communities.com](https://www.j-communities.com)  
> **Last updated:** August 2026

---

## Table of contents

1. [Overview](#1-overview)
2. [Tech stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Public website](#4-public-website)
5. [Projects](#5-projects)
6. [Lead capture forms](#6-lead-capture-forms)
7. [News & press](#7-news--press)
8. [Admin dashboard](#8-admin-dashboard)
9. [API reference](#9-api-reference)
10. [Database schema](#10-database-schema)
11. [Security](#11-security)
12. [Environment variables](#12-environment-variables)
13. [Scripts & commands](#13-scripts--commands)
14. [Local development](#14-local-development)
15. [Production deployment (VPS)](#15-production-deployment-vps)
16. [Project structure](#16-project-structure)
17. [Design & brand](#17-design--brand)
18. [Maintenance checklist](#18-maintenance-checklist)

---

## 1. Overview

**J Communities** is a full-stack real estate marketing platform for a UK-based developer with flagship projects in Egypt. It combines:

- A **premium marketing site** with 3D hero experiences, editorial photography, and smooth scroll
- **Project landing pages** (Jamila North Coast, Jura Sokhna) with galleries, amenities, floor plans, and 3D tours
- **Lead capture** via contact forms and timed popups
- A **news / press section** with English and Arabic articles
- An **admin dashboard** for leads and news management

Everything runs in a **single Node.js process**: Express serves the API, admin routes, uploaded files, and the built React SPA.

---

## 2. Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| 3D / motion | Three.js, React Three Fiber, Drei, Lenis smooth scroll |
| Backend | Node.js, Express 4 |
| Database | SQLite via Prisma ORM |
| Auth | Express sessions + bcrypt admin password |
| PII encryption | AES-256-GCM (`LEAD_ENCRYPTION_KEY`) |
| Anti-spam | Cloudflare Turnstile, honeypots, rate limits |
| Email alerts | SMTP (InMotion) or Resend API |
| Excel export | SheetJS (`xlsx`) |
| Process manager | PM2 |
| Reverse proxy | nginx + Let's Encrypt |
| Hosting | Hostinger VPS (Ubuntu) |

---

## 3. Architecture

```mermaid
flowchart TB
  subgraph client [Browser]
    SPA[React SPA]
    Forms[Lead Forms]
    Admin[Admin Dashboard]
  end

  subgraph server [Node.js Express :3000]
    API["/api/leads"]
    NewsAPI["/api/news"]
    AdminAPI["/api/admin"]
    Static[client/dist static]
    Uploads[/uploads/news]
  end

  subgraph data [Data]
    SQLite[(SQLite leads.db)]
    Files[data/uploads/news]
  end

  subgraph external [External]
    CF[Cloudflare Turnstile]
    SMTP[Email SMTP / Resend]
  end

  SPA --> Static
  Forms --> API
  Admin --> AdminAPI
  API --> SQLite
  AdminAPI --> SQLite
  NewsAPI --> SQLite
  API --> CF
  API --> SMTP
  AdminAPI --> Files
  Uploads --> Files
```

**Request flow (lead submission):**

1. User fills popup or contact form on a project page
2. Client validates name (≤15 chars) and phone (country-specific digit count)
3. Cloudflare Turnstile token attached (production)
4. `POST /api/leads` → validate → encrypt PII → store in SQLite
5. Optional email notification sent in background
6. Admin views/decrypts leads at `/admin`

---

## 4. Public website

### Routes

| URL | Page | Description |
|-----|------|-------------|
| `/` | Homepage | Hero, about, lifestyle, pillars, value prop, projects grid, news teaser, footer |
| `/projects/jamila` | Jamila North Coast | Full project page with themed sections |
| `/projects/jura-sokhna` | Jura Sokhna | Full project page with themed sections |
| `/projects/jamila-north-coast` | Redirect | → `/projects/jamila` |
| `/news` | News list | Filterable press & social articles (EN / AR) |
| `/news/:slug` | Article detail | Full article with cover image and related posts |
| `/admin` | Admin | Leads dashboard (login required) |
| `/admin/news` | Admin | News CMS (login required) |
| `/admin/login` | Admin login | Session-based authentication |

### Homepage sections

1. **Hero** — 3D canvas, headline, navigation
2. **Intro** — Company philosophy
3. **Lifestyle banner** — Editorial photography
4. **Pillars** — Jura, Jamila, coastal living links
5. **Value proposition** — Four key points + brochure CTA
6. **Projects grid** — Portfolio cards linking to project pages
7. **News teaser** — Latest 3 articles (featured + 2 side cards)
8. **Footer** — Quick links, social, contact

### Project pages

Each project page is built from configurable sections rendered by `ProjectSectionRenderer`:

- Hero
- Gateway / split content
- Amenities
- Property types
- Floor plans
- Gallery
- 3D tour embed
- Partners
- Contact form
- Lead popup (auto-opens after ~1.4s, once per session)

**Themes:** Each project has its own visual theme (`jura` or `jamila`) with custom colors, fonts, and assets.

---

## 5. Projects

| Project | Slug | Location | Theme |
|---------|------|----------|-------|
| **Jamila North Coast** | `jamila` | North Coast, Egypt | Jamila (Yale Blue `#1A4284`, Lemon `#DDFF00`, Teal accents) |
| **Jura Sokhna** | `jura-sokhna` | Ain Sokhna, Egypt | Jura theme |

**Campaign URLs:**
- Jamila: `https://www.j-communities.com/projects/jamila`
- Jura: `https://www.j-communities.com/projects/jura-sokhna`

**3D tours:**
- Jamila: `https://njdegypt.com/jamila360/HQ`
- Jura: `https://logica-itech.com/JURA/index.htm`

---

## 6. Lead capture forms

### Form types

| Form | Location | Fields | Source tag |
|------|----------|--------|------------|
| **Contact form** | Project page contact section | Name, phone, optional message | `contact` |
| **Popup form** | Auto popup on project pages | Name, phone | `popup` |

### Validation rules

| Field | Rule |
|-------|------|
| **Name** | Required, max **15 characters** |
| **Phone** | Country code dropdown + local number; digit count validated per country |
| **Message** | Optional, max 2,000 characters (contact form only) |

### Supported country codes

Default: **Egypt (+20)** — 10 digits.

Also supported: Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman, Jordan, Lebanon, Iraq, Libya, Morocco, Tunisia, US, UK, France, Germany, Italy, India, Pakistan.

Each country has its own `minDigits` / `maxDigits` (e.g. Egypt = exactly 10, Lebanon = 7–8).

Phone is stored in international format (e.g. `+201012345678`).

### Anti-spam controls

- Cloudflare Turnstile (required in production)
- Hidden honeypot fields
- Minimum 2.5s after form opens before submit accepted
- Rate limit: 3 submissions / 10 min per IP
- Rate limit: 3 submissions / hour per phone
- Duplicate detection: same phone + project within 24h → auto-marked as spam
- Origin validation on POST requests

### Lead statuses (admin)

| Status | Meaning |
|--------|---------|
| `new` | Just submitted |
| `contacted` | Team reached out |
| `qualified` | Valid prospect |
| `closed` | Done / not proceeding |
| `spam` | Spam or duplicate |

---

## 7. News & press

### Public features

- List page at `/news` with language filter (English / Arabic / All) and category filter (Press / Social)
- Article detail pages with cover image, rich HTML body, and related articles
- Homepage teaser showing latest 3 articles in editorial grid layout
- Per-article cover images scraped from original press URLs

### Content model

| Field | Description |
|-------|-------------|
| `slug` | URL-safe unique identifier |
| `title` | Headline |
| `excerpt` | Short summary for cards |
| `body` | Full article (HTML, sanitized) |
| `publishedAt` | Display date |
| `source` | Publication name (e.g. "Tadawul News") |
| `externalUrl` | Link to original article |
| `category` | `press` or `social` |
| `language` | `en` or `ar` (RTL layout for Arabic) |
| `featured` | Pin to top of lists |
| `published` | Visible on public site |
| `coverImageUrl` | Hero/thumbnail image |

### Seed data

15 pre-seeded articles about the Jamila national football team chalet handover initiative.

```bash
npm run db:seed-news          # Seed / update articles
npm run db:fetch-news-covers  # Re-fetch og:image covers from URLs
```

---

## 8. Admin dashboard

**URL:** `/admin`  
**Login:** Username + password (bcrypt hash in `.env`)

### Leads dashboard (`/admin`)

- View paginated lead list (50 per page)
- Filter by: project, status, source, show/hide spam
- Update lead status inline
- Add internal notes (encrypted at rest)
- **Export CSV** — filtered download
- **Export XLSX** — filtered Excel download
- **Export date range** — "Export from" / "Export to" datetime pickers (includes hours)

#### Export columns

| Column | Description |
|--------|-------------|
| `id` | Lead ID |
| `createdDate` | `YYYY-MM-DD` |
| `createdTime` | `HH:mm:ss` |
| `name` | Lead name |
| `phone` | Full international phone |
| `message` | Optional message |
| `projectName` | Project display name |
| `projectSlug` | `jamila` or `jura-sokhna` |
| `themeId` | Theme identifier |
| `source` | `contact` or `popup` |
| `status` | Lead status |
| `notes` | Admin notes |
| `duplicateOfId` | If duplicate spam |
| `pageUrl` | Page URL at submission |

Export respects all active filters + date range. Max 5,000 rows per export.

### News CMS (`/admin/news`)

- List all articles (including unpublished)
- Create / edit / delete articles
- Rich text editor with image upload
- Set language (EN / AR), category, featured flag, publish toggle
- Upload cover images to `data/uploads/news/`

---

## 9. API reference

### Public — Leads

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/leads` | Submit a new lead |

**Body (JSON):**
```json
{
  "name": "Ahmed",
  "phone": "1012345678",
  "countryCode": "EG",
  "message": "Optional message",
  "projectName": "Jamila North Coast",
  "projectSlug": "jamila",
  "themeId": "jamila",
  "source": "contact",
  "pageUrl": "https://www.j-communities.com/projects/jamila",
  "formReadyAt": 1735123456789,
  "turnstileToken": "..."
}
```

### Public — News

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/news` | List published articles |
| `GET` | `/api/news/:slug` | Single article + related |

**Query params (list):** `category`, `language`, `featured=1`, `limit`

### Admin — Auth & Leads

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/admin/login` | — | Admin login |
| `POST` | `/api/admin/logout` | Session + CSRF | Logout |
| `GET` | `/api/admin/me` | Session | Current user + CSRF token |
| `GET` | `/api/admin/leads` | Session | Paginated leads |
| `GET` | `/api/admin/leads.csv` | Session | CSV export |
| `GET` | `/api/admin/leads.xlsx` | Session | XLSX export |
| `PATCH` | `/api/admin/leads/:id` | Session + CSRF | Update status / notes |

**Export query params:** `projectSlug`, `status`, `source`, `includeSpam=1`, `exportFrom`, `exportTo`

### Admin — News

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/admin/news` | Session | List all articles |
| `POST` | `/api/admin/news` | Session + CSRF | Create article |
| `GET` | `/api/admin/news/:id` | Session | Get one article |
| `PATCH` | `/api/admin/news/:id` | Session + CSRF | Update article |
| `DELETE` | `/api/admin/news/:id` | Session + CSRF | Delete article |
| `POST` | `/api/admin/news/upload` | Session + CSRF | Upload cover image |

---

## 10. Database schema

**Engine:** SQLite (`data/leads.db`)

### Lead

```
id, createdAt, updatedAt
name, phone, message          ← encrypted at rest
projectName, projectSlug, themeId
source (contact | popup)
pageUrl, userAgent, ipHash
status (new | contacted | qualified | closed | spam)
notes                         ← encrypted at rest
phoneFingerprint, duplicateOfId
```

### NewsArticle

```
id, createdAt, updatedAt
slug (unique), title, excerpt, body
publishedAt, source, externalUrl
category (press | social)
language (en | ar)
featured, published
coverImageUrl
```

---

## 11. Security

| Control | Details |
|---------|---------|
| **PII encryption** | Name, phone, message, notes encrypted with AES-256-GCM |
| **Admin sessions** | HttpOnly cookies, SameSite=Strict (prod), 12h max age |
| **CSRF tokens** | Required on admin mutations |
| **Origin validation** | Blocks cross-site POST/PATCH when `SITE_ORIGIN` set |
| **Turnstile** | Server-side verification on all lead forms (prod) |
| **Rate limits** | Login: 10/15min/IP · Leads: 3/10min/IP · Phone: 3/hour |
| **Honeypots** | Hidden fields reject bots silently |
| **Production gate** | Server refuses start without secrets, encryption key, Turnstile |
| **Helmet** | Security headers on Express |
| **Allowlist** | Only `jamila` and `jura-sokhna` project slugs accepted |

**Critical:** Back up `LEAD_ENCRYPTION_KEY` securely — without it, encrypted leads cannot be recovered.

---

## 12. Environment variables

### Server (`.env` at repo root)

| Variable | Required (prod) | Purpose |
|----------|-----------------|---------|
| `PORT` | — | Express port (default `3000`) |
| `NODE_ENV` | ✓ | `production` |
| `SESSION_SECRET` | ✓ | Session signing (min 32 chars) |
| `ADMIN_USERNAME` | ✓ | Dashboard username |
| `ADMIN_PASSWORD_HASH` | ✓ | Bcrypt hash |
| `LEAD_ENCRYPTION_KEY` | ✓ | 64-char hex AES key |
| `SITE_ORIGIN` | ✓ | Public site URL |
| `ALLOWED_ORIGINS` | ✓ | Comma-separated origins |
| `DATABASE_URL` | ✓ | e.g. `file:./data/leads.db` |
| `TURNSTILE_SECRET_KEY` | ✓ | Cloudflare Turnstile secret |
| `TURNSTILE_HOSTNAMES` | ✓ | Allowed hostnames |
| `NOTIFY_EMAIL` | — | Alert inbox |
| `SMTP_*` | — | InMotion mail settings |
| `RESEND_API_KEY` | — | Optional Resend fallback |
| `SESSION_MAX_AGE_MS` | — | Default 12 hours |
| `DUPLICATE_WINDOW_HOURS` | — | Default 24 |

### Client (`client/.env`)

| Variable | Purpose |
|----------|---------|
| `VITE_SITE_ORIGIN` | Canonical / OG URLs |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |

---

## 13. Scripts & commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (port 5173, proxies `/api`) |
| `npm run dev:server` | Express API (port 3000) |
| `npm run build` | Production frontend build → `client/dist/` |
| `npm start` | Production server (requires build first) |
| `npm test` / `npm run test:run` | Vitest unit tests |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run deploy:vps` | Migrate + generate + seed news + build |
| `npm run db:seed-news` | Seed/update news articles |
| `npm run db:fetch-news-covers` | Fetch cover images from press URLs |
| `npm run admin:hash-password -- <pw>` | Generate bcrypt hash |
| `npm run admin:set-password -- <pw>` | Set admin password in `.env` |
| `npm run admin:generate-key` | Generate encryption key |
| `npm run admin:verify-env` | Validate production env |

---

## 14. Local development

```bash
# 1. Clone & install
git clone https://github.com/davidZakaria/j-communities.git
cd j-communities
npm install

# 2. Environment
cp .env.example .env
cp client/.env.example client/.env
npm run admin:generate-key    # → LEAD_ENCRYPTION_KEY
npm run admin:hash-password -- your-password  # → ADMIN_PASSWORD_HASH
# Set SITE_ORIGIN=http://localhost:5173

# 3. Database
npx prisma migrate dev

# 4. Run (two terminals)
npm run dev:server   # Terminal 1 — API on :3000
npm run dev          # Terminal 2 — Vite on :5173

# 5. Open
# Site:  http://localhost:5173
# Admin: http://localhost:5173/admin
```

Turnstile is optional locally (leave keys empty).

---

## 15. Production deployment (VPS)

**Server:** Hostinger VPS (`31.97.180.94`)  
**Domain:** `j-communities.com` / `www.j-communities.com`  
**App path:** `/var/www/j-communities`  
**Process:** PM2 `j-communities` on port **3002** (proxied by nginx)

### Deploy / update

```bash
cd /var/www/j-communities
git fetch origin
git reset --hard origin/main    # Use if local changes block pull
git log -1 --oneline            # Verify latest commit
npm install
npm run build
npm run db:migrate              # If schema changed
pm2 restart j-communities --update-env
```

> **Important:** Always run `npm run build` after pulling — the frontend is not served from git, only from `client/dist/`. If `git pull` fails due to local changes, run `git reset --hard origin/main` first.

### nginx

nginx reverse-proxies port 80/443 → Node app. SSL via Let's Encrypt (Certbot).

### File permissions

```bash
chmod 700 data
chmod 600 data/leads.db
```

---

## 16. Project structure

```
j-communities/
├── client/                    # React frontend
│   ├── public/assets/         # Static images, models, news covers
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── project/       # Project page sections + lead forms
│   │   │   └── admin/         # Admin guards, rich text editor
│   │   ├── pages/             # Route pages (home, project, news, admin)
│   │   ├── features/          # API clients, motion, three.js scenes
│   │   ├── config/            # Brand, themes, copy, validation
│   │   └── content/           # Site copy, project section configs
│   └── dist/                  # Production build (gitignored)
├── server/                    # Express backend
│   ├── routes/                # admin.js, adminNews.js, leads.js, news.js
│   ├── lib/                   # Validation, encryption, export, notify
│   ├── middleware/            # Auth, CSRF, rate limits, security
│   └── config.js              # Server configuration
├── shared/                    # Shared modules (country dial codes)
├── prisma/                    # Schema + migrations
├── scripts/                   # Seed, deploy helpers, password tools
├── data/                      # SQLite DB + uploads (gitignored)
├── server.js                  # Entry point
└── package.json
```

---

## 17. Design & brand

### Jamila brand colors

| Token | Hex | Usage |
|-------|-----|-------|
| Yale Blue | `#1A4284` | Primary brand, badges, links |
| Lemon | `#DDFF00` | Accent lines, highlights |
| Teal | `#00B2A9` | Arabic language tags, secondary accent |

### Typography

- **Headings:** Serif (editorial feel)
- **Body / UI:** Sans-serif, uppercase tracking on labels
- Type scale defined in `client/src/config/lookFeel.ts`

### Photography

- Editorial stills in `client/public/assets/look-feel/`
- Project galleries in `client/public/assets/projects/`
- Grayscale + contrast treatment via `.j-img-editorial` CSS

### 3D hero

- WebGL scenes per context (home, jura, jamila)
- Draco-compressed GLB models
- Respects reduced-motion preference

---

## 18. Maintenance checklist

### After code changes

- [ ] `npm run build` on VPS
- [ ] `pm2 restart j-communities --update-env`
- [ ] Hard refresh browser (`Ctrl+Shift+R`)
- [ ] Verify `git log -1` matches expected commit

### Regular

- [ ] Back up `data/leads.db` and `LEAD_ENCRYPTION_KEY`
- [ ] Review spam leads in admin
- [ ] Check Turnstile dashboard for abuse
- [ ] Update news articles via `/admin/news`

### Troubleshooting

| Issue | Fix |
|-------|-----|
| 502 Bad Gateway | Check PM2 status, rebuild if `client/dist/` missing |
| Admin changes not visible | Run `npm run build`, hard refresh |
| `git pull` blocked | `git reset --hard origin/main` then rebuild |
| Export button missing | Confirm latest commit deployed + build ran |
| Forms not submitting | Check Turnstile keys, browser console, server logs |

---

## Contact & support

- **Site:** [j-communities.com](https://www.j-communities.com)
- **Email:** info@j-communities.com
- **GitHub:** [davidZakaria/j-communities](https://github.com/davidZakaria/j-communities)

---

*This document describes the application as of commit `1c07816` (August 2026). For the latest code, see the repository.*
