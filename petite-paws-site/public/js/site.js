/*
 * Petite Paws — website script.
 * Loads the site content (from the admin database via /api/content, or from data/content.json
 * if the API isn't available), then draws the page. Plain JavaScript, no libraries.
 */
(function (global) {
  "use strict";

  /* ================= helpers ================= */
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var enc = encodeURIComponent;

  var WA_ICON = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.6C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>';

  function svgIcon(p) {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  }
  var ICONS = {
    shield: svgIcon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
    video: svgIcon('<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>'),
    plane: svgIcon('<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>'),
    heart: svgIcon('<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>'),
  };

  /** Small drawn logo mark (used only for the logo). */
  var LOGO_SVG = '<svg viewBox="0 0 200 190" aria-hidden="true"><ellipse cx="46" cy="96" rx="24" ry="40" fill="#D9A15E" transform="rotate(18 46 96)"/><ellipse cx="154" cy="96" rx="24" ry="40" fill="#D9A15E" transform="rotate(-18 154 96)"/><circle cx="86" cy="50" r="16" fill="#EFC48E"/><circle cx="100" cy="44" r="18" fill="#EFC48E"/><circle cx="114" cy="50" r="16" fill="#EFC48E"/><ellipse cx="100" cy="104" rx="62" ry="58" fill="#EFC48E"/><ellipse cx="100" cy="132" rx="34" ry="24" fill="#FFF7EE" opacity=".9"/><circle cx="76" cy="98" r="9" fill="#2B1B33"/><circle cx="124" cy="98" r="9" fill="#2B1B33"/><circle cx="79" cy="95" r="3" fill="#fff"/><circle cx="127" cy="95" r="3" fill="#fff"/><ellipse cx="100" cy="122" rx="11" ry="8" fill="#2B1B33"/></svg>';

  /** Real breed photos in /images/breeds/, used when a puppy or post has no photo of its own. */
  var BREED_PHOTOS = {
    pomeranian: "/images/breeds/pomeranian.webp",
    maltipoo: "/images/breeds/maltipoo.webp",
    maltese: "/images/breeds/maltese.webp",
    "toy-poodle": "/images/breeds/toy-poodle.webp",
    yorkie: "/images/breeds/yorkie.webp",
    chihuahua: "/images/breeds/chihuahua.webp",
    "french-bulldog": "/images/breeds/french-bulldog.webp",
    pomsky: "/images/breeds/pomsky.webp",
    "bichon-frise": "/images/breeds/bichon-frise.webp",
  };

  var NAV = [
    ["/puppies", "Available Puppies", ["puppies", "puppy", "previous"]],
    ["/breeds", "Breeds", ["breeds", "breed"]],
    ["/how-it-works", "How It Works", ["how", "process", "safe"]],
    ["/about", "About", ["about"]],
    ["/reviews", "Reviews", ["reviews"]],
    ["/blog", "Blog", ["blog", "post"]],
    ["/faq", "FAQ", ["faq"]],
    ["/contact", "Contact", ["contact"]],
  ];

  var TEAM = [
    { name: "Sarah Mitchell", role: "Founder & breeder", text: "Handles matching, video calls and every litter's daily care." },
    { name: "Dr. Arjun Rao", role: "Partner veterinarian", text: "Examines every puppy and issues health certificates before travel." },
    { name: "Emily Chen", role: "Client care", text: "Your contact on WhatsApp from reservation to delivery and beyond." },
  ];

  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n/).filter(Boolean).map(function (p) { return "<p>" + esc(p.trim()) + "</p>"; }).join("");
  }

  /* ================= renderer ================= */
  function createRenderer(data) {
    var site = data.site || {};
    var breeds = data.breeds || [];
    var puppies = data.puppies || [];
    var posts = data.posts || [];
    var reviews = data.reviews || [];
    var faqs = data.faqs || [];
    var processPages = data.process || [];
    var legalPages = data.legal || [];
    var YEAR = new Date().getFullYear();

    function wa(msg) {
      return "https://wa.me/" + String(site.whatsappNumber || "").replace(/\D/g, "") + "?text=" + enc(msg || site.whatsappDefaultMessage || "Hi!");
    }
    function price(n) {
      try { return new Intl.NumberFormat(site.locale || "en-US", { style: "currency", currency: site.currency || "USD", maximumFractionDigits: 0 }).format(Number(n) || 0); }
      catch (e) { return (site.currency || "") + " " + (Number(n) || 0).toLocaleString(); }
    }
    function fmtDate(iso) {
      var d = new Date(String(iso) + "T00:00:00");
      return isNaN(d) ? esc(iso) : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    function getBreed(slug) { return breeds.find(function (b) { return b.slug === slug; }); }
    function bgOf(slug) { var b = getBreed(slug); return (b && b.art && b.art.bg) || "#F4ECF3"; }
    function pronoun(p) { return p.sex === "Female" ? "she" : "he"; }
    function breedPhoto(slug) { var b = getBreed(slug); return (b && b.image) || BREED_PHOTOS[slug] || ""; }
    function breedArt(slug, alt, eager) {
      var src = breedPhoto(slug);
      if (!src) return '<span class="no-photo" aria-hidden="true"></span>';
      return '<img class="art-photo" src="' + esc(src) + '" alt="' + esc(alt || "") + '" width="480" height="480"' + (eager ? "" : ' loading="lazy"') + ' decoding="async">';
    }
    var current = puppies.filter(function (p) { return p.status !== "sold"; });
    var previous = puppies.filter(function (p) { return p.status === "sold"; });
    function byFeatured(a, b) { return (Number(!!b.featured) - Number(!!a.featured)) || ((a.sort || 0) - (b.sort || 0)); }
    var sortedPosts = posts.slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });

    /** Converts links in admin-written HTML like href="/blog/some-post" to this site's page addresses. */
    function fixLinks(html) {
      return String(html || "").replace(/href="\/(blog|how-it-works|legal|breeds|puppies)\/([a-z0-9-]+)\/?"/g, function (_, type, slug) {
        var map = { blog: "post", "how-it-works": "process", legal: "legal", breeds: "breed", puppies: "puppy" };
        return 'href="/' + map[type] + "?id=" + slug + '"';
      }).replace(/href="\/(contact|about|faq|reviews|blog|breeds|puppies|buy-safely|how-it-works)\/?"/g, 'href="/$1"');
    }

    /* ---- links ---- */
    var link = {
      puppy: function (s) { return "/puppy?id=" + enc(s); },
      breed: function (s) { return "/breed?id=" + enc(s); },
      post: function (s) { return "/post?id=" + enc(s); },
      process: function (s) { return "/process?id=" + enc(s); },
      legal: function (s) { return "/legal?id=" + enc(s); },
    };

    /* ---- components ---- */
    function waBtn(msg, label, cls) {
      return '<a class="' + (cls || "btn btn-wa") + '" href="' + esc(wa(msg)) + '" target="_blank" rel="noopener noreferrer">' + WA_ICON + esc(label || "Chat on WhatsApp") + "</a>";
    }
    function header(page) {
      return '<div class="wrap nav">' +
        '<a class="logo" href="/" aria-label="' + esc(site.name) + ' home"><span class="logo-mark">' + LOGO_SVG + "</span><span><b>" + esc(site.name) + "</b><small>" + esc(site.tagline) + "</small></span></a>" +
        '<button class="burger" type="button" aria-expanded="false" aria-controls="main-menu">Menu</button>' +
        '<nav id="main-menu" class="menu" aria-label="Main">' +
        NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[2].indexOf(page) > -1 ? ' aria-current="page"' : "") + ">" + esc(n[1]) + "</a>"; }).join("") +
        "</nav></div>";
    }
    function footer() {
      return '<div class="wrap"><div class="cols">' +
        '<div><div class="foot-brand">' + esc(site.name) + '</div><p style="opacity:.8;margin-top:.5rem;max-width:34ch;font-size:.92rem">Small-breed puppies raised in a home environment, vet-checked and delivered with care.</p>' +
        '<p style="margin-top:1rem;font-size:.92rem">WhatsApp: ' + esc(site.whatsappDisplay) + "<br>" + esc(site.email) + "</p></div>" +
        '<div><h4>Puppies</h4><a href="/puppies">Available Puppies</a><a href="/previous-puppies">Previous Puppies</a><a href="/breeds">Breeds</a><a href="' + link.process("special-order") + '">Special Order</a></div>' +
        "<div><h4>Process</h4>" + processPages.slice(0, 4).map(function (p) { return '<a href="' + link.process(p.slug) + '">' + esc(p.title) + "</a>"; }).join("") + '<a href="/buy-safely">Buy Safely</a></div>' +
        '<div><h4>Company</h4><a href="/about">About Us</a><a href="/reviews">Reviews</a><a href="/blog">Blog</a><a href="/faq">FAQ</a><a href="/contact">Contact</a></div>' +
        '</div><div class="legal"><span>© ' + YEAR + " " + esc(site.name) + '. All rights reserved.</span><nav aria-label="Legal">' +
        legalPages.map(function (p) { return '<a href="' + link.legal(p.slug) + '">' + esc(p.title) + "</a>"; }).join("") + "</nav></div></div>";
    }
    function pageHero(title, subtitle, crumbs) {
      return '<div class="page-hero"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>' +
        (crumbs || []).map(function (c) { return " / " + (c.href ? '<a href="' + c.href + '">' + esc(c.label) + "</a>" : "<span>" + esc(c.label) + "</span>"); }).join("") +
        "</nav><h1>" + esc(title) + "</h1>" + (subtitle ? "<p>" + esc(subtitle) + "</p>" : "") + "</div></div>";
    }
    function ctaBand(title, text) {
      return '<section><div class="wrap"><div class="cta-band"><div><h2>' + esc(title || "Ready to meet your puppy?") + "</h2><p>" + esc(text || "Message us and we'll set up a live video call today.") + '</p></div><div style="display:flex;gap:.6rem;flex-wrap:wrap">' +
        waBtn("Hi! I'd like to book a video call to meet a puppy.", "WhatsApp us") + '<a class="btn btn-ghost" href="/puppies">See puppies</a></div></div></div></section>';
    }
    function badge(s) {
      return s === "reserved" ? '<span class="badge reserved">Reserved</span>' : s === "sold" ? '<span class="badge sold">Found a home</span>' : '<span class="badge">Available</span>';
    }
    function pupCard(p) {
      var b = getBreed(p.breed) || {};
      var img = p.images && p.images[0];
      var media = img ? '<img src="' + esc(img) + '" alt="' + esc(p.name + ", " + (b.name || "") + " puppy") + '" loading="lazy">' : breedArt(p.breed, (b.name || "") + " puppy");
      return '<a class="pup" href="' + link.puppy(p.slug) + '" data-breed="' + esc(p.breed) + '" data-sex="' + esc(p.sex) + '" data-status="' + esc(p.status) + '" data-price="' + (Number(p.price) || 0) + '" data-featured="' + (p.featured ? 1 : 0) + '">' +
        '<div class="ph" style="background:' + esc(bgOf(p.breed)) + '">' + badge(p.status) + media + "</div>" +
        '<div class="info"><div class="row"><span class="name">' + esc(p.name) + '</span><span class="price">' + (p.status === "sold" ? "" : price(p.price)) + "</span></div>" +
        '<span class="muted" style="font-size:.9rem">' + esc(b.name) + "</span>" +
        '<div class="chips"><span class="chip">' + esc(p.sex) + "</span>" + (p.age ? '<span class="chip">' + esc(p.age) + "</span>" : "") + (p.color ? '<span class="chip">' + esc(p.color) + "</span>" : "") + "</div></div></a>";
    }
    function breedCard(b, count, blurb) {
      return '<a class="breed" href="' + link.breed(b.slug) + '"><span class="breed-art" style="background:' + esc((b.art && b.art.bg) || "#F4ECF3") + '">' + breedArt(b.slug, b.name + " puppy") + "</span><h3>" + esc(b.name) + "</h3><span>" + esc(b.weight) + (count !== undefined ? " · " + count + " available" : "") + "</span>" + (blurb ? "<p>" + esc(b.blurb) + "</p>" : "") + "</a>";
    }
    function postCard(p) {
      return '<a class="post" href="' + link.post(p.slug) + '"><div class="cover" style="background:' + esc(bgOf(p.breed)) + '">' + (p.cover ? '<img src="' + esc(p.cover) + '" alt="" loading="lazy">' : breedArt(p.breed)) + '</div><div class="body"><div class="meta">' + fmtDate(p.date) + (p.readTime ? " · " + esc(p.readTime) + " read" : "") + "</div><h3>" + esc(p.title) + '</h3><p class="muted" style="font-size:.93rem">' + esc(p.excerpt) + "</p></div></a>";
    }
    function reviewCard(r) {
      var n = Math.max(1, Math.min(5, Number(r.rating) || 5));
      return '<figure class="card review"><div class="stars" aria-label="' + n + ' out of 5 stars">' + "★".repeat(n) + "</div><blockquote>" + esc(r.text) + "</blockquote><figcaption>" + esc(r.name) + (r.puppy ? " · " + esc(r.puppy) : "") + "</figcaption></figure>";
    }
    function faqList(items) { return '<div class="faq">' + items.map(function (f) { return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>"; }).join("") + "</div>"; }
    function trust() { return '<div class="trust">' + (site.stats || []).map(function (s) { return "<div><b>" + esc(s.value) + "</b><span>" + esc(s.label) + "</span></div>"; }).join("") + "</div>"; }
    function steps() {
      return '<div class="steps"><div><h3>Choose</h3><p>Browse available puppies or ask us to match you with a breed.</p></div><div><h3>Video call</h3><p>Meet your puppy live and ask us anything.</p></div><div><h3>Reserve</h3><p>Secure your puppy with a deposit and sign the agreement.</p></div><div><h3>Go home</h3><p>Pick up or get delivery, with records and a starter kit.</p></div></div>';
    }
    function hoursGrid() { return '<div class="hours">' + (site.hours || []).map(function (h) { return "<span>" + esc(h.days) + "</span><span>" + esc(h.time) + "</span>"; }).join("") + "</div>"; }
    function processTabs(active) {
      return '<nav class="tabs" aria-label="How it works sections">' + processPages.map(function (p) { return '<a href="' + link.process(p.slug) + '"' + (p.slug === active ? ' aria-current="page"' : "") + ">" + esc(p.title) + "</a>"; }).join("") + "</nav>";
    }
    function notFound(what) {
      return { title: "Not found", noindex: true, html: pageHero((what || "Page") + " not found", "It may have been removed or renamed.", [{ label: "Not found" }]) + '<section><div class="wrap" style="display:flex;gap:.6rem;flex-wrap:wrap"><a class="btn btn-primary" href="/">Back to home</a><a class="btn btn-ghost" href="/puppies">See puppies</a></div></section>' };
    }

    /* ---- pages: each returns { title, description, html, waMessage } ---- */
    var views = {};

    views.home = function () {
      return {
        title: site.name + " | " + site.tagline, fullTitle: true,
        html: '<div class="wrap hero"><div>' +
          '<div class="eyebrow">' + esc(site.heroEyebrow || "Toy & teacup puppies") + (site.foundedYear ? " · since " + esc(site.foundedYear) : "") + "</div>" +
          '<h1 style="margin-top:.6rem">' + esc(site.heroTitle) + '</h1><p class="lede">' + esc(site.heroText) + "</p>" +
          '<div class="ctas"><a class="btn btn-primary" href="/puppies">See available puppies</a>' + waBtn("Hi! I'd like to book a video call to see your available puppies.", "Book a video call") + "</div></div>" +
          '<div class="art-frame" style="background:' + esc(bgOf("pomeranian")) + '">' + (site.heroImage ? '<img src="' + esc(site.heroImage) + '" alt="" style="border-radius:50% 50% 24px 24px">' : breedArt("pomeranian", "Pomeranian puppy", true)) +
          '<span class="hero-tag" style="top:12%;left:4%">Vet-checked ✓</span><span class="hero-tag" style="bottom:12%;right:4%">1-year health guarantee</span></div></div>' +
          '<div class="wrap">' + trust() + "</div>" +
          '<section><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Ready for their new homes</div><h2>Available puppies</h2></div><a class="btn btn-ghost" href="/puppies">View all</a></div>' +
          (current.length ? '<div class="grid">' + current.slice().sort(byFeatured).slice(0, 8).map(pupCard).join("") + "</div>" : '<p class="muted">New puppies are coming soon. Message us to join the waitlist.</p>') + "</div></section>" +
          '<section class="band"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Why families choose us</div><h2>Every puppy comes with peace of mind</h2></div></div><div class="feat">' +
          '<div><div class="ic">' + ICONS.shield + "</div><h3>Vet-checked</h3><p>Full vet exam, vaccinations and deworming before going home, backed by a written one-year health guarantee.</p></div>" +
          '<div><div class="ic">' + ICONS.video + "</div><h3>See them live</h3><p>Meet your puppy on a live video call before you reserve. Ask for one any day of the week.</p></div>" +
          '<div><div class="ic">' + ICONS.plane + "</div><h3>Safe delivery</h3><p>Pick up in person, or choose pet cargo or a flight nanny who hands your puppy to you at the airport.</p></div>" +
          '<div><div class="ic">' + ICONS.heart + "</div><h3>Lifetime support</h3><p>Questions about food, training or health? Message us on WhatsApp for as long as you own your dog.</p></div></div></div></section>" +
          '<section><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Simple and transparent</div><h2>How to bring your puppy home</h2></div><a class="btn btn-ghost" href="/how-it-works">Full process</a></div>' + steps() + "</div></section>" +
          '<section class="band"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Shop by breed</div><h2>Our breeds</h2></div><a class="btn btn-ghost" href="/breeds">All breeds</a></div><div class="breeds">' + breeds.slice(0, 5).map(function (b) { return breedCard(b); }).join("") + "</div></div></section>" +
          (reviews.length ? '<section><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Happy families</div><h2>What our families say</h2></div><a class="btn btn-ghost" href="/reviews">All reviews</a></div><div class="reviews">' + reviews.slice(0, 3).map(reviewCard).join("") + "</div></div></section>" : "") +
          (posts.length ? '<section class="band"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">From the blog</div><h2>Puppy guides</h2></div><a class="btn btn-ghost" href="/blog">All posts</a></div><div class="posts">' + sortedPosts.slice(0, 3).map(postCard).join("") + "</div></div></section>" : "") +
          '<section><div class="wrap two"><div><div class="eyebrow">Questions</div><h2>Frequently asked</h2><p class="muted" style="margin-top:.6rem">Can\'t find your answer? Message us on WhatsApp and we\'ll reply within minutes during business hours.</p><p style="margin-top:1rem"><a class="link" href="/faq">See all questions →</a></p></div>' + faqList(faqs.slice(0, 5)) + "</div></section>" +
          ctaBand(),
      };
    };

    views.puppies = function () {
      var opts = breeds.filter(function (b) { return current.some(function (p) { return p.breed === b.slug; }); });
      return {
        title: "Available Puppies", description: "Browse vet-checked toy and teacup puppies available now. Meet any puppy on a live video call before you reserve.",
        html: pageHero("Available puppies", "Every puppy is vet-checked and can be met on a live video call before you reserve.", [{ label: "Available puppies" }]) +
          '<section><div class="wrap"><div class="shop" data-puppy-filter><aside class="filters" aria-label="Filter puppies">' +
          '<div><label for="f-breed">Breed</label><select id="f-breed" data-f="breed"><option value="all">All breeds</option>' + opts.map(function (b) { return '<option value="' + esc(b.slug) + '">' + esc(b.name) + "</option>"; }).join("") + "</select></div>" +
          '<div><label for="f-sex">Sex</label><select id="f-sex" data-f="sex"><option value="all">Any</option><option value="Female">Female</option><option value="Male">Male</option></select></div>' +
          '<div><label for="f-status">Availability</label><select id="f-status" data-f="status"><option value="all">Available &amp; reserved</option><option value="available">Available only</option><option value="reserved">Reserved</option></select></div>' +
          '<div><label for="f-sort">Sort</label><select id="f-sort" data-f="sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div></aside>' +
          '<div><p class="result-count" aria-live="polite" data-count>' + current.length + ' puppies</p><div class="grid" data-grid>' + current.slice().sort(byFeatured).map(pupCard).join("") + "</div>" +
          '<div class="card" data-empty hidden><p>No puppies match these filters right now. Ask us about upcoming litters.</p><div>' + waBtn("Hi! I'm looking for a puppy that's not listed. Can you help?", "Ask on WhatsApp") + "</div></div></div></div>" +
          '<p class="muted" style="margin-top:2rem">Looking for puppies that already went home? <a class="link" href="/previous-puppies">See previous puppies</a>.</p></div></section>' + ctaBand(),
      };
    };

    views.previous = function () {
      return {
        title: "Previous Puppies", description: "Puppies who have already found their forever families.",
        html: pageHero("Previous puppies", "Puppies who have already found their families.", [{ href: "/puppies", label: "Puppies" }, { label: "Previous" }]) +
          '<section><div class="wrap">' + (previous.length ? '<div class="grid">' + previous.map(pupCard).join("") + "</div>" : '<p class="muted">No previous puppies listed yet.</p>') + "</div></section>" +
          ctaBand("Want a puppy like these?", "Tell us what you're looking for and we'll match you with an upcoming litter."),
      };
    };

    views.puppy = function (id) {
      var p = puppies.find(function (x) { return x.slug === id; });
      if (!p) return notFound("Puppy");
      var b = getBreed(p.breed) || { name: "", slug: p.breed, art: {} };
      var imgs = (p.images || []).filter(Boolean);
      var slots = imgs.length ? imgs : [null];
      var bg = esc((b.art && b.art.bg) || "#F4ECF3");
      var msg = "Hi! I'm interested in " + p.name + " (" + b.name + ", " + p.sex + "). Is " + pronoun(p) + " still available?";
      var similar = puppies.filter(function (x) { return x.slug !== p.slug && x.status === "available"; }).sort(function (x) { return x.breed === p.breed ? -1 : 1; }).slice(0, 4);
      function row(k, v) { return v ? '<tr><th scope="row">' + k + "</th><td>" + esc(v) + "</td></tr>" : ""; }
      var slides = slots.map(function (src, i) {
        return '<div class="slide" data-slide="' + i + '"' + (i ? " hidden" : "") + ">" + (src ? '<img src="' + esc(src) + '" alt="' + esc(p.name + ", photo " + (i + 1)) + '">' : breedArt(p.breed, b.name + " puppy", true)) + "</div>";
      }).join("");
      var thumbs = slots.length > 1 ? '<div class="thumbs">' + slots.slice(0, 8).map(function (src, i) {
        return '<button type="button" style="background:' + bg + ';position:relative" aria-pressed="' + (i === 0) + '" aria-label="Show photo ' + (i + 1) + '" data-thumb="' + i + '"><img src="' + esc(src) + '" alt="" loading="lazy"></button>';
      }).join("") + "</div>" : "";
      var ctas = p.status !== "sold"
        ? '<div class="detail-ctas">' + waBtn(msg, "Ask about " + p.name + " on WhatsApp") + waBtn("Hi! I'd like to book a video call to see " + p.name + " (" + b.name + ").", "Book a video call", "btn btn-ghost") + "</div>"
        : '<div class="detail-ctas">' + waBtn("Hi! I loved " + p.name + " (" + b.name + "). Do you have a similar puppy coming up?", "Ask about a similar puppy") + "</div>";
      return {
        title: p.name + " – " + b.name + " " + p.sex + " Puppy",
        description: (p.name + " is a " + (p.age || "") + " " + (p.color || "") + " " + b.name + " " + String(p.sex || "").toLowerCase() + " puppy. " + (p.about || "")).replace(/\s+/g, " "),
        waMessage: msg,
        html: '<div class="wrap" style="padding-block:1.2rem 0"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/puppies">Available puppies</a> / <span>' + esc(p.name) + "</span></nav></div>" +
          '<section style="padding-top:1rem"><div class="wrap detail"><div data-gallery><div class="gallery-main" style="background:' + bg + '">' + slides + "</div>" + thumbs + "</div><div>" +
          '<a class="eyebrow" href="' + link.breed(b.slug) + '" style="text-decoration:none">' + esc(b.name) + '</a><h1 style="margin-top:.4rem">' + esc(p.name) + '</h1><div class="big-price">' + (p.status === "sold" ? "Found a home" : price(p.price)) + "</div>" +
          (p.status === "reserved" ? '<p class="note">' + esc(p.name) + " is reserved. Message us to join the waitlist or see a similar puppy.</p>" : "") +
          '<table class="specs"><tbody>' + row("Breed", b.name) + row("Sex", p.sex) + row("Age", p.age) + row("Color", p.color) + row("Adult size", p.adultWeight) + row("Vaccinations", p.vaccinations) + '<tr><th scope="row">Microchip</th><td>' + (p.microchip ? "Yes" : "No") + "</td></tr></tbody></table>" +
          ctas + '<div class="prose" style="margin-top:1.6rem"><h3>About ' + esc(p.name) + "</h3>" + paragraphs(p.about) + '<p class="muted">Comes home with vet records, a microchip, our one-year <a href="' + link.process("health-guarantee") + '">health guarantee</a> and a starter kit.</p></div></div></div></section>' +
          (similar.length ? '<section class="band"><div class="wrap"><div class="sec-head"><h2>You might also like</h2></div><div class="grid">' + similar.map(pupCard).join("") + "</div></div></section>" : ""),
      };
    };

    views.breeds = function () {
      return {
        title: "Breeds", description: "Toy and small breeds we raise: " + breeds.map(function (b) { return b.name; }).join(", ") + ".",
        html: pageHero("Our breeds", "Toy and small breeds chosen for temperament, health and how well they fit modern homes.", [{ label: "Breeds" }]) +
          '<section><div class="wrap"><div class="breeds">' + breeds.map(function (b) { return breedCard(b, puppies.filter(function (p) { return p.breed === b.slug && p.status === "available"; }).length, true); }).join("") + "</div></div></section>" +
          ctaBand("Not sure which breed?", "Tell us about your home and we'll suggest the best match."),
      };
    };

    views.breed = function (id) {
      var b = getBreed(id);
      if (!b) return notFound("Breed");
      var list = puppies.filter(function (p) { return p.breed === b.slug && p.status !== "sold"; });
      return {
        title: b.name + " Puppies for Sale", description: (b.blurb || "") + " See available " + b.name + " puppies, vet-checked with a one-year health guarantee.",
        waMessage: "Hi! I'm interested in a " + b.name + " puppy.",
        html: pageHero(b.name + " puppies", (b.blurb || "") + (b.weight ? " Adult weight " + b.weight + "." : ""), [{ href: "/breeds", label: "Breeds" }, { label: b.name }]) +
          '<section><div class="wrap two"><div class="art-frame" style="background:' + esc((b.art && b.art.bg) || "#F4ECF3") + ';max-width:380px">' + breedArt(b.slug, b.name + " puppy", true) + "</div>" +
          '<div class="prose"><h2>About the ' + esc(b.name) + "</h2>" + paragraphs(b.description) + "<ul>" +
          (b.weight ? "<li><strong>Adult weight:</strong> " + esc(b.weight) + "</li>" : "") + (b.lifespan ? "<li><strong>Lifespan:</strong> " + esc(b.lifespan) + "</li>" : "") +
          (b.grooming ? "<li><strong>Grooming:</strong> " + esc(b.grooming) + "</li>" : "") + (b.goodFor && b.goodFor.length ? "<li><strong>Good for:</strong> " + esc(b.goodFor.join(", ")) + "</li>" : "") +
          "</ul>" + waBtn("Hi! I'm interested in a " + b.name + " puppy.", "Ask about " + b.name + "s") + "</div></div></section>" +
          '<section class="band"><div class="wrap"><div class="sec-head"><h2>Available ' + esc(b.name) + " puppies</h2></div>" +
          (list.length ? '<div class="grid">' + list.map(pupCard).join("") + "</div>" : '<p class="muted">No ' + esc(b.name) + " puppies available right now. Message us to join the waitlist for the next litter.</p>") + "</div></section>" + ctaBand(),
      };
    };

    views.how = function () {
      return {
        title: "How It Works", description: "How to reserve, pay for and receive your puppy: delivery, health guarantee, financing and special orders.",
        html: pageHero("How it works", "Everything you need to know about reserving, paying for and receiving your puppy.", [{ label: "How it works" }]) +
          '<section><div class="wrap">' + processTabs() + '<div style="margin-bottom:2.5rem">' + steps() + '</div><div class="cards3">' +
          processPages.map(function (p) { return '<a href="' + link.process(p.slug) + '" class="card" style="text-decoration:none"><h3>' + esc(p.title) + '</h3><p class="muted">' + esc(p.summary) + '</p><span class="link">Read more →</span></a>'; }).join("") +
          "</div></div></section>" + ctaBand(),
      };
    };

    views.process = function (id) {
      var p = processPages.find(function (x) { return x.slug === id; });
      if (!p) return notFound("Page");
      return {
        title: p.title, description: p.summary,
        html: pageHero(p.title, p.summary, [{ href: "/how-it-works", label: "How it works" }, { label: p.title }]) +
          '<section><div class="wrap">' + processTabs(p.slug) + '<div class="prose">' + fixLinks(p.body) + "</div></div></section>" + ctaBand(),
      };
    };

    views.about = function () {
      return {
        title: "About Us", description: "Meet the family behind " + site.name + ": our story, our team and our promise.",
        html: pageHero("About " + site.name, "A small, family-run breeding program focused on healthy, well-socialized toy breeds.", [{ label: "About" }]) +
          '<section><div class="wrap two"><div class="prose"><h2>Our story</h2>' + paragraphs(site.aboutStory) +
          "<h2>Our promise</h2><ul><li>Honest descriptions and real videos of every puppy</li><li>Written contract and health guarantee</li><li>Support for the life of your dog</li></ul></div>" +
          '<div class="art-frame" style="background:' + esc(bgOf("maltese")) + '">' + breedArt("maltese", "Maltese puppy") + "</div></div></section>" +
          '<section class="band" id="team"><div class="wrap"><div class="sec-head"><h2>Meet the team</h2></div><div class="cards3">' +
          TEAM.map(function (t) { return '<div class="card"><h3>' + esc(t.name) + '</h3><p class="muted">' + esc(t.role) + "</p><p>" + esc(t.text) + "</p></div>"; }).join("") + "</div></div></section>" +
          '<section id="locations"><div class="wrap"><div class="sec-head"><h2>Where to find us</h2></div><div class="cards3">' +
          '<div class="card"><h3>Main kennel</h3><p class="muted">Visits by appointment only. Message us on WhatsApp to book.</p></div>' +
          '<div class="card"><h3>Opening hours</h3>' + hoursGrid() + "</div>" +
          '<div class="card"><h3>Licensed breeder</h3><p class="muted">Registered business. License number available on request.</p></div></div></div></section>' + ctaBand(),
      };
    };

    views.reviews = function () {
      return {
        title: "Reviews", description: "What families say about their puppies and our service.",
        html: pageHero("What our families say", "Messages from families who brought a puppy home.", [{ label: "Reviews" }]) +
          '<section><div class="wrap"><div style="margin-bottom:2rem">' + trust() + '</div><div class="reviews">' + reviews.map(reviewCard).join("") + "</div></div></section>" + ctaBand(),
      };
    };

    views.faq = function () {
      return {
        title: "FAQ", description: "Answers to common questions about reserving, paying for, delivering and caring for your puppy.",
        html: pageHero("Frequently asked questions", "Answers to the questions we hear most often.", [{ label: "FAQ" }]) +
          '<section><div class="wrap" style="max-width:860px">' + faqList(faqs) + "</div></section>" + ctaBand("Still have a question?", "Message us on WhatsApp. We usually reply within minutes."),
      };
    };

    views.safe = function () {
      return {
        title: "Buy Safely", description: "How to make sure you're talking to us and not a scammer using our name.",
        html: pageHero("Buy safely", "How to make sure you're talking to us and not a scammer using our name.", [{ label: "Buy safely" }]) +
          '<section><div class="wrap"><div class="steps"><div><h3>Check the number</h3><p>We only message from ' + esc(site.whatsappDisplay) + ", the number shown on this website.</p></div>" +
          "<div><h3>Ask for video</h3><p>We'll always show your puppy on a live video call.</p></div><div><h3>Pay the business</h3><p>Payments go only to our registered business account.</p></div><div><h3>Get it in writing</h3><p>You receive a contract and receipt for every payment.</p></div></div>" +
          '<div class="note" style="margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;justify-content:space-between"><span>Contacted by someone claiming to be us? Check with our official number first.</span>' + waBtn("Hi! Someone contacted me claiming to be you. Can you confirm?", "Verify on WhatsApp") + "</div>" +
          '<p style="margin-top:2rem">Read the full guide: <a class="link" href="' + link.post("how-to-spot-a-puppy-scam") + '">How to spot a puppy scam</a>.</p></div></section>',
      };
    };

    views.contact = function () {
      return {
        title: "Contact", description: "Contact us on WhatsApp, by email or with our contact form.",
        html: pageHero("Get in touch", "WhatsApp is the fastest way to reach us. We usually reply within minutes during business hours.", [{ label: "Contact" }]) +
          '<section><div class="wrap two"><div style="display:grid;gap:1.2rem">' +
          '<div class="card"><h3>WhatsApp</h3><p style="font-weight:800">' + esc(site.whatsappDisplay) + "</p><div>" + waBtn("Hi! I have a question about your puppies.", "Start a chat") + "</div></div>" +
          '<div class="card"><h3>Email</h3><p><a class="link" href="mailto:' + esc(site.email) + '">' + esc(site.email) + "</a></p></div>" +
          '<div class="card"><h3>Hours</h3>' + hoursGrid() + "</div></div>" +
          '<form class="card" id="contact-form" action="/api/contact" method="post"><h3>Send a message</h3>' +
          '<div class="field"><label for="c-name">Name</label><input id="c-name" name="name" required maxlength="100" placeholder="Your name"></div>' +
          '<div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required maxlength="200" placeholder="you@example.com"></div>' +
          '<div class="field"><label for="c-phone">Phone / WhatsApp</label><input id="c-phone" name="phone" maxlength="40" placeholder="+1 …"></div>' +
          '<div class="field"><label for="c-breed">Interested in</label><select id="c-breed" name="interest"><option>Any breed</option>' + breeds.map(function (b) { return "<option>" + esc(b.name) + "</option>"; }).join("") + "</select></div>" +
          '<div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" rows="4" required maxlength="3000" placeholder="Tell us what you\'re looking for"></textarea></div>' +
          '<input type="text" name="company" tabindex="-1" autocomplete="off" class="sr-only" aria-hidden="true">' +
          '<button class="btn btn-primary" type="submit" style="justify-self:start">Send message</button><p class="form-ok" aria-live="polite" data-status></p></form></div></section>',
      };
    };

    views.blog = function () {
      return {
        title: "Blog", description: "Practical advice on choosing, raising and caring for small-breed puppies.",
        html: pageHero("Puppy guides & news", "Practical advice on choosing, raising and caring for small-breed puppies.", [{ label: "Blog" }]) +
          '<section><div class="wrap">' + (sortedPosts.length ? '<div class="posts">' + sortedPosts.map(postCard).join("") + "</div>" : '<p class="muted">No posts yet.</p>') + "</div></section>",
      };
    };

    views.post = function (id) {
      var p = posts.find(function (x) { return x.slug === id; });
      if (!p) return notFound("Post");
      var more = sortedPosts.filter(function (x) { return x.slug !== p.slug; }).slice(0, 2);
      return {
        title: p.title, description: p.excerpt,
        html: '<section><div class="wrap"><article class="article"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a></nav>' +
          '<div class="meta">' + fmtDate(p.date) + (p.readTime ? " · " + esc(p.readTime) + " read" : "") + '</div><h1 style="margin-top:.4rem">' + esc(p.title) + "</h1>" +
          '<div class="article-cover" style="background:' + esc(bgOf(p.breed)) + '">' + (p.cover ? '<img src="' + esc(p.cover) + '" alt="">' : breedArt(p.breed, "", true)) + "</div>" +
          '<div class="prose">' + fixLinks(p.body) + "</div>" +
          '<div class="note ask-box"><span>Have a question about this?</span>' + waBtn('Hi! I just read "' + p.title + '" and have a question.', "Ask on WhatsApp") + "</div></article></div></section>" +
          (more.length ? '<section class="band"><div class="wrap"><div class="sec-head"><h2>Keep reading</h2></div><div class="posts">' + more.map(postCard).join("") + "</div></div></section>" : ""),
      };
    };

    views.legal = function (id) {
      var p = legalPages.find(function (x) { return x.slug === id; });
      if (!p) return notFound("Page");
      return { title: p.title, description: p.title + " for " + site.name + ".", html: pageHero(p.title, "", [{ label: p.title }]) + '<section><div class="wrap"><div class="prose">' + p.body + "</div></div></section>" };
    };

    views.notfound = function () { return notFound("Page"); };

    function waFloat(msg) {
      return { href: wa(msg), html: '<span class="lbl">Chat on WhatsApp</span><span class="bubble">' + WA_ICON + "</span>" };
    }

    return { views: views, header: header, footer: footer, waFloat: waFloat, site: site };
  }

  /* ================= interactions ================= */
  function bindMenu() {
    var burger = document.querySelector(".burger");
    var menu = document.getElementById("main-menu");
    if (!burger || !menu) return;
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      burger.textContent = open ? "Close" : "Menu";
    });
  }

  function bindFilters() {
    var shop = document.querySelector("[data-puppy-filter]");
    if (!shop) return;
    var grid = shop.querySelector("[data-grid]");
    var count = shop.querySelector("[data-count]");
    var empty = shop.querySelector("[data-empty]");
    var cards = Array.prototype.slice.call(grid.children);
    var selects = shop.querySelectorAll("[data-f]");
    var state = { breed: "all", sex: "all", status: "all", sort: "featured" };
    var params = new URLSearchParams(location.search);
    selects.forEach(function (s) {
      var v = params.get(s.dataset.f);
      if (v && Array.prototype.some.call(s.options, function (o) { return o.value === v; })) { s.value = v; state[s.dataset.f] = v; }
    });
    function apply() {
      var shown = cards.filter(function (c) {
        var ok = (state.breed === "all" || c.dataset.breed === state.breed) && (state.sex === "all" || c.dataset.sex === state.sex) && (state.status === "all" || c.dataset.status === state.status);
        c.hidden = !ok;
        return ok;
      });
      var sorted = cards.slice();
      if (state.sort === "low") sorted.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
      else if (state.sort === "high") sorted.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
      else sorted.sort(function (a, b) { return b.dataset.featured - a.dataset.featured; });
      sorted.forEach(function (c) { grid.appendChild(c); });
      count.textContent = shown.length + (shown.length === 1 ? " puppy" : " puppies");
      empty.hidden = shown.length > 0;
      grid.hidden = shown.length === 0;
    }
    selects.forEach(function (s) { s.addEventListener("change", function () { state[s.dataset.f] = s.value; apply(); }); });
    apply();
  }

  function bindGallery() {
    document.querySelectorAll("[data-gallery]").forEach(function (g) {
      var slides = g.querySelectorAll("[data-slide]");
      var thumbs = g.querySelectorAll("[data-thumb]");
      thumbs.forEach(function (t) {
        t.addEventListener("click", function () {
          slides.forEach(function (s) { s.hidden = s.dataset.slide !== t.dataset.thumb; });
          thumbs.forEach(function (x) { x.setAttribute("aria-pressed", String(x === t)); });
        });
      });
    });
  }

  function bindContact() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = form.querySelector("[data-status]");
    var button = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      button.disabled = true;
      button.textContent = "Sending…";
      status.className = "form-ok";
      status.textContent = "";
      fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (json) {
            if (!res.ok) throw new Error(json.error || "");
          });
        })
        .then(function () {
          status.textContent = "Thanks! We got your message and will reply soon. For the fastest answer, use WhatsApp.";
          form.reset();
        })
        .catch(function (err) {
          status.className = "form-err";
          status.textContent = (err && err.message) || "We couldn't send your message right now. Please message us on WhatsApp.";
        })
        .finally(function () {
          button.disabled = false;
          button.textContent = "Send message";
        });
    });
  }

  /* ================= data loading ================= */
  function loadContent() {
    return fetch("/api/content", { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("api"); return r.json(); })
      .catch(function () {
        // No API (for example a plain static host): use the bundled default content
        return fetch("/data/content.json").then(function (r) { return r.json(); });
      });
  }

  function setMeta(name, value) {
    var el = document.querySelector('meta[name="' + name + '"]');
    if (el && value) el.setAttribute("content", value);
  }

  function renderPage(data) {
    var body = document.body;
    var page = body.dataset.page || "home";
    var id = new URLSearchParams(location.search).get("id") || "";
    var r = createRenderer(data);
    var view = (r.views[page] || r.views.notfound)(id);

    document.querySelector(".site-header").innerHTML = r.header(page);
    document.querySelector(".site-foot").innerHTML = r.footer();
    document.getElementById("main").innerHTML = view.html;
    var float = document.querySelector(".wa-float");
    var w = r.waFloat(view.waMessage);
    float.href = w.href;
    float.innerHTML = w.html;

    document.title = view.fullTitle ? view.title : view.title + " | " + r.site.name;
    setMeta("description", view.description || r.site.description);
    if (view.noindex) {
      var m = document.createElement("meta");
      m.name = "robots"; m.content = "noindex";
      document.head.appendChild(m);
    }

    bindMenu();
    bindFilters();
    bindGallery();
    bindContact();
  }

  function boot() {
    loadContent()
      .then(renderPage)
      .catch(function () {
        var main = document.getElementById("main");
        if (main) main.innerHTML = '<section><div class="wrap"><h1>Sorry, this page couldn\'t load.</h1><p class="muted" style="margin-top:.6rem">Please refresh the page, or message us on WhatsApp.</p></div></section>';
      });
  }

  // Exposed for the page generator and for debugging
  global.PetitePaws = { createRenderer: createRenderer, esc: esc };

  if (typeof document !== "undefined" && document.body && document.body.dataset && !global.PETITE_PAWS_NO_BOOT) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }
})(typeof window !== "undefined" ? window : globalThis);
