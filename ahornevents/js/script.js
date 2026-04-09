/* =========================================================
   1. Init / DOM Ready
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  applyStoredConsent();

  if (typeof loadSharedLayout === "function") {
    await loadSharedLayout();
  }
  initCookieBanner();
  initMobileMenu();
  initSubmenus();
  initActiveNav();
  initRevealAnimations();
  initLightbox();
  initLanguagePreference();
  initServiceCards();
  initVideoModal();
  initParticles();
});

/* =========================================================
   2. Navigation / Mobile Menu
========================================================= */

function initMobileMenu() {
  const menuToggle = document.querySelector(".site-menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (!menuToggle || !siteNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      siteNav.classList.remove("is-open");
      menuToggle.classList.remove("is-active");
      menuToggle.setAttribute("aria-expanded", "false");

      document.querySelectorAll(".site-nav__item.is-open").forEach((item) => {
        item.classList.remove("is-open");
      });

      document
        .querySelectorAll(".site-nav__item.has-submenu .site-nav__link--parent")
        .forEach((link) => {
          link.setAttribute("aria-expanded", "false");
        });
    }
  });
}

/* =========================================================
   3. Navigation / Dropdown
========================================================= */

function initSubmenus() {
  const navParents = document.querySelectorAll(
    ".site-nav__item.has-submenu .site-nav__link--parent",
  );

  if (!navParents.length) return;

  navParents.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (window.innerWidth > 980) return;

      const parentItem = link.closest(".site-nav__item");
      if (!parentItem) return;

      const isOpen = parentItem.classList.contains("is-open");

      if (!isOpen) {
        event.preventDefault();

        navParents.forEach((otherLink) => {
          const otherItem = otherLink.closest(".site-nav__item");

          if (otherItem && otherItem !== parentItem) {
            otherItem.classList.remove("is-open");
            otherLink.setAttribute("aria-expanded", "false");
          }
        });

        parentItem.classList.add("is-open");
        link.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function initActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document
    .querySelectorAll(".site-nav > a[aria-current='page']")
    .forEach((link) => {
      link.removeAttribute("aria-current");
    });

  document
    .querySelectorAll(".lang-switch a[aria-current='page']")
    .forEach((link) => {
      link.removeAttribute("aria-current");
    });

  document.querySelectorAll(".site-nav > a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    const cleanHref = href.split("#")[0];

    if (cleanHref === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  const currentLang = document.documentElement.lang === "de" ? "de" : "en";
  const currentLangLink = document.querySelector(
    `.lang-switch a[data-lang="${currentLang}"]`,
  );
  if (currentLangLink) {
    currentLangLink.setAttribute("aria-current", "page");
  }
}
/* =========================================================
   4. Reveal / Scroll Animations
========================================================= */

function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
      },
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }
}

/* =========================================================
   5. Gallery / Lightbox
========================================================= */

function initLightbox() {
  const galleryButtons = Array.from(
    document.querySelectorAll(".lightbox-item"),
  );
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxOverlay = document.querySelector(".lightbox__overlay");

  if (!galleryButtons.length || !lightbox || !lightboxImg) return;

  let currentImageIndex = 0;

  const galleryImages = galleryButtons
    .map((button) => {
      const img = button.querySelector("img");
      if (!img) return null;

      return {
        src: button.getAttribute("data-image") || img.getAttribute("src"),
        alt: img.getAttribute("alt") || "Gallery image",
      };
    })
    .filter(Boolean);

  if (!galleryImages.length) return;

  function updateImage() {
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxImg.alt = galleryImages[currentImageIndex].alt;
  }

  function openLightbox(index) {
    currentImageIndex = index;
    updateImage();
    lightbox.classList.add("is-active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-active");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    lightboxImg.alt = "";
    document.body.style.overflow = "";
  }

  function showPrevImage() {
    currentImageIndex =
      (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateImage();
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateImage();
  }

  galleryButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", showPrevImage);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", showNextImage);
  }

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-active")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPrevImage();
    if (event.key === "ArrowRight") showNextImage();
  });
}

/* =========================================================
   6. Language / Switch + Persistence
========================================================= */

function initLanguagePreference() {
  const langLinks = document.querySelectorAll(".lang-switch a[data-lang]");
  if (!langLinks.length) return;

  langLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const selectedLanguage = link.getAttribute("data-lang");
      if (!selectedLanguage) return;
      localStorage.setItem("preferred-language", selectedLanguage);
    });
  });
}

/* =========================================================
   7. Background / Particles
========================================================= */

