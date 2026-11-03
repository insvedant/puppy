# Petite Paws: Static Website for Cloudflare (HTML, CSS, JavaScript)

A puppy store website in plain HTML, CSS and JavaScript, with a floating WhatsApp button on every page. On a puppy or breed page, the button's pre-filled message names that puppy or breed.

- **`public/`** is the finished website: 47 HTML pages plus CSS, JS, fonts, sitemap and robots. **This is the folder you upload.**
- **`functions/`** is the contact-form backend for **Cloudflare Pages**.
- **`worker/`** and **`wrangler.jsonc`** are the same backend for **Cloudflare Workers**.
- **`src/`** is optional: the data files and a small generator that rebuilds `public/` after you edit content.

No frameworks, no npm packages needed to run the site.

---

## Deploy option A: Cloudflare Pages (simplest)

### A1. Drag and drop (no tools)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Name the project and drop the **`public`** folder.
3. Done. The site works, including WhatsApp, filters and the gallery.

Drag-and-drop uploads **don't run Pages Functions**, so the contact form can't send email this way. It shows a "please message us on WhatsApp" note instead. Use A2 or B if you want form emails.

### A2. Git or Wrangler (contact form works)

Connect a GitHub repo containing this project, with:

- Build command: *(leave empty)*, or `npm run build` if you edit `src/`
- Build output directory: `public`

Cloudflare picks up `functions/api/contact.js` automatically. Or deploy from your computer:

```bash
npx wrangler pages deploy public --project-name petite-paws
```

(Run it from the project root so the `functions/` folder is included.)

## Deploy option B: Cloudflare Workers (static assets + Worker)

```bash
npx wrangler login
npx wrangler deploy
```

`wrangler.jsonc` serves `public/` as static assets and runs `worker/index.js` only for `/api/contact`. Clean URLs (`/puppies/bella/`) and the 404 page are handled automatically.

Local test: `npx wrangler dev` → http://localhost:8787

---

## Contact form email (optional)

The form posts to `/api/contact`, which sends the message through [Resend](https://resend.com) (free tier). In Cloudflare → your project → **Settings → Variables and Secrets**, add:

| Name | Example |
| --- | --- |
| `RESEND_API_KEY` | `re_xxxxxxxx` (add as a secret) |
| `CONTACT_TO_EMAIL` | `you@yourdomain.com` |
| `CONTACT_FROM_EMAIL` | `Website <noreply@yourdomain.com>` (a domain verified in Resend) |

Without these variables, the form still returns success and the message is printed to the Worker logs. For local `wrangler dev`, copy `.dev.vars.example` to `.dev.vars`.

---

## Editing content

### Quick edits

Open any file in `public/` and edit the HTML directly. For example, `public/contact/index.html` is the contact page.

### Recommended: edit the data, then rebuild

Every page shares the header, footer, WhatsApp number and puppy cards, so it's easier to change the source and regenerate:

| File | What's in it |
| --- | --- |
| `src/site.config.js` | Brand name, **WhatsApp number**, email, hours, currency, domain, trust stats |
| `src/data/puppies.js` | Puppies: name, breed, sex, age, color, price, status (`available` / `reserved` / `sold`), photos |
| `src/data/breeds.js` | 9 breeds |
| `src/data/posts.js` | 5 blog posts (HTML body) |
| `src/data/process.js` | How to Buy, Delivery, Health Guarantee, Financing, Special Order, Adoption Agreement, Puppy Checklist |
| `src/data/faqs.js`, `reviews.js`, `legal.js` | FAQ, reviews, policies |
| `src/static/css/style.css` | All styles. Brand colors are tokens at the top (`--accent`, `--wa`…) |
| `src/static/js/main.js` | Mobile menu, puppy filters, gallery, contact form |

Then run (Node 18 or newer, no install needed):

```bash
npm run build
```

This rewrites `public/` completely, so make lasting changes in `src/`, not in `public/`.

**WhatsApp number:** `whatsappNumber` takes digits only with the country code, e.g. `919876543210` for India.

**Photos:** put images in `src/static/images/puppies/` and list them on the puppy:

```js
images: ["/images/puppies/bella-1.jpg", "/images/puppies/bella-2.jpg"],
```

Without photos, a drawn placeholder puppy is shown. Breeds (`image`) and blog posts (`cover`) work the same way.

**New blog post or puppy:** add an entry with a new `slug` and rebuild. Its page, listing card and sitemap entry are created automatically.

---

## Pages

| URL | Page |
| --- | --- |
| `/` | Home |
| `/puppies/` | Available puppies with breed / sex / availability / price filters (`/puppies/?breed=pomeranian` works) |
| `/puppies/<name>/` | Puppy detail: gallery, specs, WhatsApp + video-call buttons |
| `/puppies/previous/` | Puppies that found homes |
| `/breeds/`, `/breeds/<breed>/` | Breeds overview + each breed |
| `/how-it-works/` + 7 sub-pages | Process |
| `/about/`, `/reviews/`, `/faq/`, `/buy-safely/`, `/contact/` | |
| `/blog/` + 5 posts | Blog |
| `/legal/privacy-policy/`, `/legal/terms-of-service/`, `/legal/refund-policy/` | Policies (template text: have them reviewed) |
| `404.html`, `sitemap.xml`, `robots.txt`, `_headers` | Used by Cloudflare automatically |

Set `url` in `src/site.config.js` to your real domain and rebuild, so canonical links and the sitemap point to it.
