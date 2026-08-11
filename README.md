# J Communities

React + Vite marketing site (`client/`), Express API + SQLite leads database, and an admin dashboard at `/admin`.

## Scripts

- **`npm run dev`** — Vite dev server (proxies `/api` → `http://localhost:3000`).
- **`npm run dev:server`** — Express API + static server on port 3000.
- **`npm run build`** — Production bundle into `client/dist/`.
- **`npm start`** — Serves `client/dist` + API. Run **`npm run build`** first.
- **`npm test`** / **`npm run test:run`** — Vitest unit tests.
- **`npm run db:migrate`** — Apply Prisma migrations (production).
- **`npm run admin:hash-password -- <password>`** — Generate `ADMIN_PASSWORD_HASH`.
- **`npm run admin:generate-key`** — Generate `LEAD_ENCRYPTION_KEY`.

### Local development

1. Copy [`.env.example`](.env.example) to `.env` at the repo root.
2. Run `npm run admin:generate-key` → set `LEAD_ENCRYPTION_KEY`.
3. Run `npm run admin:hash-password -- your-password` → set `ADMIN_PASSWORD_HASH`.
4. Set `SITE_ORIGIN=http://localhost:5173` for local origin checks.
5. Run migrations: `npx prisma migrate dev`.
6. Terminal 1: `npm run dev:server`
7. Terminal 2: `npm run dev`
8. Site: `http://localhost:5173` · Admin: `http://localhost:5173/admin`

## Configuration

### Server (`.env` at repo root)

| Variable | Purpose |
|----------|---------|
| `PORT` | Express port (default `3000`) |
| `SESSION_SECRET` | Session cookie signing secret |
| `ADMIN_USERNAME` | Dashboard login username |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash from `npm run admin:hash-password` |
| `LEAD_ENCRYPTION_KEY` | 64-char hex key from `npm run admin:generate-key` (encrypts PII at rest) |
| `SITE_ORIGIN` | Public site URL for origin validation (required in production) |
| `ALLOWED_ORIGINS` | Optional comma-separated extra origins (www + apex) |
| `SESSION_MAX_AGE_MS` | Admin session lifetime (default 12 hours) |
| `DATABASE_URL` | SQLite path, e.g. `file:./data/leads.db` |
| `NOTIFY_EMAIL` | Optional alert inbox |
| `RESEND_API_KEY` | Optional Resend API key for new-lead emails |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret (required in production) |

### Client (`client/.env`)

Copy [`client/.env.example`](client/.env.example) and set:

- **`VITE_SITE_ORIGIN`** (no trailing slash) for canonical + Open Graph URLs
- **`VITE_TURNSTILE_SITE_KEY`** — public site key from Cloudflare Turnstile (required for production builds)

### Look & Feel photos & logo

- **Photos:** Drop exports in `client/public/assets/look-feel/` and set **`LOOK_FEEL_EXT`** in `client/src/config/lookFeel.ts`.
- **Logo:** **`logoLightUrl`** in **`client/src/config/brand.ts`**.
- **Copy & type scale:** **`client/src/content/siteCopy.ts`** and **`client/src/config/lookFeel.ts`**.

## Leads

Public forms (Jura + Jamila contact section + popup) POST to **`POST /api/leads`**.

Admin dashboard: **`/admin`** — filter leads, update status, add notes, export CSV.

Campaign URLs:
- Jamila: `/projects/jamila`
- Jura: `/projects/jura-sokhna`

## Security (leads protection)

Lead data (name, phone, message, notes) is treated as sensitive PII.

