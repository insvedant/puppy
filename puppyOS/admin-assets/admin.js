/* Admin panel helpers: confirm deletes, photo uploads with previews, HTML preview. */
(function () {
  "use strict";

  // Confirm before deleting
  document.querySelectorAll("form[data-confirm]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      if (!window.confirm(f.dataset.confirm)) e.preventDefault();
    });
  });

  // Photo fields
  document.querySelectorAll("[data-media]").forEach(function (box) {
    var multi = box.dataset.media === "multi";
    var input = box.querySelector("input:not([type=file]), textarea");
    var file = box.querySelector("input[type=file]");
    var thumbs = box.querySelector("[data-thumbs]");
    var status = document.createElement("div");
    status.className = "status";
    box.appendChild(status);

    function values() {
      return input.value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    }
    function setValues(list) {
      input.value = multi ? list.join("\n") : (list[0] || "");
      draw();
    }
    function draw() {
      thumbs.innerHTML = "";
      values().forEach(function (src, i, all) {
        var fig = document.createElement("figure");
        var img = document.createElement("img");
        img.src = src; img.alt = "";
        var rm = document.createElement("button");
        rm.type = "button"; rm.textContent = "×"; rm.setAttribute("aria-label", "Remove photo");
        rm.addEventListener("click", function () { var l = all.slice(); l.splice(i, 1); setValues(l); });
        fig.appendChild(img); fig.appendChild(rm); thumbs.appendChild(fig);
      });
    }
    input.addEventListener("input", draw);
    draw();

    file.addEventListener("change", async function () {
      var files = Array.prototype.slice.call(file.files);
      if (!files.length) return;
      status.className = "status";
      var list = multi ? values() : [];
      for (var i = 0; i < files.length; i++) {
        status.textContent = "Uploading " + (i + 1) + " of " + files.length + "…";
        var fd = new FormData();
        fd.append("file", files[i]);
        try {
          var res = await fetch("/admin/upload", { method: "POST", body: fd, credentials: "same-origin" });
          var json = await res.json();
          if (!res.ok) throw new Error(json.error || "Upload failed.");
          list.push(json.url);
          setValues(list);
        } catch (err) {
          status.className = "status err";
          status.textContent = err.message;
          file.value = "";
          return;
        }
      }
      status.textContent = "Uploaded. Remember to click Save.";
      file.value = "";
    });
  });

  // HTML preview
  document.querySelectorAll("[data-preview]").forEach(function (btn) {
    var ta = document.getElementById(btn.dataset.preview);
    var box = document.querySelector('[data-preview-for="' + btn.dataset.preview + '"]');
    btn.addEventListener("click", function () {
      if (box.hidden) {
        // Preview of the admin's own content, shown only to the admin. Scripts are stripped.
        box.innerHTML = ta.value.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\son\w+="[^"]*"/gi, "");
        box.hidden = false; btn.textContent = "Hide preview";
      } else {
        box.hidden = true; btn.textContent = "Preview";
      }
    });
  });
})();
