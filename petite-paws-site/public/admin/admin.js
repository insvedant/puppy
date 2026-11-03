/*
 * Petite Paws — admin panel (plain JavaScript).
 * Talks to the server code in _worker.js through /api/admin/...
 * Pages: #/ (dashboard), #/c/<section>, #/c/<section>/new, #/c/<section>/edit/<id>, #/settings, #/messages
 */
(function () {
  "use strict";

  /* ================= what can be edited ================= */
  var SORT = { name: "sort", label: "Display order", type: "number", help: "Lower numbers show first." };

  var COLLECTIONS = {
    puppies: {
      label: "Puppies", singular: "puppy", titleField: "name", view: function (s) { return "/puppy?id=" + encodeURIComponent(s); },
      columns: [["Breed", function (x, ctx) { return ctx.breedName(x.breed); }], ["Price", function (x, ctx) { return ctx.price(x.price); }], ["Status", function (x) { return x.status; }]],
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "slug", label: "URL name", type: "slug", help: "Used in the web address. Leave empty to create it from the name." },
        { name: "breed", label: "Breed", type: "select", options: "breeds", required: true },
        { name: "sex", label: "Sex", type: "select", options: ["Female", "Male"], required: true },
        { name: "status", label: "Status", type: "select", options: [["available", "Available"], ["reserved", "Reserved"], ["sold", "Sold (moves to Previous Puppies)"]], required: true },
        { name: "price", label: "Price", type: "number", required: true },
        { name: "age", label: "Age", type: "text", placeholder: "12 weeks" },
        { name: "color", label: "Color", type: "text", placeholder: "Orange Sable" },
        { name: "adultWeight", label: "Adult size", type: "text", placeholder: "Est. 4 lb" },
        { name: "vaccinations", label: "Vaccinations", type: "text", placeholder: "Up to date (5-in-1)" },
        { name: "microchip", label: "Microchipped", type: "checkbox" },
        { name: "featured", label: "Featured (shown first on the home page)", type: "checkbox" },
        { name: "images", label: "Photos", type: "images", help: "The first photo is the main one. Without photos, the breed photo is shown." },
        { name: "about", label: "About this puppy", type: "textarea", rows: 5 },
        SORT,
      ],
    },
    breeds: {
      label: "Breeds", singular: "breed", titleField: "name", view: function (s) { return "/breed?id=" + encodeURIComponent(s); },
      columns: [["Weight", function (x) { return x.weight; }]],
      fields: [
        { name: "name", label: "Breed name", type: "text", required: true },
        { name: "slug", label: "URL name", type: "slug", help: "Also links puppies to this breed. Changing it unlinks existing puppies." },
        { name: "blurb", label: "Short description", type: "text", help: "One line shown on breed cards." },
        { name: "description", label: "Full description", type: "textarea", rows: 5 },
        { name: "weight", label: "Adult weight", type: "text", placeholder: "3–7 lb" },
        { name: "lifespan", label: "Lifespan", type: "text", placeholder: "12–16 years" },
        { name: "grooming", label: "Grooming", type: "text" },
        { name: "goodFor", label: "Good for", type: "list", help: "Separate with commas, e.g. Apartments, Families" },
        { name: "image", label: "Breed photo", type: "image", help: "Shown on breed cards, and on any puppy or blog post of this breed without its own photo." },
        { name: "art.bg", label: "Card background color", type: "color" },
        SORT,
      ],
    },
    posts: {
      label: "Blog posts", singular: "blog post", titleField: "title", view: function (s) { return "/post?id=" + encodeURIComponent(s); },
      columns: [["Date", function (x) { return x.date; }]],
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "URL name", type: "slug" },
        { name: "date", label: "Publish date", type: "date", required: true },
        { name: "readTime", label: "Read time", type: "text", placeholder: "5 min" },
        { name: "excerpt", label: "Summary", type: "textarea", rows: 2, help: "Shown on the blog list and in Google results." },
        { name: "cover", label: "Cover image", type: "image" },
        { name: "breed", label: "Breed photo to use if there is no cover image", type: "select", options: "breeds" },
        { name: "body", label: "Article", type: "html", rows: 18 },
      ],
    },
    reviews: {
      label: "Reviews", singular: "review", titleField: "name", autoSlug: true,
      columns: [["Rating", function (x) { return "★".repeat(Number(x.rating) || 5); }], ["Text", function (x) { return String(x.text || "").slice(0, 70) + "…"; }]],
      fields: [
        { name: "name", label: "Customer name", type: "text", required: true },
        { name: "puppy", label: "Label", type: "text", placeholder: "Pomeranian family" },
        { name: "rating", label: "Stars (1–5)", type: "number", min: 1, max: 5, default: 5 },
        { name: "text", label: "Review", type: "textarea", rows: 4, required: true },
        SORT,
      ],
    },
    faqs: {
      label: "FAQs", singular: "question", titleField: "q", autoSlug: true, columns: [],
      fields: [
        { name: "q", label: "Question", type: "text", required: true },
        { name: "a", label: "Answer", type: "textarea", rows: 4, required: true },
        SORT,
      ],
    },
    process: {
      label: "How it works pages", singular: "page", titleField: "title", view: function (s) { return "/process?id=" + encodeURIComponent(s); },
      columns: [["Summary", function (x) { return x.summary; }]],
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "URL name", type: "slug" },
        { name: "summary", label: "Summary", type: "text" },
        { name: "body", label: "Page content", type: "html", rows: 16 },
        SORT,
      ],
    },
    legal: {
      label: "Legal pages", singular: "page", titleField: "title", view: function (s) { return "/legal?id=" + encodeURIComponent(s); },
      columns: [],
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "URL name", type: "slug" },
        { name: "body", label: "Page content", type: "html", rows: 16 },
        SORT,
      ],
    },
  };

  var SETTINGS_FIELDS = [
    { section: "Business" },
    { name: "name", label: "Business name", type: "text", required: true },
    { name: "tagline", label: "Tagline (under the logo)", type: "text" },
    { name: "description", label: "Site description (for Google)", type: "textarea", rows: 2 },
    { name: "foundedYear", label: "Year founded", type: "number" },
    { section: "WhatsApp & contact" },
    { name: "whatsappNumber", label: "WhatsApp number (digits only, with country code)", type: "text", required: true, placeholder: "919876543210", help: "No +, spaces or dashes. This is the number every WhatsApp button opens." },
    { name: "whatsappDisplay", label: "WhatsApp number as shown on the site", type: "text", placeholder: "+91 98765 43210" },
    { name: "whatsappDefaultMessage", label: "Default WhatsApp message", type: "text" },
    { name: "phoneDisplay", label: "Phone", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "hours", label: "Opening hours", type: "pairs", keys: ["days", "time"], help: "One per line: Days | Time, e.g. Mon – Fri | 9:30 AM – 8:00 PM" },
    { section: "Home page" },
    { name: "heroEyebrow", label: "Small heading above the title", type: "text" },
    { name: "heroTitle", label: "Main title", type: "text" },
    { name: "heroText", label: "Intro text", type: "textarea", rows: 3 },
    { name: "heroImage", label: "Hero photo (optional, replaces the Pomeranian photo)", type: "image" },
    { name: "stats", label: "Trust numbers", type: "pairs", keys: ["value", "label"], help: "One per line: Value | Label, e.g. 4.9★ | from 180+ reviews" },
    { section: "About page" },
    { name: "aboutStory", label: "Our story", type: "textarea", rows: 6, help: "Leave a blank line between paragraphs." },
    { section: "Prices" },
    { name: "currency", label: "Currency code", type: "text", placeholder: "USD, INR, CAD, GBP…" },
    { name: "locale", label: "Number format", type: "text", placeholder: "en-US, en-IN…" },
    { section: "Social links" },
    { name: "social.instagram", label: "Instagram URL", type: "text" },
    { name: "social.facebook", label: "Facebook URL", type: "text" },
    { name: "social.youtube", label: "YouTube URL", type: "text" },
  ];

  /* ================= helpers ================= */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  };
  function getPath(o, p) { return p.split(".").reduce(function (a, k) { return a == null ? undefined : a[k]; }, o); }
  function setPath(o, p, v) {
    var ks = p.split("."), cur = o;
    ks.slice(0, -1).forEach(function (k) { if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {}; cur = cur[k]; });
    cur[ks[ks.length - 1]] = v;
  }

  function api(path, opts) {
    opts = opts || {};
    var init = { method: opts.method || "GET", credentials: "same-origin", headers: {} };
    if (opts.body instanceof FormData) init.body = opts.body;
    else if (opts.body !== undefined) { init.body = JSON.stringify(opts.body); init.headers["Content-Type"] = "application/json"; }
    return fetch("/api/admin/" + path, init).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (res.status === 401 && data.loggedOut) { showLogin(); throw new Error(data.error || "Please log in."); }
        if (!res.ok) throw new Error(data.error || "Something went wrong (" + res.status + ").");
        return data;
      });
    });
  }

  var view = $("#view");
  var unread = 0;
  var flashMsg = "";

  function flash(msg) { flashMsg = msg; }
  function takeFlash() {
    var m = flashMsg; flashMsg = "";
    return m ? '<div class="flash ok" role="status">' + esc(m) + "</div>" : "";
  }
  function errorBox(msg) { return '<div class="flash err" role="alert">' + esc(msg) + "</div>"; }

  function renderNav(active) {
    var items = [["#/", "Dashboard", "dashboard"]]
      .concat(Object.keys(COLLECTIONS).map(function (k) { return ["#/c/" + k, COLLECTIONS[k].label, k]; }))
      .concat([["#/messages", "Messages" + (unread ? ' <span class="pill">' + unread + "</span>" : ""), "messages"], ["#/settings", "Site settings", "settings"]]);
    $("#side-nav").innerHTML = items.map(function (i) { return '<a href="' + i[0] + '"' + (i[2] === active ? ' aria-current="page"' : "") + ">" + i[1] + "</a>"; }).join("");
  }

  function makeCtx(breeds, settings) {
    return {
      breeds: breeds || [],
      breedName: function (s) { var b = (breeds || []).find(function (x) { return x.slug === s; }); return b ? b.name : s; },
      price: function (n) {
        try { return new Intl.NumberFormat(settings.locale || "en-US", { style: "currency", currency: settings.currency || "USD", maximumFractionDigits: 0 }).format(Number(n) || 0); }
        catch (e) { return n; }
      },
    };
  }

  /* ================= form fields ================= */
  function fieldHtml(f, item, ctx) {
    if (f.section) return '<h2 class="section">' + esc(f.section) + "</h2>";
    var id = "f-" + f.name.replace(/\./g, "-");
    var v = getPath(item, f.name);
    if (v === undefined || v === null) v = f.default !== undefined ? f.default : "";
    var req = f.required ? " required" : "";
    var help = f.help ? '<small class="help">' + esc(f.help) + "</small>" : "";
    var label = '<label for="' + id + '">' + esc(f.label) + (f.required ? ' <span class="req">*</span>' : "") + "</label>";
    var input;
    switch (f.type) {
      case "textarea":
        input = '<textarea id="' + id + '" name="' + f.name + '" rows="' + (f.rows || 4) + '"' + req + ">" + esc(v) + "</textarea>"; break;
      case "html":
        input = '<textarea id="' + id + '" name="' + f.name + '" rows="' + (f.rows || 12) + '" class="code"' + req + ">" + esc(v) + "</textarea>" +
          '<small class="help">HTML is allowed: &lt;h2&gt;Heading&lt;/h2&gt;, &lt;p&gt;Paragraph&lt;/p&gt;, &lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;, &lt;strong&gt;bold&lt;/strong&gt;, &lt;a href="/contact"&gt;link&lt;/a&gt;</small>' +
          '<button type="button" class="btn small" data-preview="' + id + '">Preview</button><div class="preview prose" data-preview-for="' + id + '" hidden></div>';
        break;
      case "number":
        input = '<input id="' + id + '" name="' + f.name + '" type="number" step="any" value="' + esc(v) + '"' + (f.min !== undefined ? ' min="' + f.min + '"' : "") + (f.max !== undefined ? ' max="' + f.max + '"' : "") + req + ">"; break;
      case "date":
        input = '<input id="' + id + '" name="' + f.name + '" type="date" value="' + esc(v) + '"' + req + ">"; break;
      case "color":
        input = '<input id="' + id + '" name="' + f.name + '" type="color" value="' + esc(v || "#f4ecf3") + '">'; break;
      case "checkbox":
        return '<div class="field check"><input id="' + id + '" name="' + f.name + '" type="checkbox"' + (v ? " checked" : "") + '><label for="' + id + '">' + esc(f.label) + "</label>" + help + "</div>";
      case "select": {
        var opts = f.options === "breeds" ? ctx.breeds.map(function (b) { return [b.slug, b.name]; }) : f.options.map(function (o) { return Array.isArray(o) ? o : [o, o]; });
        input = '<select id="' + id + '" name="' + f.name + '"' + req + ">" + (f.required ? "" : '<option value="">—</option>') +
          opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(v) === String(o[0]) ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select>";
        break;
      }
      case "slug":
        input = '<input id="' + id + '" name="slug" value="' + esc(v) + '" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="created automatically">'; break;
      case "list":
        input = '<input id="' + id + '" name="' + f.name + '" value="' + esc((v || []).join(", ")) + '">'; break;
      case "pairs":
        input = '<textarea id="' + id + '" name="' + f.name + '" rows="' + Math.max(3, (v || []).length + 1) + '">' +
          esc((v || []).map(function (p) { return (p[f.keys[0]] || "") + " | " + (p[f.keys[1]] || ""); }).join("\n")) + "</textarea>";
        break;
      case "image":
        input = '<div class="media" data-media="single"><input id="' + id + '" name="' + f.name + '" value="' + esc(v) + '" placeholder="/media/… or https://…">' +
          '<label class="btn small upload">Upload photo<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden></label><div class="thumbs" data-thumbs></div></div>';
        break;
      case "images":
        input = '<div class="media" data-media="multi"><textarea id="' + id + '" name="' + f.name + '" rows="3" placeholder="One image address per line">' + esc((v || []).join("\n")) + "</textarea>" +
          '<label class="btn small upload">Upload photos<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple hidden></label><div class="thumbs" data-thumbs></div></div>';
        break;
      default:
        input = '<input id="' + id + '" name="' + f.name + '" value="' + esc(v) + '"' + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : "") + req + ">";
    }
    return '<div class="field">' + label + input + (f.type === "html" ? "" : help) + "</div>";
  }

  /** Read form inputs into an object, using the field definitions. */
  function readForm(form, fields, base) {
    var data = JSON.parse(JSON.stringify(base || {}));
    var errors = [];
    fields.forEach(function (f) {
      if (!f.name || f.type === "slug") return;
      var el = form.elements[f.name];
      if (!el) return;
      var raw = el.value, v;
      switch (f.type) {
        case "checkbox": v = el.checked; break;
        case "number":
          v = String(raw).trim() === "" ? (f.default !== undefined ? f.default : 0) : Number(raw);
          if (isNaN(v)) { errors.push(f.label + " must be a number."); v = 0; }
          if (f.min !== undefined && v < f.min) v = f.min;
          if (f.max !== undefined && v > f.max) v = f.max;
          break;
        case "images": v = raw.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean); break;
        case "list": v = raw.split(",").map(function (s) { return s.trim(); }).filter(Boolean); break;
        case "pairs":
          v = raw.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) {
            var parts = l.split("|"), o = {};
            o[f.keys[0]] = parts[0].trim(); o[f.keys[1]] = parts.slice(1).join("|").trim();
            return o;
          });
          break;
        default: v = String(raw).trim();
      }
      if (f.required && (v === "" || (Array.isArray(v) && !v.length))) errors.push(f.label + " is required.");
      setPath(data, f.name, v);
    });
    return { data: data, errors: errors };
  }

  function bindFormExtras(root) {
    // Photo upload fields
    root.querySelectorAll("[data-media]").forEach(function (box) {
      var multi = box.dataset.media === "multi";
      var input = box.querySelector("input:not([type=file]), textarea");
      var file = box.querySelector("input[type=file]");
      var thumbs = box.querySelector("[data-thumbs]");
      var status = document.createElement("div");
      status.className = "status";
      box.appendChild(status);
      function values() { return input.value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean); }
      function setValues(list) { input.value = multi ? list.join("\n") : (list[0] || ""); draw(); }
      function draw() {
        thumbs.innerHTML = "";
        values().forEach(function (src, i, all) {
          var fig = document.createElement("figure");
          var img = document.createElement("img"); img.src = src; img.alt = "";
          var rm = document.createElement("button"); rm.type = "button"; rm.textContent = "×"; rm.setAttribute("aria-label", "Remove photo");
          rm.addEventListener("click", function () { var l = all.slice(); l.splice(i, 1); setValues(l); });
          fig.appendChild(img); fig.appendChild(rm); thumbs.appendChild(fig);
        });
      }
      input.addEventListener("input", draw);
      draw();
      file.addEventListener("change", function () {
        var files = Array.prototype.slice.call(file.files);
        if (!files.length) return;
        var list = multi ? values() : [];
        status.className = "status";
        var i = 0;
        (function next() {
          if (i >= files.length) { status.textContent = "Uploaded. Remember to click Save."; file.value = ""; return; }
          status.textContent = "Uploading " + (i + 1) + " of " + files.length + "…";
          var fd = new FormData(); fd.append("file", files[i]);
          api("upload", { method: "POST", body: fd }).then(function (r) {
            list.push(r.url); setValues(list); i++; next();
          }).catch(function (err) {
            status.className = "status err"; status.textContent = err.message; file.value = "";
          });
        })();
      });
    });
    // HTML preview
    root.querySelectorAll("[data-preview]").forEach(function (btn) {
      var ta = document.getElementById(btn.dataset.preview);
      var box = root.querySelector('[data-preview-for="' + btn.dataset.preview + '"]');
      btn.addEventListener("click", function () {
        if (box.hidden) {
          box.innerHTML = ta.value.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\son\w+="[^"]*"/gi, "");
          box.hidden = false; btn.textContent = "Hide preview";
        } else { box.hidden = true; btn.textContent = "Preview"; }
      });
    });
  }

  /* ================= screens ================= */
  function showDashboard() {
    renderNav("dashboard");
    api("dashboard").then(function (d) {
      unread = d.unread; renderNav("dashboard");
      view.innerHTML = takeFlash() + '<div class="head"><h1>Dashboard</h1><a class="btn primary" href="#/c/puppies/new">+ Add a puppy</a></div>' +
        (d.uploads ? "" : '<div class="flash err">Photo uploads are off: the R2 bucket isn\'t connected (binding name IMAGES). You can still paste image links. See README.</div>') +
        '<div class="stats">' +
        '<a class="stat" href="#/c/puppies"><b>' + d.available + "</b><span>Available puppies</span></a>" +
        '<a class="stat" href="#/c/puppies"><b>' + d.reserved + "</b><span>Reserved</span></a>" +
        '<a class="stat" href="#/messages"><b>' + d.unread + "</b><span>Unread messages</span></a>" +
        '<a class="stat" href="#/c/posts"><b>' + d.counts.posts + "</b><span>Blog posts</span></a></div>" +
        '<h2 class="section">Content</h2><div class="tiles">' +
        Object.keys(COLLECTIONS).map(function (k) { var n = d.counts[k]; return '<a class="tile" href="#/c/' + k + '"><b>' + esc(COLLECTIONS[k].label) + "</b><span>" + n + (n === 1 ? " item" : " items") + "</span></a>"; }).join("") +
        '<a class="tile" href="#/settings"><b>Site settings</b><span>Name, WhatsApp number, hours, home page text</span></a></div>';
    }).catch(showError);
  }

  function showList(key) {
    var c = COLLECTIONS[key];
    renderNav(key);
    api("items?c=" + key).then(function (d) {
      var ctx = makeCtx(d.breeds, d.settings || {});
      view.innerHTML = takeFlash() + '<div class="head"><h1>' + esc(c.label) + '</h1><a class="btn primary" href="#/c/' + key + '/new">+ Add ' + esc(c.singular) + "</a></div>" +
        (d.items.length
          ? '<div class="table-wrap"><table class="list"><thead><tr><th>' + (key === "faqs" ? "Question" : "Name") + "</th>" + c.columns.map(function (col) { return "<th>" + esc(col[0]) + "</th>"; }).join("") + '<th class="actions"><span class="sr-only">Actions</span></th></tr></thead><tbody>' +
            d.items.map(function (x) {
              var edit = "#/c/" + key + "/edit/" + encodeURIComponent(x.slug);
              return '<tr><td><a href="' + edit + '"><b>' + esc(x[c.titleField] || x.slug) + "</b></a>" + (x.featured ? ' <span class="pill">Featured</span>' : "") + "</td>" +
                c.columns.map(function (col) { return "<td>" + esc(col[1](x, ctx)) + "</td>"; }).join("") +
                '<td class="actions"><a class="btn small" href="' + edit + '">Edit</a>' + (c.view ? '<a class="btn small" href="' + c.view(x.slug) + '" target="_blank" rel="noopener">View</a>' : "") +
                '<button class="btn small danger" type="button" data-delete="' + esc(x.slug) + '" data-name="' + esc(x[c.titleField] || x.slug) + '">Delete</button></td></tr>';
            }).join("") + "</tbody></table></div>"
          : '<div class="card empty">Nothing here yet. <a href="#/c/' + key + '/new">Add the first ' + esc(c.singular) + "</a>.</div>");
      view.querySelectorAll("[data-delete]").forEach(function (b) {
        b.addEventListener("click", function () {
          if (!window.confirm("Delete “" + b.dataset.name + "”? This can't be undone.")) return;
          api("delete", { method: "POST", body: { collection: key, slug: b.dataset.delete } }).then(function () { flash("Deleted."); showList(key); }).catch(showError);
        });
      });
    }).catch(showError);
  }

  function showItem(key, slug) {
    var c = COLLECTIONS[key];
    renderNav(key);
    Promise.all([api("items?c=" + key), slug ? api("item?c=" + key + "&slug=" + encodeURIComponent(slug)) : Promise.resolve(null)]).then(function (res) {
      var list = res[0];
      var item = res[1] ? res[1].item : { sort: list.items.length + 1, microchip: true, status: "available", date: new Date().toISOString().slice(0, 10) };
      var ctx = makeCtx(list.breeds, list.settings || {});
      drawItemForm(key, c, item, slug || "", ctx, "");
    }).catch(showError);
  }

  function drawItemForm(key, c, item, oldSlug, ctx, error) {
    var fields = c.autoSlug ? c.fields.filter(function (f) { return f.type !== "slug"; }) : c.fields;
    view.innerHTML = takeFlash() + (error ? errorBox(error) : "") +
      '<div class="head"><h1>' + (oldSlug ? "Edit " + esc(c.singular) + ": " + esc(item[c.titleField] || oldSlug) : "Add " + esc(c.singular)) + "</h1>" +
      (oldSlug && c.view ? '<a class="btn" href="' + c.view(oldSlug) + '" target="_blank" rel="noopener">View on website ↗</a>' : "") + "</div>" +
      '<form class="card form" id="item-form" novalidate>' + fields.map(function (f) { return fieldHtml(f, item, ctx); }).join("") +
      '<div class="form-actions"><button class="btn primary" type="submit">Save</button><a class="btn" href="#/c/' + key + '">Cancel</a></div></form>';
    var form = $("#item-form");
    bindFormExtras(form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = readForm(form, fields, item);
      if (r.errors.length) { drawItemForm(key, c, r.data, oldSlug, ctx, r.errors.join(" ")); window.scrollTo(0, 0); return; }
      var slugInput = form.elements.slug;
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true; btn.textContent = "Saving…";
      api("save", { method: "POST", body: { collection: key, oldSlug: oldSlug, slug: slugInput ? slugInput.value.trim() : oldSlug, data: r.data } })
        .then(function (res) {
          flash("Saved. The website is updated.");
          var target = "#/c/" + key + "/edit/" + encodeURIComponent(res.slug);
          if (location.hash === target) showItem(key, res.slug); else location.hash = target;
        })
        .catch(function (err) { drawItemForm(key, c, r.data, oldSlug, ctx, err.message); window.scrollTo(0, 0); });
    });
  }

  function showSettings(error, draft) {
    renderNav("settings");
    (draft ? Promise.resolve({ settings: draft }) : api("settings")).then(function (d) {
      var s = d.settings;
      view.innerHTML = takeFlash() + (error ? errorBox(error) : "") + '<div class="head"><h1>Site settings</h1></div><form class="card form" id="settings-form" novalidate>' +
        SETTINGS_FIELDS.map(function (f) { return fieldHtml(f, s, makeCtx([], {})); }).join("") +
        '<div class="form-actions"><button class="btn primary" type="submit">Save settings</button></div></form>';
      var form = $("#settings-form");
      bindFormExtras(form);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var r = readForm(form, SETTINGS_FIELDS, s);
        if (r.errors.length) { showSettings(r.errors.join(" "), r.data); return; }
        api("settings", { method: "POST", body: { data: r.data } }).then(function () { flash("Saved. The website is updated."); showSettings(); window.scrollTo(0, 0); })
          .catch(function (err) { showSettings(err.message, r.data); });
      });
    }).catch(showError);
  }

  function showMessages() {
    renderNav("messages");
    api("messages").then(function (d) {
      unread = d.messages.filter(function (m) { return !m.is_read; }).length;
      renderNav("messages");
      view.innerHTML = takeFlash() + '<div class="head"><h1>Messages</h1></div><p class="muted">Messages sent through the contact form on the website.</p>' +
        (d.messages.length ? '<div class="msgs">' + d.messages.map(function (m) {
          var phone = String(m.phone || "").replace(/\D/g, "");
          return '<article class="msg card' + (m.is_read ? "" : " unread") + '"><header><b>' + esc(m.name) + '</b> <span class="muted">' + esc(m.created_at) + " UTC</span>" + (m.is_read ? "" : ' <span class="pill">New</span>') + "</header>" +
            '<p class="meta"><a href="mailto:' + esc(m.email) + '">' + esc(m.email) + "</a>" + (m.phone ? " · " + esc(m.phone) : "") + (m.interest ? " · Interested in: " + esc(m.interest) : "") + "</p>" +
            '<p class="body">' + esc(m.message).replace(/\n/g, "<br>") + '</p><div class="row">' +
            (phone ? '<a class="btn small wa" href="https://wa.me/' + phone + '" target="_blank" rel="noopener">Reply on WhatsApp</a>' : "") +
            '<a class="btn small" href="mailto:' + esc(m.email) + "?subject=" + encodeURIComponent("Re: your enquiry") + '">Reply by email</a>' +
            '<button class="btn small" type="button" data-mark="' + m.id + '" data-to="' + (m.is_read ? "unread" : "read") + '">' + (m.is_read ? "Mark unread" : "Mark read") + "</button>" +
            '<button class="btn small danger" type="button" data-del="' + m.id + '">Delete</button></div></article>';
        }).join("") + "</div>" : '<div class="card empty">No messages yet.</div>');
      view.querySelectorAll("[data-mark]").forEach(function (b) {
        b.addEventListener("click", function () { api("messages", { method: "POST", body: { id: b.dataset.mark, action: b.dataset.to } }).then(showMessages).catch(showError); });
      });
      view.querySelectorAll("[data-del]").forEach(function (b) {
        b.addEventListener("click", function () {
          if (!window.confirm("Delete this message?")) return;
          api("messages", { method: "POST", body: { id: b.dataset.del, action: "delete" } }).then(function () { flash("Deleted."); showMessages(); }).catch(showError);
        });
      });
    }).catch(showError);
  }

  function showError(err) {
    if (!err || /log in/i.test(err.message)) return;
    view.innerHTML = errorBox(err.message) + '<p><a href="#/">Back to the dashboard</a></p>';
  }

  /* ================= routing & login ================= */
  function route() {
    var h = location.hash.replace(/^#/, "") || "/";
    var m;
    if (h === "/") return showDashboard();
    if (h === "/settings") return showSettings();
    if (h === "/messages") return showMessages();
    if ((m = h.match(/^\/c\/([a-z]+)$/)) && COLLECTIONS[m[1]]) return showList(m[1]);
    if ((m = h.match(/^\/c\/([a-z]+)\/new$/)) && COLLECTIONS[m[1]]) return showItem(m[1], null);
    if ((m = h.match(/^\/c\/([a-z]+)\/edit\/(.+)$/)) && COLLECTIONS[m[1]]) return showItem(m[1], decodeURIComponent(m[2]));
    view.innerHTML = '<h1>Page not found</h1><p><a href="#/">Back to the dashboard</a></p>';
  }

  function showLogin(message) {
    $("#app").hidden = true;
    $("#offline").hidden = true;
    $("#login-screen").hidden = false;
    var e = $("#login-error");
    e.hidden = !message; e.textContent = message || "";
    $("#p").focus();
  }

  function showApp() {
    $("#login-screen").hidden = true;
    $("#offline").hidden = true;
    $("#app").hidden = false;
    route();
  }

  $("#login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = e.target.querySelector("button");
    btn.disabled = true; btn.textContent = "Logging in…";
    api("login", { method: "POST", body: { username: $("#u").value, password: $("#p").value } })
      .then(function () { $("#p").value = ""; showApp(); })
      .catch(function (err) { showLogin(err.message); })
      .finally(function () { btn.disabled = false; btn.textContent = "Log in"; });
  });

  $("#logout").addEventListener("click", function () {
    api("logout", { method: "POST" }).finally(function () { location.hash = "#/"; showLogin(); });
  });

  window.addEventListener("hashchange", function () { if (!$("#app").hidden) route(); });

  // Start
  fetch("/api/admin/me", { credentials: "same-origin" })
    .then(function (r) { if (!r.ok) throw new Error("offline"); return r.json(); })
    .then(function (me) {
      if (!me.configured) showLogin("The admin password isn't set yet. In Cloudflare, add a secret named ADMIN_PASSWORD (Settings → Variables and Secrets), then redeploy.");
      else if (me.loggedIn) showApp();
      else showLogin();
    })
    .catch(function () { $("#offline").hidden = false; });
})();
