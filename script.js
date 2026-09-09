/* ============================================================
   MEL ENTRETIEN — interactions & animations page d'accueil
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Animation d'entrée au chargement ----------
     Déclenchée dès que le DOM est prêt, sans attendre `load` :
     une police ou une image lente ne doit jamais laisser le héro vide. */
  requestAnimationFrame(function () {
    document.body.classList.add("is-loaded");
  });

  /* ---------- Lien de navigation actif au scroll ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = nav ? nav.querySelectorAll("a") : [];

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Apparition progressive (stagger) ---------- */
  var revealables = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealables.length && !reduceMotion) {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var group = entry.target.parentElement
          ? entry.target.parentElement.querySelectorAll(":scope > .reveal")
          : [entry.target];
        var index = Array.prototype.indexOf.call(group, entry.target);
        entry.target.style.transitionDelay = (Math.max(index, 0) * 90) + "ms";
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealables.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Compteurs animés ---------- */
  var counters = document.querySelectorAll(".stat-num[data-count]");

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1500;
    var start = null;

    function tick(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var countObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (reduceMotion) {
          entry.target.textContent =
            entry.target.getAttribute("data-count") + (entry.target.getAttribute("data-suffix") || "");
        } else {
          animateCount(entry.target);
        }
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (c) { countObs.observe(c); });
  }

  /* ---------- Parallaxe + header + retour haut (un seul listener scroll) ---------- */
  var header = document.querySelector(".site-header");
  var toTop = document.getElementById("to-top");
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  var ticking = false;

  function onScrollFrame() {
    var y = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
    }

    if (toTop) {
      toTop.classList.toggle("is-visible", y > 600);
    }

    if (!reduceMotion) {
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var offset = (rect.top + rect.height / 2 - window.innerHeight / 2);
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
        var shift = (offset / window.innerHeight) * speed;
        el.style.setProperty("--py", shift.toFixed(1) + "px");
      });
    }

    ticking = false;
  }

  function requestScroll() {
    if (!ticking) {
      window.requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", requestScroll);
  onScrollFrame();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Effet de tilt (inclinaison au survol) ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var maxTilt = 7;

      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--rx", (-py * maxTilt).toFixed(2) + "deg");
        card.style.setProperty("--ry", (px * maxTilt).toFixed(2) + "deg");
        card.style.setProperty("--tz", "10px");
      });

      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--tz", "0px");
      });
    });

    /* ---------- Boutons magnétiques ---------- */
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + mx * 0.15 + "px," + my * 0.25 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Galerie : filtres ---------- */
  var galGrid = document.getElementById("gal-grid");
  if (galGrid) {
    var pills = document.querySelectorAll(".gal-pill");
    var galItems = galGrid.querySelectorAll(".gal-item");
    var galEmpty = document.getElementById("gal-empty");

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        var cat = pill.getAttribute("data-filter");
        pills.forEach(function (p) { p.classList.toggle("is-active", p === pill); });

        var shown = 0;
        galItems.forEach(function (item) {
          var match = cat === "tout" || item.getAttribute("data-cat") === cat;
          item.hidden = !match;
          if (match) shown++;
        });
        if (galEmpty) galEmpty.hidden = shown > 0;
      });
    });
  }

  /* ---------- Galerie : visionneuse ---------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbPhoto = document.getElementById("lightbox-photo");
    var lbCaption = document.getElementById("lightbox-caption");
    var lbClose = document.getElementById("lightbox-close");
    var lastFocused = null;

    function openLightbox(trigger) {
      // on reprend le fond calculé : fonctionne aussi avec le dégradé de secours
      lbPhoto.style.backgroundImage = window.getComputedStyle(trigger).backgroundImage;
      var fig = trigger.closest("figure");
      var cap = fig ? fig.querySelector("figcaption") : null;
      lbCaption.textContent = cap ? cap.textContent : "";
      lastFocused = trigger;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lbClose.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
      btn.addEventListener("click", function () { openLightbox(btn); });
    });

    lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  /* ---------- Galerie : comparateur avant / après ---------- */
  var ba = document.querySelector("[data-ba]");
  if (ba) {
    var baRange = ba.querySelector("[data-ba-range]");
    var setPos = function () {
      ba.style.setProperty("--pos", baRange.value + "%");
    };
    baRange.addEventListener("input", setPos);
    setPos();
  }

  /* ---------- Formulaire de devis ---------- */
  var devisForm = document.getElementById("devis-form");
  if (devisForm) {
    var status = document.getElementById("form-status");

    var show = function (msg, isError) {
      status.textContent = msg;
      status.classList.toggle("form-status--error", !!isError);
      status.hidden = false;
    };

    devisForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // validation native, déclenchée seulement à la soumission
      if (!devisForm.checkValidity()) {
        show("Merci de compléter les champs obligatoires avant d'envoyer votre demande.", true);
        var firstBad = devisForm.querySelector(":invalid");
        if (firstBad) firstBad.focus();
        return;
      }

      // Tant que la destination n'est pas configurée, on ne fait pas croire
      // à un envoi réussi : on oriente vers un contact direct.
      if (devisForm.hasAttribute("data-form-inactive")) {
        show("L'envoi automatique n'est pas encore activé. Merci de nous appeler ou " +
             "de nous écrire directement — vos coordonnées sont indiquées ci-contre.", true);
        return;
      }

      devisForm.submit();
    });
  }
})();
