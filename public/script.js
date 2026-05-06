/* ============================================
   UTILITY HELPERS
   ============================================ */
const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
};

const THEME_STORAGE_KEY = "portfolio-theme";
const WHATSAPP_NUMBER = "201017741741";
const PROFILE_PHOTO_CANDIDATES = [
  "/assets/main-photo.jpeg",
  "assets/main-photo.jpeg",
  "./assets/main-photo.jpeg",
  "../Assets/main-photo.jpeg",
  "Assets/main-photo.jpeg",
  "/Assets/main-photo.jpeg",
  "/assets/main-photo.jpg",
  "assets/main-photo.jpg",
  "./assets/main-photo.jpg",
  "../Assets/main-photo.jpg",
  "Assets/main-photo.jpg",
  "/Assets/main-photo.jpg",
  "/assets/main-photo.png",
  "assets/main-photo.png",
  "./assets/main-photo.png",
  "../Assets/main-photo.png",
  "Assets/main-photo.png",
  "/Assets/main-photo.png"
];

/* ============================================
   PORTFOLIO DATA (fallback)
   ============================================ */
const fallbackPortfolio = {
  profile: {
    name: "Zayd Ali Mohamed",
    title: "Junior Computer Science Student | Full-Stack Developer",
    location: "Maadi, Cairo",
    phone: "01017741741",
    email: "zaydaly0501@gmail.com",
    linkedin: "https://www.linkedin.com/in/zayd-ali-17a85a1a0",
    github: "https://github.com/zaydaly05",
    summary:
      "Motivated junior computer science student who loves technology and problem solving. I enjoy learning new skills, working on projects, and being part of workshops to grow in software development."
  },
  education: [
    { institution: "Misr International University", degree: "Bachelor of Science in Computer Science", period: "Sep 2023 - Jun 2027" }
  ],
  activities: [
    { name: "ACPC Club", role: "Member", period: "2023 - Present" },
    { name: "IEEE Club", role: "Member", period: "2023 - Present" }
  ],
  experience: [
    {
      company: "Cairo Higher Institute",
      role: "IT Department Intern",
      period: "August 2025 - September 2025",
      location: "1st Settlement, Cairo",
      points: [
        "Created and managed institutional user email accounts using the official domain.",
        "Edited and updated the front-end of the institute website using WordPress.",
        "Managed and maintained the institute's official social media accounts.",
        "Clipped, edited, and produced videos and photos for digital content."
      ]
    },
    {
      company: "TAQA Arabia",
      role: "Software Development Intern",
      period: "July 2025 - August 2025",
      location: "Maadi, Cairo",
      points: ["Contributed to developing the In Gaz API mobile application."]
    },
    {
      company: "TAQA Arabia",
      role: "IT Department Intern",
      period: "August 2024 - September 2024",
      location: "Maadi, Cairo",
      points: ["Handled devices software management.", "Managed user accounts and access support."]
    }
  ],
  projects: [
    {
      name: "Car Rental Website",
      period: "May 2025",
      stack: "HTML, CSS, MongoDB, Node.js, JavaScript",
      description:
        "Developed a comprehensive e-commerce style platform for users to browse and rent cars with authentication, catalog management, and order processing."
    },
    {
      name: "Restaurant Management System",
      period: "December 2024",
      stack: "Java, JavaFX",
      description:
        "Created a recruitment system with a graphical user interface for managing job postings, applications, and interviews using Java and JavaFX."
    },
    {
      name: "In Gaz API System",
      period: "July 2025",
      stack: "C#, Flutter, .NET Core Web API",
      description:
        "Built a Flutter frontend integrated with a C# .NET Core Web API backend using MVC, secure role-based access, CRUD operations, and Swagger testing."
    },
    {
      name: "Employee Attendance & Leave System",
      period: "December 2025",
      stack: "HTML, CSS, PHP, MySQL",
      description:
        "Developed a web-based attendance and leave platform with automated tracking and approval, event and announcement features, and secure role-based access."
    },
    {
      name: "Sleeping Alert System",
      period: "December 2025",
      stack: "Python, Flutter",
      description:
        "Developed a sleeping alert system for an HCI course, applying usability and interaction design principles with a responsive mobile interface."
    }
  ],
  technicalSkills: [
    { category: "Languages", items: ["PHP", "C", "Python", "Java", "HTML", "CSS", "JavaScript", "SQL", "C++", "C#", "Flutter", "Dart"] },
    { category: "Databases", items: ["SQL", "MongoDB", "Firebase"] },
    { category: "Frameworks", items: ["Node.js", "Express.js"] },
    { category: "Developer Tools", items: ["VS Code", "Apache NetBeans", "XAMPP", "Git", "GitHub", "Android Studio"] },
    { category: "Microsoft Office 365", items: ["Word", "Excel", "PowerPoint", "Access"] },
    { category: "Design Tools", items: ["Adobe Photoshop", "Adobe InDesign", "Adobe Premiere", "Filmora"] },
    { category: "Data Analysis", items: ["Orange Data Mining"] },
    { category: "Other Skills", items: ["Data Structures", "OOP"] }
  ],
  softSkills: ["Strong Teamwork Abilities", "Problem-Solving", "Time Management and Organizational Skills"],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "French", level: "Beginner" }
  ]
};

