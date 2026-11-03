# Petite Paws: website + admin panel (Cloudflare Workers via GitHub)

## Folder layout

```
wrangler.jsonc     Cloudflare settings (nothing to fill in)
server/worker.js   server code: database, admin login, photo uploads, contact form
public/            the website: .html pages, css/, js/, images/, admin/ (the admin panel)
```

The website files are in `public/`. The server file sits outside `public/`, so it's never visible to visitors and needs no hidden `.assetsignore` file.

## Deploy

1. **GitHub:** put the contents of this folder in your repo.
   - If they sit inside a folder such as `petite-paws-site/`, go to Cloudflare → your Worker → **Settings → Build → Root directory** and enter that folder name, e.g. `petite-paws-site`.
   - If `wrangler.jsonc` is at the top of the repo, leave Root directory empty.
2. **Build settings:** Build command empty, Deploy command `npx wrangler deploy`.
3. **Push** (or click Retry build). The first deploy creates the **D1 database** and **R2 photo storage** automatically and connects them.
4. **Password:** Worker → Settings → **Variables and Secrets** → Add → type *Secret*, name **`ADMIN_PASSWORD`**.
   Optional: `ADMIN_USERNAME` (default `admin`).
5. Open **`https://<your-worker>.workers.dev/admin`** and log in.

The first visit fills the database with the starting puppies, breeds and blog posts.

## If step 3 fails with a database or bucket error

Your account may need R2 switched on once (Cloudflare dashboard → **R2** → enable; it's free up to 10 GB). Then click **Retry build**.
To skip photo uploads, delete the line `"r2_buckets": [{ "binding": "IMAGES" }],` from `wrangler.jsonc`.

## Editing

- **Content** (puppies, blog, settings, WhatsApp number): in `/admin`. It's live immediately.
- **Design:** `public/css/style.css`, or any `.html` file in `public/`. Commit and push to redeploy. Your content is kept.
- **Email for contact messages (optional):** add the secrets `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`. Messages are always saved in Admin → Messages either way.
