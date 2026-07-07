document.addEventListener("DOMContentLoaded", () => {
  const navbar      = document.getElementById("navbar");
  const hamburger   = document.getElementById("hamburger");
  const mobileMenu  = document.getElementById("mobileMenu");
  const menuOverlay = document.getElementById("menuOverlay");
  const scrollTopBtn= document.getElementById("scrollTop");
  const navH = () => navbar ? navbar.offsetHeight : 80;

  /* ────────────────────────────────────────────────
     1. MOBILE MENU
  ──────────────────────────────────────────────── */
  const closeMobileMenu = () => {
    hamburger   && hamburger.classList.remove("open") && hamburger.setAttribute("aria-expanded","false");
    mobileMenu  && mobileMenu.classList.remove("open");
    menuOverlay && menuOverlay.classList.remove("show");
  };
  const _close = () => {          // plain function ref for event listeners
    if (hamburger)   { hamburger.classList.remove("open"); hamburger.setAttribute("aria-expanded","false"); }
    if (mobileMenu)  { mobileMenu.classList.remove("open"); }
    if (menuOverlay) { menuOverlay.classList.remove("show"); }
  };

  if (hamburger && mobileMenu && menuOverlay) {
    hamburger.addEventListener("click", () => {
      const open = !mobileMenu.classList.contains("open");
      hamburger.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", String(open));
      mobileMenu.classList.toggle("open", open);
      menuOverlay.classList.toggle("show", open);
    });
    menuOverlay.addEventListener("click", _close);
  }
  /* Close menu on any nav/mobile link click */
  document.querySelectorAll(".nav-link, .mobile-link, .btn-nav-cta, .mobile-cta").forEach(l => l.addEventListener("click", _close));

  /* ────────────────────────────────────────────────
     2. HASH-ON-LOAD SCROLL
     When arriving on index.html from gallery.html
     (e.g. href="index.html#about"), the browser
     natively scrolls to the hash but sometimes
     renders before the navbar height is known.
     This fallback scrolls after 120 ms so the
     scroll-padding-top offset is always correct.
  ──────────────────────────────────────────────── */
  if (window.location.hash) {
    const targetId = window.location.hash.slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      setTimeout(() => {
        const top = targetEl.getBoundingClientRect().top + window.pageYOffset - navH() - 16;
        window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
      }, 120);
    }
  }

  /* ────────────────────────────────────────────────
     3. NAVBAR SHADOW + SCROLL-TOP BUTTON
  ──────────────────────────────────────────────── */
  const onScroll = () => {
    const y = window.pageYOffset;
    navbar        && navbar.classList.toggle("scrolled", y > 20);
    scrollTopBtn  && scrollTopBtn.classList.toggle("show", y > 400);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ────────────────────────────────────────────────
     4. ACTIVE NAV LINK — section tracking
     Highlights the correct nav link as the user
     scrolls through sections on index.html.
  ──────────────────────────────────────────────── */
  const sections  = Array.from(document.querySelectorAll("section[id]"));
  const navLinks  = Array.from(document.querySelectorAll(".nav-links .nav-link"));

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const setActive = id => {
      navLinks.forEach(a => {
        const href = a.getAttribute("href");
        const match = href === "#" + id || href === "index.html#" + id;
        a.classList.toggle("active", match);
      });
    };

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-" + (navH() + 10) + "px 0px -55% 0px", threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ────────────────────────────────────────────────
     5. SERVICE TABS
  ──────────────────────────────────────────────── */
  const tabBtns   = Array.from(document.querySelectorAll(".tab-btn"));
  const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
  if (tabBtns.length && tabPanels.length) {
    const activateTab = name => {
      tabBtns.forEach(b => {
        const on = b.dataset.tab === name;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", String(on));
      });
      tabPanels.forEach(p => {
        const on = p.id === "tab-" + name;
        p.classList.toggle("active", on);
        p.hidden = !on;
      });
    };
    const first = tabBtns.find(b => b.classList.contains("active"));
    if (first) activateTab(first.dataset.tab);
    tabBtns.forEach(b => b.addEventListener("click", () => b.dataset.tab && activateTab(b.dataset.tab)));
  }

  /* ────────────────────────────────────────────────
     6. SCROLL-REVEAL ANIMATIONS
  ──────────────────────────────────────────────── */
  if ("IntersectionObserver" in window) {
    const revealIO = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); revealIO.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => revealIO.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  }

  /* ────────────────────────────────────────────────
     7. COPYRIGHT YEAR
  ──────────────────────────────────────────────── */
  const yr = document.getElementById("copyrightYear");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ────────────────────────────────────────────────
     8. CONTACT FORM
  ──────────────────────────────────────────────── */
  const form      = document.getElementById("contactForm");
  const statusEl  = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const btnTxt    = submitBtn ? submitBtn.querySelector(".btn-txt")  : null;
  const btnLoad   = submitBtn ? submitBtn.querySelector(".btn-load") : null;

  const setStatus = (type, msg) => {
    if (!statusEl) return;
    statusEl.classList.remove("success", "error");
    if (!type) { statusEl.textContent = ""; return; }
    statusEl.classList.add(type);
    statusEl.textContent = msg;
  };

  if (form instanceof HTMLFormElement) {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!form.reportValidity()) { setStatus("error", "Please fill in all required fields."); return; }
      setStatus("", "");
      if (submitBtn) submitBtn.disabled = true;
      if (btnTxt)   btnTxt.hidden  = true;
      if (btnLoad)  btnLoad.hidden = false;
      try {
        const res  = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus("success", "Thanks! Your message was sent successfully.");
          form.reset();
        } else {
          setStatus("error", (typeof data.message === "string" && data.message) ? data.message : "Unable to send right now. Please try again.");
        }
      } catch {
        setStatus("error", "Network error. Please try again.");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnTxt)   btnTxt.hidden  = false;
        if (btnLoad)  btnLoad.hidden = true;
      }
    });
  }
});