| Control | What it does |
|---------|----------------|
| AES-256-GCM at rest | PII encrypted in SQLite via `LEAD_ENCRYPTION_KEY` |
| Admin session | HttpOnly, `SameSite=Strict` in prod, 12h max age |
| CSRF tokens | Required on admin logout and lead updates |
| Origin validation | Blocks cross-site POST/PATCH when `SITE_ORIGIN` is set |
| Cloudflare Turnstile | CAPTCHA on popup + contact forms; verified server-side |
| Rate limits | Login 10/15min/IP · leads 3/10min/IP · 3/hour per phone |
| Honeypot + allowlist | Hidden fields; only `jura-sokhna` / `jamila` slugs |
| Duplicate detection | Same phone + project within 24h → auto-spam |
| Production gate | Server refuses to start without secrets + encryption key + Turnstile |

Generate secrets before deploy:

```bash
npm run admin:generate-key
npm run admin:hash-password -- 'your-strong-password'
```

Back up **`LEAD_ENCRYPTION_KEY`** securely — without it, encrypted leads cannot be recovered.

### Cloudflare Turnstile (forms)

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Turnstile** → **Add widget**
2. Widget name: `J Communities leads`
3. Hostnames: `j-communities.com`, `www.j-communities.com`
4. Widget mode: **Managed** (recommended)
5. Copy **Site key** → `client/.env` as `VITE_TURNSTILE_SITE_KEY`
6. Copy **Secret key** → root `.env` as `TURNSTILE_SECRET_KEY`
7. Set `TURNSTILE_HOSTNAMES=j-communities.com,www.j-communities.com` in root `.env`
8. Rebuild and restart: `npm run build && pm2 restart j-communities --update-env`

Turnstile is optional in local dev (leave keys empty). **Required in production.**

On VPS: `chmod 700 data && chmod 600 data/leads.db`, firewall 22/80/443 only, nginx HSTS, do not expose port 3000 publicly.

## Deployment (Hostinger VPS)

Recommended: run the **entire app** on your Ubuntu VPS (site + API + dashboard in one Node process).

### 1. DNS (Cloudflare + cutover from shared host)

Your live site is on **shared hosting** today with **Cloudflare** in front. Email stays on **InMotion** — do **not** change MX records.

When the VPS app is ready:

1. In Cloudflare DNS, set **`@`** and **`www`** A records to your **VPS IP** (orange cloud / proxy ON is fine).
2. SSL/TLS mode: **Full (strict)** once Let’s Encrypt is on the VPS.
3. Stop uploading to shared `public_html` after the VPS site is verified.
4. Copy the repo `.env` to the VPS (includes `SMTP_*` for InMotion mail alerts).

`client/.env` already has `VITE_SITE_ORIGIN=https://www.j-communities.com` for canonical URLs.

### 2. Server setup (Ubuntu 22.04)

```bash
# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx

# App directory
sudo mkdir -p /var/www/j-communities
sudo chown $USER:$USER /var/www/j-communities
```

Clone or upload the repo to `/var/www/j-communities`.

### 3. Environment

```bash
cd /var/www/j-communities
cp .env.example .env
npm run admin:hash-password -- 'your-strong-password'
# Paste hash into ADMIN_PASSWORD_HASH in .env
# Set SESSION_SECRET to a long random string
# Set NODE_ENV=production
```

Build and migrate:

```bash
npm ci
npm run build
npm run db:migrate
```

### 4. Process manager (pm2)

```bash
sudo npm install -g pm2
pm2 start server.js --name j-communities
pm2 save
pm2 startup
```

### 5. nginx reverse proxy

Create `/etc/nginx/sites-available/j-communities`:

```nginx
server {
    listen 80;
    server_name www.j-communities.com j-communities.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and SSL:

```bash
sudo ln -s /etc/nginx/sites-available/j-communities /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d j-communities.com -d www.j-communities.com
```

### 6. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 7. Updates

```bash
cd /var/www/j-communities
git pull
npm ci
npm run build
npm run db:migrate
pm2 restart j-communities
```

### Optional email alerts

Set `NOTIFY_EMAIL` and `RESEND_API_KEY` in `.env`. New leads trigger a Resend email in the background (non-blocking).

## Legacy shared hosting

The previous Hostinger **static** `public_html` flow is no longer needed once DNS points to the VPS. The built SPA is served by Express from `client/dist/`.
