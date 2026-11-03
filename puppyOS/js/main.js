/* Petite Paws — site scripts (no dependencies) */
(function () {
  "use strict";

  // Mobile menu
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("main-menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      burger.textContent = open ? "Close" : "Menu";
    });
  }

  // Puppy filters (Available Puppies page)
  var shop = document.querySelector("[data-puppy-filter]");
  if (shop) {
    var grid = shop.querySelector("[data-grid]");
    var count = shop.querySelector("[data-count]");
    var empty = shop.querySelector("[data-empty]");
    var cards = Array.prototype.slice.call(grid.children);
    var selects = shop.querySelectorAll("[data-f]");
    var state = { breed: "all", sex: "all", status: "all", sort: "featured" };

    // Support links like /puppies/?breed=pomeranian
    var params = new URLSearchParams(location.search);
    selects.forEach(function (s) {
      var v = params.get(s.dataset.f);
      if (v && s.querySelector('option[value="' + v.replace(/"/g, "") + '"]')) { s.value = v; state[s.dataset.f] = v; }
    });

    function apply() {
      var shown = cards.filter(function (c) {
        var ok = (state.breed === "all" || c.dataset.breed === state.breed) &&
                 (state.sex === "all" || c.dataset.sex === state.sex) &&
                 (state.status === "all" || c.dataset.status === state.status);
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
    selects.forEach(function (s) {
      s.addEventListener("change", function () { state[s.dataset.f] = s.value; apply(); });
    });
    apply();
  }

  // Puppy photo gallery
  document.querySelectorAll("[data-gallery]").forEach(function (g) {
    var slides = g.querySelectorAll("[data-slide]");
    var thumbs = g.querySelectorAll("[data-thumb]");
    thumbs.forEach(function (t) {
      t.addEventListener("click", function () {
        var i = t.dataset.thumb;
        slides.forEach(function (s) { s.hidden = s.dataset.slide !== i; });
        thumbs.forEach(function (x) { x.setAttribute("aria-pressed", String(x === t)); });
      });
    });
  });

  // Contact form -> /api/contact (Cloudflare Pages Function or Worker)
  var form = document.getElementById("contact-form");
  if (form) {
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
            if (!res.ok) throw new Error(json.error || "We couldn't send your message right now. Please message us on WhatsApp.");
          });
        })
        .then(function () {
          status.textContent = "Thanks! We got your message and will reply soon. For the fastest answer, use WhatsApp.";
          form.reset();
        })
        .catch(function (err) {
          status.className = "form-err";
          status.textContent = err && err.message && err.message.indexOf("Failed to fetch") === -1
            ? err.message
            : "We couldn't send your message right now. Please message us on WhatsApp.";
        })
        .finally(function () {
          button.disabled = false;
          button.textContent = "Send message";
        });
    });
  }
})();
