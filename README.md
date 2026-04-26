# MOSTRO 360 — Site Operations

Static HTML/CSS/JS site deployed on Cloudflare Pages from the `main` branch.

---

## Deployment

Push to `main`. Cloudflare Pages auto-deploys within ~60 seconds.

After pushing, run the cache purge script (see below) to ensure all visitors
get the new version immediately.

---

## Cloudflare cache purge setup

### 1. Create a Cloudflare API token

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click your profile icon (top right) → **My Profile** → **API Tokens**
3. Click **Create Token** → use the **"Cache Purge"** template
4. Set Zone Resources to: `Include → Specific zone → mostro360.com`
5. Click **Continue to summary** → **Create Token**
6. **Copy the token now** — it is shown only once

### 2. Find your Zone ID

- Cloudflare Dashboard → select **mostro360.com** → **Overview**
- Scroll to the right sidebar — **Zone ID** is listed there
- Copy it

### 3. Set the environment variables

Never hardcode these values in code. Set them in your shell profile or
export them before running the script:

```bash
export CF_API_TOKEN="your-token-here"
export CF_ZONE_ID="your-zone-id-here"
```

Or pass them inline for a one-off run:

```bash
CF_API_TOKEN="..." CF_ZONE_ID="..." bash scripts/purge-cache.sh
```

### 4. Run the purge script after every deploy

```bash
git push origin main && CF_API_TOKEN="..." CF_ZONE_ID="..." bash scripts/purge-cache.sh
```

---

## Cache-busting versioned assets

`css/style.css` and `js/main.js` are loaded with a `?v=<git-hash>` query
string in `index.html`. After each deploy, update these two lines to the new
commit hash so Cloudflare treats them as new URLs:

```html
<link rel="stylesheet" href="css/style.css?v=COMMITHASH">
<script src="js/main.js?v=COMMITHASH"></script>
```

To update automatically, run from the repo root after committing:

```bash
HASH=$(git rev-parse --short HEAD)
sed -i "s/?v=[a-f0-9]*/?v=${HASH}/g" index.html
```

---

## Cloudflare Cache Rules (set once in dashboard)

Two rules under **Caching → Cache Rules**:

| Rule | Match | Action |
|------|-------|--------|
| Bypass HTML | file extension = `html` | Cache Status: Bypass |
| Cache assets | file extension = `css`, `js`, `jpg`, `png`, `svg`, `woff2` | Edge TTL: 2h · Browser TTL: 4h · Cache Everything |

See the Cloudflare dashboard for exact configuration UI.