/* ============================================
   THEME MANAGEMENT
   ============================================ */
const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
  }
};

const setupThemeToggle = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "dark";
  applyTheme(savedTheme);

  const toggle = document.getElementById("theme-toggle");
  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  });
};

/* ============================================
   DATA FETCHING
   ============================================ */
const fetchPortfolio = async () => {
  const response = await fetch("/api/portfolio", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load portfolio data.");
  return response.json();
};

/* ============================================
   TYPED TEXT EFFECT
   ============================================ */
class TypedText {
  constructor(element, strings, options = {}) {
    this.el = element;
    this.strings = strings;
    this.typeSpeed = options.typeSpeed || 55;
    this.deleteSpeed = options.deleteSpeed || 35;
    this.delayBetween = options.delayBetween || 2200;
    this.loop = options.loop !== undefined ? options.loop : true;
    this.currentString = 0;
    this.currentChar = 0;
    this.isDeleting = false;

    // Create cursor
    this.cursor = document.createElement("span");
    this.cursor.className = "typed-cursor";
    this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);

    this.tick();
  }

  tick() {
    const fullText = this.strings[this.currentString];

    if (this.isDeleting) {
      this.currentChar--;
    } else {
      this.currentChar++;
    }

    this.el.textContent = fullText.substring(0, this.currentChar);

    let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.currentChar === fullText.length) {
      delay = this.delayBetween;
      if (this.loop || this.currentString < this.strings.length - 1) {
        this.isDeleting = true;
      } else {
        return; // Stop if not looping and we finished the last string
      }
    } else if (this.isDeleting && this.currentChar === 0) {
      this.isDeleting = false;
      this.currentString = (this.currentString + 1) % this.strings.length;
      delay = 400;
    }

    setTimeout(() => this.tick(), delay);
  }
}

