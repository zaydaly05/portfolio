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
      name: "Gulf Limousine Booking App",
      period: "July 2026",
      stack: "Flutter, Dart, Firebase, REST API",
      image: "/assets/gulf-limousine.jpg",
      github: "https://github.com/zaydaly05/Gulf_Limousine_App",
      description: "Cross-platform luxury limousine reservation & fleet tracking mobile app featuring real-time driver allocation, vehicle selection, fare estimation, and client booking management."
    },
    {
      name: "Essmat Plastic Factory Management System",
      period: "September 2026",
      stack: "C#, .NET, SQL Server, Entity Framework",
      image: "/assets/essmat-plastic-report.pdf",
      github: "https://github.com/zaydaly05/EssmatPlastic",
      description: "Enterprise inventory and production management solution for plastic manufacturing, optimizing raw material tracking, order processing, and factory billing workflows."
    },
    {
      name: "Dr. Naglaa Academic Biography Portal",
      period: "September 2026",
      stack: "HTML5, CSS3, JavaScript, Responsive UI",
      image: "/assets/dr-nagla-bio.jpeg",
      github: "https://github.com/zaydaly05/drNaglaBio",
      description: "Modern academic portfolio & publication showcase website designed for university faculty, featuring curriculum vitae integration, research paper archives, and student contact channels."
    },
    {
      name: "Food Ordering Management System",
      period: "May 2026",
      stack: "Spring Boot, Tailwind, React, MongoDB",
      image: "/assets/f1.png",
      github: "https://github.com/zaydaly05/food_ordering_system",
      description: "Developed a full-stack food ordering system with Spring Boot and a React + Tailwind frontend. Built RESTful APIs for authentication, menu management, cart operations, and order processing with MongoDB. Implemented role-based Admin and Customer flows with CRUD, order tracking, and analytics such as top-selling items and profit insights."
    },
    {
      name: "In Gaz API System",
      period: "July 2025",
      stack: "C#, Flutter, .NET Core Web API",
      image: "/assets/ingaz-1.jpeg",
      github: "https://github.com/zaydaly05/InGazAPI",
      description: "Built a Flutter frontend integrated with a C# .NET Core Web API backend using MVC, secure role-based access, CRUD operations, and Swagger testing."
    },
    {
      name: "Employee Attendance & Leave System",
      period: "December 2025",
      stack: "HTML, CSS, PHP, MySQL",
      image: "/assets/employee-e1.png",
      github: "https://github.com/zaydaly05/Employee_Attendance-Leave_Management_System",
      description: "Developed a web-based attendance and leave platform with automated tracking and approval, event/announcement features, and secure relational role-based access."
    },
    {
      name: "Car Rental Website",
      period: "May 2025",
      stack: "HTML, CSS, MongoDB, Node.js, JavaScript",
      image: "/assets/car-rental-c1.png",
      github: "https://github.com/zaydaly05/Car_Rental_Website",
      description: "Developed a comprehensive e-commerce style platform for users to browse and rent cars with authentication, catalog management, and order processing."
    },
    {
      name: "Restaurant Management System",
      period: "December 2024",
      stack: "Java, JavaFX",
      image: "/assets/restaurant-r1.png",
      github: "https://github.com/zaydaly05/Restaurant_Management_System",
      description: "Created a recruitment system with a graphical user interface for managing job postings, applications, and interviews using Java and JavaFX."
    },
    {
      name: "Sleeping Alert System",
      period: "December 2025",
      stack: "Python, Flutter",
      image: "/assets/sleeping-alert-py2.jpeg",
      github: "https://github.com/zaydaly05/Sleep_Alert_System",
      description: "Developed a sleeping alert system for an HCI course, applying usability and interaction design principles with a responsive mobile interface."
    },
    {
      name: "Zaydentity Digital Identity Platform",
      period: "September 2026",
      stack: "HTML5, CSS3, JavaScript",
      image: "/assets/main-photo.jpeg",
      github: "https://github.com/zaydaly05/zaydentity",
      description: "Digital personal branding & bio-link platform consolidating developer links, project highlights, and verified professional credentials in a unified interactive card UI."
    },
    {
      name: "WE Telecom Training Suite",
      period: "August 2026",
      stack: "Networking, C++, Telecommunications",
      image: "/assets/chi-experience.jpeg",
      github: "https://github.com/zaydaly05/WE_Intern",
      description: "Technical codebase & project artifacts developed during Telecom Egypt (WE) training, focusing on network protocol fundamentals, system administration, and enterprise infrastructure."
    }
  ],
  technicalSkills: [
    { category: "Languages", items: ["PHP", "C", "Python", "Java", "HTML", "CSS", "JavaScript", "SQL", "C++", "C#", "Flutter", "Dart", "Tailwind"] },
    { category: "Databases", items: ["SQL", "MongoDB", "Firebase"] },
    { category: "Frameworks", items: ["Node.js", "Express.js", "Spring Boot", "React"] },
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
   MODAL & LIGHTBOX
   ============================================ */
const modalState = { open: false };
const lightboxState = { open: false, images: [], index: 0 };
let modalMediaObserver = null;

const buildMediaHtml = (media) => {
  let imageIndex = 0;
  return media
    .map((item, idx) => {
      if (item.type === "video") {
        return `
          <figure class="modal-media-item">
            <video src="${item.src}" controls preload="metadata" playsinline></video>
          </figure>
        `;
      }

      const currentImageIndex = imageIndex;
      const eager = imageIndex < 3;
      imageIndex += 1;
      const alt = item.alt || `Project media ${idx + 1}`;

      return `
        <figure
          class="modal-media-item modal-media-clickable"
          data-lightbox-index="${currentImageIndex}"
          tabindex="0"
          role="button"
          aria-label="View ${alt} full size"
        >
          <div class="modal-media-skeleton" aria-hidden="true"></div>
          <img
            ${eager ? `src="${item.src}"` : `data-src="${item.src}"`}
            alt="${alt}"
            loading="${eager ? "eager" : "lazy"}"
            decoding="async"
            ${eager && currentImageIndex === 0 ? 'fetchpriority="high"' : ""}
          />
          <span class="modal-media-zoom-hint" aria-hidden="true">Click to enlarge</span>
        </figure>
      `;
    })
    .join("");
};

const markMediaLoaded = (img) => {
  img.classList.add("loaded");
  const figure = img.closest(".modal-media-item");
  if (figure) figure.classList.add("is-loaded");
};

const initModalMedia = (container, media) => {
  if (!container || !media.length) return;

  if (modalMediaObserver) {
    modalMediaObserver.disconnect();
    modalMediaObserver = null;
  }

  const scrollRoot = container.closest(".modal-card");
  const lazyImages = container.querySelectorAll("img[data-src]");

  if (lazyImages.length) {
    modalMediaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          if (!img.dataset.src) return;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          modalMediaObserver.unobserve(img);
        });
      },
      { root: scrollRoot, rootMargin: "200px 0px" }
    );
    lazyImages.forEach((img) => modalMediaObserver.observe(img));
  }

  container.querySelectorAll(".modal-media-item img").forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      markMediaLoaded(img);
    } else {
      img.addEventListener("load", () => markMediaLoaded(img), { once: true });
      img.addEventListener("error", () => markMediaLoaded(img), { once: true });
    }
  });

  const images = media.filter((item) => item.type !== "video");
  container.querySelectorAll(".modal-media-clickable").forEach((figure) => {
    const openFromFigure = () => {
      const index = Number(figure.dataset.lightboxIndex);
      if (!Number.isNaN(index)) openLightbox(images, index);
    };
    figure.addEventListener("click", (event) => {
      event.stopPropagation();
      openFromFigure();
    });
    figure.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        openFromFigure();
      }
    });
  });
};

