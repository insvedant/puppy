# Petite Paws: HTML, CSS & JavaScript website + admin panel

## What's in this folder

**The website (plain HTML files)**

| File | Page |
| --- | --- |
| `index.html` | Home |
| `puppies.html` | Available puppies (with filters) |
| `puppy.html` | One puppy, e.g. `/puppy?id=bella` |
| `previous-puppies.html` | Puppies that found homes |
| `breeds.html`, `breed.html` | All breeds / one breed (`/breed?id=pomeranian`) |
| `how-it-works.html`, `process.html` | How it works / one process page (`/process?id=delivery`) |
| `about.html`, `reviews.html`, `faq.html`, `buy-safely.html`, `contact.html` | |
| `blog.html`, `post.html` | Blog list / one post (`/post?id=feeding-a-toy-puppy`) |
| `legal.html` | Privacy, terms, refunds (`/legal?id=privacy-policy`) |
| `404.html` | Page not found |

**Styles and scripts**

- `css/style.css`: the whole design. Brand colors are at the top (`--accent`, `--wa`…).
- `js/site.js`: loads the content and fills in the pages, plus the mobile menu, puppy filters, photo gallery and contact form.
- `images/breeds/`: the 9 breed photos. Any puppy or post without its own photo shows its breed photo.
- `data/content.json`: the starting content. It's used automatically if the admin server isn't running.

**The admin panel**

- `admin/index.html`, `admin/admin.js`, `admin/admin.css` open at **`/admin`**.

**The one server file**

- `_worker.js`: Cloudflare runs this automatically. It saves admin changes to the database, checks the admin password, stores uploaded photos and receives contact-form messages. A plain HTML site can't save anything without it. You don't need to edit it.
- `wrangler.jsonc` and `.assetsignore` are only needed if you deploy from GitHub.

---

## Option A: Cloudflare Pages, drag and drop (no tools)

1. **Database:** Cloudflare → Storage & Databases → **D1** → Create → `petite-paws-db`
2. **Photo storage** (optional): Storage & Databases → **R2** → Create bucket → `petite-paws-images`
3. **Upload:** Workers & Pages → Create → **Pages** → Upload assets. Drag in **this whole folder** (`_worker.js` included).
4. **Connect:** your Pages project → Settings → **Bindings** → Add:
   - D1 database: variable name **`DB`** → `petite-paws-db`
   - R2 bucket: variable name **`IMAGES`** → `petite-paws-images`
5. **Password:** Settings → **Variables and Secrets** → Add → type *Secret*, name **`ADMIN_PASSWORD`**
6. **Redeploy:** Deployments → Create deployment → drag in the folder again. Settings only apply to new deployments.
7. Open **`https://<project>.pages.dev/admin`** and log in with username **`admin`** and your password.

## Option B: GitHub + Cloudflare Workers

1. Put **everything in this folder at the root** of your GitHub repo, including `.assetsignore`.
2. Create the D1 database and R2 bucket (steps 1 and 2 above).
3. Paste the D1 **Database ID** into `wrangler.jsonc`. If you skipped R2, delete the `r2_buckets` block.
4. Worker → Settings → Variables and Secrets → add the secret **`ADMIN_PASSWORD`**.
5. Deploy command: `npx wrangler deploy`, with the build command left empty. Push to deploy.
6. Open **`https://<worker>.workers.dev/admin`**.

---

## Using the admin panel

- **Puppies:** add, edit, mark reserved or sold, upload photos, and choose which are featured.
- **Breeds, Blog posts, Reviews, FAQs, How it works pages, Legal pages:** add, edit and delete.
- **Messages:** contact-form messages, with buttons to reply on WhatsApp or by email.
- **Site settings:** business name, **WhatsApp number**, hours, home page text, currency, social links.

Changes appear on the website as soon as you click Save.

## Changing the design

Edit `css/style.css` (or any `.html` file), then upload again: Pages → Deployments → Create deployment, or push to GitHub.
Your puppies, posts and settings live in the database, so redeploying never deletes them.

## Notes

- Page links use clean addresses (`/puppies`, `/puppy?id=bella`). Cloudflare serves the matching `.html` file automatically.
- **Forgot the password?** Change the `ADMIN_PASSWORD` secret and redeploy.
- **Email for contact messages (optional):** add the secrets `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` (from resend.com). Messages are always saved in Admin → Messages either way.
