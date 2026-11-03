/**
 * Static site generator: turns the data files into plain HTML pages in /public.
 * Run with: npm run build   (Node 18+, no dependencies)
 */
import { mkdir, writeFile, rm, cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { site } from "./site.config.js";
import { breeds } from "./data/breeds.js";
import { puppies } from "./data/puppies.js";
import { reviews } from "./data/reviews.js";
import { faqs } from "./data/faqs.js";
import { posts } from "./data/posts.js";
import { processPages } from "./data/process.js";
import { legalPages } from "./data/legal.js";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, "public");
const YEAR = new Date().getFullYear();

/* ---------------- helpers ---------------- */
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const wa = (msg = site.whatsappDefaultMessage) => `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`;
const price = (n) => new Intl.NumberFormat(site.locale, { style: "currency", currency: site.currency, maximumFractionDigits: 0 }).format(n);
const fmtDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const getBreed = (slug) => breeds.find((b) => b.slug === slug);
const bgOf = (slug) => getBreed(slug)?.art.bg ?? "#F4ECF3";
const pronoun = (p) => (p.sex === "Female" ? "she" : "he");

const WA_ICON = `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.6C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`;

const icon = (p) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICONS = {
  shield: icon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  video: icon('<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>'),
  plane: icon('<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>'),
  heart: icon('<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>'),
};

/** Placeholder puppy illustration (used when no photo is set). */
function puppyArt({ fur = "#E9C9A0", ear = "#C99A68", type = "fluffy" } = {}) {
  const eye = "#2B1B33";
  let ears = "";
  if (type === "pointy") ears = `<path d="M48 70 L60 18 L88 58Z" fill="${ear}"/><path d="M152 70 L140 18 L112 58Z" fill="${ear}"/>`;
  else if (type === "bat") ears = `<path d="M46 76 L44 14 L92 54Z" fill="${ear}"/><path d="M154 76 L156 14 L108 54Z" fill="${ear}"/><path d="M54 66 L54 30 L80 54Z" fill="#F2B8C6"/><path d="M146 66 L146 30 L120 54Z" fill="#F2B8C6"/>`;
  else ears = `<ellipse cx="46" cy="96" rx="24" ry="40" fill="${ear}" transform="rotate(18 46 96)"/><ellipse cx="154" cy="96" rx="24" ry="40" fill="${ear}" transform="rotate(-18 154 96)"/>`;
  const tuft = type === "fluffy" ? `<circle cx="86" cy="50" r="16" fill="${fur}"/><circle cx="100" cy="44" r="18" fill="${fur}"/><circle cx="114" cy="50" r="16" fill="${fur}"/>` : "";
  return `<svg viewBox="0 0 200 190" aria-hidden="true">${ears}${tuft}<ellipse cx="100" cy="104" rx="62" ry="58" fill="${fur}"/><ellipse cx="100" cy="132" rx="34" ry="24" fill="#FFF7EE" opacity=".9"/><circle cx="76" cy="98" r="9" fill="${eye}"/><circle cx="124" cy="98" r="9" fill="${eye}"/><circle cx="79" cy="95" r="3" fill="#fff"/><circle cx="127" cy="95" r="3" fill="#fff"/><ellipse cx="100" cy="122" rx="11" ry="8" fill="${eye}"/><path d="M100 130 Q100 140 90 142 M100 130 Q100 140 110 142" stroke="${eye}" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="66" cy="120" rx="8" ry="5" fill="#F2A7B9" opacity=".6"/><ellipse cx="134" cy="120" rx="8" ry="5" fill="#F2A7B9" opacity=".6"/></svg>`;
}
const breedArt = (slug) => puppyArt(getBreed(slug)?.art);

/* ---------------- shared components ---------------- */
const NAV = [
  ["/puppies/", "Available Puppies"],
  ["/breeds/", "Breeds"],
  ["/how-it-works/", "How It Works"],
  ["/about/", "About"],
  ["/reviews/", "Reviews"],
  ["/blog/", "Blog"],
  ["/faq/", "FAQ"],
  ["/contact/", "Contact"],
];

const waBtn = (msg, label = "Chat on WhatsApp", cls = "btn btn-wa") =>
  `<a class="${cls}" href="${esc(wa(msg))}" target="_blank" rel="noopener noreferrer">${WA_ICON}${esc(label)}</a>`;

