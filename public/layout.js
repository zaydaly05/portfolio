/* ============================================
   CENTRALIZED LAYOUT & NAVIGATION MANAGER (SOLID DRY PATTERN)
   Single source of truth for site-wide Header Navigation, Mobile Menu, and Footer.
   Automatically mounts layout components and highlights active page links.
   ============================================ */

(function (global) {
  const LayoutManager = {
    /**
     * Renders header navigation bar and mobile menu overlay into target or header placeholder.
     */
    renderHeader() {
      const headerSlot = document.getElementById("site-header") || document.querySelector("header.site-header-container");
      if (!headerSlot && document.querySelector("nav.nav")) return; // already present

      const path = (window.location.pathname || "/").toLowerCase();
      const isHome = path === "/" || path.endsWith("/index.html");
      const isProjects = path.includes("projects");
      const isExperience = path.includes("experience");
      const isSkills = path.includes("skills");
      const isContact = path.includes("contact");

      const navHtml = `
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

      if (headerSlot) {
        headerSlot.innerHTML = navHtml;
      }
    },

    /**
     * Renders site footer into footer slot.
     */
    renderFooter() {
      const footerSlot = document.getElementById("site-footer") || document.querySelector("footer.footer-slot");
      if (!footerSlot && document.querySelector("footer.footer")) return; // already present

      const footerHtml = `
        <footer class="footer reveal">
          <div class="footer-content">
            <p>Crafted with passion by <strong>Zayd Ali Mohamed</strong>.</p>
            <div class="footer-links">
              <button id="terminal-footer-btn" class="footer-link-btn">Terminal CLI</button>
              <button id="ai-chat-footer-btn" class="footer-link-btn">Ask AI Copilot</button>
              <a href="https://github.com/zaydaly05" target="_blank" rel="noopener">GitHub</a>
              <a href="https://www.linkedin.com/in/zayd-ali-17a85a1a0" target="_blank" rel="noopener">LinkedIn</a>
              <a href="mailto:zaydaly0501@gmail.com">Email</a>
            </div>
            <p style="font-size: 0.75rem; opacity: 0.45; margin-top: 4px">
              © 2026 Zayd Ali Mohamed · Built with Node.js &amp; Express
            </p>
          </div>
        </footer>
      `;

      if (footerSlot) {
        footerSlot.innerHTML = footerHtml;
      }
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
