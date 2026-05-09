# J Communities

React + Vite marketing site (`client/`) and a small Express static server (`server.js`).

## Scripts

- **`npm run dev`** — Vite dev server (see `client/vite.config.ts`).
- **`npm run build`** — Production bundle into `client/dist/`.
- **`npm start`** — Serves `client/dist` on port 3000. Run **`npm run build`** first.
- **`npm test`** — Vitest unit tests.

## Configuration

Copy `client/.env.example` to `client/.env` and set **`VITE_SITE_ORIGIN`** to your live domain so canonical URLs and Open Graph metadata resolve correctly.

### Look & Feel photos & logo

- **Photos:** Drop exports in `client/public/assets/look-feel/` and set **`LOOK_FEEL_EXT`** (and optionally **`lookFeelBasenames`**) in `client/src/config/lookFeel.ts`. See `client/public/assets/look-feel/README.txt`.
- **Logo:** **`logoLightUrl`** in **`client/src/config/brand.ts`** points at **`public/assets/look-feel/white logo.png`** (white mark on the hero photo). Add a dark-background mark under **`public/brand/`** and set **`logoDarkUrl`** if you want to replace the cream-column text mark.
- **Copy & type scale:** Deck-aligned headlines and CTAs live in **`client/src/content/siteCopy.ts`**; shared typography tokens in **`client/src/config/lookFeel.ts`** (`LF_TYPE`). Fonts: Playfair Display + Montserrat (see `client/index.html`).

## Deployment

Build the client before production: **`npm run build`**. Output is **`client/dist/`**.

### VPS / Node

Point your process manager at **`node server.js`** after building (same repo root as `server.js`).

### Hostinger shared hosting (static)

Hostinger serves **`public_html`** from **Apache/LiteSpeed**. This project is a Vite SPA with **`BrowserRouter`**, so the server must return **`index.html`** for routes like **`/projects/…`**.

1. **Canonical / Open Graph URLs** — In **`client/`**, copy **`.env.example`** to **`.env`** and set **`VITE_SITE_ORIGIN`** to your real site URL (no trailing slash), e.g. `https://www.yourdomain.com`. Rebuild after any change (`npm run build`).
2. **Build locally:** `npm run build`.
3. **Upload** everything **inside** **`client/dist/`** into **`public_html`** (via **hPanel → File Manager** or **FTP**): **`index.html`**, **`.htaccess`**, **`favicon.svg`**, the **`assets/`** folder, and any folders you added under **`public/`** (for example **`assets/look-feel/`**). Your domain root must be **`public_html/index.html`**, not a nested **`dist`** folder name.
4. The build copies **`client/public/.htaccess`** into **`dist`** so refreshes on **`/projects/…`** work on Hostinger.

**Subfolder:** If the site lives at `https://example.com/marketing/` instead of the domain root, set **`RewriteBase`** in **`.htaccess`** to that path (e.g. **`RewriteBase /marketing/`**) and add **`base: '/marketing/'`** in **`client/vite.config.ts`** **`build`** options, then rebuild.

**HTTPS:** Enable a free SSL certificate in **hPanel** for your domain.
