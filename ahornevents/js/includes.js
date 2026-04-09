function getCurrentLanguage() {
  const path = window.location.pathname;

  if (path.startsWith("/de/")) return "de";
  return "en";
}

function getCurrentPageName() {
  const path = window.location.pathname;
  return path.split("/").pop() || "index.html";
}

function getCurrentPageKey() {
  const path = window.location.pathname;
  const pageName = getCurrentPageName();

  if (path.includes("/artists/") || path.includes("/kuenstler/")) {
    return "artists";
  }

  if (path.includes("/services/")) {
    return "services";
  }

  const navMap = {
    "index.html": "home",
    "about.html": "about",
    "services.html": "services",
    "events.html": "events",
    "artists.html": "artists",
    "contact.html": "contact",
    "impressum.html": "impressum",
    "datenschutz.html": "privacy",
    "privacy-policy.html": "privacy",
    "privacy.html": "privacy",
    "legal-notice.html": "impressum",
  };

  return navMap[pageName] || "";
}

async function loadPartial(url, target) {
  if (!target) return;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load partial: ${url}`);
    }

    const html = await response.text();
    target.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

function setActiveNavigation(currentPage) {
  if (!currentPage) return;

  const navLinks = document.querySelectorAll("[data-nav]");

  navLinks.forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function setCurrentYear() {
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function getAlternatePagePath(pathname, targetLang) {
  const routes = [
    {
      en: "/en/index.html",
      de: "/de/index.html",
    },
    {
      en: "/en/about.html",
      de: "/de/about.html",
    },
    {
      en: "/en/services.html",
      de: "/de/services.html",
    },
    {
      en: "/en/events.html",
      de: "/de/events.html",
    },
    {
      en: "/en/artists.html",
      de: "/de/artists.html",
    },
    {
      en: "/en/contact.html",
      de: "/de/contact.html",
    },
    {
      en: "/en/privacy-policy.html",
      de: "/de/datenschutz.html",
    },
    {
      en: "/en/legal-notice.html",
      de: "/de/impressum.html",
    },

    // artist detail pages
    {
      en: "/en/artists/greg-bannis.html",
      de: "/de/kuenstler/greg-bannis.html",
    },

    // add future artist pages here
    // {
    //   en: "/en/artists/peter-kent.html",
    //   de: "/de/kuenstler/peter-kent.html",
    // },
  ];

  const cleanPath = pathname.replace(/\/+$/, "");

  const match = routes.find((route) => {
    return route.en === cleanPath || route.de === cleanPath;
  });

  if (match) {
    return targetLang === "de" ? match.de : match.en;
  }

  return targetLang === "de" ? "/de/index.html" : "/en/index.html";
}

function setLanguageSwitcher() {
  const currentLang = getCurrentLanguage();
  const currentPath = window.location.pathname.replace(/\/+$/, "");

  const enLink = document.querySelector('[data-lang="en"]');
  const deLink = document.querySelector('[data-lang="de"]');

  if (enLink) {
    enLink.setAttribute("href", getAlternatePagePath(currentPath, "en"));

    if (currentLang === "en") {
      enLink.setAttribute("aria-current", "page");
    } else {
      enLink.removeAttribute("aria-current");
    }

    enLink.addEventListener("click", () => {
      localStorage.setItem("preferred-language", "en");
    });
  }

  if (deLink) {
    deLink.setAttribute("href", getAlternatePagePath(currentPath, "de"));

    if (currentLang === "de") {
      deLink.setAttribute("aria-current", "page");
    } else {
      deLink.removeAttribute("aria-current");
    }

    deLink.addEventListener("click", () => {
      localStorage.setItem("preferred-language", "de");
    });
  }
}

async function loadSharedLayout() {
  const headerTarget = document.getElementById("site-header");
  const footerTarget = document.getElementById("site-footer");

  if (!headerTarget && !footerTarget) return;

  const lang = getCurrentLanguage();
  const currentPage = getCurrentPageKey();

  await Promise.all([
    loadPartial(`/partials/${lang}/header.html`, headerTarget),
    loadPartial(`/partials/${lang}/footer.html`, footerTarget),
  ]);

  setActiveNavigation(currentPage);
  setCurrentYear();
  setLanguageSwitcher();
}