function header(path) {
  const links = NAV.map(([href, label]) => {
    const on = path === href || path.startsWith(href);
    return `<a href="${href}"${on ? ' aria-current="page"' : ""}>${esc(label)}</a>`;
  }).join("");
  return `<header class="site-header"><div class="wrap nav">
<a class="logo" href="/" aria-label="${esc(site.name)} home"><span class="logo-mark">${puppyArt({ fur: "#EFC48E", ear: "#D9A15E", type: "fluffy" })}</span><span><b>${esc(site.name)}</b><small>${esc(site.tagline)}</small></span></a>
<button class="burger" type="button" aria-expanded="false" aria-controls="main-menu">Menu</button>
<nav id="main-menu" class="menu" aria-label="Main">${links}</nav>
</div></header>`;
}

function footer() {
  return `<footer class="site-foot"><div class="wrap">
<div class="cols">
  <div><div class="foot-brand">${esc(site.name)}</div>
  <p style="opacity:.8;margin-top:.5rem;max-width:34ch;font-size:.92rem">Small-breed puppies raised in a home environment, vet-checked and delivered with care.</p>
  <p style="margin-top:1rem;font-size:.92rem">WhatsApp: ${esc(site.whatsappDisplay)}<br>${esc(site.email)}</p></div>
  <div><h4>Puppies</h4><a href="/puppies/">Available Puppies</a><a href="/puppies/previous/">Previous Puppies</a><a href="/breeds/">Breeds</a><a href="/how-it-works/special-order/">Special Order</a></div>
  <div><h4>Process</h4><a href="/how-it-works/how-to-buy/">How to Buy</a><a href="/how-it-works/delivery/">Delivery</a><a href="/how-it-works/health-guarantee/">Health Guarantee</a><a href="/how-it-works/financing/">Financing</a><a href="/buy-safely/">Buy Safely</a></div>
  <div><h4>Company</h4><a href="/about/">About Us</a><a href="/reviews/">Reviews</a><a href="/blog/">Blog</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a></div>
</div>
<div class="legal"><span>© ${YEAR} ${esc(site.name)}. All rights reserved.</span><nav aria-label="Legal">${legalPages.map((p) => `<a href="/legal/${p.slug}/">${esc(p.title)}</a>`).join("")}</nav></div>
</div></footer>`;
}

const waFloat = (msg) =>
  `<a class="wa-float" href="${esc(wa(msg))}" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"><span class="lbl">Chat on WhatsApp</span><span class="bubble">${WA_ICON}</span></a>`;

function pageHero(title, subtitle, crumbs = []) {
  const c = crumbs.map((x) => ` / ${x.href ? `<a href="${x.href}">${esc(x.label)}</a>` : `<span>${esc(x.label)}</span>`}`).join("");
  return `<div class="page-hero"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${c}</nav><h1>${esc(title)}</h1>${subtitle ? `<p>${esc(subtitle)}</p>` : ""}</div></div>`;
}

const ctaBand = (title = "Ready to meet your puppy?", text = "Message us and we'll set up a live video call today.") =>
  `<section><div class="wrap"><div class="cta-band"><div><h2>${esc(title)}</h2><p>${esc(text)}</p></div><div style="display:flex;gap:.6rem;flex-wrap:wrap">${waBtn("Hi! I'd like to book a video call to meet a puppy.", "WhatsApp us")}<a class="btn btn-ghost" href="/puppies/">See puppies</a></div></div></div></section>`;

function badge(status) {
  if (status === "reserved") return `<span class="badge reserved">Reserved</span>`;
  if (status === "sold") return `<span class="badge sold">Found a home</span>`;
  return `<span class="badge">Available</span>`;
}

function pupCard(p) {
  const b = getBreed(p.breed);
  const img = p.images?.[0];
  const media = img ? `<img src="${esc(img)}" alt="${esc(`${p.name}, ${b?.name} puppy`)}" loading="lazy">` : breedArt(p.breed);
  return `<a class="pup" href="/puppies/${p.slug}/" data-breed="${p.breed}" data-sex="${p.sex}" data-status="${p.status}" data-price="${p.price}" data-featured="${p.featured ? 1 : 0}">
<div class="ph" style="background:${bgOf(p.breed)}">${badge(p.status)}${media}</div>
<div class="info"><div class="row"><span class="name">${esc(p.name)}</span><span class="price">${p.status === "sold" ? "" : price(p.price)}</span></div>
<span class="muted" style="font-size:.9rem">${esc(b?.name)}</span>
<div class="chips"><span class="chip">${esc(p.sex)}</span><span class="chip">${esc(p.age)}</span><span class="chip">${esc(p.color)}</span></div></div></a>`;
}

