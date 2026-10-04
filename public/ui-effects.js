/* ============================================
   CENTRALIZED UI/UX EFFECTS & INTERACTION ENGINE
   Single source of truth for Toast Notifications, Audio FX, 3D Tilt, and Project Filters.
   ============================================ */

(function (global) {
  // --------------------------------------------
  // 1. GLASSMORPHISM TOAST NOTIFICATION MANAGER
  // --------------------------------------------
  const ToastManager = {
    container: null,

    init() {
      if (this.container) return;
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    },

    show(message, type = "info", duration = 3000) {
      this.init();

      const icons = {
        success: "✓",
        error: "✕",
        info: "ℹ",
        copy: "📋"
      };

      const toast = document.createElement("div");
      toast.className = `toast-item toast-${type} reveal-toast`;
      toast.innerHTML = `
        <span class="toast-icon">${icons[type] || "✨"}</span>
        <span class="toast-text">${message}</span>
      `;

      this.container.appendChild(toast);

      // Play subtle sound feedback
      if (global.AudioManager) {
        if (type === "copy" || type === "success") global.AudioManager.play("success");
        else global.AudioManager.play("click");
      }

      setTimeout(() => {
        toast.classList.add("toast-hiding");
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  };

  // --------------------------------------------
  // 2. DEVELOPER WEB AUDIO FEEDBACK SYNTHESIZER
  // --------------------------------------------
  const AudioManager = {
    audioCtx: null,
    muted: localStorage.getItem("portfolio-audio-muted") === "true",

    init() {
      if (!this.audioCtx && typeof window !== "undefined") {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
    },

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem("portfolio-audio-muted", this.muted);
      if (ToastManager) {
        ToastManager.show(this.muted ? "Sound Effects Muted" : "Sound Effects Enabled", "info");
      }
      return this.muted;
    },

    play(soundType = "click") {
      if (this.muted) return;
      try {
        this.init();
        if (!this.audioCtx) return;
        if (this.audioCtx.state === "suspended") {
          this.audioCtx.resume();
        }

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        const now = this.audioCtx.currentTime;

        if (soundType === "click") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (soundType === "success") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (soundType === "modal") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(500, now + 0.08);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        }
      } catch (err) {
        // Audio synthesis fallback
      }
    }
  };

  // --------------------------------------------
  // 3. HIGH-TECH 3D TILT & SKELETON LOADER FX
  // --------------------------------------------
  const UIFxManager = {
    init3DTilt() {
      const cards = document.querySelectorAll(".project-card, .exp-card, .skill-card, .contact-quick-card");
      cards.forEach((card) => {
        if (card.dataset.tiltBound) return;
        card.dataset.tiltBound = "true";

        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0deg)";
        });
      });
    },

    getSkeletonHtml(count = 3) {
      let html = "";
      for (let i = 0; i < count; i++) {
        html += `
          <div class="skeleton-card">
            <div class="skeleton-image shimmer"></div>
            <div class="skeleton-line shimmer short"></div>
            <div class="skeleton-line shimmer medium"></div>
            <div class="skeleton-line shimmer long"></div>
          </div>
        `;
      }
      return html;
    }
  };

  // --------------------------------------------
  // 4. INTERACTIVE PROJECT FILTER & SEARCH ENGINE
  // --------------------------------------------
  const ProjectFilterManager = {
    currentCategory: "all",
    searchQuery: "",

    init() {
      const filterContainer = document.getElementById("project-filter-chips");
      const searchInput = document.getElementById("project-search-input");

      if (filterContainer && !filterContainer.dataset.initialized) {
        filterContainer.dataset.initialized = "true";
        filterContainer.addEventListener("click", (e) => {
          const btn = e.target.closest(".filter-chip-btn");
          if (!btn) return;

          filterContainer.querySelectorAll(".filter-chip-btn").forEach((chip) => chip.classList.remove("active"));
          btn.classList.add("active");
          this.currentCategory = btn.dataset.category || "all";
          this.applyFilter();
        });
      }

      if (searchInput && !searchInput.dataset.initialized) {
        searchInput.dataset.initialized = "true";
        searchInput.addEventListener("input", (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.applyFilter();
        });
      }
    },

    applyFilter() {
      const cards = document.querySelectorAll("#projects-grid .project-card, #featured-projects-grid .project-card");
      cards.forEach((card) => {
        const title = (card.querySelector(".project-title")?.textContent || "").toLowerCase();
        const desc = (card.querySelector(".project-desc")?.textContent || "").toLowerCase();
        const stack = (card.dataset.stack || card.textContent || "").toLowerCase();

        const matchesCategory =
          this.currentCategory === "all" ||
          stack.includes(this.currentCategory) ||
          (this.currentCategory === "mobile" && (stack.includes("flutter") || stack.includes("android"))) ||
          (this.currentCategory === "backend" && (stack.includes("spring") || stack.includes("c#") || stack.includes("express")));

        const matchesSearch = !this.searchQuery || title.includes(this.searchQuery) || desc.includes(this.searchQuery) || stack.includes(this.searchQuery);

        if (matchesCategory && matchesSearch) {
          card.style.display = "";
          card.classList.remove("hidden-filter");
        } else {
          card.style.display = "none";
          card.classList.add("hidden-filter");
        }
      });
    }
  };

  // --------------------------------------------
  // 5. WEB SPEECH API VOICE SYNTHESIS & STREAMING ENGINE
  // --------------------------------------------
  const VoiceAssistantManager = {
    speaking: false,
    synth: typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null,

    speak(text) {
      if (!this.synth || AudioManager.muted) return;
      this.stop();

      const cleanText = text.replace(/<[^>]*>/g, "").replace(/[\u{1F600}-\u{1F64F}]/gu, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => { this.speaking = false; };
      utterance.onerror = () => { this.speaking = false; };

      this.speaking = true;
      this.synth.speak(utterance);
    },

    stop() {
      if (this.synth) {
        this.synth.cancel();
        this.speaking = false;
      }
    },

    typeStream(element, text, speed = 18, onComplete) {
      if (!element) return;
      element.innerHTML = "";
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
          if (onComplete) onComplete();
        }
      }, speed);
    }
  };

  // --------------------------------------------
  // 6. MATRIX CODE RAIN VISUAL FX CANVAS
  // --------------------------------------------
  const MatrixRainManager = {
    canvas: null,
    ctx: null,
    interval: null,

    toggle() {
      if (this.canvas) {
        this.stop();
        if (ToastManager) ToastManager.show("Matrix Rain Effect Stopped", "info");
        return false;
      }
      this.start();
      if (ToastManager) ToastManager.show("Matrix Digital Code Rain Activated 🟢", "success");
      return true;
    },

    start() {
      if (this.canvas) return;
      this.canvas = document.createElement("canvas");
      this.canvas.id = "matrix-canvas";
      this.canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;pointer-events:none;opacity:0.85;";
      document.body.appendChild(this.canvas);

      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      const katakana = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const fontSize = 16;
      const columns = Math.floor(this.canvas.width / fontSize);
      const rainDrops = Array(columns).fill(1);

      this.interval = setInterval(() => {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#0F0";
        this.ctx.font = fontSize + "px monospace";

        for (let i = 0; i < rainDrops.length; i++) {
          const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
          this.ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

          if (rainDrops[i] * fontSize > this.canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
          }
          rainDrops[i]++;
        }
      }, 30);
    },

    stop() {
      if (this.interval) clearInterval(this.interval);
      if (this.canvas) this.canvas.remove();
      this.canvas = null;
      this.ctx = null;
      this.interval = null;
    }
  };

  // --------------------------------------------
  // 7. CENTRALIZED MOBILE COMPATIBILITY ENGINE
  // --------------------------------------------
  const MobileCompatibilityManager = {
    init() {
      this.updateViewportHeight();
      this.setupTouchGestures();
      this.setupMobileDrawerAutoClose();
      this.setupScrollLockHandler();

      window.addEventListener("resize", () => this.updateViewportHeight());
      window.addEventListener("orientationchange", () => this.updateViewportHeight());
    },

    /**
     * Fixes 100vh viewport height issue on mobile devices (iOS Safari & Android Chrome address bars)
     */
    updateViewportHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    },

    /**
     * Handles mobile touch swipe-left/right to dismiss overlays & drawers
     */
    setupTouchGestures() {
      let touchStartX = 0;
      let touchStartY = 0;

      document.addEventListener("touchstart", (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
        }
      }, { passive: true });

      document.addEventListener("touchend", (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Swipe right (horizontal swipe > 100px with small vertical drift)
        if (deltaX > 100 && Math.abs(deltaY) < 60) {
          const mobileOverlay = document.getElementById("mobile-nav-overlay");
          if (mobileOverlay && mobileOverlay.classList.contains("active")) {
            mobileOverlay.classList.remove("active");
            document.body.classList.remove("no-scroll");
          }
        }
      }, { passive: true });
    },

    /**
     * Auto-closes mobile drawer overlay when any navigation link is clicked
     */
    setupMobileDrawerAutoClose() {
      document.addEventListener("click", (e) => {
        const navLink = e.target.closest("#mobile-nav-overlay a");
        if (navLink) {
          const mobileOverlay = document.getElementById("mobile-nav-overlay");
          if (mobileOverlay) {
            mobileOverlay.classList.remove("active");
            document.body.classList.remove("no-scroll");
          }
        }
      });
    },

    /**
     * Locks background scroll when any modal or drawer is open
     */
    setupScrollLockHandler() {
      const observer = new MutationObserver(() => {
        const hasOpenModal = document.querySelector(".modal:not(.hidden), .terminal-drawer:not(.hidden), .mobile-nav-overlay.active");
        if (hasOpenModal) {
          document.body.classList.add("no-scroll");
        } else {
          document.body.classList.remove("no-scroll");
        }
      });

      observer.observe(document.body, { attributes: true, subtree: true, childList: true });
    }
  };

  // Export Managers to global scope
  global.ToastManager = ToastManager;
  global.AudioManager = AudioManager;
  global.UIFxManager = UIFxManager;
  global.ProjectFilterManager = ProjectFilterManager;
  global.VoiceAssistantManager = VoiceAssistantManager;
  global.MatrixRainManager = MatrixRainManager;
  global.MobileCompatibilityManager = MobileCompatibilityManager;

  // Auto-initialize on DOM ready
  const initAll = () => {
    ToastManager.init();
    UIFxManager.init3DTilt();
    ProjectFilterManager.init();
    MobileCompatibilityManager.init();

    // Bind copy-chip toasts
    document.addEventListener("click", (e) => {
      const copyBtn = e.target.closest("[data-copy]");
      if (copyBtn) {
        const textToCopy = copyBtn.getAttribute("data-copy");
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            ToastManager.show(`Copied: "${textToCopy}" to clipboard`, "copy");
          }).catch(() => {
            ToastManager.show(`Copied to clipboard`, "copy");
          });
        }
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})(typeof window !== "undefined" ? window : this);
