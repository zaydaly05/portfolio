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
     * Renders contact info cards dynamically into #contact-info-cards container.
     */
    renderContactCards() {
      const container = document.getElementById("contact-info-cards");
      if (!container) return;

      container.innerHTML = `
        <!-- Email -->
        <div class="contact-quick-card">
          <div class="quick-card-icon">📧</div>
          <div class="quick-card-info">
            <span>Email Address</span>
            <strong>zaydaly0501@gmail.com</strong>
          </div>
          <button class="btn-copy-chip" data-copy="zaydaly0501@gmail.com">Copy</button>
        </div>

        <!-- Phone / WhatsApp -->
        <div class="contact-quick-card">
          <div class="quick-card-icon">📱</div>
          <div class="quick-card-info">
            <span>Phone / WhatsApp</span>
            <strong>+20 101 774 1741</strong>
          </div>
          <button class="btn-copy-chip" data-copy="+201017741741">Copy</button>
        </div>

        <!-- LinkedIn Profile Card -->
        <div
          class="contact-quick-card linkedin-card-badge"
          style="background: rgba(10, 102, 194, 0.12); border: 1px solid rgba(10, 102, 194, 0.3)"
        >
          <div class="quick-card-icon" style="background: rgba(10, 102, 194, 0.2); color: #0a66c2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"
              />
            </svg>
          </div>
          <div class="quick-card-info">
            <span>Official LinkedIn Profile</span>
            <strong style="color: var(--text)">zayd-ali-17a85a1a0</strong>
          </div>
          <a
            href="https://www.linkedin.com/in/zayd-ali-17a85a1a0"
            target="_blank"
            rel="noopener"
            class="btn-copy-chip"
            style="background: #0a66c2; color: #fff; text-decoration: none"
            >Connect ↗</a
          >
        </div>

        <!-- Location -->
        <div class="contact-quick-card">
          <div class="quick-card-icon">📍</div>
          <div class="quick-card-info">
            <span>Location &amp; Time Zone</span>
            <strong>Maadi, Cairo, Egypt (UTC+3)</strong>
          </div>
        </div>

        <!-- Schedule Meeting Banner -->
        <div class="contact-schedule-banner">
          <h5>Schedule a Direct Interview</h5>
          <p>Recruiting for a position or looking for a software engineering candidate? Let's connect directly.</p>
          <a href="mailto:zaydaly0501@gmail.com?subject=Interview%20Inquiry%20-%20Zayd%20Ali" class="btn btn-sm">
            Schedule an Interview ✉️
          </a>
        </div>
      `;
    },

    /**
     * Initializes layout components across the page.
     */
    init() {
      this.renderHeader();
      this.renderFooter();
      this.renderContactCards();
    }
  };

  global.LayoutManager = LayoutManager;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => LayoutManager.init());
  } else {
    LayoutManager.init();
  }

  // Register Service Worker for offline asset caching and PWA performance
  if ("serviceWorker" in navigator && (window.location.protocol === "https:" || window.location.hostname === "localhost")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
})(typeof window !== "undefined" ? window : this);