const updateLightbox = () => {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  const counter = document.getElementById("lightbox-counter");
  const loader = document.getElementById("lightbox-loader");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  if (!lightbox || !img || !lightboxState.images.length) return;

  const item = lightboxState.images[lightboxState.index];
  const total = lightboxState.images.length;

  if (loader) loader.classList.add("active");
  img.classList.remove("loaded");

  const onReady = () => {
    if (loader) loader.classList.remove("active");
    img.classList.add("loaded");
  };

  img.onload = onReady;
  img.onerror = onReady;
  img.src = item.src;
  img.alt = item.alt || "";
  if (img.complete && img.naturalWidth > 0) onReady();

  if (caption) caption.textContent = item.alt || "";
  if (counter) counter.textContent = `${lightboxState.index + 1} / ${total}`;
  if (prevBtn) prevBtn.disabled = lightboxState.index === 0;
  if (nextBtn) nextBtn.disabled = lightboxState.index === total - 1;

  const preload = (offset) => {
    const target = lightboxState.images[lightboxState.index + offset];
    if (!target) return;
    const probe = new Image();
    probe.src = target.src;
  };
  preload(1);
  preload(-1);
};

const openLightbox = (images, startIndex = 0) => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox || !images.length) return;

  lightboxState.images = images;
  lightboxState.index = Math.max(0, Math.min(startIndex, images.length - 1));
  lightboxState.open = true;

  lightbox.classList.remove("hidden");
  lightbox.setAttribute("aria-hidden", "false");
  updateLightbox();
};