function breedCard(b, { count, blurb } = {}) {
  const media = b.image ? `<img src="${esc(b.image)}" alt="" loading="lazy">` : breedArt(b.slug);
  return `<a class="breed" href="/breeds/${b.slug}/"><span class="breed-art" style="background:${b.art.bg}">${media}</span><h3>${esc(b.name)}</h3><span>${esc(b.weight)}${count !== undefined ? ` · ${count} available` : ""}</span>${blurb ? `<p>${esc(b.blurb)}</p>` : ""}</a>`;
}

function postCard(p) {
  const media = p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : breedArt(p.breed);
  return `<a class="post" href="/blog/${p.slug}/"><div class="cover" style="background:${bgOf(p.breed)}">${media}</div><div class="body"><div class="meta">${fmtDate(p.date)} · ${esc(p.readTime)} read</div><h3>${esc(p.title)}</h3><p class="muted" style="font-size:.93rem">${esc(p.excerpt)}</p></div></a>`;
}

const reviewCard = (r) =>
  `<figure class="card review"><div class="stars" aria-label="${r.rating} out of 5 stars">${"★".repeat(r.rating)}</div><blockquote>${esc(r.text)}</blockquote><figcaption>${esc(r.name)} · ${esc(r.puppy)}</figcaption></figure>`;

const faqList = (items) => `<div class="faq">${items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>`;
const trust = () => `<div class="trust">${site.stats.map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}</div>`;
const steps = () => `<div class="steps">
<div><h3>Choose</h3><p>Browse available puppies or ask us to match you with a breed.</p></div>
<div><h3>Video call</h3><p>Meet your puppy live and ask us anything.</p></div>
<div><h3>Reserve</h3><p>Secure your puppy with a deposit and sign the agreement.</p></div>
<div><h3>Go home</h3><p>Pick up or get delivery, with records and a starter kit.</p></div></div>`;
const hoursGrid = () => `<div class="hours">${site.hours.map((h) => `<span>${esc(h.days)}</span><span>${esc(h.time)}</span>`).join("")}</div>`;