function initParticles() {
  const particlesContainer = document.getElementById("particles-js");
  if (!particlesContainer) return;

  if (particlesContainer.dataset.particlesInitialized === "true") return;

  if (!window.particlesJS) {
    setTimeout(initParticles, 100);
    return;
  }

  particlesContainer.dataset.particlesInitialized = "true";

  window.particlesJS("particles-js", {
    particles: {
      number: {
        value: 140,
        density: {
          enable: true,
          value_area: 900,
        },
      },
      color: {
        value: "#b8965a",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.4,
        random: true,
        anim: {
          enable: true,
          speed: 0.3,
          opacity_min: 0.15,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          size_min: 0.8,
          sync: false,
        },
      },
      line_linked: {
        enable: false,
      },
      move: {
        enable: true,
        speed: 0.35,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false,
        },
        onclick: {
          enable: false,
        },
        resize: true,
      },
    },
    retina_detect: true,
  });
}
/* =========================================================
   8.Service Cards
========================================================= */

function initServiceCards() {
  const buttons = document.querySelectorAll(".service-card__toggle");

  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentCard = button.closest(".service-card");

      document.querySelectorAll(".service-card").forEach((card) => {
        if (card !== currentCard) {
          card.classList.remove("active");
          const otherButton = card.querySelector(".service-card__toggle");
          if (otherButton) otherButton.textContent = "Discover";
        }
      });

      currentCard.classList.toggle("active");
      button.textContent = currentCard.classList.contains("active")
        ? "Close"
        : "Discover";
    });
  });
}

/* =========================================================
   9.Youtube Video Player
========================================================= */

function initVideoModal() {
  const modal = document.getElementById("videoModal");
  const frame = document.getElementById("videoFrame");
  const closeBtn = document.getElementById("videoClose");

  if (!modal || !frame || !closeBtn) return;

  const overlay = modal.querySelector(".video-modal__overlay");

  function openModal(videoUrl) {
    const separator = videoUrl.includes("?") ? "&" : "?";
    frame.src = `${videoUrl}${separator}autoplay=1&rel=0`;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    frame.src = "";
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    const trigger = e.target.closest(".js-video-link");
    if (!trigger) return;

    e.preventDefault();

    const videoUrl = trigger.getAttribute("data-video");
    if (!videoUrl) return;

    openModal(videoUrl);
  });

  closeBtn.addEventListener("click", closeModal);

  if (overlay) {
    overlay.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

/* =========================
   COOKIE CONSENT + GA4
   Use banner only on index pages
========================= */

/* Apply stored consent on every page */
function applyStoredConsent() {
  const consent = localStorage.getItem("cookieConsent");

  if (!consent) return;

  if (consent === "accepted") {
    enableAnalytics();
  } else {
    disableAnalytics();
  }
}

/* Cookie banner logic */
function initCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-reject");

  if (!banner || !acceptBtn || !rejectBtn) return;

  const COOKIE_KEY = "ahorn_cookie_consent";

  function setConsent(mode) {
    localStorage.setItem(COOKIE_KEY, mode);

    if (typeof window.gtag === "function") {
      if (mode === "accepted") {
        window.gtag("consent", "update", {
          ad_storage: "denied",
          analytics_storage: "granted",
        });

        window.gtag("config", "G-KCC3E9VCT3", {
          anonymize_ip: true,
          send_page_view: true,
        });
      } else {
        window.gtag("consent", "update", {
          ad_storage: "denied",
          analytics_storage: "denied",
        });
      }
    }

    banner.classList.remove("is-visible");
    banner.setAttribute("hidden", "");
  }

  const savedConsent = localStorage.getItem(COOKIE_KEY);

  if (savedConsent === "accepted") {
    banner.classList.remove("is-visible");
    banner.setAttribute("hidden", "");

    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "granted",
      });

      window.gtag("config", "G-KCC3E9VCT3", {
        anonymize_ip: true,
        send_page_view: true,
      });
    }

    return;
  }

  if (savedConsent === "rejected") {
    banner.classList.remove("is-visible");
    banner.setAttribute("hidden", "");

    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
      });
    }

    return;
  }

  banner.removeAttribute("hidden");
  banner.classList.add("is-visible");

  acceptBtn.addEventListener("click", () => {
    setConsent("accepted");
  });

  rejectBtn.addEventListener("click", () => {
    setConsent("rejected");
  });
}

/* Enable GA4 analytics after consent */
function enableAnalytics() {
  if (typeof gtag === "function") {
    gtag("consent", "update", {
      analytics_storage: "granted",
    });
    gtag("event", "page_view");
  }
}

/* Disable GA4 analytics */
function disableAnalytics() {
  if (typeof gtag === "function") {
    gtag("consent", "update", {
      analytics_storage: "denied",
    });
  }
}

/* Optional helper for testing */
function resetCookieConsent() {
  localStorage.removeItem("cookieConsent");
}