const closeLightbox = () => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  lightbox.classList.add("hidden");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxState.open = false;

  const img = document.getElementById("lightbox-img");
  if (img) {
    img.onload = null;
    img.onerror = null;
    img.removeAttribute("src");
    img.classList.remove("loaded");
  }
};

const shiftLightbox = (delta) => {
  if (!lightboxState.open || !lightboxState.images.length) return;
  const next = lightboxState.index + delta;
  if (next < 0 || next >= lightboxState.images.length) return;
  lightboxState.index = next;
  updateLightbox();
};

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
      ? buildMediaHtml(media)
      : "<p>Add your project/experience images here later.</p>";
    initModalMedia(mediaContainer, media);
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalState.open = true;
};

const closeModal = () => {
  if (lightboxState.open) closeLightbox();

  const modal = document.getElementById("details-modal");
  if (!modal) return;

  if (modalMediaObserver) {
    modalMediaObserver.disconnect();
    modalMediaObserver = null;
  }

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
  
  const getGithubUrl = (name, customGithub) => {
    if (customGithub) return customGithub;
    const repoNameMap = {
      "gulf limousine booking app": "https://github.com/zaydaly05/Gulf_Limousine_App",
      "essmat plastic factory management system": "https://github.com/zaydaly05/EssmatPlastic",
      "dr. naglaa academic biography portal": "https://github.com/zaydaly05/drNaglaBio",
      "food ordering management system": "https://github.com/zaydaly05/food_ordering_system",
      "in gaz api system": "https://github.com/zaydaly05/InGazAPI",
      "employee attendance & leave system": "https://github.com/zaydaly05/Employee_Attendance-Leave_Management_System",
      "car rental website": "https://github.com/zaydaly05/Car_Rental_Website",
      "restaurant management system": "https://github.com/zaydaly05/Restaurant_Management_System",
      "sleeping alert system": "https://github.com/zaydaly05/Sleep_Alert_System",
      "zaydentity digital identity platform": "https://github.com/zaydaly05/zaydentity",
      "we telecom training suite": "https://github.com/zaydaly05/WE_Intern"
    };
    return repoNameMap[(name || "").toLowerCase()] || `https://github.com/zaydaly05/${(name || "").replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  };

  container.innerHTML = safeItems
    .map((item) => {
      const githubUrl = getGithubUrl(item.name, item.github);
      const imgUrl = item.image || "/assets/main-photo.jpeg";
      const isPdf = imgUrl.endsWith(".pdf");

      return `
      <article class="card card-clickable reveal-card js-project-card" tabindex="0" role="button" aria-label="Open ${item.name || "project"} details">
        ${isPdf ? `
          <div class="project-card-image-wrap project-card-pdf-wrap">
            <span class="pdf-card-badge">📄 PDF Report</span>
            <p class="pdf-card-title">${item.name}</p>
          </div>
        ` : `
          <div class="project-card-image-wrap">
            <img src="${imgUrl}" alt="${item.name || "Project screenshot"}" class="project-card-img" loading="lazy" />
          </div>
        `}
        <div class="project-card-body">
          <div class="project-card-header">
            <h4>${item.name || "-"}</h4>
            <span class="live-sync-badge" title="Automatically synced with GitHub Repository">● Synced</span>
          </div>
          <p class="meta">${item.period || "-"}</p>
          <p><strong>Stack:</strong> ${item.stack || "-"}</p>
          <p class="project-desc">${item.description || "-"}</p>
          <div class="project-card-actions">
            <a href="${githubUrl}" target="_blank" rel="noopener" class="btn-github-link" onclick="event.stopPropagation();">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:text-bottom;margin-right:4px;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              View GitHub Repo ↗
            </a>
          </div>
        </div>
      </article>
    `;
    })
    .join("");

  attachCardModalHandlers(".js-project-card", (index) => {
    const item = safeItems[index] || {};
    const nameLower = (item.name || "").toLowerCase();
    const githubUrl = getGithubUrl(item.name, item.github);

    const isInGazProject = nameLower.includes("in gaz api");
    const isCarRentalProject = nameLower.includes("car rental website");
    const isRestaurantProject = nameLower.includes("restaurant management system");
    const isSleepingAlertProject = nameLower.includes("sleeping alert system");
    const isEmployeeAttendanceProject = nameLower.includes("employee attendance");
    const isFoodOrderingProject = nameLower.includes("food ordering management system");
    const isGulfLimousineProject = nameLower.includes("gulf limousine");
    const isEssmatPlasticProject = nameLower.includes("essmat plastic");
    const isDrNaglaBioProject = nameLower.includes("dr. naglaa");

    return {
      tag: "Project Details",
      title: item.name || "Project",
      subtitle: `${item.period || ""} · ${item.stack || ""}`,
      description: `${item.description || ""}\n\n🔗 Live Repository: ${githubUrl}`,
      points: [
        `Connected to live GitHub repository: ${githubUrl}`,
        `Automatically synced with GitHub commits`
      ],
      media: isGulfLimousineProject
        ? [{ src: "/assets/gulf-limousine.jpg", alt: "Gulf Limousine App screenshot" }]
        : isEssmatPlasticProject
        ? [{ src: "/assets/essmat-plastic-report.pdf", alt: "Essmat Plastic Customer Report PDF" }]
        : isDrNaglaBioProject
        ? [{ src: "/assets/dr-nagla-bio.jpeg", alt: "Dr Naglaa Academic Biography Portal" }]
        : isFoodOrderingProject
        ? Array.from({ length: 16 }, (_, i) => ({
            src: `/assets/f${i + 1}.png`,
            alt: `Food Ordering Management System screenshot f${i + 1}`
          }))
        : isInGazProject
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
        : isRestaurantProject
        ? [
            { src: "/assets/restaurant-r1.png", alt: "Restaurant Management System screenshot r1" },
            { src: "/assets/restaurant-r2.png", alt: "Restaurant Management System screenshot r2" },
            { src: "/assets/restaurant-r3.png", alt: "Restaurant Management System screenshot r3" },
            { src: "/assets/restaurant-r4.png", alt: "Restaurant Management System screenshot r4" },
            { src: "/assets/restaurant-r5.png", alt: "Restaurant Management System screenshot r5" }
          ]
        : isSleepingAlertProject
        ? [
            { src: "/assets/sleeping-alert-py2.jpeg", alt: "Sleeping Alert System screenshot py2" },
            { src: "/assets/sleeping-alert-py1.mp4", type: "video", alt: "Sleeping Alert System demo video py1" }
          ]
        : isEmployeeAttendanceProject
        ? [
            { src: "/assets/employee-e1.png", alt: "Employee Attendance and Leave System screenshot e1" },
            { src: "/assets/employee-e2.png", alt: "Employee Attendance and Leave System screenshot e2" },
            { src: "/assets/employee-e3.png", alt: "Employee Attendance and Leave System screenshot e3" },
            { src: "/assets/employee-e4.png", alt: "Employee Attendance and Leave System screenshot e4" }
          ]
        : [{ src: item.image || "/assets/main-photo.jpeg", alt: item.name }]
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

  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => shiftLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => shiftLightbox(1));

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.dataset.closeLightbox === "true") {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (lightboxState.open) {
      closeLightbox();
      return;
    }
    if (modalState.open) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightboxState.open) return;
    if (event.key === "ArrowLeft") shiftLightbox(-1);
    if (event.key === "ArrowRight") shiftLightbox(1);
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

  // Advanced Interactive Modules
  setupCairoClock();
  setupGitHubSync();
  setupProjectFiltering(data.projects);
  setupSkillFiltering(data.technicalSkills);
  setupTerminalCLI();
  setupAICopilot();
  setupCVViewerModal();
  setupCopyChips();

  // Particle system
  const canvas = document.getElementById("particles-canvas");
  if (canvas) new ParticleSystem(canvas);
};

/* ============================================
   CAIRO CLOCK & LIVE STATUS
   ============================================ */
const setupCairoClock = () => {
  const clockEl = document.getElementById("cairo-clock");
  if (!clockEl) return;

  const updateTime = () => {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString("en-US", {
      timeZone: "Africa/Cairo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  updateTime();
  setInterval(updateTime, 1000);
};

/* ============================================
   LIVE GITHUB SYNC
   ============================================ */
const setupGitHubSync = async () => {
  const reposContainer = document.getElementById("github-repos-list");
  if (!reposContainer) return;

  try {
    const res = await fetch("/api/github");
    if (!res.ok) throw new Error("GitHub sync API failed");
    const data = await res.json();

    setText("gh-username", `@${data.username}`);
    setText("gh-bio", data.bio);
    setText("gh-repos-count", data.publicRepos);
    setText("gh-followers-count", data.followers);

    const avatarImg = document.getElementById("gh-avatar");
    if (avatarImg && data.avatar) avatarImg.src = data.avatar;

    if (data.topRepos && data.topRepos.length > 0) {
      reposContainer.innerHTML = data.topRepos
        .map(
          (repo) => `
        <div class="gh-repo-card">
          <div>
            <div class="gh-repo-title">${repo.name}</div>
            <p class="gh-repo-desc">${repo.description}</p>
          </div>
          <div class="gh-repo-meta">
            <span class="gh-lang-tag"><span class="gh-lang-dot"></span> ${repo.language}</span>
            <div class="gh-repo-links">
              <span>⭐ ${repo.stars}</span>
              <a href="${repo.url}" target="_blank" rel="noopener" style="margin-left: 8px; color: var(--brand);">View ↗</a>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    } else {
      reposContainer.innerHTML = `<div class="github-loading">No public repositories found.</div>`;
    }
  } catch (err) {
    console.error("GitHub Sync error:", err);
    reposContainer.innerHTML = `<div class="github-loading">Visit Zayd's GitHub directly at <a href="https://github.com/zaydaly05" target="_blank" style="color:var(--brand)">github.com/zaydaly05</a></div>`;
  }
};