/* ---------------- layout ---------------- */
function layout({ path, title, description = site.description, body, waMessage, jsonLd = [], ogType = "website", fullTitle = false }) {
  const t = fullTitle ? title : `${title} | ${site.name}`;
  const url = site.url.replace(/\/$/, "") + path;
  const ld = [
    { "@context": "https://schema.org", "@type": "PetStore", name: site.name, url: site.url, email: site.email, telephone: site.phoneDisplay, foundingDate: String(site.foundedYear), sameAs: Object.values(site.social) },
    ...jsonLd,
  ];
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(t)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#211824" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/nunito-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/dm-serif-display-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/style.css">
${ld.map((x) => `<script type="application/ld+json">${JSON.stringify(x).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
${waFloat(waMessage)}
<script src="/js/main.js" defer></script>
</body>
</html>
`;
}

/* ---------------- pages ---------------- */
const pages = []; // { path, html }
const add = (path, opts) => pages.push({ path, html: layout({ path, ...opts }) });
const current = puppies.filter((p) => p.status !== "sold");
const previous = puppies.filter((p) => p.status === "sold");
const byFeatured = (a, b) => Number(!!b.featured) - Number(!!a.featured);

// Home
add("/", {
  title: `${site.name} | ${site.tagline}`,
  fullTitle: true,
  body: `
<div class="wrap hero">
  <div>
    <div class="eyebrow">Toy &amp; teacup puppies · since ${site.foundedYear}</div>
    <h1 style="margin-top:.6rem">Small puppies, raised with big care.</h1>
    <p class="lede">Vet-checked Pomeranians, Maltipoos, Poodles and more, raised in our home and delivered to your door with a one-year health guarantee.</p>
    <div class="ctas"><a class="btn btn-primary" href="/puppies/">See available puppies</a>${waBtn("Hi! I'd like to book a video call to see your available puppies.", "Book a video call")}</div>
  </div>
  <div class="art-frame" style="background:${bgOf("pomeranian")}">${breedArt("pomeranian")}
    <span class="hero-tag" style="top:12%;left:4%">Vet-checked ✓</span>
    <span class="hero-tag" style="bottom:12%;right:4%">1-year health guarantee</span>
  </div>
</div>
<div class="wrap">${trust()}</div>
<section><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Ready for their new homes</div><h2>Available puppies</h2></div><a class="btn btn-ghost" href="/puppies/">View all</a></div>
  <div class="grid">${[...current].sort(byFeatured).slice(0, 8).map(pupCard).join("")}</div>
</div></section>
<section class="band"><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Why families choose us</div><h2>Every puppy comes with peace of mind</h2></div></div>
  <div class="feat">
    <div><div class="ic">${ICONS.shield}</div><h3>Vet-checked</h3><p>Full vet exam, vaccinations and deworming before going home, backed by a written one-year health guarantee.</p></div>
    <div><div class="ic">${ICONS.video}</div><h3>See them live</h3><p>Meet your puppy on a live video call before you reserve. Ask for one any day of the week.</p></div>
    <div><div class="ic">${ICONS.plane}</div><h3>Safe delivery</h3><p>Pick up in person, or choose pet cargo or a flight nanny who hands your puppy to you at the airport.</p></div>
    <div><div class="ic">${ICONS.heart}</div><h3>Lifetime support</h3><p>Questions about food, training or health? Message us on WhatsApp for as long as you own your dog.</p></div>
  </div>
</div></section>
<section><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Simple and transparent</div><h2>How to bring your puppy home</h2></div><a class="btn btn-ghost" href="/how-it-works/">Full process</a></div>
  ${steps()}
</div></section>
<section class="band"><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Shop by breed</div><h2>Our breeds</h2></div><a class="btn btn-ghost" href="/breeds/">All breeds</a></div>
  <div class="breeds">${breeds.slice(0, 5).map((b) => breedCard(b)).join("")}</div>
</div></section>
<section><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Happy families</div><h2>What our families say</h2></div><a class="btn btn-ghost" href="/reviews/">All reviews</a></div>
  <div class="reviews">${reviews.slice(0, 3).map(reviewCard).join("")}</div>
</div></section>
<section class="band"><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">From the blog</div><h2>Puppy guides</h2></div><a class="btn btn-ghost" href="/blog/">All posts</a></div>
  <div class="posts">${posts.slice(0, 3).map(postCard).join("")}</div>
</div></section>
<section><div class="wrap two">
  <div><div class="eyebrow">Questions</div><h2>Frequently asked</h2>
  <p class="muted" style="margin-top:.6rem">Can't find your answer? Message us on WhatsApp and we'll reply within minutes during business hours.</p>
  <p style="margin-top:1rem"><a class="link" href="/faq/">See all questions →</a></p></div>
  ${faqList(faqs.slice(0, 5))}
</div></section>
${ctaBand()}`,
});

// Puppies listing (filters run in main.js)
const breedOptions = breeds.filter((b) => current.some((p) => p.breed === b.slug));
add("/puppies/", {
  title: "Available Puppies",
  description: "Browse vet-checked toy and teacup puppies available now. Meet any puppy on a live video call before you reserve.",
  body: `${pageHero("Available puppies", "Every puppy is vet-checked and can be met on a live video call before you reserve.", [{ label: "Available puppies" }])}
<section><div class="wrap">
<div class="shop" data-puppy-filter>
  <aside class="filters" aria-label="Filter puppies">
    <div><label for="f-breed">Breed</label><select id="f-breed" data-f="breed"><option value="all">All breeds</option>${breedOptions.map((b) => `<option value="${b.slug}">${esc(b.name)}</option>`).join("")}</select></div>
    <div><label for="f-sex">Sex</label><select id="f-sex" data-f="sex"><option value="all">Any</option><option value="Female">Female</option><option value="Male">Male</option></select></div>
    <div><label for="f-status">Availability</label><select id="f-status" data-f="status"><option value="all">Available &amp; reserved</option><option value="available">Available only</option><option value="reserved">Reserved</option></select></div>
    <div><label for="f-sort">Sort</label><select id="f-sort" data-f="sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
  </aside>
  <div>
    <p class="result-count" aria-live="polite" data-count>${current.length} puppies</p>
    <div class="grid" data-grid>${[...current].sort(byFeatured).map(pupCard).join("")}</div>
    <div class="card" data-empty hidden><p>No puppies match these filters right now. Ask us about upcoming litters.</p><div>${waBtn("Hi! I'm looking for a puppy that's not listed. Can you help?", "Ask on WhatsApp")}</div></div>
  </div>
</div>
<p class="muted" style="margin-top:2rem">Looking for puppies that already went home? <a class="link" href="/puppies/previous/">See previous puppies</a>.</p>
</div></section>${ctaBand()}`,
});

add("/puppies/previous/", {
  title: "Previous Puppies",
  description: "Puppies who have already found their forever families.",
  body: `${pageHero("Previous puppies", "Puppies who have already found their families.", [{ href: "/puppies/", label: "Puppies" }, { label: "Previous" }])}
<section><div class="wrap"><div class="grid">${previous.map(pupCard).join("")}</div></div></section>
${ctaBand("Want a puppy like these?", "Tell us what you're looking for and we'll match you with an upcoming litter.")}`,
});

// Puppy detail pages
for (const p of puppies) {
  const b = getBreed(p.breed);
  const imgs = p.images || [];
  const slots = imgs.length ? imgs : [null, null, null, null];
  const slide = (src, i) => `<div class="slide" data-slide="${i}"${i ? " hidden" : ""}>${src ? `<img src="${esc(src)}" alt="${esc(`${p.name}, photo ${i + 1}`)}"${i ? ' loading="lazy"' : ""}>` : breedArt(p.breed)}</div>`;
  const thumb = (src, i) => `<button type="button" style="background:${b.art.bg};position:relative" aria-pressed="${i === 0}" aria-label="Show photo ${i + 1}" data-thumb="${i}">${src ? `<img src="${esc(src)}" alt="" loading="lazy">` : breedArt(p.breed)}</button>`;
  const similar = puppies.filter((x) => x.slug !== p.slug && x.status === "available").sort((x) => (x.breed === p.breed ? -1 : 1)).slice(0, 4);
  const ctas = p.status !== "sold"
    ? `<div class="detail-ctas">${waBtn(`Hi! I'm interested in ${p.name} (${b.name}, ${p.sex}). Is ${pronoun(p)} still available?`, `Ask about ${p.name} on WhatsApp`)}${waBtn(`Hi! I'd like to book a video call to see ${p.name} (${b.name}).`, "Book a video call", "btn btn-ghost")}</div>`
    : `<div class="detail-ctas">${waBtn(`Hi! I loved ${p.name} (${b.name}). Do you have a similar puppy coming up?`, "Ask about a similar puppy")}</div>`;

  add(`/puppies/${p.slug}/`, {
    title: `${p.name} – ${b.name} ${p.sex} Puppy`,
    description: `${p.name} is a ${p.age} ${p.color} ${b.name} ${p.sex.toLowerCase()} puppy. ${p.about}`,
    waMessage: `Hi! I'm interested in ${p.name} (${b.name}, ${p.sex}). Is ${pronoun(p)} still available?`,
    jsonLd: [{
      "@context": "https://schema.org", "@type": "Product", name: `${p.name} – ${b.name} puppy`, description: p.about, brand: site.name,
      ...(imgs[0] ? { image: site.url + imgs[0] } : {}),
      offers: { "@type": "Offer", price: p.price, priceCurrency: site.currency, availability: p.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut" },
    }],
    body: `<div class="wrap" style="padding-block:1.2rem 0"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/puppies/">Available puppies</a> / <span>${esc(p.name)}</span></nav></div>
<section style="padding-top:1rem"><div class="wrap detail">
  <div data-gallery>
    <div class="gallery-main" style="background:${b.art.bg}">${slots.map(slide).join("")}</div>
    <div class="thumbs">${slots.slice(0, 8).map(thumb).join("")}</div>
  </div>
  <div>
    <a class="eyebrow" href="/breeds/${b.slug}/" style="text-decoration:none">${esc(b.name)}</a>
    <h1 style="margin-top:.4rem">${esc(p.name)}</h1>
    <div class="big-price">${p.status === "sold" ? "Found a home" : price(p.price)}</div>
    ${p.status === "reserved" ? `<p class="note">${esc(p.name)} is reserved. Message us to join the waitlist or see a similar puppy.</p>` : ""}
    <table class="specs"><tbody>
      <tr><th scope="row">Breed</th><td>${esc(b.name)}</td></tr>
      <tr><th scope="row">Sex</th><td>${esc(p.sex)}</td></tr>
      <tr><th scope="row">Age</th><td>${esc(p.age)}</td></tr>
      <tr><th scope="row">Color</th><td>${esc(p.color)}</td></tr>
      <tr><th scope="row">Adult size</th><td>${esc(p.adultWeight)}</td></tr>
      <tr><th scope="row">Vaccinations</th><td>${esc(p.vaccinations)}</td></tr>
      <tr><th scope="row">Microchip</th><td>${p.microchip ? "Yes" : "No"}</td></tr>
    </tbody></table>
    ${ctas}
    <div class="prose" style="margin-top:1.6rem"><h3>About ${esc(p.name)}</h3><p>${esc(p.about)}</p>
    <p class="muted">Comes home with vet records, a microchip, our one-year <a href="/how-it-works/health-guarantee/">health guarantee</a> and a starter kit.</p></div>
  </div>
</div></section>
${similar.length ? `<section class="band"><div class="wrap"><div class="sec-head"><h2>You might also like</h2></div><div class="grid">${similar.map(pupCard).join("")}</div></div></section>` : ""}`,
  });
}

// Breeds
add("/breeds/", {
  title: "Breeds",
  description: "Toy and small breeds we raise: Pomeranian, Maltipoo, Maltese, Toy Poodle, Yorkie, Chihuahua, French Bulldog, Pomsky and Bichon Frise.",
  body: `${pageHero("Our breeds", "Toy and small breeds chosen for temperament, health and how well they fit modern homes.", [{ label: "Breeds" }])}
<section><div class="wrap"><div class="breeds">${breeds.map((b) => breedCard(b, { blurb: true, count: puppies.filter((p) => p.breed === b.slug && p.status === "available").length })).join("")}</div></div></section>
${ctaBand("Not sure which breed?", "Tell us about your home and we'll suggest the best match.")}`,
});

for (const b of breeds) {
  const list = puppies.filter((p) => p.breed === b.slug && p.status !== "sold");
  add(`/breeds/${b.slug}/`, {
    title: `${b.name} Puppies for Sale`,
    description: `${b.blurb} See available ${b.name} puppies, vet-checked with a one-year health guarantee.`,
    waMessage: `Hi! I'm interested in a ${b.name} puppy.`,
    body: `${pageHero(`${b.name} puppies`, `${b.blurb} Adult weight ${b.weight}.`, [{ href: "/breeds/", label: "Breeds" }, { label: b.name }])}
<section><div class="wrap two">
  <div class="art-frame" style="background:${b.art.bg};max-width:380px">${b.image ? `<img src="${esc(b.image)}" alt="${esc(b.name)}">` : breedArt(b.slug)}</div>
  <div class="prose"><h2>About the ${esc(b.name)}</h2><p>${esc(b.description)}</p>
  <ul><li><strong>Adult weight:</strong> ${esc(b.weight)}</li><li><strong>Lifespan:</strong> ${esc(b.lifespan)}</li><li><strong>Grooming:</strong> ${esc(b.grooming)}</li><li><strong>Good for:</strong> ${esc(b.goodFor.join(", "))}</li></ul>
  ${waBtn(`Hi! I'm interested in a ${b.name} puppy.`, `Ask about ${b.name}s`)}</div>
</div></section>
<section class="band"><div class="wrap"><div class="sec-head"><h2>Available ${esc(b.name)} puppies</h2></div>
${list.length ? `<div class="grid">${list.map(pupCard).join("")}</div>` : `<p class="muted">No ${esc(b.name)} puppies available right now. Message us to join the waitlist for the next litter.</p>`}
</div></section>${ctaBand()}`,
  });
}

// How it works
const processTabs = (active) => `<nav class="tabs" aria-label="How it works sections">${processPages.map((p) => `<a href="/how-it-works/${p.slug}/"${p.slug === active ? ' aria-current="page"' : ""}>${esc(p.title)}</a>`).join("")}</nav>`;
// internal links in content: make them directory-style
const fixLinks = (html) => html.replace(/href="(\/[^"#?]*?[^/"])"/g, 'href="$1/"');

add("/how-it-works/", {
  title: "How It Works",
  description: "How to reserve, pay for and receive your puppy: delivery, health guarantee, financing and special orders.",
  body: `${pageHero("How it works", "Everything you need to know about reserving, paying for and receiving your puppy.", [{ label: "How it works" }])}
<section><div class="wrap">${processTabs()}
<div style="margin-bottom:2.5rem">${steps()}</div>
<div class="cards3">${processPages.map((p) => `<a href="/how-it-works/${p.slug}/" class="card" style="text-decoration:none"><h3>${esc(p.title)}</h3><p class="muted">${esc(p.summary)}</p><span class="link">Read more →</span></a>`).join("")}</div>
</div></section>${ctaBand()}`,
});

for (const p of processPages) {
  add(`/how-it-works/${p.slug}/`, {
    title: p.title,
    description: p.summary,
    body: `${pageHero(p.title, p.summary, [{ href: "/how-it-works/", label: "How it works" }, { label: p.title }])}
<section><div class="wrap">${processTabs(p.slug)}<div class="prose">${fixLinks(p.body)}</div></div></section>${ctaBand()}`,
  });
}

// About
const team = [
  { name: "Sarah Mitchell", role: "Founder & breeder", text: "Handles matching, video calls and every litter's daily care." },
  { name: "Dr. Arjun Rao", role: "Partner veterinarian", text: "Examines every puppy and issues health certificates before travel." },
  { name: "Emily Chen", role: "Client care", text: "Your contact on WhatsApp from reservation to delivery and beyond." },
];
add("/about/", {
  title: "About Us",
  description: `Meet the family behind ${site.name}: our story, our team and our promise.`,
  body: `${pageHero(`About ${site.name}`, "A small, family-run breeding program focused on healthy, well-socialized toy breeds.", [{ label: "About" }])}
<section><div class="wrap two">
  <div class="prose"><h2>Our story</h2>
  <p>${esc(site.name)} started in ${site.foundedYear} with one Pomeranian and a lot of questions about how to raise small dogs well. Today we work with a handful of carefully selected breeds and a dedicated vet partner.</p>
  <p>Our puppies grow up inside our home, around everyday sounds and people. By the time they leave, they're used to handling, grooming and short car rides.</p>
  <h2>Our promise</h2><ul><li>Honest descriptions and real videos of every puppy</li><li>Written contract and health guarantee</li><li>Support for the life of your dog</li></ul></div>
  <div class="art-frame" style="background:${bgOf("maltese")}">${breedArt("maltese")}</div>
</div></section>
<section class="band" id="team"><div class="wrap"><div class="sec-head"><h2>Meet the team</h2></div>
<div class="cards3">${team.map((t) => `<div class="card"><h3>${esc(t.name)}</h3><p class="muted">${esc(t.role)}</p><p>${esc(t.text)}</p></div>`).join("")}</div></div></section>
<section id="locations"><div class="wrap"><div class="sec-head"><h2>Where to find us</h2></div><div class="cards3">
<div class="card"><h3>Main kennel</h3><p class="muted">Visits by appointment only. Message us on WhatsApp to book.</p></div>
<div class="card"><h3>Opening hours</h3>${hoursGrid()}</div>
<div class="card"><h3>Licensed breeder</h3><p class="muted">Registered business. License number available on request.</p></div>
</div></div></section>${ctaBand()}`,
});

add("/reviews/", {
  title: "Reviews",
  description: "What families say about their puppies and our service.",
  body: `${pageHero("What our families say", "Messages from families who brought a puppy home.", [{ label: "Reviews" }])}
<section><div class="wrap"><div style="margin-bottom:2rem">${trust()}</div><div class="reviews">${reviews.map(reviewCard).join("")}</div></div></section>${ctaBand()}`,
});

add("/faq/", {
  title: "FAQ",
  description: "Answers to common questions about reserving, paying for, delivering and caring for your puppy.",
  jsonLd: [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }],
  body: `${pageHero("Frequently asked questions", "Answers to the questions we hear most often.", [{ label: "FAQ" }])}
<section><div class="wrap" style="max-width:860px">${faqList(faqs)}</div></section>
${ctaBand("Still have a question?", "Message us on WhatsApp. We usually reply within minutes.")}`,
});

add("/buy-safely/", {
  title: "Buy Safely",
  description: "How to make sure you're talking to us and not a scammer using our name.",
  body: `${pageHero("Buy safely", "How to make sure you're talking to us and not a scammer using our name.", [{ label: "Buy safely" }])}
<section><div class="wrap">
<div class="steps">
<div><h3>Check the number</h3><p>We only message from ${esc(site.whatsappDisplay)}, the number shown on this website.</p></div>
<div><h3>Ask for video</h3><p>We'll always show your puppy on a live video call.</p></div>
<div><h3>Pay the business</h3><p>Payments go only to our registered business account.</p></div>
<div><h3>Get it in writing</h3><p>You receive a contract and receipt for every payment.</p></div></div>
<div class="note" style="margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;justify-content:space-between"><span>Contacted by someone claiming to be us? Check with our official number first.</span>${waBtn("Hi! Someone contacted me claiming to be you. Can you confirm?", "Verify on WhatsApp")}</div>
<p style="margin-top:2rem">Read the full guide: <a class="link" href="/blog/how-to-spot-a-puppy-scam/">How to spot a puppy scam</a>.</p>
</div></section>`,
});

add("/contact/", {
  title: "Contact",
  description: "Contact us on WhatsApp, by email or with our contact form.",
  body: `${pageHero("Get in touch", "WhatsApp is the fastest way to reach us. We usually reply within minutes during business hours.", [{ label: "Contact" }])}
<section><div class="wrap two">
  <div style="display:grid;gap:1.2rem">
    <div class="card"><h3>WhatsApp</h3><p style="font-weight:800">${esc(site.whatsappDisplay)}</p><div>${waBtn("Hi! I have a question about your puppies.", "Start a chat")}</div></div>
    <div class="card"><h3>Email</h3><p><a class="link" href="mailto:${esc(site.email)}">${esc(site.email)}</a></p></div>
    <div class="card"><h3>Hours</h3>${hoursGrid()}</div>
  </div>
  <form class="card" id="contact-form" action="/api/contact" method="post">
    <h3>Send a message</h3>
    <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" required maxlength="100" placeholder="Your name"></div>
    <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required maxlength="200" placeholder="you@example.com"></div>
    <div class="field"><label for="c-phone">Phone / WhatsApp</label><input id="c-phone" name="phone" maxlength="40" placeholder="+1 …"></div>
    <div class="field"><label for="c-breed">Interested in</label><select id="c-breed" name="interest"><option>Any breed</option>${breeds.map((b) => `<option>${esc(b.name)}</option>`).join("")}</select></div>
    <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" rows="4" required maxlength="3000" placeholder="Tell us what you're looking for"></textarea></div>
    <input type="text" name="company" tabindex="-1" autocomplete="off" class="sr-only" aria-hidden="true">
    <button class="btn btn-primary" type="submit" style="justify-self:start">Send message</button>
    <p class="form-ok" aria-live="polite" data-status></p>
  </form>
</div></section>`,
});

// Blog
const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));
add("/blog/", {
  title: "Blog",
  description: "Practical advice on choosing, raising and caring for small-breed puppies.",
  body: `${pageHero("Puppy guides & news", "Practical advice on choosing, raising and caring for small-breed puppies.", [{ label: "Blog" }])}
<section><div class="wrap"><div class="posts">${sortedPosts.map(postCard).join("")}</div></div></section>`,
});

for (const p of posts) {
  const more = posts.filter((x) => x.slug !== p.slug).slice(0, 2);
  add(`/blog/${p.slug}/`, {
    title: p.title,
    description: p.excerpt,
    ogType: "article",
    jsonLd: [{ "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.excerpt, datePublished: p.date, author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name } }],
    body: `<section><div class="wrap"><article class="article">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog/">Blog</a></nav>
<div class="meta">${fmtDate(p.date)} · ${esc(p.readTime)} read</div>
<h1 style="margin-top:.4rem">${esc(p.title)}</h1>
<div class="article-cover" style="background:${bgOf(p.breed)}">${p.cover ? `<img src="${esc(p.cover)}" alt="">` : breedArt(p.breed)}</div>
<div class="prose">${fixLinks(p.body)}</div>
<div class="note ask-box"><span>Have a question about this?</span>${waBtn(`Hi! I just read "${p.title}" and have a question.`, "Ask on WhatsApp")}</div>
</article></div></section>
<section class="band"><div class="wrap"><div class="sec-head"><h2>Keep reading</h2></div><div class="posts">${more.map(postCard).join("")}</div></div></section>`,
  });
}

// Legal
for (const p of legalPages) {
  add(`/legal/${p.slug}/`, {
    title: p.title,
    description: `${p.title} for ${site.name}.`,
    body: `${pageHero(p.title, "", [{ label: p.title }])}<section><div class="wrap"><div class="prose">${p.body}</div></div></section>`,
  });
}

/* ---------------- write ---------------- */
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp(join(ROOT, "src", "static"), OUT, { recursive: true });

for (const { path, html } of pages) {
  const file = path === "/" ? join(OUT, "index.html") : join(OUT, path, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

// 404 page (served automatically by Cloudflare)
await writeFile(join(OUT, "404.html"), layout({
  path: "/404",
  title: "Page not found",
  body: `${pageHero("Page not found", "The page you're looking for doesn't exist or has moved.", [{ label: "Not found" }])}
<section><div class="wrap" style="display:flex;gap:.6rem;flex-wrap:wrap"><a class="btn btn-primary" href="/">Back to home</a><a class="btn btn-ghost" href="/puppies/">See puppies</a></div></section>`,
}).replace('<link rel="canonical"', '<meta name="robots" content="noindex">\n<link rel="canonical"'));

// sitemap + robots
const base = site.url.replace(/\/$/, "");
await writeFile(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${base}${p.path}</loc></url>`).join("\n")}
</urlset>
`);
await writeFile(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${base}/sitemap.xml\n`);

// Cloudflare headers: cache static assets, basic security headers
await writeFile(join(OUT, "_headers"), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/css/*
  Cache-Control: public, max-age=86400

/js/*
  Cache-Control: public, max-age=86400

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
`);

console.log(`Built ${pages.length + 1} pages into ${OUT}`);
