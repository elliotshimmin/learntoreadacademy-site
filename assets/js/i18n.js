/* Learn to Read Academy — translations engine.
   English lives in the HTML. Other languages live in /assets/js/i18n/<code>.js
   and are only downloaded when someone picks that language.

   How a language is chosen (first match wins):
     1. ?lang=es in the URL (handy for links in Jessie's bio, e.g. learntoreadacademy.com/?lang=ar)
     2. the visitor's earlier choice (remembered in this browser)
     3. the browser's own language, if we support it
     4. English
*/
(function () {
  var LANGS = [
    { code: "en", name: "English", short: "EN" },
    { code: "es", name: "Español", short: "ES" },
    { code: "pt", name: "Português", short: "PT" },
    { code: "fr", name: "Français", short: "FR" },
    { code: "de", name: "Deutsch", short: "DE" },
    { code: "it", name: "Italiano", short: "IT" },
    { code: "tr", name: "Türkçe", short: "TR" },
    { code: "id", name: "Bahasa Indonesia", short: "ID" },
    { code: "vi", name: "Tiếng Việt", short: "VI" },
    { code: "ru", name: "Русский", short: "RU", font: "Noto+Sans:wght@300;400;500;600" },
    { code: "ar", name: "العربية", short: "AR", dir: "rtl", font: "Noto+Sans+Arabic:wght@300;400;500;600" },
    { code: "ur", name: "اردو", short: "UR", dir: "rtl", font: "Noto+Nastaliq+Urdu:wght@400;500;600" },
    { code: "hi", name: "हिन्दी", short: "HI", font: "Noto+Sans+Devanagari:wght@300;400;500;600" },
    { code: "bn", name: "বাংলা", short: "BN", font: "Noto+Sans+Bengali:wght@300;400;500;600" },
    { code: "th", name: "ไทย", short: "TH", font: "Noto+Sans+Thai:wght@300;400;500;600" },
    { code: "zh-Hans", name: "简体中文", short: "简", font: "Noto+Sans+SC:wght@300;400;500;600" },
    { code: "zh-Hant", name: "繁體中文", short: "繁", font: "Noto+Sans+TC:wght@300;400;500;600" },
    { code: "ja", name: "日本語", short: "JA", font: "Noto+Sans+JP:wght@300;400;500;600" },
    { code: "ko", name: "한국어", short: "KO", font: "Noto+Sans+KR:wght@300;400;500;600" }
  ];
  var STORE_KEY = "ltr-lang";
  // Folder that holds assets/, worked out from this script's own address (works on any domain or sub-folder)
  var ASSETS = ((document.currentScript && document.currentScript.src) || "/assets/js/i18n.js").replace(/js\/i18n\.js(\?.*)?$/, "");
  var html = document.documentElement;
  var I = (window.LTR_I18N = { langs: LANGS, dict: {}, current: "en", assets: ASSETS });

  function find(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return null;
  }
  function match(tag) {
    if (!tag) return null;
    tag = String(tag).toLowerCase();
    if (tag.indexOf("zh") === 0) return /hant|-tw|-hk|-mo/.test(tag) ? "zh-Hant" : "zh-Hans";
    var base = tag.split("-")[0];
    return find(base) ? base : null;
  }
  function stored() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function remember(code) {
    try { localStorage.setItem(STORE_KEY, code); } catch (e) {}
  }

  function choose() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
    if (q === "zh") q = "zh-Hans";
    if (q && (find(q) || match(q))) return find(q) ? q : match(q);
    var s = stored();
    if (s && find(s)) return s;
    var list = navigator.languages || [navigator.language];
    for (var i = 0; i < list.length; i++) {
      var m = match(list[i]);
      if (m) return m;
      if (/^en/i.test(list[i])) return "en";
    }
    return "en";
  }

  function loadFont(lang) {
    if (!lang.font || document.getElementById("font-" + lang.code)) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.id = "font-" + lang.code;
    l.href = "https://fonts.googleapis.com/css2?family=" + lang.font + "&display=swap";
    document.head.appendChild(l);
  }

  function loadDict(code, cb) {
    if (code === "en" || I.dict[code]) return cb();
    var s = document.createElement("script");
    s.src = ASSETS + "js/i18n/" + code + ".js";
    s.onload = function () { cb(I.dict[code] ? null : new Error("empty")); };
    s.onerror = function () { cb(new Error("missing")); };
    document.head.appendChild(s);
  }

  I.register = function (code, d) { I.dict[code] = d; };

  I.t = function (key, fallback) {
    var d = I.dict[I.current];
    return (d && d[key]) || fallback || "";
  };

  function applyAll() {
    var d = I.current === "en" ? null : I.dict[I.current];
    function each(attr, fn) {
      var els = document.querySelectorAll("[" + attr + "]");
      for (var i = 0; i < els.length; i++) fn(els[i], els[i].getAttribute(attr));
    }
    each("data-i18n", function (el, k) {
      if (el.__en == null) el.__en = el.textContent;
      el.textContent = (d && d[k]) || el.__en;
    });
    each("data-i18n-html", function (el, k) {
      if (el.__en == null) el.__en = el.innerHTML;
      el.innerHTML = (d && d[k]) || el.__en;
    });
    each("data-i18n-placeholder", function (el, k) {
      if (el.__en == null) el.__en = el.getAttribute("placeholder");
      el.setAttribute("placeholder", (d && d[k]) || el.__en);
    });
    each("data-i18n-label", function (el, k) {
      if (el.__en == null) el.__en = el.getAttribute("aria-label");
      el.setAttribute("aria-label", (d && d[k]) || el.__en);
    });
    var titleKey = html.getAttribute("data-title-key") || "meta.title";
    if (I.__enTitle == null) I.__enTitle = document.title;
    document.title = (d && d[titleKey]) || I.__enTitle;

    var cur = document.querySelectorAll("[data-lang-current]");
    var lang = find(I.current);
    for (var j = 0; j < cur.length; j++) cur[j].textContent = lang.short;
    var note = document.querySelector(".reviews-note");
    if (note) note.hidden = I.current === "en";
    document.dispatchEvent(new CustomEvent("ltr:lang", { detail: I.current }));
  }

  I.set = function (code, save) {
    var lang = find(code) || find("en");
    if (save) remember(lang.code);
    html.lang = lang.code;
    html.dir = lang.dir || "ltr";
    loadFont(lang);
    loadDict(lang.code, function (err) {
      I.current = err ? "en" : lang.code;
      if (err) { html.lang = "en"; html.dir = "ltr"; }
      var run = function () { applyAll(); html.classList.remove("i18n-loading"); };
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
      else run();
    });
  };

  // Decide straight away so the page never flashes the wrong direction.
  var first = choose();
  if (first !== "en") {
    html.classList.add("i18n-loading");
    setTimeout(function () { html.classList.remove("i18n-loading"); }, 2500); // never leave the page hidden
  }
  I.set(first, false);
})();