/* ============================================
   PROJECT FILTER & LIVE SEARCH
   ============================================ */
let rawProjects = [];
const setupProjectFiltering = (projects) => {
  rawProjects = projects || [];
  const searchInput = document.getElementById("project-search-input");
  const filterBtns = document.querySelectorAll("#project-filter-tabs .filter-btn");

  let currentCategory = "all";
  let searchQuery = "";

  const applyFilters = () => {
    const filtered = rawProjects.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.stack.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery);

      if (!matchSearch) return false;

      if (currentCategory === "all") return true;
      if (currentCategory === "fullstack") return p.stack.toLowerCase().includes("spring") || p.stack.toLowerCase().includes("react") || p.stack.toLowerCase().includes("full-stack");
      if (currentCategory === "mobile") return p.stack.toLowerCase().includes("flutter") || p.stack.toLowerCase().includes("api") || p.stack.toLowerCase().includes("c#");
      if (currentCategory === "web") return p.stack.toLowerCase().includes("html") || p.stack.toLowerCase().includes("php") || p.stack.toLowerCase().includes("node");
      if (currentCategory === "systems") return p.stack.toLowerCase().includes("java") || p.stack.toLowerCase().includes("python");

      return true;
    });

    renderProjects(filtered);
  };

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.filter || "all";
      applyFilters();
    });
  });
};

