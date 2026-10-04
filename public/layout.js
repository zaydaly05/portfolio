/* ============================================
   CENTRALIZED LAYOUT & NAVIGATION MANAGER (SOLID DRY PATTERN)
   Single source of truth for site-wide Header Navigation, Mobile Menu, and Footer.
   Called by ID (#site-header, #site-footer) from all webpages.
   ============================================ */

(function (global) {
  const LayoutManager = {
    /**
     * Renders header navigation bar and mobile menu overlay into #site-header.
     */
    renderHeader() {
      let headerSlot = document.getElementById("site-header");

      // Fallback: replace existing nav if present or create header slot
      if (!headerSlot) {
        const existingNav = document.getElementById("navbar") || document.querySelector("nav.nav");
        if (existingNav) {
          headerSlot = document.createElement("header");
          headerSlot.id = "site-header";
          existingNav.parentNode.replaceChild(headerSlot, existingNav);
          const existingMobile = document.getElementById("mobile-nav-overlay");
          if (existingMobile) existingMobile.remove();
        } else {
          headerSlot = document.createElement("header");
          headerSlot.id = "site-header";
          document.body.insertBefore(headerSlot, document.body.firstChild);
        }
      }

      const path = (window.location.pathname || "/").toLowerCase();
      const isHome = path === "/" || path.endsWith("/index.html") || path.endsWith("/");
      const isProjects = path.includes("projects");
      const isExperience = path.includes("experience");
      const isSkills = path.includes("skills");
      const isContact = path.includes("contact");

      headerSlot.innerHTML = `
        <nav class="nav" id="navbar">
          <a href="/" class="logo" aria-label="Zayd Ali Mohamed home">
            <img
              src="https://res.cloudinary.com/delnnzcph/image/upload/v1791135580/logo.jpg"
              alt="ZA"
              width="48"
              height="48"
            />
          </a>
          <ul class="nav-links" id="nav-links">
            <li><a href="/" class="${isHome ? "active-nav" : ""}">Home</a></li>
            <li><a href="/projects" class="${isProjects ? "active-nav" : ""}">Projects Hub</a></li>
            <li><a href="/experience" class="${isExperience ? "active-nav" : ""}">Experience &amp; Reviews</a></li>
            <li><a href="/skills" class="${isSkills ? "active-nav" : ""}">Skills &amp; Tech Stack</a></li>
            <li><a href="/contact" class="${isContact ? "active-nav" : ""}">Contact &amp; Hire</a></li>
          </ul>
          <div class="nav-actions">
            <button id="open-terminal-nav-btn" class="btn-outline btn-terminal-nav" type="button" title="Open Developer CLI">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              CLI
            </button>
            <button id="theme-toggle" class="btn-outline theme-toggle" type="button">Light Mode</button>
            <button id="preview-cv-nav-btn" class="btn-outline btn-cv-nav" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View CV
            </button>
            <a class="btn" href="/contact">Hire Me</a>
            <button class="hamburger-btn" id="hamburger-btn" aria-label="Open navigation menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </nav>

        <div class="mobile-nav-overlay" id="mobile-nav-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close navigation">&times;</button>
          <ul class="mobile-nav-links">
            <li><a href="/" class="${isHome ? "active-nav" : ""}">Home</a></li>
            <li><a href="/projects" class="${isProjects ? "active-nav" : ""}">Projects Hub</a></li>
            <li><a href="/experience" class="${isExperience ? "active-nav" : ""}">Experience &amp; Reviews</a></li>
            <li><a href="/skills" class="${isSkills ? "active-nav" : ""}">Skills &amp; Tech Stack</a></li>
            <li><a href="/contact" class="${isContact ? "active-nav" : ""}">Contact &amp; Hire</a></li>
          </ul>
          <div class="mobile-nav-actions">
            <a class="btn" href="/contact">Hire Me</a>
            <button id="mobile-terminal-btn" class="btn-outline" type="button">Terminal CLI</button>
          </div>
        </div>
      `;
    },

    /**
     * Renders site footer into #site-footer slot.
     */
    renderFooter() {
      let footerSlot = document.getElementById("site-footer");

      // Fallback: replace existing footer if present or append to body
      if (!footerSlot) {
        const existingFooter = document.querySelector("footer.footer");
        if (existingFooter) {
          footerSlot = document.createElement("footer");
          footerSlot.id = "site-footer";
          existingFooter.parentNode.replaceChild(footerSlot, existingFooter);
        } else {
          footerSlot = document.createElement("footer");
          footerSlot.id = "site-footer";
          document.body.appendChild(footerSlot);
        }
      }

      footerSlot.className = "footer";
      footerSlot.innerHTML = `
        <div class="footer-container">
          <p>Crafted with passion by <strong>Zayd Ali Mohamed</strong>.</p>
          <div class="footer-links">
            <button id="terminal-footer-btn" class="footer-link-btn">Terminal CLI</button>
            <button id="ai-chat-footer-btn" class="footer-link-btn">AI Assistant</button>
          </div>
        </div>
      `;
    },

    /**
     * Initializes layout components across the page.
     */
    init() {
      this.renderHeader();
      this.renderFooter();
    }
  };

  global.LayoutManager = LayoutManager;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => LayoutManager.init());
  } else {
    LayoutManager.init();
  }
})(typeof window !== "undefined" ? window : this);
