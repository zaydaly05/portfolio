/* ============================================
   SITE CONTENT BINDER
   Fills every dynamic region of the pages from the portfolio data served by /api/portfolio
   (database content). The text already in the HTML is only a no-JavaScript / fallback copy.
   ============================================ */
(function (global) {
  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const getPath = (obj, path) => path.split(".").reduce((o, key) => (o == null ? undefined : o[key]), obj);

  /** Values usable as {tokens} inside any site text. */
  function buildTokens(data) {
    const profile = data.profile || {};
    const name = profile.name || "";
    const projects = data.projects || [];
    return {
      name,
      firstName: name.split(" ")[0] || name,
      location: profile.location || "",
      email: profile.email || "",
      projectsCount: projects.length,
      certificatesCount: (data.certificates || []).filter((c) => c && c.kind !== "letter").length,
      internshipsCount: countInternships(data),
      skillCategoriesCount: (data.technicalSkills || []).length,
      technologiesCount: countTechnologies(data)
    };
  }

  /** Distinct languages, frameworks and tools across every skill group. */
  const countTechnologies = (data) =>
    new Set(
      (data.technicalSkills || [])
        .flatMap((g) => (g && Array.isArray(g.items) ? g.items : []))
        .map((item) => String(item).trim().toLowerCase())
        .filter(Boolean)
    ).size;

  const countInternships = (data) => (data.experience || []).filter((e) => /intern/i.test(`${e.role || ""} ${e.company || ""}`)).length;

  const fill = (text, tokens) => String(text ?? "").replace(/\{(\w+)\}/g, (match, key) => (key in tokens ? tokens[key] : match));

  const FORMATS = {
    handle: (v) => String(v).replace(/\/+$/, "").split("/").pop(),
    nowww: (v) => String(v).replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
  };
  const format = (el, value) => (FORMATS[el.dataset.bindFormat] ? FORMATS[el.dataset.bindFormat](value) : value);

  function bindText(data, tokens) {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const value = getPath(data, el.dataset.bind);
      if (typeof value === "string" && value.trim()) el.textContent = format(el, fill(value, tokens));
    });
    // Attribute bindings: data-bind-href / data-bind-src / data-bind-copy (copied by the copy chips)
    const attrMap = { "data-bind-href": "href", "data-bind-src": "src", "data-bind-copy": "data-copy" };
    Object.keys(attrMap).forEach((selector) => {
      document.querySelectorAll(`[${selector}]`).forEach((el) => {
        const value = getPath(data, el.getAttribute(selector));
        if (typeof value !== "string" || !value.trim()) return;
        const prefix = el.dataset.hrefPrefix || "";
        const suffix = el.dataset.hrefSuffix || "";
        el.setAttribute(attrMap[selector], selector === "data-bind-href" ? `${prefix}${value}${suffix}` : value);
      });
    });
  }

  function renderHeroPills(data) {
    const container = document.querySelector(".hero-tech-pills");
    const pills = data.heroPills;
    if (!container || !Array.isArray(pills) || !pills.length) return;
    container.innerHTML = pills
      .map(
        (p) =>
          `<span class="hero-tech-pill"><span class="tech-dot" style="background: ${escapeHtml(p.color || "#6366f1")}"></span>${escapeHtml(p.icon || "")} ${escapeHtml(p.label)}</span>`
      )
      .join("");
  }

  function renderHeroBadges(data) {
    const wrapper = document.querySelector(".profile-photo-wrapper");
    const badges = data.heroBadges;
    if (!wrapper || !Array.isArray(badges) || !badges.length) return;
    wrapper.querySelectorAll(".profile-floating-badge").forEach((el) => el.remove());
    const classes = ["badge-taqa", "badge-miu"];
    badges.slice(0, classes.length).forEach((b, i) => {
      const el = document.createElement("div");
      el.className = `profile-floating-badge ${classes[i]}`;
      el.innerHTML = `<span class="badge-icon">${escapeHtml(b.icon || "")}</span><span>${escapeHtml(b.text)}</span>`;
      wrapper.appendChild(el);
    });
  }

  function renderHeroSlides(data, tokens) {
    const track = document.getElementById("slider-track");
    const slides = data.heroSlides;
    if (!track || !Array.isArray(slides) || !slides.length) return;
    track.innerHTML = slides
      .map(
        (s, i) => `
      <div class="slider-slide${i === 0 ? " active" : ""}" data-index="${i}">
        <img src="${escapeHtml(s.image)}" alt="${escapeHtml(fill(s.imageAlt || s.title, tokens))}" class="slide-img" width="800" height="450" loading="lazy" />
        <div class="slide-overlay">
          <div class="slide-tag-row">
            <span class="slide-tag ${escapeHtml(s.tagStyle || "tag-backend")}">${escapeHtml(s.tag)}</span>
            <span class="slide-badge-mini">${escapeHtml(s.stackLine)}</span>
          </div>
          <h3 class="slide-title">${escapeHtml(fill(s.title, tokens))}</h3>
          <p class="slide-desc">${escapeHtml(fill(s.description, tokens))}</p>
          <div class="slide-action-row">
            <a href="${escapeHtml(s.ctaHref || "/projects")}" class="slide-btn ${escapeHtml(s.btnStyle || "")}">${escapeHtml(s.ctaLabel)}</a>
            <span class="slide-tech-chips">${(s.chips || []).map((c) => `<span class="chip-sm">${escapeHtml(c)}</span>`).join("")}</span>
          </div>
        </div>
      </div>`
      )
      .join("");
    const dots = document.getElementById("slider-dots");
    if (dots) {
      dots.innerHTML = slides.map((_, i) => `<span class="dot${i === 0 ? " active" : ""}" data-index="${i}"></span>`).join("");
    }
  }

  /** Number shown for a stat; github_repos is refined with live GitHub data by the counter script. */
  function statValue(stat, data, tokens) {
    switch (stat.source) {
      case "projects":
        return tokens.projectsCount;
      case "skill_categories":
        return tokens.skillCategoriesCount;
      case "certificates":
        return tokens.certificatesCount;
      case "internships":
        return tokens.internshipsCount;
      case "github_repos":
        return Math.max(Number(stat.value) || 0, tokens.projectsCount);
      case "technologies":
        return tokens.technologiesCount;
      case "lines_of_code":
      case "commits":
        return Number(stat.value) || 0; // replaced by the live figure when GitHub answers
      default:
        return Number(stat.value) || 0;
    }
  }

  function renderStats(data, tokens) {
    const row = document.getElementById("stat-counters-row");
    const stats = data.stats;
    if (!row || !Array.isArray(stats) || !stats.length) return;
    row.innerHTML = stats
      .map((s) => {
        const live = s.source === "lines_of_code" || s.source === "commits";
        const idAttr = (s.source === "github_repos" ? ' id="github-repos-stat"' : "") + (live ? ` data-live="${s.source}"` : "");
        const suffix = s.suffix === undefined ? "+" : s.suffix;
        return `
        <div class="stat-counter-box">
          <div class="stat-icon">${escapeHtml(s.icon || "")}</div>
          <span class="stat-number-val"${idAttr} data-target="${statValue(s, data, tokens)}">0</span><span class="stat-plus">${escapeHtml(suffix)}</span>
          <span class="stat-label-title">${escapeHtml(s.label)}</span>
        </div>`;
      })
      .join("");
  }

  /** Shrinks each gateway tag just enough to fit on a single line (never below 0.6rem). */
  function fitGatewayTags() {
    document.querySelectorAll(".gateway-card .eyebrow").forEach((tag) => {
      tag.style.removeProperty("--tag-fit-size");
      tag.style.removeProperty("--tag-fit-ls");
      let size = parseFloat(getComputedStyle(tag).fontSize);
      const min = 10.5;
      while (tag.scrollWidth > tag.clientWidth && size > min) {
        size -= 0.5;
        tag.style.setProperty("--tag-fit-size", `${size}px`);
      }
      // Still too wide: tighten the letter spacing before giving up (ellipsis is the last resort).
      let spacing = 0.14;
      while (tag.scrollWidth > tag.clientWidth && spacing > 0.01) {
        spacing -= 0.02;
        tag.style.setProperty("--tag-fit-ls", `${spacing.toFixed(2)}em`);
      }
    });
  }

  let fitTimer = null;
  global.addEventListener("resize", () => {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitGatewayTags, 120);
  });

  function renderGateways(data, tokens) {
    const grid = document.querySelector(".gateway-grid");
    const items = data.gateways;
    if (!grid || !Array.isArray(items) || !items.length) return;
    grid.innerHTML = items
      .map(
        (g) => `
      <div class="card gateway-card"${g.id ? ` id="${escapeHtml(g.id)}"` : ""}>
        <div>
          <div class="gateway-icon">${escapeHtml(g.icon || "")}</div>
          <span class="eyebrow ${escapeHtml(g.tagStyle || "")}">${escapeHtml(fill(g.tag, tokens))}</span>
          <h3>${escapeHtml(fill(g.title, tokens))}</h3>
          <p>${escapeHtml(fill(g.description, tokens))}</p>
        </div>
        <a href="${escapeHtml(g.href || "/")}" class="${escapeHtml(g.btnStyle || "btn gateway-btn")}">${escapeHtml(fill(g.ctaLabel, tokens))}</a>
      </div>`
      )
      .join("");
  }

  function renderFaq(data, tokens) {
    const grid = document.querySelector(".faq-grid");
    const items = data.faq;
    if (!grid || !Array.isArray(items) || !items.length) return;
    grid.innerHTML = items
      .map(
        (f) => `
      <div class="card" style="padding: 24px">
        <h5 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 8px; color: var(--brand)">${escapeHtml(fill(f.question, tokens))}</h5>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6">${escapeHtml(fill(f.answer, tokens))}</p>
      </div>`
      )
      .join("");
  }

  const BADGE_CLASS = { "full-stack": "badge-fullstack", "enterprise c#": "badge-enterprise" };

  function renderFeaturedProjects(data) {
    const grid = document.querySelector(".home-projects-grid");
    const projects = data.projects;
    if (!grid || !Array.isArray(projects) || !projects.length) return;
    let featured = projects.filter((p) => p.featured);
    if (!featured.length) featured = projects.slice(0, 3);
    grid.innerHTML = featured
      .slice(0, 6)
      .map((p) => {
        const tag = p.tag || (p.stack || "").split(",")[0] || "Project";
        const badgeClass = BADGE_CLASS[String(tag).toLowerCase()] || "";
        const meta = [p.period, p.stack].filter(Boolean).join(" · ");
        const image = p.image && !String(p.image).endsWith(".pdf") ? p.image : "";
        return `
      <article class="card home-project-card reveal-card">
        <div class="home-project-badge ${badgeClass}">${escapeHtml(tag)}</div>
        <div class="home-project-img-wrap">
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(p.name)}" width="300" height="200" loading="lazy" />` : ""}
        </div>
        <div class="home-project-body">
          <h4>${escapeHtml(p.name)}</h4>
          <p class="meta">${escapeHtml(meta)}</p>
          <p class="home-project-desc">${escapeHtml(p.description || "")}</p>
          <div class="home-project-footer">
            ${p.github ? `<a href="${escapeHtml(p.github)}" target="_blank" rel="noopener" class="btn-github-link">GitHub Repo ↗</a>` : ""}
            <a href="/projects" class="home-project-more">Full Hub Details →</a>
          </div>
        </div>
      </article>`;
      })
      .join("");
  }

  /** Profile-driven links and media that used to be hard-coded in the HTML / scripts. */
  function bindProfile(data, tokens) {
    const profile = data.profile || {};
    const photo = document.getElementById("profile-photo");
    if (photo && profile.photo) photo.src = profile.photo;
    if (profile.cvUrl) {
      // every CV link on the page points at the newest build, not the copy that was in the HTML
      document.querySelectorAll("#download-cv, a[download*='CV']").forEach((a) => {
        a.href = profile.cvUrl;
      });
    }
    document.querySelectorAll("[data-profile-name]").forEach((el) => {
      el.textContent = tokens.name;
    });
    const status = document.querySelector("#hero-status-pill .status-text");
    if (status && profile.availability) status.textContent = profile.availability;
    const eyebrowBrand = document.querySelectorAll("[data-site-name]");
    eyebrowBrand.forEach((el) => {
      el.textContent = tokens.name.toUpperCase();
    });
  }

  function apply(data) {
    if (!data || typeof data !== "object") return;
    const tokens = buildTokens(data);
    global.PORTFOLIO_DATA = data;
    bindText(data, tokens);
    bindProfile(data, tokens);
    renderHeroPills(data);
    renderHeroBadges(data);
    renderHeroSlides(data, tokens);
    renderStats(data, tokens);
    renderGateways(data, tokens);
    fitGatewayTags();
    renderFaq(data, tokens);
    renderFeaturedProjects(data);
  }

  // The shared header/footer/contact cards are rendered by layout.js; fill them if the data arrived first.
  global.addEventListener("layout:rendered", () => {
    if (global.PORTFOLIO_DATA) {
      const tokens = buildTokens(global.PORTFOLIO_DATA);
      bindText(global.PORTFOLIO_DATA, tokens);
      bindProfile(global.PORTFOLIO_DATA, tokens);
    }
  });

  global.SiteContent = { apply, buildTokens, fill };
})(window);