/* ============================================
   TECHNICAL SKILLS CATEGORY FILTERING
   ============================================ */
let rawSkillGroups = [];
const setupSkillFiltering = (skills) => {
  rawSkillGroups = skills || [];
  const skillTabs = document.querySelectorAll("#skills-filter-tabs .skill-tab");

  skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      skillTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const cat = tab.dataset.skillCat || "all";
      if (cat === "all") {
        renderTechnicalSkills(rawSkillGroups);
      } else {
        const filtered = rawSkillGroups.filter((g) => g.category.toLowerCase().includes(cat.toLowerCase()));
        renderTechnicalSkills(filtered);
      }
    });
  });
};

/* ============================================
   DEVELOPER TERMINAL CLI
   ============================================ */
const setupTerminalCLI = () => {
  const drawer = document.getElementById("terminal-drawer");
  const openNavBtn = document.getElementById("open-terminal-nav-btn");
  const closeBtn = document.getElementById("terminal-close-btn");
  const closeDot = document.getElementById("terminal-close-dot");
  const footerBtn = document.getElementById("terminal-footer-btn");
  const form = document.getElementById("terminal-input-form");
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");

  if (!drawer) return;

  const toggleTerminal = (show) => {
    if (show) {
      drawer.classList.remove("hidden");
      if (input) input.focus();
    } else {
      drawer.classList.add("hidden");
    }
  };

  if (openNavBtn) openNavBtn.addEventListener("click", () => toggleTerminal(true));
  if (footerBtn) footerBtn.addEventListener("click", () => toggleTerminal(true));
  if (closeBtn) closeBtn.addEventListener("click", () => toggleTerminal(false));
  if (closeDot) closeDot.addEventListener("click", () => toggleTerminal(false));

  const printLine = (text, className = "term-output-line") => {
    const div = document.createElement("div");
    div.className = className;
    div.innerHTML = text;
    output.appendChild(div);
    const body = document.getElementById("terminal-body");
    if (body) body.scrollTop = body.scrollHeight;
  };

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;

      printLine(`<span class="term-prompt">zayd@portfolio:~$</span> ${val}`);
      input.value = "";

      const cmd = val.toLowerCase();
      if (cmd === "help") {
        printLine(`Available Commands:
  • <span class="term-cmd">skills</span>   - List Zayd's technical skill set
  • <span class="term-cmd">projects</span> - Display Zayd's top projects & tech stacks
  • <span class="term-cmd">exp</span>      - Display internship & work experience
  • <span class="term-cmd">contact</span>  - View Zayd's email, phone, and LinkedIn
  • <span class="term-cmd">cv</span>       - Open the PDF CV viewer
  • <span class="term-cmd">whoami</span>   - Show current viewer identity
  • <span class="term-cmd">date</span>     - Show current Cairo date & time
  • <span class="term-cmd">hire</span>     - Quick message for recruiters
  • <span class="term-cmd">clear</span>    - Clear terminal output screen`);
      } else if (cmd === "skills") {
        printLine(`Zayd's Technical Skills:
  [Languages] Java, C#, C++, Python, JavaScript, PHP, Dart, SQL
  [Frameworks] Spring Boot, React, Node.js, Express, Flutter, .NET Core Web API
  [Databases] MongoDB, MySQL, Firebase
  [Tools] Git, GitHub, VS Code, NetBeans, Android Studio`);
      } else if (cmd === "projects") {
        printLine(`Featured Projects:
  1. Food Ordering Management System (Spring Boot + React + MongoDB)
  2. In Gaz API System (Flutter + C# .NET Core)
  3. Car Rental Website (Node.js + MongoDB)
  4. Employee Attendance System (PHP + MySQL)
  5. Sleeping Alert System (Python + Flutter)`);
      } else if (cmd === "exp") {
        printLine(`Work Experience:
  • Cairo Higher Institute - IT Dept Intern (Aug-Sep 2025)
  • TAQA Arabia - Software Dev Intern [In Gaz API] (Jul-Aug 2025)
  • TAQA Arabia - IT Dept Intern (Aug-Sep 2024)`);
      } else if (cmd === "contact") {
        printLine(`Contact Info:
  • Email: zaydaly0501@gmail.com
  • Phone: +20 101 774 1741
  • LinkedIn: linkedin.com/in/zayd-ali-17a85a1a0
  • GitHub: github.com/zaydaly05`);
      } else if (cmd === "cv") {
        printLine(`Opening CV Viewer modal...`);
        const cvModal = document.getElementById("cv-viewer-modal");
        if (cvModal) cvModal.classList.remove("hidden");
      } else if (cmd === "whoami") {
        printLine(`guest@recruiter-workstation ~ Welcome to Zayd Ali Mohamed's Portfolio!`);
      } else if (cmd === "date") {
        const cairoStr = new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" });
        printLine(`Cairo Local Time: ${cairoStr}`);
      } else if (cmd === "hire") {
        printLine(`Great choice! Zayd is actively open for software development roles. Email zaydaly0501@gmail.com or use the Contact form!`);
      } else if (cmd === "clear") {
        output.innerHTML = "";
      } else if (cmd === "sudo") {
        printLine(`Permission denied: Zayd is the root administrator 🚀`);
      } else {
        printLine(`Command not found: '${val}'. Type <span class="term-cmd">help</span> for a list of valid commands.`);
      }
    });
  }
};

