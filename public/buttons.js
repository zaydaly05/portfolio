/* ============================================
   COMMON BUTTONS COMPONENT REGISTRY (SOLID DRY PATTERN)
   Centralized single source of truth for all common website buttons.
   Callable by button ID or auto-mounted via [data-button-id] across all pages.
   ============================================ */

(function (global) {
  const BUTTON_TEMPLATES = {
    "open-terminal-nav-btn": () => `
      <button
        id="open-terminal-nav-btn"
        class="btn-outline btn-terminal-nav"
        type="button"
        title="Open Developer CLI"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
        CLI
      </button>
    `,
    "theme-toggle": (options = {}) => `
      <button id="theme-toggle" class="btn-outline theme-toggle" type="button">${options.label || "Light Mode"}</button>
    `,
    "preview-cv-nav-btn": () => `
      <button id="preview-cv-nav-btn" class="btn-outline btn-cv-nav" type="button">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        View CV
      </button>
    `,
    "hire-me-btn": (options = {}) => `
      <a id="hire-me-btn" class="${options.className || "btn"}" href="${options.href || "/contact"}">Hire Me</a>
    `,
    "hamburger-btn": () => `
      <button class="hamburger-btn" id="hamburger-btn" aria-label="Open navigation menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    `,
    "ai-chat-toggle-btn": () => `
      <button id="ai-chat-toggle-btn" class="ai-chat-toggle-btn" aria-label="Toggle Ask Zayd AI Copilot">
        <div class="ai-avatar-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
        <span class="ai-btn-text">Ask Zayd AI</span>
        <span class="ai-online-pulse"></span>
      </button>
    `,
    "btn-preview-cv-hero": () => `
      <button id="btn-preview-cv-hero" class="btn-outline btn-cv-hero" type="button">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        View CV
      </button>
    `,
    "cv-modal-download-btn": () => `
      <a href="https://res.cloudinary.com/delnnzcph/image/upload/v1791142658/zayd-portfolio/Zayd_Ali_Mohamed_CV.pdf" target="_blank" download="Zayd_Ali_Mohamed_CV.pdf" class="btn btn-sm">
        Download PDF 📥
      </a>
    `,
    "cv-modal-close": () => `
      <button id="cv-modal-close" class="modal-close" type="button" aria-label="Close CV Viewer">×</button>
    `,
    "terminal-close-btn": () => `
      <button id="terminal-close-btn" class="terminal-close-x">✕</button>
    `,
    "ai-chat-close-btn": () => `
      <button id="ai-chat-close-btn" class="ai-close-btn" aria-label="Close AI Chat">✕</button>
    `
  };

  const CommonButtons = {
    /**
     * Retrieves the raw HTML string for a common button by its ID.
     */
    getHtml(id, options = {}) {
      const templateFn = BUTTON_TEMPLATES[id];
      if (!templateFn) {
        console.warn(`CommonButtons: No template found for button ID "${id}"`);
        return "";
      }
      return templateFn(options).trim();
    },

    /**
     * Renders and mounts a common button into a target container or replaces a slot.
     */
    render(id, targetOrId, options = {}) {
      const el = typeof targetOrId === "string" ? document.getElementById(targetOrId) || document.querySelector(targetOrId) : targetOrId;
      if (!el) return null;

      const html = this.getHtml(id, options);
      if (!html) return null;

      const temp = document.createElement("div");
      temp.innerHTML = html;
      const newBtn = temp.firstElementChild;
      if (!newBtn) return null;

      el.replaceWith(newBtn);
      return newBtn;
    },

    /**
     * Scans the document for [data-button-id] elements and auto-mounts the corresponding button templates.
     */
    mountAll() {
      document.querySelectorAll("[data-button-id]").forEach((placeholder) => {
        const id = placeholder.getAttribute("data-button-id");
        if (id && BUTTON_TEMPLATES[id]) {
          this.render(id, placeholder);
        }
      });
    }
  };

  global.CommonButtons = CommonButtons;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => CommonButtons.mountAll());
  } else {
    CommonButtons.mountAll();
  }
})(typeof window !== "undefined" ? window : this);
