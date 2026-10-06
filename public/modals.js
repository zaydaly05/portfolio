/* ============================================
   CENTRALIZED POP-UP & MODAL MANAGER (SOLID & DRY PATTERN)
   Single source of truth for all pop-up screens, lightboxes, and drawers.
   Callable by Modal ID: ModalManager.open(id, params) / ModalManager.close(id)
   ============================================ */

(function (global) {
  const MODAL_TEMPLATES = {
    "details-modal": () => `
      <div id="details-modal" class="modal hidden" aria-hidden="true">
        <div class="modal-backdrop" data-close-modal="true"></div>
        <div class="pm-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
          <button id="modal-close" class="pm-close" type="button" aria-label="Close details">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" /></svg>
          </button>

          <section id="modal-stage" class="pm-stage" aria-label="Project media">
            <div class="pm-viewer">
              <div id="modal-viewer-frame" class="pm-viewer-frame"></div>
              <button id="modal-prev" class="pm-nav pm-nav-prev" type="button" aria-label="Previous media">‹</button>
              <button id="modal-next" class="pm-nav pm-nav-next" type="button" aria-label="Next media">›</button>
              <div class="pm-viewer-bar">
                <span id="modal-counter" class="pm-counter" aria-live="polite"></span>
                <button id="modal-zoom" class="pm-zoom" type="button">Enlarge ⤢</button>
              </div>
            </div>
            <div id="modal-media" class="pm-thumbs"></div>
          </section>

          <section class="pm-panel">
            <div class="pm-panel-scroll">
              <div class="pm-badges">
                <span id="modal-tag" class="pm-badge pm-badge-accent">Details</span>
                <span id="modal-sync-badge" class="pm-badge pm-badge-ok"><span class="pm-dot" aria-hidden="true"></span>Synced with GitHub</span>
              </div>
              <h3 id="modal-title" class="pm-title"></h3>
              <p id="modal-subtitle" class="pm-subtitle"></p>
              <div id="modal-tech-pills" class="pm-pills"></div>

              <h4 class="pm-heading">Overview</h4>
              <p id="modal-description" class="pm-text"></p>

              <div id="modal-list-wrapper">
                <h4 class="pm-heading">Architecture &amp; capabilities</h4>
                <ul id="modal-list" class="pm-specs"></ul>
              </div>
            </div>

            <div id="modal-footer-actions" class="pm-footer">
              <a id="modal-github-btn" href="#" target="_blank" rel="noopener" class="pm-btn pm-btn-primary" style="display: none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                View on GitHub ↗
              </a>
              <a id="modal-pdf-btn" href="#" target="_blank" rel="noopener" download class="pm-btn pm-btn-secondary" style="display: none">
                Download PDF
              </a>
              <button type="button" class="pm-btn pm-btn-ghost btn-modal-close-action">Close</button>
            </div>
          </section>
        </div>
      </div>
    `,
    "cv-viewer-modal": () => `
      <div id="cv-viewer-modal" class="modal hidden" aria-hidden="true">
        <div class="modal-backdrop" id="cv-modal-backdrop"></div>
        <div class="pm-card pm-card--cv" role="dialog" aria-modal="true" aria-labelledby="cv-modal-title" tabindex="-1">
          <header class="pm-cv-header">
            <div>
              <span class="pm-eyebrow">Curriculum Vitae</span>
              <h3 id="cv-modal-title" class="pm-cv-title">Zayd Ali Mohamed — CV</h3>
            </div>
            <div class="cv-modal-actions">
              <a id="cv-modal-download-link" href="https://res.cloudinary.com/delnnzcph/image/upload/v1791142658/zayd-portfolio/Zayd_Ali_Mohamed_CV.pdf" target="_blank" rel="noopener" download="Zayd_Ali_Mohamed_CV.pdf" class="pm-btn pm-btn-primary">
                Download PDF
              </a>
              <button id="cv-modal-close" class="pm-close pm-close--inline" type="button" aria-label="Close CV Viewer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" /></svg>
              </button>
            </div>
          </header>
          <div class="cv-iframe-container">
            <div class="pm-cv-loading" aria-hidden="true">Loading CV…</div>
            <embed id="cv-iframe" type="application/pdf" title="CV" />
          </div>
        </div>
      </div>
    `,
    "lightbox": () => `
      <div id="lightbox" class="lightbox hidden" aria-hidden="true">
        <div class="lightbox-backdrop" data-close-lightbox="true"></div>
        <button id="lightbox-close" class="lightbox-close" type="button" aria-label="Close image viewer">×</button>
        <button id="lightbox-prev" class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">‹</button>
        <button id="lightbox-next" class="lightbox-nav lightbox-next" type="button" aria-label="Next image">›</button>
        <div class="lightbox-content">
          <div class="lightbox-loader" id="lightbox-loader" aria-hidden="true"></div>
          <img id="lightbox-img" alt="" />
          <p id="lightbox-caption" class="lightbox-caption"></p>
          <span id="lightbox-counter" class="lightbox-counter"></span>
        </div>
      </div>
    `,
    "terminal-drawer": () => `
      <div id="terminal-drawer" class="terminal-drawer hidden">
        <div class="terminal-header">
          <div class="terminal-window-dots">
            <span class="dot dot-red" id="terminal-close-dot"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="terminal-title">zayd@portfolio-cli:~</div>
          <button id="terminal-close-btn" class="terminal-close-x">✕</button>
        </div>
        <div class="terminal-body" id="terminal-body">
          <div class="terminal-welcome">
            <p class="term-glow">Welcome to Zayd Ali Mohamed's Interactive Terminal CLI v2.0!</p>
            <p>
              Type <span class="term-cmd">help</span> to see available commands (e.g.,
              <span class="term-cmd">skills</span>, <span class="term-cmd">projects</span>,
              <span class="term-cmd">exp</span>, <span class="term-cmd">contact</span>, <span class="term-cmd">cv</span>,
              <span class="term-cmd">clear</span>).
            </p>
          </div>
          <div id="terminal-output"></div>
          <form id="terminal-input-form" class="terminal-input-row">
            <span class="term-prompt">zayd@portfolio:~$</span>
            <input
              type="text"
              id="terminal-input"
              autocomplete="off"
              spellcheck="false"
              placeholder="type a command..."
            />
          </form>
        </div>
      </div>
    `,
    "ai-chat-widget": () => `
      <div id="ai-chat-widget" class="ai-chat-widget">
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

        <div id="ai-chat-drawer" class="ai-chat-drawer hidden">
          <div class="ai-chat-header">
            <div class="ai-header-info">
              <div class="ai-avatar-small">🤖</div>
              <div>
                <h5>Zayd Copilot AI</h5>
                <p class="ai-subtitle">Instant answer assistant</p>
              </div>
            </div>
            <button id="ai-chat-close-btn" class="ai-close-btn" aria-label="Close AI Chat">✕</button>
          </div>

          <div class="ai-chat-body" id="ai-chat-body">
            <div class="ai-chat-msg ai-msg-bot">
              <div class="msg-content">
                👋 Hi! I'm Zayd's AI assistant. Ask me anything about Zayd's technical background, projects, Spring Boot,
                React, C#, Flutter skills, or experience at TAQA Arabia!
              </div>
            </div>
            <div class="ai-suggestions-row" id="ai-initial-suggestions">
              <button class="ai-chip-btn">What is Zayd's tech stack?</button>
              <button class="ai-chip-btn">Tell me about TAQA Arabia</button>
              <button class="ai-chip-btn">Show top projects</button>
              <button class="ai-chip-btn">How to contact Zayd?</button>
            </div>
          </div>

          <form id="ai-chat-form" class="ai-chat-input-row">
            <input type="text" id="ai-chat-input" placeholder="Ask Zayd AI anything..." autocomplete="off" />
            <button type="submit" class="ai-send-btn" aria-label="Send message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    `
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  const ModalManager = {
    /**
     * Ensures all required pop-up modal containers exist in the DOM.
     */
    ensureMounted() {
      Object.keys(MODAL_TEMPLATES).forEach((modalId) => {
        if (!document.getElementById(modalId)) {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = MODAL_TEMPLATES[modalId]().trim();
          document.body.appendChild(wrapper.firstElementChild);
        }
      });
      this._bindGlobalEvents();
    },

    /**
     * Opens a pop-up modal or drawer by ID, optionally configuring dynamic parameters.
     */
    open(modalId, params = {}) {
      this.ensureMounted();
      const el = document.getElementById(modalId);
      if (!el) {
        console.warn(`ModalManager: No modal found with ID "${modalId}"`);
        return;
      }

      // Configure dynamic parameters based on modal type
      if (modalId === "details-modal" && params) {
        this._populateDetailsModal(params);
      } else if (modalId === "cv-viewer-modal" && params) {
        if (params.cvUrl) {
          const iframe = document.getElementById("cv-iframe");
          if (iframe && iframe.getAttribute("src") !== params.cvUrl) {
            iframe.setAttribute("src", params.cvUrl);
          }
          const downloadLink = document.getElementById("cv-modal-download-link");
          if (downloadLink) {
            downloadLink.href = params.cvUrl;
          }
        }
      }

      const isDialog = el.classList.contains("modal");
      if (isDialog) lastFocused = document.activeElement;
      el.classList.remove("hidden");
      el.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (isDialog) {
        const card = el.querySelector(".pm-card");
        if (card) requestAnimationFrame(() => card.focus({ preventScroll: true }));
      }

      // Dispatch event for observers
      window.dispatchEvent(new CustomEvent("modal:opened", { detail: { modalId, params } }));
    },

    /**
     * Closes a pop-up modal or drawer by ID.
     */
    close(modalId) {
      const el = document.getElementById(modalId);
      if (!el) return;
      el.classList.add("hidden");
      el.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (el.classList.contains("modal") && lastFocused && document.contains(lastFocused)) {
        lastFocused.focus({ preventScroll: true });
        lastFocused = null;
      }

      // Dispatch event for observers
      window.dispatchEvent(new CustomEvent("modal:closed", { detail: { modalId } }));
    },

    /**
     * Toggles visibility of a pop-up modal or drawer by ID.
     */
    toggle(modalId, params = {}) {
      const el = document.getElementById(modalId);
      if (el && !el.classList.contains("hidden")) {
        this.close(modalId);
      } else {
        this.open(modalId, params);
      }
    },

    /**
     * Checks if a pop-up modal or drawer is currently open.
     */
    isOpen(modalId) {
      const el = document.getElementById(modalId);
      return el ? !el.classList.contains("hidden") : false;
    },

    /**
     * Populates the details-modal elements dynamically.
     */
    _populateDetailsModal(payload) {
      const setElText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text || "";
      };

      setElText("modal-tag", payload.tag || "Details");
      setElText("modal-title", payload.title || "");
      setElText("modal-subtitle", payload.subtitle || "");
      setElText("modal-description", payload.description || "");
      const syncBadge = document.getElementById("modal-sync-badge");
      if (syncBadge) syncBadge.style.display = payload.githubUrl ? "" : "none";

      // Tech Pills
      const techPillsContainer = document.getElementById("modal-tech-pills");
      if (techPillsContainer) {
        const stackItems = (payload.stack || "").split(",").map((s) => s.trim()).filter(Boolean);
        techPillsContainer.innerHTML = stackItems
          .map((tech) => `<span class="pm-pill">${escapeHtml(tech)}</span>`)
          .join("");
      }

      // Specifications / Capabilities List
      const listContainer = document.getElementById("modal-list");
      const listWrapper = document.getElementById("modal-list-wrapper");
      if (listContainer && listWrapper) {
        if (Array.isArray(payload.points) && payload.points.length > 0) {
          listWrapper.style.display = "block";
          listContainer.innerHTML = payload.points
            .map((pt) => `<li class="pm-spec"><span class="pm-spec-mark" aria-hidden="true"></span><span>${escapeHtml(pt)}</span></li>`)
            .join("");
        } else {
          listWrapper.style.display = "none";
        }
      }

      // Media Showcase (rendered by initModalMedia in script.js)
      const mediaList = Array.isArray(payload.media) ? payload.media : [];
      const card = document.querySelector("#details-modal .pm-card");
      const thumbs = document.getElementById("modal-media");
      const viewerFrame = document.getElementById("modal-viewer-frame");
      if (thumbs) thumbs.innerHTML = "";
      if (viewerFrame) viewerFrame.innerHTML = "";
      if (card) card.classList.toggle("pm-card--no-media", mediaList.length === 0);
      const panelScroll = document.querySelector("#details-modal .pm-panel-scroll");
      if (panelScroll) panelScroll.scrollTop = 0;

      // Action Buttons
      const githubBtn = document.getElementById("modal-github-btn");
      if (githubBtn) {
        if (payload.githubUrl) {
          githubBtn.href = payload.githubUrl;
          githubBtn.style.display = "inline-flex";
        } else {
          githubBtn.style.display = "none";
        }
      }

      const pdfBtn = document.getElementById("modal-pdf-btn");
      if (pdfBtn) {
        if (payload.pdfUrl) {
          pdfBtn.href = payload.pdfUrl;
          pdfBtn.style.display = "inline-flex";
        } else {
          pdfBtn.style.display = "none";
        }
      }
    },

    /**
     * Binds global event handlers for backdrop clicks, close buttons, and ESC key.
     */
    _bindGlobalEvents() {
      if (this._eventsBound) return;
      this._eventsBound = true;

      // ESC key listener
      document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          const open = document.querySelector(".modal:not(.hidden) .pm-card");
          if (!open) return;
          const items = [...open.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
          if (!items.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (e.shiftKey && (document.activeElement === first || document.activeElement === open)) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          return;
        }
        if (e.key === "Escape") {
          if (e.defaultPrevented || this.isOpen("lightbox")) return;
          ["details-modal", "cv-viewer-modal", "lightbox", "terminal-drawer", "ai-chat-drawer"].forEach((id) => {
            if (this.isOpen(id)) {
              this.close(id);
            }
          });
        }
      });

      // Global click listener for backdrop and close triggers
      document.addEventListener("click", (e) => {
        if (e.target.matches("[data-close-modal], #cv-modal-backdrop, #modal-close, #cv-modal-close, .btn-modal-close-action")) {
          const openModal = e.target.closest(".modal");
          if (openModal && openModal.id) {
            this.close(openModal.id);
          }
        }
      });
    }
  };

  global.ModalManager = ModalManager;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ModalManager.ensureMounted());
  } else {
    ModalManager.ensureMounted();
  }
})(typeof window !== "undefined" ? window : this);