/* ============================================
   AI COPILOT CHATBOT
   ============================================ */
const setupAICopilot = () => {
  const toggleBtn = document.getElementById("ai-chat-toggle-btn");
  const drawer = document.getElementById("ai-chat-drawer");
  const closeBtn = document.getElementById("ai-chat-close-btn");
  const footerBtn = document.getElementById("ai-chat-footer-btn");
  const form = document.getElementById("ai-chat-form");
  const input = document.getElementById("ai-chat-input");
  const body = document.getElementById("ai-chat-body");

  if (!toggleBtn || !drawer) return;

  const toggleDrawer = (show) => {
    if (show) {
      drawer.classList.remove("hidden");
      if (input) input.focus();
    } else {
      drawer.classList.add("hidden");
    }
  };

  toggleBtn.addEventListener("click", () => {
    const isHidden = drawer.classList.contains("hidden");
    toggleDrawer(isHidden);
  });

  if (closeBtn) closeBtn.addEventListener("click", () => toggleDrawer(false));
  if (footerBtn) footerBtn.addEventListener("click", () => toggleDrawer(true));

  const appendMsg = (text, sender = "bot", suggestions = []) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-chat-msg ai-msg-${sender}`;

    // Format bold markdown and links
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:var(--brand)">$1</a>');

    msgDiv.innerHTML = `<div class="msg-content">${formattedText}</div>`;
    body.appendChild(msgDiv);

    if (suggestions && suggestions.length > 0) {
      const suggDiv = document.createElement("div");
      suggDiv.className = "ai-suggestions-row";
      suggDiv.innerHTML = suggestions.map((s) => `<button class="ai-chip-btn">${s}</button>`).join("");
      body.appendChild(suggDiv);

      suggDiv.querySelectorAll(".ai-chip-btn").forEach((chip) => {
        chip.addEventListener("click", () => {
          sendUserMessage(chip.textContent);
        });
      });
    }

    body.scrollTop = body.scrollHeight;
  };

  const sendUserMessage = async (msgText) => {
    if (!msgText) return;
    appendMsg(msgText, "user");

    // Add typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.className = "ai-chat-msg ai-msg-bot";
    typingDiv.innerHTML = `<div class="msg-content">Thinking... 💭</div>`;
    body.appendChild(typingDiv);
    body.scrollTop = body.scrollHeight;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText })
      });
      const data = await res.json();
      body.removeChild(typingDiv);
      appendMsg(data.reply || "Thanks for your question!", "bot", data.suggestions);
    } catch (err) {
      console.error("AI Chat error:", err);
      body.removeChild(typingDiv);
      appendMsg("Zayd is currently offline, but you can reach him at zaydaly0501@gmail.com!", "bot");
    }
  };

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      sendUserMessage(text);
    });
  }

  // Bind initial chips
  document.querySelectorAll("#ai-initial-suggestions .ai-chip-btn").forEach((chip) => {
    chip.addEventListener("click", () => {
      sendUserMessage(chip.textContent);
    });
  });
};

/* ============================================
   CV VIEWER MODAL
   ============================================ */
const setupCVViewerModal = () => {
  const cvModal = document.getElementById("cv-viewer-modal");
  const closeBtn = document.getElementById("cv-modal-close");
  const backdrop = document.getElementById("cv-modal-backdrop");
  const navBtn = document.getElementById("preview-cv-nav-btn");
  const heroBtn = document.getElementById("btn-preview-cv-hero");

  if (!cvModal) return;

  const openCVModal = () => cvModal.classList.remove("hidden");
  const closeCVModal = () => cvModal.classList.add("hidden");

  if (navBtn) navBtn.addEventListener("click", openCVModal);
  if (heroBtn) heroBtn.addEventListener("click", openCVModal);
  if (closeBtn) closeBtn.addEventListener("click", closeCVModal);
  if (backdrop) backdrop.addEventListener("click", closeCVModal);
};

/* ============================================
   COPY CHIPS (Email / Phone)
   ============================================ */
const setupCopyChips = () => {
  document.querySelectorAll(".btn-copy-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const textToCopy = btn.dataset.copy;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        const original = btn.textContent;
        btn.textContent = "Copied! ✓";
        btn.style.background = "#10b981";
        btn.style.color = "#ffffff";
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = "";
          btn.style.color = "";
        }, 2000);
      }
    });
  });
};

init();

