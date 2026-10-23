/* ==========================================================================
   script.js — вся логика шаблона свадебного приглашения
   --------------------------------------------------------------------------
   Редактировать этот файл НЕ нужно: все данные берутся из data.js
   (объект weddingConfig). Данные → эта логика → готовый сайт.
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.weddingConfig || {};

  /* короткие помощники */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function text(key) { return cfg[key] == null ? "" : String(cfg[key]); }

  /* русский плюрализатор: plural(5, "день", "дня", "дней") → "дней" */
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  /* ======================================================================
     1. INLINE SVG-ИКОНКИ (никаких иконных библиотек)
     ====================================================================== */
  var ICONS = {
    "rings": '<path d="M8.6 3.8 10 6.2H7.2Z"/><circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/>',
    "glass": '<path d="M7 3h10c0 4.6-2.2 7-5 7s-5-2.4-5-7Z"/><path d="M12 10v8"/><path d="M8 21h8"/><circle cx="10.3" cy="5.9" r=".8"/><circle cx="13.7" cy="5" r=".6"/>',
    "church": '<path d="M12 2.5v3"/><path d="M10.7 4h2.6"/><path d="M5 21v-8.5l7-5 7 5V21"/><path d="M3.5 21h17"/><path d="M10.2 21v-4.2a1.8 1.8 0 0 1 3.6 0V21"/>',
    "camera": '<rect x="3" y="7" width="18" height="13" rx="2.5"/><circle cx="12" cy="13.2" r="3.6"/><path d="M8.4 7l1.4-2.5h4.4L15.6 7"/>',
    "dinner": '<path d="M5 16a7 7 0 0 1 14 0"/><path d="M3.5 16h17"/><path d="M12 9V7.8"/><circle cx="12" cy="6.6" r=".9"/><path d="M4.5 20h15"/>',
    "cake": '<path d="M4 20.5h16"/><rect x="5" y="13.5" width="14" height="6.5" rx="1.2"/><rect x="7.5" y="8.5" width="9" height="5" rx="1.2"/><path d="M12 8.5V5.2"/><path d="M12 5.2c.8-.9.8-2 0-3-.8 1-.8 2.1 0 3Z"/>',
    "music": '<path d="M9 18.2V6.2l11-2.3v12"/><circle cx="6.6" cy="18.2" r="2.4"/><circle cx="17.6" cy="15.9" r="2.4"/>',
    "sparkles": '<path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.5l-1.8-5.9L4.5 10.8 10.2 9Z"/><path d="M18.8 3v2.6M17.5 4.3h2.6"/>',
    "heart": '<path d="M12 20.2s-7.9-4.8-9.8-9.4C.9 7.6 3 4.3 6.3 4.3c2 0 3.6 1.1 4.4 2.7h2.6c.8-1.6 2.4-2.7 4.4-2.7 3.3 0 5.4 3.3 4.1 6.5-1.9 4.6-9.8 9.4-9.8 9.4Z"/>',
    "dress": '<circle cx="12" cy="4.4" r="1.7"/><path d="M12 6.1v1.7"/><path d="M12 7.8 20.4 13.8c1 .8.5 2.4-.8 2.4H4.4c-1.3 0-1.8-1.6-.8-2.4Z"/>',
    "bus": '<rect x="4" y="3.5" width="16" height="13.5" rx="2.5"/><path d="M4 10.5h16"/><path d="M7.5 6.8h9"/><circle cx="8" cy="19.4" r="1.6"/><circle cx="16" cy="19.4" r="1.6"/>',
    "pin": '<path d="M12 21s-6.6-5.5-6.6-10.2a6.6 6.6 0 0 1 13.2 0C18.6 15.5 12 21 12 21Z"/><circle cx="12" cy="10.6" r="2.1"/>',
    "calendar": '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17"/><path d="M8 3v4M16 3v4"/><path d="m10 15.2 1.7 1.7 3.2-3.4"/>',
    "send": '<path d="M21 3.5 3.9 10.4c-.9.4-.9 1.7.1 2l6.7 2.4 2.4 6.7c.3.9 1.6 1 2 .1Z"/><path d="M21 3.5 10.7 14.8"/>',
    "phone": '<path d="M5.6 3.5h2.9L10.2 8l-1.9 1.6a13.2 13.2 0 0 0 6.1 6.1L16 13.8l4.5 1.7v2.9a2 2 0 0 1-2.2 2A17.3 17.3 0 0 1 3.6 5.7a2 2 0 0 1 2-2.2Z"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.6 7.2 8.4 5.9 8.4-5.9"/>',
    "message": '<path d="M21 11.7a8.4 8.4 0 0 1-12.3 7.4L3 20.6l1.5-5.5A8.4 8.4 0 1 1 21 11.7Z"/>',
    "gift": '<rect x="3.5" y="8.5" width="17" height="4"/><rect x="5" y="12.5" width="14" height="8.5" rx="1"/><path d="M12 8.5V21"/><path d="M12 8.5s-4.8.3-5.8-2.1C5.5 4.6 8.6 3.2 10 4.9c1.1 1.3 2 3.6 2 3.6Zm0 0s4.8.3 5.8-2.1c.7-1.8-2.4-3.2-3.8-1.5-1.1 1.3-2 3.6-2 3.6Z"/>',
    "check": '<path d="m4.5 12.5 5 5 10-11"/>',
    "x": '<path d="M6 6l12 12M18 6 6 18"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "chevron-down": '<path d="m5 9 7 7 7-7"/>',
    "chevron-left": '<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',
    "chevron-right": '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>'
  };

  function icon(name) {
    return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.heart) + "</svg>";
  }

  /* вставляем иконки во все слоты [data-icon] */
  $$("[data-icon]").forEach(function (el) { el.innerHTML = icon(el.getAttribute("data-icon")); });

  /* ======================================================================
     2. ТЕМА И ЦВЕТА
     ====================================================================== */
  document.documentElement.lang = cfg.language || "ru";
  document.body.setAttribute("data-theme", cfg.theme || "lace");

  /* ручная палитра — только если useThemeColors: false */
  if (cfg.useThemeColors === false) {
    var root = document.documentElement.style;
    if (cfg.accentColor) { root.setProperty("--accent", cfg.accentColor); root.setProperty("--accent-2", cfg.accentColor); root.setProperty("--border-strong", cfg.accentColor); root.setProperty("--gold-grad", "linear-gradient(120deg," + cfg.accentColor + "," + cfg.accentColor + ")"); }
    if (cfg.bgColor) { root.setProperty("--bg", cfg.bgColor); root.setProperty("--bg-alt", cfg.bgColor); root.setProperty("--surface", cfg.bgColor); }
    if (cfg.textColor) root.setProperty("--text", cfg.textColor);
    if (cfg.mutedColor) root.setProperty("--muted", cfg.mutedColor);
    if (cfg.borderColor) root.setProperty("--border", cfg.borderColor);
  }

  /* ======================================================================
     3. ПРИВЯЗКА ТЕКСТОВ  [data-bind="ключ"]
     ====================================================================== */
  $$("[data-bind]").forEach(function (el) {
    var v = cfg[el.getAttribute("data-bind")];
    if (v != null) el.textContent = v;
  });

  /* орнамент в разделителях секций */
  $$("[data-divider]").forEach(function (el) {
    el.innerHTML = '<span class="divider-char">' + (cfg.ornament || "❦") + "</span>";
  });

  /* ======================================================================
     4. SEO / META из конфига
     ====================================================================== */
  if (cfg.siteTitle) document.title = cfg.siteTitle;
  function setMeta(sel, attr, val) { var m = $(sel); if (m && val) m.setAttribute(attr, val); }
  setMeta('meta[name="description"]', "content", cfg.siteDescription);
  setMeta('meta[property="og:title"]', "content", cfg.siteTitle);
  setMeta('meta[property="og:description"]', "content", cfg.siteDescription);
  setMeta('meta[property="og:image"]', "content", cfg.ogImageUrl);
  setMeta('meta[name="theme-color"]', "content", cfg.accentColor);

  /* ======================================================================
     5. HERO: фон, дата, город
     ====================================================================== */
  var hero = $("#hero"), heroBg = $("#heroBg");
  var bgMode = cfg.heroBackground || "gradient";
  hero.classList.add("bg-" + bgMode);
  if (bgMode === "photo" && cfg.heroPhotoUrl) {
    heroBg.style.backgroundImage = 'url("' + cfg.heroPhotoUrl + '")';
  } else if (bgMode === "photo") {
    /* фото не задано — мягкий fallback на градиент */
    hero.classList.remove("bg-photo");
    hero.classList.add("bg-gradient");
  }

  try {
    var dObj = new Date(cfg.weddingDate + "T00:00:00");
    if (!isNaN(dObj)) {
      var dd = ("0" + dObj.getDate()).slice(-2), mm = ("0" + (dObj.getMonth() + 1)).slice(-2);
      $("#heroDate").textContent = dd + " · " + mm + " · " + dObj.getFullYear();
    }
  } catch (e) { /* дата остаётся из разметки */ }
  if (cfg.city) $("#heroCity").textContent = cfg.city;

  /* ======================================================================
     6. ВКЛЮЧЕНИЕ/ВЫКЛЮЧЕНИЕ СЕКЦИЙ + очистка навигации
     ====================================================================== */
  $$("[data-flag]").forEach(function (sec) {
    if (cfg[sec.getAttribute("data-flag")] === false) sec.remove();
  });
  $$("[data-nav]").forEach(function (link) {
    if (!document.getElementById(link.getAttribute("data-nav"))) link.remove();
  });

  /* стрелка в hero ведёт на первую существующую секцию после hero */
  var firstSection = $("main .section");
  if (firstSection && $("#heroArrow")) $("#heroArrow").setAttribute("href", "#" + firstSection.id);

  /* ======================================================================
     7. НАША ИСТОРИЯ
     ====================================================================== */
  $("#storyPhoto").src = cfg.storyPhotoUrl || "";
  $("#storyPhoto").alt = (cfg.brideName || "") + " и " + (cfg.groomName || "");
  $("#storyBody").innerHTML = text("story")
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(function (p) { return "<p>" + p.trim().replace(/\n/g, "<br>") + "</p>"; })
    .join("");

  /* ======================================================================
     8. TIMELINE — ПРОГРАММА ДНЯ
     ====================================================================== */
  var tlList = $("#timelineList");
  if (tlList) {
    tlList.innerHTML = (cfg.timeline || []).map(function (item) {
      return '<li class="tl-item reveal">' +
        '<span class="tl-dot" aria-hidden="true"></span>' +
        '<div class="tl-card"><div class="tl-top">' +
        '<span class="tl-icon">' + icon(item.icon) + "</span>" +
        '<span class="tl-time">' + item.time + "</span></div>" +
        "<h3>" + item.title + "</h3><p>" + item.text + "</p></div></li>";
    }).join("");
  }

  /* ======================================================================
     9. ДЕТАЛИ: палитра дресс-кода и телефон организатора
     ====================================================================== */
  $("#dressPalette").innerHTML = (cfg.dressCodePalette || [])
    .map(function (c) { return '<i style="background:' + c + '" title="' + c + '"></i>'; })
    .join("");
  var orgLink = $("#organizerLink");
  if (orgLink) orgLink.href = "tel:" + text("organizerPhone").replace(/[^+\d]/g, "");

  /* ======================================================================
     10. КАРТА
     ====================================================================== */
  if ($("#mapIframe")) {
    $("#mapIframe").src = cfg.yandexMapEmbed || "";
    $("#yandexBtn").href = cfg.yandexMapsUrl || "#";
    $("#googleBtn").href = cfg.googleMapsUrl || "#";
  }

  /* ======================================================================
     11. ГАЛЕРЕЯ + LIGHTBOX
     ====================================================================== */
  var photos = Array.isArray(cfg.galleryPhotos) ? cfg.galleryPhotos.filter(Boolean) : [];
  var galleryGrid = $("#galleryGrid");
  if (galleryGrid) {
    galleryGrid.innerHTML = photos.map(function (src, i) {
      return '<figure class="g-item" data-idx="' + i + '" tabindex="0" role="button" aria-label="Открыть фото ' + (i + 1) + '">' +
        '<img src="' + src + '" alt="Фото пары ' + (i + 1) + '" loading="lazy" decoding="async"></figure>';
    }).join("");
  }

  var lightbox = $("#lightbox"), lbImg = $("#lbImage"), lbCounter = $("#lbCounter"), lbIndex = 0;
  function lbOpen(i) {
    if (!photos.length || !lightbox) return;
    lbIndex = (i + photos.length) % photos.length;
    lbImg.src = photos[lbIndex];
    lbImg.alt = "Фото пары " + (lbIndex + 1);
    lbCounter.textContent = (lbIndex + 1) + " / " + photos.length;
    lightbox.hidden = false;
    requestAnimationFrame(function () { lightbox.classList.add("is-open"); });
    document.body.style.overflow = "hidden";
  }
  function lbClose() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () { lightbox.hidden = true; }, 380);
  }
  if (galleryGrid && lightbox) {
    galleryGrid.addEventListener("click", function (e) {
      var item = e.target.closest(".g-item");
      if (item) lbOpen(+item.getAttribute("data-idx"));
    });
    galleryGrid.addEventListener("keydown", function (e) {
      var item = e.target.closest(".g-item");
      if (item && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); lbOpen(+item.getAttribute("data-idx")); }
    });
    $("#lbClose").addEventListener("click", lbClose);
    $("#lbPrev").addEventListener("click", function () { lbOpen(lbIndex - 1); });
    $("#lbNext").addEventListener("click", function () { lbOpen(lbIndex + 1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) lbClose(); });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") lbClose();
      if (e.key === "ArrowLeft") lbOpen(lbIndex - 1);
      if (e.key === "ArrowRight") lbOpen(lbIndex + 1);
    });
  }

  /* ======================================================================
     12. COUNTDOWN-ТАЙМЕР
     ====================================================================== */
  var target = new Date((cfg.weddingDate || "2026-01-01") + "T" + (cfg.ceremonyTime || "15:00") + ":00").getTime();
  var cdGrid = $("#countdownGrid"), cdDone = $("#countdownDone");
  function setNum(id, val) {
    var el = $(id);
    if (!el) return;
    if (el.textContent !== String(val)) {
      el.textContent = val;
      el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
    }
  }
  var cdTimer = null;
  function tickCountdown() {
    var diff = target - Date.now();
    if (isNaN(target) || diff <= 0) {
      if (cdGrid) cdGrid.hidden = true;
      if (cdDone) cdDone.hidden = false;
      if (cdTimer) { clearInterval(cdTimer); cdTimer = null; }
      return;
    }
    setNum("#cdDays", Math.floor(diff / 86400000));
    setNum("#cdHours", ("0" + Math.floor(diff / 3600000 % 24)).slice(-2));
    setNum("#cdMins", ("0" + Math.floor(diff / 60000 % 60)).slice(-2));
    setNum("#cdSecs", ("0" + Math.floor(diff / 1000 % 60)).slice(-2));
  }
  if (cdGrid) { tickCountdown(); cdTimer = setInterval(tickCountdown, 1000); }

  /* ======================================================================
     13. NAVBAR: появление, бейдж «осталось дней», FAB
     ====================================================================== */
  var navBadge = $("#navDays");
  function updateBadge() {
    if (!navBadge) return;
    var days = Math.ceil((target - Date.now()) / 86400000);
    if (isNaN(days)) { navBadge.hidden = true; return; }
    navBadge.textContent = days > 0
      ? "Осталось " + days + " " + plural(days, "день", "дня", "дней")
      : (days === 0 ? "Свадьба сегодня!" : "Мы женаты");
  }
  updateBadge();

  var heroArrow = $("#heroArrow");
  function onScroll() {
    document.body.classList.toggle("is-scrolled", window.scrollY > 100);
    /* лёгкий параллакс фона hero */
    if (heroBg && window.scrollY < window.innerHeight && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heroBg.style.transform = "translateY(" + window.scrollY * 0.28 + "px)";
    }
    /* скрываем стрелку после начала скролла */
    if (heroArrow) heroArrow.style.opacity = window.scrollY > 60 ? 0 : "";
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ======================================================================
     14. SCROLL-REVEAL (IntersectionObserver)
     ====================================================================== */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(function (el) {
    var d = el.getAttribute("data-delay");
    if (d) el.style.transitionDelay = d + "ms";
    io.observe(el);
  });

  /* ======================================================================
     15. RSVP — режимы, валидация, отправка (Formspree)
     ====================================================================== */
  var guestsSel = $("#fGuests");
  if (guestsSel) {
    var max = Math.min(Math.max(parseInt(cfg.maxGuests, 10) || 5, 0), 5) || 5;
    var opts = "";
    for (var g = 1; g <= max; g++) opts += '<option value="' + g + '">' + g + " " + plural(g, "гость", "гостя", "гостей") + "</option>";
    guestsSel.innerHTML = opts;
  }

  var form = $("#rsvpForm"), altBox = $("#rsvpAlt"), success = $("#rsvpSuccess"), formError = $("#formError"), submitBtn = $("#rsvpSubmit");

  function showSuccess() {
    if (form) {
      form.classList.add("is-gone");
      setTimeout(function () { form.hidden = true; success.hidden = false; requestAnimationFrame(function () { success.classList.add("is-visible"); }); }, 430);
    } else {
      success.hidden = false; success.classList.add("is-visible");
    }
  }

  function buildAlt(mode) {
    /* альтернативные режимы подтверждения */
    var map = {
      telegram: {
        text: "Подтвердить участие можно одним сообщением в Telegram — напишите нам имя и число гостей.",
        href: cfg.telegramBot, label: "Ответить в Telegram", icon: "send"
      },
      phone: {
        text: "Позвоните или напишите организатору — мы с радостью отметим вас в списке гостей.",
        href: "tel:" + text("organizerPhone").replace(/[^+\d]/g, ""),
        label: "Позвонить: " + cfg.organizerPhone, icon: "phone"
      },
      googleform: {
        text: "Заполните короткую Google-форму — это займёт меньше минуты.",
        href: cfg.googleFormUrl, label: "Открыть Google-форму", icon: "send"
      }
    };
    var m = map[mode];
    if (!m || !altBox) return;
    form.hidden = true;
    altBox.hidden = false;
    altBox.innerHTML = "<p>" + m.text + '</p><a class="btn" href="' + m.href + '" target="_blank" rel="noopener">' + icon(m.icon) + " " + m.label + "</a>";
  }

  if (cfg.rsvpMode && cfg.rsvpMode !== "form") {
    buildAlt(cfg.rsvpMode);
  } else if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      /* кастомная валидация */
      var ok = true;
      ["#fName", "#fAttend"].forEach(function (sel) {
        var f = $(sel);
        var valid = f.value && f.value.trim() !== "";
        f.classList.toggle("is-invalid", !valid);
        if (!valid) ok = false;
      });
      formError.hidden = ok;
      if (!ok) return;

      submitBtn.disabled = true;
      submitBtn.querySelector("span").textContent = "Отправляем…";

      var endpoint = cfg.formspreeEndpoint || "";
      if (endpoint.indexOf("YOUR_ID") !== -1 || !endpoint) {
        /* ДЕМО-РЕЖИМ: Formspree ещё не настроен — просто показываем успех */
        console.info("[RSVP] Демо-режим. Укажите formspreeEndpoint в data.js. Данные формы:", Object.fromEntries(new FormData(form)));
        setTimeout(showSuccess, 700);
        return;
      }
      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(function (res) {
        console.info("[RSVP] Ответ сервера:", res.status);
        if (res.ok) { showSuccess(); }
        else {
          formError.textContent = "Не удалось отправить. Попробуйте ещё раз или напишите нам в мессенджер.";
          formError.hidden = false;
          submitBtn.disabled = false;
          submitBtn.querySelector("span").textContent = "Отправить ответ";
        }
      }).catch(function () {
        formError.textContent = "Проверьте интернет и попробуйте снова.";
        formError.hidden = false;
        submitBtn.disabled = false;
        submitBtn.querySelector("span").textContent = "Отправить ответ";
      });
    });
    /* снимаем подсветку ошибки при вводе */
    form.addEventListener("input", function (e) { e.target.classList.remove("is-invalid"); });
  }

  /* ======================================================================
     16. FAQ — АККОРДЕОН
     ====================================================================== */
  var faqList = $("#faqList");
  if (faqList) {
    faqList.innerHTML = (cfg.faq || []).map(function (item, i) {
      return '<div class="faq-item">' +
        '<button class="faq-q" type="button" aria-expanded="false" aria-controls="faqA' + i + '">' +
        "<span>" + item.q + '</span><span class="faq-icon">' + icon("plus") + "</span></button>" +
        '<div class="faq-a" id="faqA' + i + '"><p>' + item.a + "</p></div></div>";
    }).join("");

    faqList.addEventListener("click", function (e) {
      var btn = e.target.closest(".faq-q");
      if (!btn) return;
      var item = btn.parentElement, panel = $(".faq-a", item), isOpen = item.classList.contains("is-open");
      /* закрываем остальные */
      $$(".faq-item.is-open", faqList).forEach(function (other) {
        if (other !== item) {
          other.classList.remove("is-open");
          $(".faq-a", other).style.maxHeight = "0px";
          $(".faq-q", other).setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? "0px" : panel.scrollHeight + "px";
    });
  }

  /* ======================================================================
     17. QR-КОД + СОХРАНИТЬ В КАЛЕНДАРЬ (ICS / Google)
     ====================================================================== */
  if ($("#qrImage") && cfg.siteUrl) {
    $("#qrImage").src = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&qzone=1&data=" + encodeURIComponent(cfg.siteUrl);
  }

  function icsDate(ms) {
    var d = new Date(ms);
    return d.getFullYear() +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      ("0" + d.getDate()).slice(-2) + "T" +
      ("0" + d.getHours()).slice(-2) +
      ("0" + d.getMinutes()).slice(-2) + "00";
  }
  var eventEnd = target + (cfg.eventDurationHours || 8) * 3600000;
  var locationStr = (cfg.ceremonyVenue || "") + ", " + (cfg.ceremonyAddress || "") + ", " + (cfg.city || "");
  var descStr = (cfg.siteDescription || "") + " Подробности: " + (cfg.siteUrl || "");

  if ($("#icsBtn")) {
    $("#icsBtn").addEventListener("click", function () {
      var ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invite//RU",
        "BEGIN:VEVENT",
        "UID:" + Date.now() + "@wedding-invite",
        "DTSTAMP:" + icsDate(Date.now()),
        "DTSTART:" + icsDate(target),
        "DTEND:" + icsDate(eventEnd),
        "SUMMARY:" + (cfg.calendarEventTitle || "Свадьба"),
        "DESCRIPTION:" + descStr.replace(/,/g, "\\,"),
        "LOCATION:" + locationStr.replace(/,/g, "\\,"),
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "svadba.ics";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    });

    $("#gcalBtn").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(cfg.calendarEventTitle || "Свадьба") +
      "&dates=" + icsDate(target) + "/" + icsDate(eventEnd) +
      "&details=" + encodeURIComponent(descStr) +
      "&location=" + encodeURIComponent(locationStr);
  }

  /* ======================================================================
     18. FOOTER: имена, хэштег, контакты, копирайт
     ====================================================================== */
  $("#footerNames").textContent = (cfg.brideName || "") + " & " + (cfg.groomName || "") + " · " + (cfg.displayDate || "");
  var tag = (cfg.instagramHashtag || "").replace(/^#/, "");
  var tagLink = $("#footerHashtag");
  tagLink.textContent = cfg.instagramHashtag || "";
  tagLink.href = "https://instagram.com/explore/tags/" + tag;

  $("#fcPhone").href = "tel:" + text("organizerPhone").replace(/[^+\d]/g, "");
  $("#fcMail").href = "mailto:" + (cfg.coupleEmail || "");
  $("#fcWa").href = cfg.whatsappUrl || "#";
  $("#fcTg").href = cfg.telegramBot || "#";

  var credit = $("#footerCredit");
  if (cfg.creditUrl) {
    $("#creditLink").textContent = cfg.creditText || "";
    $("#creditLink").href = cfg.creditUrl;
  } else if (credit) { credit.remove(); }

  /* ======================================================================
     19. МУЗЫКА (опционально): блок + фоновая кнопка
     ====================================================================== */
  var player = $("#musicPlayer");
  if (player && cfg.songUrl) {
    if (cfg.songUrl.indexOf("spotify") !== -1) {
      player.innerHTML = '<iframe src="' + cfg.songUrl + '" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Наша песня — Spotify"></iframe>';
    } else {
      player.innerHTML = '<audio controls preload="none" src="' + cfg.songUrl + '"></audio>';
    }
  }
  var musicFab = $("#musicFab");
  if (cfg.backgroundMusic && cfg.songUrl && cfg.songUrl.indexOf(".mp3") !== -1 && musicFab) {
    var audio = new Audio(cfg.songUrl);
    audio.loop = true;
    musicFab.hidden = false;
    musicFab.addEventListener("click", function () {
      if (audio.paused) { audio.play(); musicFab.classList.add("is-playing"); }
      else { audio.pause(); musicFab.classList.remove("is-playing"); }
    });
  }

  /* ======================================================================
     20. JSON-LD (Event schema) для SEO
     ====================================================================== */
  try {
    var ld = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": cfg.calendarEventTitle || cfg.siteTitle,
      "startDate": new Date(target).toISOString(),
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "Place",
        "name": cfg.ceremonyVenue,
        "address": cfg.ceremonyAddress + ", " + cfg.city
      },
      "image": [cfg.ogImageUrl],
      "description": cfg.siteDescription,
      "url": cfg.siteUrl
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  } catch (e) { /* SEO-блок не критичен */ }

  /* ======================================================================
     21. PRELOADER — гасим после полной загрузки (минимум 1.6 c)
     ====================================================================== */
  var startTs = Date.now();
  function finishPreloader() {
    var wait = Math.max(0, 1600 - (Date.now() - startTs));
    setTimeout(function () {
      $("#preloader").classList.add("is-done");
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-ready");
    }, wait);
  }
  if (document.readyState === "complete") finishPreloader();
  else {
    window.addEventListener("load", finishPreloader);
    setTimeout(finishPreloader, 4000); /* страховка */
  }
})();
