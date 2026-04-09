function appendHeadTag(tagName, attributes = {}, parent = document.head) {
  const element = document.createElement(tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "textContent") {
      element.textContent = value;
    } else if (key === "crossorigin") {
      element.setAttribute("crossorigin", value);
    } else {
      element.setAttribute(key, value);
    }
  });

  parent.appendChild(element);
  return element;
}

function headTagExists(selector) {
  return Boolean(document.head.querySelector(selector));
}

function getBasePrefix() {
  const path = window.location.pathname;

  if (
    path.startsWith("/en/artists/") ||
    path.startsWith("/de/kuenstler/") ||
    path.startsWith("/en/services/") ||
    path.startsWith("/de/services/")
  ) {
    return "../../";
  }

  if (path.startsWith("/en/") || path.startsWith("/de/")) {
    return "../";
  }

  return "";
}

function getSharedAssetPaths() {
  const basePrefix = getBasePrefix();

  return {
    cssPath: `${basePrefix}css/style.css`,
    faviconPath: `${basePrefix}images/favicon.png`,
  };
}

function initSharedAssets() {
  const { cssPath, faviconPath } = getSharedAssetPaths();

  if (
    !headTagExists(
      'link[rel="preconnect"][href="https://fonts.googleapis.com"]',
    )
  ) {
    appendHeadTag("link", {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    });
  }

  if (
    !headTagExists('link[rel="preconnect"][href="https://fonts.gstatic.com"]')
  ) {
    appendHeadTag("link", {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "",
    });
  }

  if (
    !headTagExists('link[href*="fonts.googleapis.com/css2?family=Poppins"]')
  ) {
    appendHeadTag("link", {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
    });
  }

  if (!headTagExists(`link[rel="stylesheet"][href="${cssPath}"]`)) {
    appendHeadTag("link", {
      rel: "stylesheet",
      href: cssPath,
    });
  }

  if (!headTagExists('link[rel="icon"]')) {
    appendHeadTag("link", {
      rel: "icon",
      href: faviconPath,
    });
  }

  if (!headTagExists('meta[name="theme-color"]')) {
    appendHeadTag("meta", {
      name: "theme-color",
      content: "#0f1720",
    });
  }

  if (!headTagExists('meta[name="robots"]')) {
    appendHeadTag("meta", {
      name: "robots",
      content: "index, follow",
    });
  }

  document.documentElement.classList.remove("shared-assets-loading");
}

function initTracking() {
  const GA_ID = "G-KCC3E9VCT3";

  if (window.__ahornAnalyticsLoaded) return;
  window.__ahornAnalyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
  });

  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const existingScript = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`,
  );

  if (!existingScript) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
  }
}