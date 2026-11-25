/* Learn to Read Academy — page behaviour */
(function () {
  var I = window.LTR_I18N;
  var C = window.LTR_CONFIG || {};
  var t = function (k, en) { return I && I.current !== "en" ? I.t(k, en) : en; };

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var drawer = document.getElementById("drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      var open = drawer.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) { drawer.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- Language picker ---------- */
  document.querySelectorAll("[data-lang-picker]").forEach(function (picker) {
    var btn = picker.querySelector(".lang-btn");
    var menu = picker.querySelector(".lang-menu");
    I.langs.forEach(function (l) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "menuitem");
      b.setAttribute("lang", l.code);
      b.dataset.code = l.code;
      b.innerHTML = "<span></span><span class='code'></span>";
      b.firstChild.textContent = l.name;
      b.lastChild.textContent = l.short;
      b.addEventListener("click", function () {
        I.set(l.code, true);
        close();
        btn.focus();
      });
      li.appendChild(b);
      menu.appendChild(li);
    });
    function mark() {
      menu.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-current", b.dataset.code === I.current); });
    }
    function close() { picker.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = picker.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      mark();
      if (open) { var cur = menu.querySelector("[aria-current=true]"); if (cur) cur.focus(); }
    });
    document.addEventListener("click", function (e) { if (!picker.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    document.addEventListener("ltr:lang", mark);
  });

  /* ---------- Reviews: show more ---------- */
  var more = document.getElementById("moreReviews");
  var grid = document.getElementById("reviewsGrid");
  if (more && grid) {
    more.addEventListener("click", function () {
      var all = grid.classList.toggle("show-all");
      more.setAttribute("aria-expanded", all);
      more.textContent = all ? t("reviews.less", "Show fewer reviews") : t("reviews.more", "Show more reviews");
      if (!all) document.getElementById("reviews").scrollIntoView();
    });
    document.addEventListener("ltr:lang", function () {
      var all = grid.classList.contains("show-all");
      more.textContent = all ? t("reviews.less", "Show fewer reviews") : t("reviews.more", "Show more reviews");
    });
  }

  /* ---------- FAQ: one open at a time ---------- */
  document.querySelectorAll(".faq-list").forEach(function (list) {
    list.addEventListener("toggle", function (e) {
      if (!e.target.open) return;
      list.querySelectorAll("details[open]").forEach(function (d) { if (d !== e.target) d.open = false; });
    }, true);
  });

  /* ---------- Video (Tolstoy) ---------- */
  /* Tolstoy shows Jessie's video as a floating bubble. Clicking our play button
     clicks that bubble (never its little ✕ dismiss button), which opens the video. */
  function openVideo() {
    var el = document.querySelector("tolstoy-widget, [id^='tolstoy-widget']");
    if (el) {
      var root = el.shadowRoot || el;
      var bubble = root.querySelector(".migration-bubble, [class*='bubble']:not([class*='dismiss']):not([class*='anchor']):not([class*='root'])");
      if (bubble) { bubble.click(); return true; }
    }
    var w = window.tolstoyWidget;
    try { if (w && typeof w.show === "function") w.show(); } catch (e) {}
    try { if (w && typeof w.start === "function") { w.start(); return true; } } catch (e) {}
    return false;
  }
  var vslButtons = document.querySelectorAll("[data-vsl]");
  vslButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      if (!openVideo()) setTimeout(openVideo, 800); // widget may still be loading
    });
  });
  // If Tolstoy never shows up (e.g. blocked, or the domain isn't enabled in Tolstoy yet),
  // turn the play button into a plain photo so it doesn't look broken.
  setTimeout(function () {
    if (document.querySelector("tolstoy-widget, [id^='tolstoy-widget']")) return;
    vslButtons.forEach(function (b) { b.classList.add("no-video"); b.setAttribute("tabindex", "-1"); b.setAttribute("aria-hidden", "true"); });
  }, 8000);

  /* ---------- Chat bubble (WhatsApp / Messenger / iMessage) ---------- */
  var icons = {
    wa: '<svg viewBox="0 0 448 512" aria-hidden="true"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.4 2.4-11.2 2.5-2.5 5.5-6.4 8.3-9.6 2.8-3.2 3.7-5.5 5.5-9.3 1.9-3.7 1-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>',
    ms: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0084FF" d="M12 2.04c-5.5 0-10 4.14-10 9.22 0 2.9 1.46 5.5 3.75 7.15V22l3.41-1.87c.92.26 1.89.41 2.84.41 5.5 0 10-4.14 10-9.22s-4.5-9.28-10-9.28zm1.09 12.31l-2.58-2.75-5.05 2.75 5.55-5.89 2.63 2.75 5-2.75-5.55 5.89z"/></svg>',
    sms: '<svg viewBox="0 0 512 512" aria-hidden="true"><path fill="#34C759" d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.6c-2.9 3.1-3.1 7.8-1.1 11.4 2.1 3.6 5.9 5.8 10 5.8 51.1 0 91.5-22.1 118.8-39.9 38 18.2 80 28.5 121.8 28.5 141.4 0 256-93.1 256-208S397.4 32 256 32z"/></svg>'
  };
  var chat = document.createElement("div");
  chat.className = "chat";
  chat.innerHTML =
    '<span class="chat-hint" data-i18n="chat.hint">Hi, how can I help?</span>' +
    '<div class="chat-card" id="chatCard" role="dialog" aria-label="Message us">' +
      '<header><img src="' + (I.assets || "/assets/") + 'img/logo.webp" alt="" width="42" height="42"><div><b data-i18n="chat.support">Support</b><span data-i18n="chat.online">Online</span></div></header>' +
      '<div class="chat-body">' +
        '<div class="chat-msg" data-i18n="chat.hello">Hi there! 👋 How can I help you today?</div>' +
        '<div class="chat-msg"><span data-i18n="chat.pick">Please select a platform to chat with us:</span>' +
          '<div class="chat-opts">' +
            '<a href="' + (C.whatsapp || "#") + '" target="_blank" rel="noopener"><span style="color:#25D366;fill:#25D366">' + icons.wa + '</span>WhatsApp</a>' +
            '<a href="' + (C.messenger || "#") + '" target="_blank" rel="noopener">' + icons.ms + 'Messenger</a>' +
            '<a href="' + (C.sms || "#") + '">' + icons.sms + '<span data-i18n="talk.sms">iMessage / SMS</span></a>' +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>" +
    '<button class="chat-trigger" type="button" aria-expanded="false" aria-controls="chatCard" data-i18n-label="chat.open" aria-label="Message us">' +
      '<span class="chat-dot"></span>' + icons.wa.replace("<svg", '<svg class="wa"') + '<span class="x" aria-hidden="true">×</span>' +
    "</button>";
  document.body.appendChild(chat);
  var trig = chat.querySelector(".chat-trigger");
  trig.addEventListener("click", function () {
    var open = chat.classList.toggle("open");
    chat.classList.add("seen");
    trig.setAttribute("aria-expanded", open);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && chat.classList.contains("open")) { chat.classList.remove("open"); trig.setAttribute("aria-expanded", "false"); }
  });
  // Translate the chat now that it exists
  if (I && I.current !== "en") I.set(I.current, false);

  /* ---------- Newsletter ---------- */
  var news = document.getElementById("newsletter");
  var form = document.getElementById("newsletterForm");
  if (news && form && C.newsletterEndpoint) {
    news.hidden = false;
    var msg = news.querySelector(".msg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = t("news.invalid", "Please enter a valid email address");
        return;
      }
      var fd = new FormData();
      fd.append(C.newsletterField || "email", email);
      fetch(C.newsletterEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" }, mode: /mailchimp|list-manage/.test(C.newsletterEndpoint) ? "no-cors" : "cors" })
        .then(function () { msg.textContent = t("news.thanks", "Thank you! 💝"); form.reset(); })
        .catch(function () { msg.textContent = t("news.error", "Oops, something went wrong. Please try again."); });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