/* ============================================
   PARTICLE SYSTEM
   ============================================ */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.particleCount = 60;
    this.connectionDistance = 120;
    this.mouseRadius = 150;

    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const particleColor = isLight ? "37, 99, 235" : "101, 240, 255";
    const lineColor = isLight ? "37, 99, 235" : "101, 240, 255";

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Mouse interaction: gentle push
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouseRadius) {
          const force = (this.mouseRadius - dist) / this.mouseRadius;
          p.vx += (dx / dist) * force * 0.02;
          p.vy += (dy / dist) * force * 0.02;
        }
      }

      // Speed damping
      p.vx *= 0.999;
      p.vy *= 0.999;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
      this.ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.connectionDistance) {
          const lineOpacity = (1 - dist / this.connectionDistance) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(${lineColor}, ${lineOpacity})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
const setupCustomCursor = () => {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  // Check for touch device
  if ("ontouchstart" in window) {
    dot.style.display = "none";
    ring.style.display = "none";
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX - 4 + "px";
    dot.style.top = mouseY - 4 + "px";
  });

  // Smooth ring follow
  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX - 20 + "px";
    ring.style.top = ringY - 20 + "px";
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Hover effect for interactive elements
  const interactives = "a, button, .card-clickable, .chip, input, textarea";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactives)) {
      ring.classList.add("hovering");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactives)) {
      ring.classList.remove("hovering");
    }
  });
};

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
const setupScrollProgress = () => {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleX(${progress})`;
  }, { passive: true });
};

/* ============================================
   NAVBAR SCROLL EFFECT & ACTIVE LINK
   ============================================ */
const setupNavbar = () => {
  const nav = document.getElementById("navbar");
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll(".section");

  window.addEventListener("scroll", () => {
    // Add/remove scrolled class
    if (window.scrollY > 60) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    // Active link highlight
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    links.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("data-section") === current) {
        link.classList.add("active");
      }
    });
  }, { passive: true });
};

/* ============================================
   CARD MOUSE GLOW EFFECT
   ============================================ */
const setupCardGlow = () => {
  document.addEventListener("mousemove", (e) => {
    const cards = document.querySelectorAll(".card, .btn, .btn-outline");
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", x + "%");
      card.style.setProperty("--mouse-y", y + "%");
    });
  });
};

/* ============================================
   MODAL
   ============================================ */
const modalState = { open: false };

const openModal = ({ tag, title, subtitle, description, points = [], media = [] }) => {
  const modal = document.getElementById("details-modal");
  if (!modal) return;

  setText("modal-tag", tag);
  setText("modal-title", title);
  setText("modal-subtitle", subtitle);
  setText("modal-description", description);

  const listContainer = document.getElementById("modal-list");
  listContainer.innerHTML = points.length
    ? `<ul>${points.map((point) => `<li>${point}</li>`).join("")}</ul>`
    : "";

  const mediaContainer = document.getElementById("modal-media");
  if (mediaContainer) {
    mediaContainer.className = media.length
      ? `modal-media-grid${media.length === 1 ? " modal-media-single" : ""}`
      : "modal-media-placeholder";
    mediaContainer.innerHTML = media.length
      ? media
          .map(
            (item, idx) => `
            <figure class="modal-media-item">
              <img src="${item.src}" alt="${item.alt || `Project media ${idx + 1}`}" loading="lazy" />
            </figure>
          `
          )
          .join("")
      : "<p>Add your project/experience images here later.</p>";
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalState.open = true;
};

const closeModal = () => {
  const modal = document.getElementById("details-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalState.open = false;
};

const attachCardModalHandlers = (selector, getPayload) => {
  document.querySelectorAll(selector).forEach((card, index) => {
    card.addEventListener("click", () => openModal(getPayload(index)));
    card.addEventListener("keypress", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(getPayload(index));
      }
    });
  });
};

/* ============================================
   RENDER FUNCTIONS
   ============================================ */
const renderExperience = (items) => {
  const container = document.getElementById("experience-list");
  const safeItems = Array.isArray(items) ? items : [];
  container.innerHTML = safeItems
    .map(
      (item) => `
      <article class="card card-clickable reveal-card js-exp-card" tabindex="0" role="button" aria-label="Open ${item.role || "experience"} details">
        <h4>${item.role || "-"}</h4>
        <p class="meta"><strong>${item.company || "-"}</strong> · ${item.location || "-"}</p>
        <p class="meta">${item.period || "-"}</p>
        <ul>${(item.points || []).map((point) => `<li>${point}</li>`).join("")}</ul>
      </article>
    `
    )
    .join("");

  attachCardModalHandlers(".js-exp-card", (index) => {
    const item = safeItems[index] || {};
    const isCairoHigherInstitute = (item.company || "").toLowerCase().includes("cairo higher institute");
    const isTaqaSoftwareDevelopment =
      (item.company || "").toLowerCase().includes("taqa arabia") &&
      (item.role || "").toLowerCase().includes("software development intern");
    const isTaqaItDepartment =
      (item.company || "").toLowerCase().includes("taqa arabia") &&
      (item.role || "").toLowerCase().includes("it department intern");
    return {
      tag: "Experience Details",
      title: item.role || "Experience",
      subtitle: `${item.company || ""} · ${item.location || ""} · ${item.period || ""}`,
      description: "Responsibilities and contributions:",
      points: item.points || [],
      media: isCairoHigherInstitute
        ? [{ src: "/assets/chi-experience.jpeg", alt: "Cairo Higher Institute experience image" }]
        : isTaqaSoftwareDevelopment
          ? [
              { src: "/assets/taqa25-exp.jpeg", alt: "TAQA Software Development Internship experience" },
              { src: "/assets/taqa25-crt.jpeg", alt: "TAQA Software Development Internship certificate" }
            ]
          : isTaqaItDepartment
            ? [
                { src: "/assets/taqa24.jpeg", alt: "TAQA IT Department internship image 24" },
                { src: "/assets/taqa24e.jpeg", alt: "TAQA IT Department internship image 24E" }
              ]
          : []
    };
  });
};

const renderProjects = (items) => {
  const container = document.getElementById("project-list");
  const safeItems = Array.isArray(items) ? items : [];
  container.innerHTML = safeItems
    .map(
      (item) => `
      <article class="card card-clickable reveal-card js-project-card" tabindex="0" role="button" aria-label="Open ${item.name || "project"} details">
        <h4>${item.name || "-"}</h4>
        <p class="meta">${item.period || "-"}</p>
        <p><strong>Stack:</strong> ${item.stack || "-"}</p>
        <p>${item.description || "-"}</p>
      </article>
    `
    )
    .join("");

  attachCardModalHandlers(".js-project-card", (index) => {
    const item = safeItems[index] || {};
    const isInGazProject = (item.name || "").toLowerCase().includes("in gaz api");
    const isCarRentalProject = (item.name || "").toLowerCase().includes("car rental website");
    return {
      tag: "Project Details",
      title: item.name || "Project",
      subtitle: `${item.period || ""} · ${item.stack || ""}`,
      description: item.description || "",
      points: isInGazProject ? [] : ["You can add project screenshots in this popup area later."],
      media: isInGazProject
        ? [
            { src: "/assets/ingaz-1.jpeg", alt: "In Gaz API app screenshot 1" },
            { src: "/assets/ingaz-2.jpeg", alt: "In Gaz API app screenshot 2" }
          ]
        : isCarRentalProject
          ? [
              { src: "/assets/car-rental-c1.png", alt: "Car Rental Website screenshot c1" },
              { src: "/assets/car-rental-c2.png", alt: "Car Rental Website screenshot c2" },
              { src: "/assets/car-rental-c3.png", alt: "Car Rental Website screenshot c3" }
            ]
          : []
    };
  });
};

const renderEducation = (items) => {
  const container = document.getElementById("education-list");
  const safeItems = Array.isArray(items) ? items : [];
  container.innerHTML = safeItems
    .map(
      (item) => `
      <article class="card reveal-card">
        <h4>${item.institution}</h4>
        <p>${item.degree}</p>
        <p class="meta">${item.period}</p>
      </article>
    `
    )
    .join("");
};

const renderActivities = (items) => {
  const container = document.getElementById("activities-list");
  const safeItems = Array.isArray(items) ? items : [];
  container.innerHTML = safeItems
    .map(
      (item) => `
      <article class="card reveal-card">
        <h4>${item.name}</h4>
        <p>${item.role}</p>
        <p class="meta">${item.period}</p>
      </article>
    `
    )
    .join("");
};

const renderTechnicalSkills = (groups) => {
  const container = document.getElementById("technical-skills-list");
  const safeGroups = Array.isArray(groups) ? groups : [];
  container.innerHTML = safeGroups
    .map(
      (group) => `
      <article class="card skill-group reveal-card">
        <h4>${group.category}</h4>
        <div class="skills">${group.items.map((item) => `<span class="chip">${item}</span>`).join("")}</div>
      </article>
    `
    )
    .join("");
};

const renderSoftSkills = (items) => {
  const container = document.getElementById("soft-skills-list");
  const safeItems = Array.isArray(items) ? items : [];
  container.innerHTML = safeItems.map((item) => `<span class="chip">${item}</span>`).join("");
};

const renderLanguages = (items) => {
  const container = document.getElementById("languages-list");
  const safeItems = Array.isArray(items) ? items : [];
  container.innerHTML = safeItems
    .map((item) => `<span class="chip">${item.name}: ${item.level}</span>`)
    .join("");
};

/* ============================================
   INTERSECTION OBSERVER (section + card reveals)
   ============================================ */
const setupReveal = () => {
  // Sections
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll(".reveal").forEach((el) => sectionObserver.observe(el));

  // Stagger containers
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.05 }
  );
  document.querySelectorAll(".reveal-stagger").forEach((el) => staggerObserver.observe(el));

  // Individual cards with staggered delay
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger based on sibling index
          const parent = entry.target.parentElement;
          const children = Array.from(parent.children);
          const idx = children.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, idx * 100);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll(".reveal-card").forEach((el) => cardObserver.observe(el));
};

/* ============================================
   CONTACT FORM
   ============================================ */
const setupContactForm = () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Opening WhatsApp...";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const name = payload.name || "Unknown";
    const email = payload.email || "Not provided";
    const message = payload.message || "";

    const whatsappText = [
      "New portfolio inquiry",
      `Name: ${name}`,
      `Email: ${email}`,
      `Message: ${message}`
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn("Contact API returned non-success; continuing with WhatsApp redirect.");
      }
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      status.textContent = "WhatsApp opened. Send the prefilled message to complete.";
      form.reset();
    } catch (error) {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      status.textContent = "WhatsApp opened. Send the prefilled message to complete.";
    }
  });
};

/* ============================================
   MODAL SETUP
   ============================================ */
const setupModal = () => {
  const closeBtn = document.getElementById("modal-close");
  const modal = document.getElementById("details-modal");
  if (!closeBtn || !modal) return;

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
      closeModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalState.open) {
      closeModal();
    }
  });
};

/* ============================================
   SMOOTH SCROLL for nav links
   ============================================ */
const setupSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};

/* ============================================
   HIDE SCROLL INDICATOR ON SCROLL
   ============================================ */
const setupScrollIndicator = () => {
  const indicator = document.getElementById("scroll-indicator");
  if (!indicator) return;

  let hidden = false;
  window.addEventListener("scroll", () => {
    if (!hidden && window.scrollY > 100) {
      indicator.style.opacity = "0";
      indicator.style.transition = "opacity 0.5s ease";
      hidden = true;
    }
  }, { passive: true });
};

/* ============================================
   PROFILE PHOTO FALLBACK
   ============================================ */
const setupProfilePhotoFallback = () => {
  const img = document.getElementById("profile-photo");
  if (!img) return;

  const tryLoad = (src) =>
    new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve(src);
      probe.onerror = () => resolve(null);
      probe.src = src;
    });

  const findFirstWorkingPhoto = async () => {
    for (const candidate of PROFILE_PHOTO_CANDIDATES) {
      const workingSrc = await tryLoad(candidate);
      if (workingSrc) {
        img.src = workingSrc;
        return;
      }
    }
  };

  findFirstWorkingPhoto();
};

/* ============================================
   INITIALIZE
   ============================================ */
const init = async () => {
  let data = fallbackPortfolio;
  try {
    data = await fetchPortfolio();
  } catch (error) {
    console.warn("Backend unavailable. Using fallback data.");
    console.error(error);
  }

  // Profile info
  const nameEl = document.getElementById("name");
  if (nameEl && data.profile?.name) {
    const parts = data.profile.name.split(" ");
    const firstName = parts[0];
    const rest = parts.slice(1).join(" ");
    nameEl.innerHTML = `${firstName} <span class="gradient-text">${rest}</span>`;
  }

  // Typed title effect
  const titleEl = document.getElementById("title");
  if (titleEl && data.profile?.title) {
    const titles = data.profile.title.split("|").map((s) => s.trim());
    new TypedText(titleEl, titles, {
      typeSpeed: 50,
      deleteSpeed: 30,
      delayBetween: 2500,
      loop: true
    });
  }

  setText("summary", data.profile?.summary);
  setText("location", `📍 ${data.profile?.location || ""}`);
  setText("email", `✉ ${data.profile?.email || ""}`);
  setText("phone", `📱 ${data.profile?.phone || ""}`);

  const linkedin = document.getElementById("linkedin");
  const github = document.getElementById("github");
  if (linkedin) linkedin.href = data.profile?.linkedin || "#";
  if (github) github.href = data.profile?.github || "#";

  // Render sections
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderEducation(data.education);
  renderActivities(data.activities);
  renderTechnicalSkills(data.technicalSkills);
  renderSoftSkills(data.softSkills);
  renderLanguages(data.languages);

  // Setup interactivity
  setupReveal();
  setupThemeToggle();
  setupModal();
  setupContactForm();
  setupCustomCursor();
  setupScrollProgress();
  setupNavbar();
  setupCardGlow();
  setupSmoothScroll();
  setupScrollIndicator();
  setupProfilePhotoFallback();

  // Particle system
  const canvas = document.getElementById("particles-canvas");
  if (canvas) new ParticleSystem(canvas);
};

init();
