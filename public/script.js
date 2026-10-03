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
  "https://res.cloudinary.com/delnnzcph/image/upload/v1790790773/zayd-portfolio/main-photo.jpg",
  "https://res.cloudinary.com/delnnzcph/image/upload/v1790790773/zayd-portfolio/main-photo.jpg",
  "https://res.cloudinary.com/delnnzcph/image/upload/v1790790773/zayd-portfolio/main-photo.jpg",
  "../Assets/main-photo.jpeg",
  "Assets/main-photo.jpeg",
  "/Assets/main-photo.jpeg"
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
    {
      institution: "Misr International University",
      degree: "Bachelor of Science in Computer Science",
      period: "Sep 2023 - Jun 2027"
    }
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
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790766/zayd-portfolio/gulf-limousine.jpg",
      github: "https://github.com/zaydaly05/Gulf_Limousine_App",
      description:
        "Cross-platform luxury limousine reservation & fleet tracking mobile app featuring real-time driver allocation, vehicle selection, fare estimation, and client booking management."
    },
    {
      name: "Essmat Plastic Factory Management System",
      period: "September 2026",
      stack: "C#, .NET, SQL Server, Entity Framework",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1790864034/esmatPlastic.jpg",
      pdfReport:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1790790736/zayd-portfolio/essmat-plastic-report.pdf",
      github: "https://github.com/zaydaly05/EssmatPlastic",
      description:
        "Enterprise inventory and production management solution for plastic manufacturing, optimizing raw material tracking, order processing, and factory billing workflows."
    },
    {
      name: "Dr. Naglaa Academic Biography Portal",
      period: "September 2026",
      stack: "HTML5, CSS3, JavaScript, Responsive UI",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790721/zayd-portfolio/dr-nagla-bio.jpg",
      github: "https://github.com/zaydaly05/drNaglaBio",
      description:
        "Modern academic portfolio & publication showcase website designed for university faculty, featuring curriculum vitae integration, research paper archives, and student contact channels."
    },
    {
      name: "Food Ordering Management System",
      period: "May 2026",
      stack: "Spring Boot, Tailwind, React, MongoDB",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1790864034/foodApplogo.png",
      github: "https://github.com/zaydaly05/food_ordering_system",
      description:
        "Developed a full-stack food ordering system with Spring Boot and a React + Tailwind frontend. Built RESTful APIs for authentication, menu management, cart operations, and order processing with MongoDB. Implemented role-based Admin and Customer flows with CRUD, order tracking, and analytics such as top-selling items and profit insights."
    },
    {
      name: "In Gaz API System",
      period: "July 2025",
      stack: "C#, Flutter, .NET Core Web API",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790771/zayd-portfolio/ingaz-1.jpg",
      github: "https://github.com/zaydaly05/InGazAPI",
      description:
        "Built a Flutter frontend integrated with a C# .NET Core Web API backend using MVC, secure role-based access, CRUD operations, and Swagger testing."
    },
    {
      name: "Employee Attendance & Leave System",
      period: "December 2025",
      stack: "HTML, CSS, PHP, MySQL",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790731/zayd-portfolio/employee-e1.png",
      github: "https://github.com/zaydaly05/Employee_Attendance-Leave_Management_System",
      description:
        "Developed a web-based attendance and leave platform with automated tracking and approval, event/announcement features, and secure relational role-based access."
    },
    {
      name: "Car Rental Website",
      period: "May 2025",
      stack: "HTML, CSS, MongoDB, Node.js, JavaScript",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790766/zayd-portfolio/gulf-limousine.jpg",
      github: "https://github.com/zaydaly05/Car_Rental_Website",
      description:
        "Developed a comprehensive e-commerce style platform for users to browse and rent cars with authentication, catalog management, and order processing."
    },
    {
      name: "Restaurant Management System",
      period: "December 2024",
      stack: "Java, JavaFX",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790805/zayd-portfolio/restaurant-r1.png",
      github: "https://github.com/zaydaly05/Restaurant_Management_System",
      description:
        "Created a recruitment system with a graphical user interface for managing job postings, applications, and interviews using Java and JavaFX."
    },
    {
      name: "Sleeping Alert System",
      period: "December 2025",
      stack: "Python, Flutter",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790811/zayd-portfolio/sleeping-alert-py2.jpg",
      github: "https://github.com/zaydaly05/Sleep_Alert_System",
      description:
        "Developed a sleeping alert system for an HCI course, applying usability and interaction design principles with a responsive mobile interface."
    },
    {
      name: "Zaydentity Digital Identity Platform",
      period: "September 2026",
      stack: "HTML5, CSS3, JavaScript",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790773/zayd-portfolio/main-photo.jpg",
      github: "https://github.com/zaydaly05/zaydentity",
      description:
        "Digital personal branding & bio-link platform consolidating developer links, project highlights, and verified professional credentials in a unified interactive card UI."
    },
    {
      name: "WE Telecom Training Suite",
      period: "August 2026",
      stack: "Networking, C++, Telecommunications",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790719/zayd-portfolio/chi-experience.jpg",
      github: "https://github.com/zaydaly05/WE_Intern",
      description:
        "Technical codebase & project artifacts developed during Telecom Egypt (WE) training, focusing on network protocol fundamentals, system administration, and enterprise infrastructure."
    }
  ],

  featuredStack: [
    {
      name: "Java & Spring Boot",
      category: "Backend",
      level: 90,
      color: "#6db33f",
      icon: "☕",
      projectsCount: 3,
      highlights: "Enterprise REST APIs, Spring Security, Microservices, JavaFX"
    },
    {
      name: "React.js & Modern Web",
      category: "Frontend",
      level: 88,
      color: "#61dafb",
      icon: "⚛️",
      projectsCount: 4,
      highlights: "Dynamic UIs, SPA routing, Tailwind, State Management"
    },
    {
      name: "Flutter & Dart",
      category: "Mobile",
      level: 85,
      color: "#02569b",
      icon: "📱",
      projectsCount: 3,
      highlights: "Cross-platform iOS/Android, Firebase, State Management, REST integration"
    },
    {
      name: "C# & .NET Core",
      category: "Enterprise & API",
      level: 85,
      color: "#9b4f96",
      icon: "🔷",
      projectsCount: 3,
      highlights: "ASP.NET Core Web API, Entity Framework, C# Desktop Apps"
    },
    {
      name: "SQL & NoSQL Databases",
      category: "Data Architecture",
      level: 88,
      color: "#47a248",
      icon: "🗄️",
      projectsCount: 5,
      highlights: "PostgreSQL, MySQL, MongoDB, Firebase Firestore, Schema Design"
    },
    {
      name: "Node.js & Express",
      category: "Backend",
      level: 82,
      color: "#5fa04e",
      icon: "🟢",
      projectsCount: 2,
      highlights: "Node RESTful backends, JWT Authentication, Async I/O"
    },
    {
      name: "Python",
      category: "Scripting & AI",
      level: 80,
      color: "#3776ab",
      icon: "🐍",
      projectsCount: 2,
      highlights: "Data structures, Automation scripts, Computer Vision / OpenCV"
    },
    {
      name: "Git & Version Control",
      category: "DevOps & Tools",
      level: 92,
      color: "#f05032",
      icon: "🔀",
      projectsCount: 10,
      highlights: "Branching workflows, GitHub Sync, Collaborative Repos"
    }
  ],
  technicalSkills: [
    {
      category: "Languages",
      items: ["Java", "Python", "C#", "C++", "C", "PHP", "Dart", "JavaScript", "SQL", "HTML5", "CSS3"]
    },
    {
      category: "Frameworks",
      items: ["Spring Boot", "React", "Flutter", "Express.js", "Node.js", ".NET Core Web API", "JavaFX", "Tailwind CSS"]
    },
    { category: "Databases", items: ["PostgreSQL", "MongoDB", "Firebase", "MySQL", "SQL Server"] },
    {
      category: "Developer Tools",
      items: ["VS Code", "Git", "GitHub", "Android Studio", "Apache NetBeans", "XAMPP", "Docker", "Postman", "Swagger"]
    },
    { category: "Microsoft Office 365", items: ["Word", "Excel", "PowerPoint", "Access"] },
    { category: "Design Tools", items: ["Adobe Photoshop", "Adobe InDesign", "Adobe Premiere", "Filmora"] },
    { category: "Data Analysis", items: ["Orange Data Mining"] },
    {
      category: "Other Skills",
      items: [
        "Data Structures & Algorithms",
        "Object-Oriented Programming (OOP)",
        "RESTful API Architecture",
        "Database Schema Design"
      ]
    }
  ],
  softSkills: [
    {
      title: "Problem Solving & Analytical Thinking",
      icon: "🧩",
      desc: "Deconstructing complex enterprise requirements into modular, scalable object-oriented software architectures."
    },
    {
      title: "Teamwork & Cross-functional Collaboration",
      icon: "🤝",
      desc: "Proven track record during TAQA Arabia & WE internships working alongside senior developers, IT teams, and stakeholders."
    },
    {
      title: "Time Management & Agile Execution",
      icon: "⏱️",
      desc: "Balancing rigorous university software engineering coursework with commercial software client deliverables and internships."
    },
    {
      title: "Adaptability & Continuous Upskilling",
      icon: "🚀",
      desc: "Rapidly mastering emerging frameworks (Spring Boot, Flutter, React) and integrating new tools into production."
    }
  ],
  languages: [
    {
      name: "Arabic",
      level: "Native Speaker",
      percent: 100,
      flag: "🇪🇬",
      desc: "Mother tongue — fluent in technical, written & verbal communication"
    },
    {
      name: "English",
      level: "Fluent / Professional",
      percent: 90,
      flag: "🇬🇧",
      desc: "Full professional proficiency in engineering documentation & teamwork"
    },
    {
      name: "French",
      level: "Elementary",
      percent: 35,
      flag: "🇫🇷",
      desc: "Basic conversational skills & foundational vocabulary"
    }
  ],
  certificates: [
    {
      title: "TAQA Arabia Software Internship Certificate",
      issuer: "TAQA Arabia — Software Engineering Dept",
      date: "August 2025",
      category: "Industry Experience",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1790790780/zayd-portfolio/Online%20Certificates/Exp_letter_taqa_2025.png",
      pdf: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790815/zayd-portfolio/Taqa25Crt.jpg",
      desc: "Official engineering internship certificate recognizing contribution to the In Gaz API mobile platform."
    },
    {
      title: "Cisco JavaScript Essentials 1 & 2",
      issuer: "Cisco Networking Academy & OpenEDG JS Institute",
      date: "July 2025",
      category: "Full-Stack Development",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1790791216/zayd-portfolio/Online%20Certificates/js1.png",
      pdf: "/assets/Online%20Certificates/JavaScriptEssentials2Update20250713-27-31fbam.pdf",
      desc: "Advanced JavaScript ES6+, asynchronous programming, object-oriented concepts, and DOM manipulation."
    },
    {
      title: "Cisco C Essentials 1 Certification",
      issuer: "Cisco Networking Academy & OpenEDG C Institute",
      date: "July 2025",
      category: "Systems & Core Programming",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1790790774/zayd-portfolio/Online%20Certificates/c-essentials-1.png",
      pdf: "/assets/Online%20Certificates/CEssentials1Update20250709-29-hnum8q.pdf",
      desc: "Low-level system programming, memory management, pointers, and algorithmic structures in C."
    },
    {
      title: "Introduction to Cybersecurity Certification",
      issuer: "Cisco Networking Academy",
      date: "July 2025",
      category: "Cybersecurity & Networks",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1790790785/zayd-portfolio/Online%20Certificates/Introduction_To_Cybersecurity_C.png",
      pdf: "/assets/Online%20Certificates/I2CSUpdate20250709-27-93jy0g.pdf",
      desc: "Network security protocols, vulnerability analysis, encryption fundamentals, and threat mitigation."
    },
    {
      title: "CSS & Modern Web Development",
      issuer: "Cisco OpenEDG Academy",
      date: "July 2025",
      category: "Frontend Architecture",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1790790778/zayd-portfolio/Online%20Certificates/css-essentials.png",
      pdf: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790779/zayd-portfolio/Online%20Certificates/CSS.png",
      desc: "Responsive layout design, Flexbox, CSS Grid, animation frameworks, and modern CSS3 aesthetics."
    },
    {
      title: "Cairo Higher Institute Experience Letter",
      issuer: "Cairo Higher Institute — IT Dept",
      date: "September 2025",
      category: "Industry Experience",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1790790781/zayd-portfolio/Online%20Certificates/Experience_letter_CHI.jpg",
      pdf: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790719/zayd-portfolio/chi-experience.jpg",
      desc: "Institutional user account management, website front-end maintenance, and digital content production."
    }
  ]
};

/* ============================================
   THEME MANAGEMENT
   ============================================ */
const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.textContent = theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode";
  }
};

const setupThemeToggle = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "dark";
  applyTheme(savedTheme);

  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
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

  let mouseX = 0,
    mouseY = 0;
  let ringX = 0,
    ringY = 0;

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

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${progress})`;
    },
    { passive: true }
  );
};

/* ============================================
   NAVBAR SCROLL EFFECT & ACTIVE LINK
   ============================================ */
const setupNavbar = () => {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll(".section");

  window.addEventListener(
    "scroll",
    () => {
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
    },
    { passive: true }
  );
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

  document.body.appendChild(lightbox);
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

  const listContainer = document.getElementById("modal-list") || document.getElementById("modal-points");
  if (listContainer) {
    listContainer.innerHTML = points.length ? `<ul>${points.map((point) => `<li>${point}</li>`).join("")}</ul>` : "";
  }

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

  document.body.appendChild(modal);
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
  if (!container) return;
  const safeItems = Array.isArray(items) ? items : [];

  container.className = "experience-timeline";

  const companyStyle = (company = "") => {
    const c = company.toLowerCase();
    if (c.includes("taqa"))
      return { color: "var(--brand)", bg: "var(--brand-glow)", border: "rgba(101, 240, 255, 0.25)" };
    if (c.includes("cairo higher") || c.includes("chi"))
      return { color: "#c084fc", bg: "rgba(192, 132, 252, 0.15)", border: "rgba(192, 132, 252, 0.3)" };
    return { color: "#34d399", bg: "rgba(52, 211, 153, 0.15)", border: "rgba(52, 211, 153, 0.3)" };
  };

  const roleIcon = (role = "") => {
    const r = role.toLowerCase();
    if (r.includes("software")) return "💻";
    if (r.includes("it department")) return "🖥️";
    if (r.includes("data")) return "📊";
    return "🏢";
  };

  const getMediaBadgeText = (company = "", role = "") => {
    const c = company.toLowerCase();
    const r = role.toLowerCase();
    if (c.includes("taqa") && r.includes("software")) return "📸 2 Photos & Certificate";
    if (c.includes("taqa") && r.includes("it department")) return "📸 2 Photos";
    if (c.includes("cairo higher") || c.includes("chi")) return "📸 Photo Available";
    return null;
  };

  container.innerHTML = safeItems
    .map((item) => {
      const cStyle = companyStyle(item.company);
      const mediaText = getMediaBadgeText(item.company, item.role);

      return `
      <article
        class="card card-clickable reveal-card js-exp-card exp-timeline-card"
        tabindex="0"
        role="button"
        aria-label="Open ${item.role || "experience"} details"
      >
        <div class="exp-card-inner">
          <div class="exp-card-icon">${roleIcon(item.role)}</div>

          <div style="flex:1; min-width:0;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span class="exp-company-chip" style="color:${cStyle.color}; background:${cStyle.bg}; border-color:${cStyle.border};">
                ${item.company || "–"}
              </span>
              ${mediaText ? `<span class="exp-media-badge">${mediaText}</span>` : ""}
            </div>

            <h4 class="exp-role-title">${item.role || "–"}</h4>

            <div class="exp-meta-row">
              <span class="exp-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${item.period || "–"}
              </span>
              <span class="exp-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${item.location || "–"}
              </span>
            </div>

            ${
              (item.points || []).length > 0
                ? `
            <ul class="exp-points-preview">
              ${(item.points || [])
                .slice(0, 2)
                .map((p) => `<li>${p}</li>`)
                .join("")}
              ${(item.points || []).length > 2 ? `<li class="exp-more-points">+${(item.points || []).length - 2} more responsibilities →</li>` : ""}
            </ul>`
                : ""
            }

            <div style="margin-top:12px;">
              <span class="exp-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                View Full Details &amp; Gallery ↗
              </span>
            </div>
          </div>
        </div>
      </article>
    `;
    })
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
      description: "Key Responsibilities, Achievements & Contributions:",
      points: item.points || [],
      media: isCairoHigherInstitute
        ? [
            {
              src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790719/zayd-portfolio/chi-experience.jpg",
              alt: "Cairo Higher Institute experience photo"
            }
          ]
        : isTaqaSoftwareDevelopment
          ? [
              {
                src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790814/zayd-portfolio/taqa25-exp.jpg",
                alt: "TAQA Software Development Internship experience photo"
              },
              {
                src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790813/zayd-portfolio/taqa25-crt.jpg",
                alt: "TAQA Software Development Internship official certificate"
              }
            ]
          : isTaqaItDepartment
            ? [
                {
                  src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790812/zayd-portfolio/taqa24.jpg",
                  alt: "TAQA IT Department internship photo 1"
                },
                {
                  src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790812/zayd-portfolio/taqa24e.jpg",
                  alt: "TAQA IT Department internship photo 2"
                }
              ]
            : []
    };
  });
};

const renderProjects = (items) => {
  const container = document.getElementById("project-list");
  if (!container) return;
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
    return (
      repoNameMap[(name || "").toLowerCase()] ||
      `https://github.com/zaydaly05/${(name || "").replace(/[^a-zA-Z0-9_-]/g, "_")}`
    );
  };

  container.innerHTML = safeItems
    .map((item) => {
      const githubUrl = getGithubUrl(item.name, item.github);
      const imgUrl =
        item.image && !item.image.endsWith(".pdf")
          ? item.image
          : "https://res.cloudinary.com/delnnzcph/image/upload/v1790790725/zayd-portfolio/dr-nagla-hero.png";
      const pdfUrl = item.pdfReport || (item.image && item.image.endsWith(".pdf") ? item.image : null);

      return `
      <article class="card card-clickable reveal-card js-project-card" tabindex="0" role="button" aria-label="Open ${item.name || "project"} details">
        <div class="project-card-image-wrap">
          <img src="${imgUrl}" alt="${item.name || "Project output screenshot"}" class="project-card-img" loading="lazy" />
        </div>
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
            ${pdfUrl ? `<a href="${pdfUrl}" target="_blank" download class="btn-pdf-link" onclick="event.stopPropagation();">📄 PDF Report 📥</a>` : ""}
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

    const autoScreenshots = Array.isArray(item.screenshots) && item.screenshots.length > 0 ? item.screenshots : null;

    return {
      tag: item.showcaseStatus === "Completed" ? "Project Details · Showcase Captured" : "Project Details",
      title: item.name || "Project",
      subtitle: `${item.period || ""} · ${item.stack || ""}`,
      description: `${item.description || ""}\n\n🔗 GitHub Repo: ${githubUrl}`,
      points: [
        `Live repository link: ${githubUrl}`,
        `Automatically synced with GitHub project commits`,
        item.showcaseStatus ? `Automated Showcase Status: ${item.showcaseStatus}` : null
      ].filter(Boolean),
      media: autoScreenshots || (isDrNaglaBioProject
        ? [
            {
              src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790725/zayd-portfolio/dr-nagla-hero.png",
              alt: "Dr Naglaa Academic Portal Hero"
            },
            {
              src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790722/zayd-portfolio/dr-nagla-biography.png",
              alt: "Dr Naglaa Biography & Academic Credentials"
            },
            {
              src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790727/zayd-portfolio/dr-nagla-publications.png",
              alt: "Dr Naglaa Research Publications"
            },
            {
              src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790723/zayd-portfolio/dr-nagla-contact.png",
              alt: "Dr Naglaa Academic Contact Section"
            }
          ]
        : isGulfLimousineProject
          ? [
              {
                src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790766/zayd-portfolio/gulf-limousine.jpg",
                alt: "Gulf Limousine App - Luxury Mobile Reservation Interface"
              },
              {
                src: "/assets/showcase/Gulf_Limousine_App/Gulf_Limousine_App-landing.jpg",
                alt: "Gulf Limousine App - Android Mobile Viewport Booking Screen"
              },
              {
                src: "/assets/showcase/Gulf_Limousine_App/Gulf_Limousine_App-feature-1.jpg",
                alt: "Gulf Limousine App - Vehicle Fleet Selection View"
              },
              {
                src: "/assets/showcase/Gulf_Limousine_App/Gulf_Limousine_App-details.jpg",
                alt: "Gulf Limousine App - Fare Estimation & Trip Details"
              }
            ]
          : isEssmatPlasticProject
            ? [
                {
                  src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790864034/esmatPlastic.jpg",
                  alt: "Essmat Plastic Factory Management System - Architecture & Data Schema"
                },
                {
                  src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790736/zayd-portfolio/essmat-plastic-report.pdf",
                  alt: "Essmat Plastic Factory Management System - Official PDF Report Document"
                },
                {
                  src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790731/zayd-portfolio/employee-e1.png",
                  alt: "Essmat Plastic Factory Management System - Inventory & Material Management View"
                },
                {
                  src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790732/zayd-portfolio/employee-e2.png",
                  alt: "Essmat Plastic Factory Management System - Factory Orders & Billing Interface"
                }
              ]
            : isFoodOrderingProject
              ? [
                  {
                    src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791061797/zayd-portfolio/showcase/food_ordering_system/food_ordering_system-landing.jpg",
                    alt: "Food Ordering Management System - Main Application Landing Screen"
                  },
                  {
                    src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791061794/zayd-portfolio/showcase/food_ordering_system/food_ordering_system-feature-2.jpg",
                    alt: "Food Ordering Management System - Food Hub Menu Browse"
                  },
                  {
                    src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791061795/zayd-portfolio/showcase/food_ordering_system/food_ordering_system-feature-3.jpg",
                    alt: "Food Ordering Management System - Customer Cart & Order Summary"
                  },
                  {
                    src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791061796/zayd-portfolio/showcase/food_ordering_system/food_ordering_system-feature-4.jpg",
                    alt: "Food Ordering Management System - Restaurant Management Portal"
                  },
                  {
                    src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791061797/zayd-portfolio/showcase/food_ordering_system/food_ordering_system-feature-5.jpg",
                    alt: "Food Ordering Management System - WhatsApp Support Integration"
                  },
                  {
                    src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791062965/zayd-portfolio/showcase/food_ordering_system/food_ordering_system-feature-6.jpg",
                    alt: "Food Ordering Management System - User Authentication & Login Portal"
                  }
                ]
              : isInGazProject
                ? [
                    {
                      src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790771/zayd-portfolio/ingaz-1.jpg",
                      alt: "In Gaz API System - Flutter Mobile App Screen 1"
                    },
                    {
                      src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790772/zayd-portfolio/ingaz-2.jpg",
                      alt: "In Gaz API System - Flutter Mobile App Screen 2"
                    },
                    {
                      src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791061861/zayd-portfolio/showcase/InGazAPI/InGazAPI-landing.jpg",
                      alt: "In Gaz API System - .NET Core Web API Swagger Documentation"
                    },
                    {
                      src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791061862/zayd-portfolio/showcase/InGazAPI/InGazAPI-details.jpg",
                      alt: "In Gaz API System - MVC Controller Data Endpoint Schema"
                    }
                  ]
                : isCarRentalProject
                  ? [
                      {
                        src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790715/zayd-portfolio/car-rental-c1.png",
                        alt: "Car Rental Website - Vehicle Fleet Catalog Overview"
                      },
                      {
                        src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790716/zayd-portfolio/car-rental-c2.png",
                        alt: "Car Rental Website - Car Specifications & Features View"
                      },
                      {
                        src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790718/zayd-portfolio/car-rental-c3.png",
                        alt: "Car Rental Website - Customer Booking & Checkout Form"
                      },
                      {
                        src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790707/zayd-portfolio/c1.png",
                        alt: "Car Rental Website - Platform Main Landing Page"
                      }
                    ]
                  : isRestaurantProject
                    ? [
                        {
                          src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790805/zayd-portfolio/restaurant-r1.png",
                          alt: "Restaurant Management System - JavaFX Main Login & Role Selection"
                        },
                        {
                          src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790805/zayd-portfolio/restaurant-r2.png",
                          alt: "Restaurant Management System - Food & Menu Order Interface"
                        },
                        {
                          src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790806/zayd-portfolio/restaurant-r3.png",
                          alt: "Restaurant Management System - Table Allocation Grid View"
                        },
                        {
                          src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790807/zayd-portfolio/restaurant-r4.png",
                          alt: "Restaurant Management System - Reservation System View"
                        },
                        {
                          src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790808/zayd-portfolio/restaurant-r5.png",
                          alt: "Restaurant Management System - Billing & Order Summary"
                        }
                      ]
                    : isSleepingAlertProject
                      ? [
                          {
                            src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790811/zayd-portfolio/sleeping-alert-py2.jpg",
                            alt: "Sleeping Alert System - OpenCV Drowsiness Detection Photo"
                          },
                          {
                            src: "https://res.cloudinary.com/delnnzcph/video/upload/v1790790810/zayd-portfolio/sleeping-alert-py1.mp4",
                            type: "video",
                            alt: "Sleeping Alert System - Realtime Facial Bounding Box Video Demo"
                          },
                          {
                            src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791061885/zayd-portfolio/showcase/Sleep_Alert_System/Sleep_Alert_System-landing.jpg",
                            alt: "Sleeping Alert System - Mobile Flutter Monitor Screen"
                          },
                          {
                            src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791061887/zayd-portfolio/showcase/Sleep_Alert_System/Sleep_Alert_System-details.jpg",
                            alt: "Sleeping Alert System - Driver Eye Aspect Ratio Threshold Dashboard"
                          }
                        ]
                      : isEmployeeAttendanceProject
                        ? [
                            {
                              src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790731/zayd-portfolio/employee-e1.png",
                              alt: "Employee Attendance and Leave System - Admin Dashboard Overview"
                            },
                            {
                              src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790732/zayd-portfolio/employee-e2.png",
                              alt: "Employee Attendance and Leave System - New Assessment / Post Announcement"
                            },
                            {
                              src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790734/zayd-portfolio/employee-e3.png",
                              alt: "Employee Attendance and Leave System - Login & Landing Screen"
                            },
                            {
                              src: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790735/zayd-portfolio/employee-e4.png",
                              alt: "Employee Attendance and Leave System - Leave History & Status Table"
                            }
                          ]
                        : [
                            {
                              src:
                                item.image ||
                                "https://res.cloudinary.com/delnnzcph/image/upload/v1790790773/zayd-portfolio/main-photo.jpg",
                              alt: item.name
                            }
                          ])
    };
  });
};

const renderEducation = (items) => {
  const container = document.getElementById("education-list");
  if (!container) return;
  const safeItems = Array.isArray(items) ? items : [];
  container.innerHTML = safeItems
    .map(
      (item) => `
      <article class="card reveal-card" style="display:flex; align-items:flex-start; gap:14px;">
        <div style="
          width:44px; height:44px; border-radius:12px; flex-shrink:0;
          background: rgba(168,85,247,0.1);
          border:1px solid rgba(168,85,247,0.2);
          display:flex; align-items:center; justify-content:center;
          font-size:1.3rem;
        ">🎓</div>
        <div style="flex:1;">
          <span style="
            display:inline-block; font-size:0.72rem; font-weight:700;
            text-transform:uppercase; letter-spacing:0.06em;
            color:#a855f7; background:rgba(168,85,247,0.1);
            border:1px solid rgba(168,85,247,0.25);
            padding:2px 10px; border-radius:999px; margin-bottom:6px;
          ">Education</span>
          <h4 style="margin:0 0 4px; font-size:1rem; font-weight:700;">${item.institution}</h4>
          <p style="margin:0 0 4px; font-size:0.88rem; color:var(--text-primary);">${item.degree}</p>
          <p class="meta" style="display:flex; align-items:center; gap:4px; font-size:0.8rem;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${item.period}
          </p>
        </div>
      </article>
    `
    )
    .join("");
};

const renderCertificates = (items) => {
  const container = document.getElementById("certificates-list");
  if (!container) return;
  const safeItems = Array.isArray(items) ? items : [];

  container.innerHTML = safeItems
    .map(
      (item) => `
      <article class="card cert-card reveal-card js-cert-card" tabindex="0" role="button" aria-label="View ${item.title} certificate">
        <div class="cert-img-wrap">
          <img src="${item.image}" alt="${item.title}" class="cert-img" loading="lazy" />
          <span class="cert-badge">${item.category || "Verified"}</span>
        </div>
        <div class="cert-body">
          <div class="cert-header">
            <h4 class="cert-title">${item.title}</h4>
            <span class="cert-date">${item.date || ""}</span>
          </div>
          <p class="cert-issuer">📜 ${item.issuer}</p>
          <p class="cert-desc">${item.desc}</p>
          <div class="cert-actions">
            ${item.pdf ? `<a href="${item.pdf}" target="_blank" class="btn-cert-link" onclick="event.stopPropagation();">View Credential Document ↗</a>` : ""}
          </div>
        </div>
      </article>
    `
    )
    .join("");

  attachCardModalHandlers(".js-cert-card", (index) => {
    const item = safeItems[index] || {};
    return {
      tag: "Verified Online Certification",
      title: item.title,
      subtitle: `${item.issuer} · ${item.date || ""}`,
      description: item.desc,
      points: [
        `Issued by: ${item.issuer}`,
        `Credential Category: ${item.category || "Technical Certification"}`,
        `Date: ${item.date || ""}`
      ],
      media: item.image ? [{ src: item.image, alt: item.title }] : []
    };
  });
};

const TECH_BRAND_COLORS = {
  Java: "#e76f00",
  "Spring Boot": "#6db33f",
  React: "#61dafb",
  Flutter: "#02569b",
  Dart: "#0175c2",
  "C#": "#9b4f96",
  "C++": "#00599c",
  C: "#a8b9cc",
  Python: "#3776ab",
  PHP: "#777bb4",
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  HTML5: "#e34f26",
  CSS3: "#1572b6",
  SQL: "#00758f",
  PostgreSQL: "#336791",
  MongoDB: "#47a248",
  Firebase: "#ffca28",
  MySQL: "#00758f",
  "SQL Server": "#cc292b",
  "Node.js": "#5fa04e",
  "Express.js": "#828282",
  ".NET Core Web API": "#512bd4",
  JavaFX: "#e76f00",
  "Tailwind CSS": "#38bdf8",
  "VS Code": "#007acc",
  Git: "#f05032",
  GitHub: "#6e5494",
  "Android Studio": "#3ddc84",
  Docker: "#2496ed",
  Postman: "#ff6c37",
  Swagger: "#85ea2d"
};

const renderFeaturedStack = (items) => {
  const container = document.getElementById("featured-stack-list");
  if (!container) return;
  const safeItems = Array.isArray(items) ? items : [];

  container.innerHTML = safeItems
    .map(
      (item) => `
      <article class="card featured-tech-card reveal-card" style="--accent-color: ${item.color || "var(--brand)"}">
        <div class="featured-tech-header">
          <div class="featured-tech-info">
            <div class="featured-tech-icon">${item.icon || "💻"}</div>
            <div>
              <h4 class="featured-tech-name">${item.name}</h4>
              <span class="featured-tech-cat">${item.category || "Technology"}</span>
            </div>
          </div>
          <span class="featured-tech-count" style="color:${item.color || "var(--brand)"}">
            ${item.projectsCount ? `${item.projectsCount}+ Projects` : "Core Tech"}
          </span>
        </div>
        <p class="featured-tech-highlights">${item.highlights || ""}</p>
        <div class="featured-tech-bar-container">
          <div class="featured-tech-bar-label">
            <span>Proficiency Mastery</span>
            <span style="color:${item.color || "var(--brand)"}">${item.level || 85}%</span>
          </div>
          <div class="featured-tech-bar">
            <div class="featured-tech-bar-fill" style="width: ${item.level || 85}%; background:${item.color || "var(--brand)"}"></div>
          </div>
        </div>
      </article>
    `
    )
    .join("");
};

const renderTechnicalSkills = (groups) => {
  const container = document.getElementById("technical-skills-list");
  if (!container) return;
  const safeGroups = Array.isArray(groups) ? groups : [];

  const categoryIcons = {
    Languages: "💻",
    Databases: "🗄️",
    Frameworks: "⚙️",
    "Developer Tools": "🛠️",
    "Microsoft Office 365": "📊",
    "Design Tools": "🎨",
    "Data Analysis": "📈",
    "Other Skills": "🔧"
  };

  container.innerHTML = safeGroups
    .map(
      (group) => `
      <article class="card skill-group reveal-card">
        <div class="skill-group-header">
          <div class="skill-group-icon">${categoryIcons[group.category] || "🔹"}</div>
          <h4>${group.category}</h4>
        </div>
        <div class="skills" style="display:flex; flex-wrap:wrap; gap:10px;">
          ${group.items
            .map((item) => {
              const dotColor = TECH_BRAND_COLORS[item] || "var(--brand)";
              return `
                <span class="tech-chip js-tech-chip" data-skill="${item}">
                  <span class="tech-dot" style="background:${dotColor}; box-shadow:0 0 6px ${dotColor}"></span>
                  ${item}
                </span>
              `;
            })
            .join("")}
        </div>
      </article>
    `
    )
    .join("");

  document.querySelectorAll(".js-tech-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const skillName = chip.dataset.skill;
      if (window.location.pathname.includes("/projects")) {
        const searchInput = document.getElementById("project-search");
        if (searchInput) {
          searchInput.value = skillName;
          searchInput.dispatchEvent(new Event("input"));
        }
      } else {
        window.location.href = `/projects?search=${encodeURIComponent(skillName)}`;
      }
    });
  });
};

const renderSoftSkills = (items) => {
  const container = document.getElementById("soft-skills-list");
  if (!container) return;
  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length > 0 && typeof safeItems[0] === "object") {
    container.innerHTML = safeItems
      .map(
        (item) => `
        <article class="card soft-skill-card reveal-card">
          <div class="soft-skill-top">
            <div class="soft-skill-icon-wrap">${item.icon || "💡"}</div>
            <h4 class="soft-skill-title">${item.title}</h4>
          </div>
          <p class="soft-skill-desc">${item.desc}</p>
        </article>
      `
      )
      .join("");
  } else {
    const defaultIcons = ["🧩", "🤝", "⏱️", "🚀"];
    container.innerHTML = safeItems
      .map(
        (item, idx) => `
        <article class="card soft-skill-card reveal-card">
          <div class="soft-skill-top">
            <div class="soft-skill-icon-wrap">${defaultIcons[idx % defaultIcons.length]}</div>
            <h4 class="soft-skill-title">${item}</h4>
          </div>
        </article>
      `
      )
      .join("");
  }
};

const renderLanguages = (items) => {
  const container = document.getElementById("languages-list");
  if (!container) return;
  const safeItems = Array.isArray(items) ? items : [];

  const getLevelBadgeClass = (level) => {
    const l = (level || "").toLowerCase();
    if (l.includes("native")) return "lang-badge-native";
    if (l.includes("fluent") || l.includes("advanced") || l.includes("professional")) return "lang-badge-fluent";
    return "lang-badge-beginner";
  };

  const getFillClass = (level) => {
    const l = (level || "").toLowerCase();
    if (l.includes("native")) return "lang-fill-native";
    if (l.includes("fluent") || l.includes("advanced") || l.includes("professional")) return "lang-fill-fluent";
    return "lang-fill-beginner";
  };

  container.innerHTML = safeItems
    .map(
      (item) => `
      <article class="card lang-prof-card reveal-card">
        <div class="lang-prof-header">
          <div class="lang-prof-title">
            <span class="lang-prof-flag">${item.flag || "🌐"}</span>
            <span>${item.name}</span>
          </div>
          <span class="lang-prof-badge ${getLevelBadgeClass(item.level)}">${item.level}</span>
        </div>
        <p class="lang-prof-desc">${item.desc || `${item.name} proficiency (${item.percent || 80}%)`}</p>
        <div class="lang-prof-bar-track">
          <div class="lang-prof-bar-fill ${getFillClass(item.level)}" style="width: ${item.percent || 80}%;"></div>
        </div>
      </article>
    `
    )
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
    const subject = payload.subject || "No subject";
    const message = payload.message || "";

    const whatsappText = [
      "🔔 *New Portfolio Inquiry*",
      "",
      `👤 *Name:* ${name}`,
      `📧 *Email:* ${email}`,
      `📌 *Subject:* ${subject}`,
      "",
      `💬 *Message:*`,
      message
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
    } catch {
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

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.dataset.closeModal === "true" || target === modal)) {
        closeModal();
      }
    });
  }

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
      if (target instanceof HTMLElement && (target.dataset.closeLightbox === "true" || target === lightbox)) {
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
    if (modalState.open) {
      closeModal();
      return;
    }
    const cvModal = document.getElementById("cv-viewer-modal");
    if (cvModal && !cvModal.classList.contains("hidden")) {
      cvModal.classList.add("hidden");
      cvModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
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
  window.addEventListener(
    "scroll",
    () => {
      if (!hidden && window.scrollY > 100) {
        indicator.style.opacity = "0";
        indicator.style.transition = "opacity 0.5s ease";
        hidden = true;
      }
    },
    { passive: true }
  );
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
  renderFeaturedStack(data.featuredStack);
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderEducation(data.education);
  renderCertificates(data.certificates);
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
  setupHeroSlider();
  setupStatCounters();
  setupCairoClock();
  setupGitHubSync();
  setupProjectFiltering(data.projects);
  setupSearchFilter(data.projects);
  setupSkillFiltering(data.technicalSkills);
  setupTerminalCLI();
  setupAICopilot();
  setupCVViewerModal();
  setupCopyChips();
  setupReviewsSystem();
  setupStarPrompt();
  setupHamburgerMenu();
  setupBackToTop();
  setupContactFormValidation();
  setupFAQAccordion();

  // Particle system
  const canvas = document.getElementById("particles-canvas");
  if (canvas) new ParticleSystem(canvas);
};

/* ============================================
   ANIMATED NUMBER STAT COUNTER BOXES
   ============================================ */
const setupStatCounters = async () => {
  const counterEls = document.querySelectorAll(".stat-number-val");
  if (!counterEls.length) return;

  try {
    const res = await fetch("/api/github");
    if (res.ok) {
      const data = await res.json();
      if (data && data.publicRepos) {
        const repoStat = document.getElementById("github-repos-stat");
        if (repoStat) repoStat.dataset.target = data.publicRepos;
      }
    }
  } catch (err) {
    console.error("Failed to fetch github stats for counters", err);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target) || 0;
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 30));
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 35);
        observer.unobserve(el);
      });
    },
    { threshold: 0.2 }
  );

  counterEls.forEach((el) => observer.observe(el));
};

/* ============================================
   COMMUNITY REVIEWS & STAR SYSTEM
   ============================================ */
const setupReviewsSystem = async () => {
  const reviewsContainer = document.getElementById("community-reviews-list");
  const starCountNum = document.getElementById("star-count-num");
  const starBtn = document.getElementById("btn-star-repo");
  const form = document.getElementById("review-submission-form");
  const statusMsg = document.getElementById("review-status-msg");

  const loadStars = async () => {
    try {
      const res = await fetch("/api/star");
      const data = await res.json();
      if (data.ok && starCountNum) starCountNum.textContent = data.stars;
    } catch {}
  };

  const loadReviews = async () => {
    if (!reviewsContainer) return;
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.ok && data.reviews) {
        reviewsContainer.innerHTML = data.reviews
          .map(
            (rev) => `
          <div class="card review-card" style="${rev.isLinkedin ? "border-left: 4px solid #0a66c2;" : ""}">
            <div class="review-header">
              <div style="width: 100%;">
                <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 4px;">
                  <h5 class="reviewer-name" style="margin: 0; line-height: 1.2;">${rev.name}</h5>
                  ${rev.isLinkedin ? '<span class="linkedin-badge" title="Verified Recommendation" style="color: #0a66c2; display: flex; align-items: center; flex-shrink: 0; margin-left: 12px;"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></span>' : ""}
                </div>
                <span class="reviewer-role">${rev.role}</span>
              </div>
            </div>
            <div style="margin-top: -4px; margin-bottom: 4px;">
               <span class="review-stars" style="letter-spacing: 2px;">${"⭐".repeat(rev.rating || 5)}</span>
            </div>
            <p class="review-comment">"${rev.comment}"</p>
            <span class="review-date">${rev.date || ""}</span>
          </div>
        `
          )
          .join("");
      }
    } catch {
      if (reviewsContainer) reviewsContainer.innerHTML = `<p class="error">Failed to load reviews.</p>`;
    }
  };

  if (starBtn) {
    starBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("/api/star", { method: "POST" });
        const data = await res.json();
        if (data.ok && starCountNum) {
          starCountNum.textContent = data.stars;
          starBtn.textContent = `★ Starred! (${data.stars})`;
          starBtn.style.background = "#10b981";
        }
      } catch {}
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      if (statusMsg) statusMsg.textContent = "Posting review...";

      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.ok) {
          if (statusMsg) {
            statusMsg.textContent = "✅ Review posted successfully!";
            statusMsg.style.color = "#10b981";
          }
          form.reset();
          loadReviews();
        } else {
          if (statusMsg) statusMsg.textContent = "❌ " + (data.error || "Failed to post");
        }
      } catch {
        if (statusMsg) statusMsg.textContent = "❌ Network error";
      }
    });
  }

  loadStars();
  loadReviews();
};

/* ============================================
   STAR NOTIFICATION POPUP PROMPT
   ============================================ */
const setupStarPrompt = () => {
  if (sessionStorage.getItem("star-prompt-dismissed")) return;

  setTimeout(() => {
    const toast = document.createElement("div");
    toast.className = "star-toast-popup";
    toast.innerHTML = `
      <button class="toast-close" aria-label="Close">&times;</button>
      <div class="toast-content">
        <span class="toast-star-icon">⭐</span>
        <div>
          <h6>Enjoying Zayd's Portfolio?</h6>
          <p>Star the repo & leave a review on the Experience page!</p>
        </div>
      </div>
      <div class="toast-actions">
        <a href="/experience#reviews-section" class="toast-btn-link">Leave Review & Star ↗</a>
      </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("visible"), 100);

    const closeBtn = toast.querySelector(".toast-close");
    const linkBtn = toast.querySelector(".toast-btn-link");

    const dismiss = () => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 400);
      sessionStorage.setItem("star-prompt-dismissed", "true");
    };

    if (closeBtn) closeBtn.addEventListener("click", dismiss);
    if (linkBtn) linkBtn.addEventListener("click", dismiss);
  }, 4000);
};

/* ============================================
   PROJECT SEARCH & FILTERING
   ============================================ */
const setupSearchFilter = (allProjects) => {
  const searchInput = document.getElementById("project-search-input");
  const pills = document.querySelectorAll("#project-filter-pills .filter-pill");

  if (!searchInput && !pills.length) return;

  let currentCategory = "all";
  let searchQuery = "";

  const applyCombinedFilter = () => {
    let filtered = allProjects || [];

    if (currentCategory !== "all") {
      filtered = filtered.filter((p) => {
        const cat = currentCategory.toLowerCase();
        const stack = (p.stack || "").toLowerCase();
        const name = (p.name || "").toLowerCase();
        return stack.includes(cat) || name.includes(cat);
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        return (
          (p.name || "").toLowerCase().includes(q) ||
          (p.stack || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
        );
      });
    }

    renderProjects(filtered);
  };

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      applyCombinedFilter();
    });
  }

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.dataset.filter || "all";
      applyCombinedFilter();
    });
  });
};

/* ============================================
   DYNAMIC HERO SHOWCASE CAROUSEL SLIDER
   ============================================ */
const setupHeroSlider = () => {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".slider-slide");
  const dots = slider.querySelectorAll(".dot");
  const prevBtn = document.getElementById("slider-prev");
  const nextBtn = document.getElementById("slider-next");
  const progressBar = document.getElementById("slider-progress");
  const currentNumEl = document.getElementById("slide-num-current");
  const totalNumEl = document.getElementById("slide-num-total");

  if (!slides.length) return;

  if (totalNumEl) {
    totalNumEl.textContent = slides.length < 10 ? `0${slides.length}` : slides.length;
  }

  let currentIndex = 0;
  let timer = null;
  const slideDuration = 5500;

  const goToSlide = (index) => {
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));

    currentIndex = (index + slides.length) % slides.length;
    slides[currentIndex].classList.add("active");
    if (dots[currentIndex]) dots[currentIndex].classList.add("active");

    if (currentNumEl) {
      currentNumEl.textContent = currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1;
    }

    resetProgress();
  };

  const resetProgress = () => {
    if (!progressBar) return;
    progressBar.style.transition = "none";
    progressBar.style.width = "0%";
    setTimeout(() => {
      progressBar.style.transition = `width ${slideDuration}ms linear`;
      progressBar.style.width = "100%";
    }, 50);
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  const startAutoPlay = () => {
    stopAutoPlay();
    resetProgress();
    timer = setInterval(nextSlide, slideDuration);
  };

  const stopAutoPlay = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoPlay();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoPlay();
    });

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      goToSlide(idx);
      startAutoPlay();
    });
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
        startAutoPlay();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
        startAutoPlay();
      }
    },
    { passive: true }
  );

  // Keyboard Arrow Control when slider is focused or hovered
  let isHovered = false;
  slider.addEventListener("mouseenter", () => {
    isHovered = true;
    stopAutoPlay();
  });
  slider.addEventListener("mouseleave", () => {
    isHovered = false;
    startAutoPlay();
  });

  document.addEventListener("keydown", (e) => {
    if (!isHovered) return;
    if (e.key === "ArrowLeft") {
      prevSlide();
      startAutoPlay();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      startAutoPlay();
    }
  });

  startAutoPlay();
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
      if (currentCategory === "fullstack")
        return (
          p.stack.toLowerCase().includes("spring") ||
          p.stack.toLowerCase().includes("react") ||
          p.stack.toLowerCase().includes("full-stack")
        );
      if (currentCategory === "mobile")
        return (
          p.stack.toLowerCase().includes("flutter") ||
          p.stack.toLowerCase().includes("api") ||
          p.stack.toLowerCase().includes("c#")
        );
      if (currentCategory === "web")
        return (
          p.stack.toLowerCase().includes("html") ||
          p.stack.toLowerCase().includes("php") ||
          p.stack.toLowerCase().includes("node")
        );
      if (currentCategory === "systems")
        return p.stack.toLowerCase().includes("java") || p.stack.toLowerCase().includes("python");

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
    const commandHistory = [];
    let historyIndex = -1;

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
          input.value = commandHistory[historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[historyIndex];
        } else {
          historyIndex = -1;
          input.value = "";
        }
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;

      // Add to history (most recent first)
      commandHistory.unshift(val);
      if (commandHistory.length > 50) commandHistory.pop();
      historyIndex = -1;

      printLine(`<span class="term-prompt">zayd@portfolio:~$</span> ${val}`);
      input.value = "";

      const cmd = val.toLowerCase();
      if (cmd === "help") {
        printLine(`Available Commands:
  • <span class="term-cmd">showcase</span> - View live automated screenshot showcase status
  • <span class="term-cmd">skills</span>   - List Zayd's technical skill set
  • <span class="term-cmd">projects</span> - Display Zayd's top projects & tech stacks
  • <span class="term-cmd">exp</span>      - Display internship & work experience
  • <span class="term-cmd">contact</span>  - View Zayd's email, phone, and LinkedIn
  • <span class="term-cmd">cv</span>       - Open the PDF CV viewer
  • <span class="term-cmd">whoami</span>   - Show current viewer identity
  • <span class="term-cmd">date</span>     - Show current Cairo date & time
  • <span class="term-cmd">hire</span>     - Quick message for recruiters
  • <span class="term-cmd">clear</span>    - Clear terminal output screen`);
      } else if (cmd === "showcase" || cmd === "screenshots") {
        printLine(`Fetching automated project showcase status... 📸`);
        fetch("/api/showcase/status")
          .then((res) => res.json())
          .then((data) => {
            const projects = data.projects || {};
            const keys = Object.keys(projects);
            if (!keys.length) {
              printLine(`No automated project showcases recorded yet. Run showcase pipeline to generate.`);
              return;
            }
            printLine(`Automated Project Showcase Status (Updated: ${new Date(data.lastUpdated).toLocaleString()}):`);
            keys.forEach((key) => {
              const p = projects[key];
              const shotCount = (p.screenshots || []).length;
              const badge = p.status === "Completed" ? `[COMPLETED - ${shotCount} shots]` : `[${p.status || "UNKNOWN"}]`;
              printLine(`  • <strong>${p.name}</strong> (${p.slug}): ${badge}`);
            });
          })
          .catch(() => printLine(`Failed to fetch showcase status.`));
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
      } else if (cmd === "linkedin") {
        printLine(`Opening Zayd's LinkedIn profile in a new tab... 💼`);
        window.open("https://www.linkedin.com/in/zayd-ali-17a85a1a0", "_blank", "noopener,noreferrer");
      } else if (cmd === "cv") {
        printLine(`Opening CV Viewer modal...`);
        const cvModal = document.getElementById("cv-viewer-modal");
        if (cvModal) {
          document.body.appendChild(cvModal);
          cvModal.classList.remove("hidden");
        }
      } else if (cmd === "whoami") {
        printLine(`guest@recruiter-workstation ~ Welcome to Zayd Ali Mohamed's Portfolio!`);
      } else if (cmd === "date") {
        const cairoStr = new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" });
        printLine(`Cairo Local Time: ${cairoStr}`);
      } else if (cmd === "hire") {
        printLine(
          `Great choice! Zayd is actively open for software development roles. Email zaydaly0501@gmail.com or use the Contact form!`
        );
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

  if (!cvModal) return;

  let cachedCvUrl = "https://res.cloudinary.com/delnnzcph/image/upload/v1790790818/zayd-portfolio/Zayd_Ali_Mohamed_CV.pdf";

  fetch("/api/cv-url")
    .then((res) => res.json())
    .then((data) => {
      if (data && data.url) {
        cachedCvUrl = data.url.includes("collection.cloudinary.com") ? "https://res.cloudinary.com/delnnzcph/image/upload/v1790790818/zayd-portfolio/Zayd_Ali_Mohamed_CV.pdf" : data.url;
      }
    })
    .catch(() => {});

  const openCVModal = async () => {
    let cvUrl = cachedCvUrl;
    try {
      const res = await fetch("/api/cv-url");
      const data = await res.json();
      if (data && data.url) {
        cvUrl = data.url.includes("collection.cloudinary.com") ? "https://res.cloudinary.com/delnnzcph/image/upload/v1790790818/zayd-portfolio/Zayd_Ali_Mohamed_CV.pdf" : data.url;
        cachedCvUrl = cvUrl;
      }
    } catch (_) {}

    const iframe = document.getElementById("cv-iframe");
    if (iframe) {
      iframe.src = cvUrl;
    }

    document
      .querySelectorAll("a[download*='CV'], #download-cv, .cv-modal-actions a, .cv-fallback-card a")
      .forEach((link) => {
        link.href = cvUrl;
        link.setAttribute("target", "_blank");
      });

    document.body.appendChild(cvModal);
    cvModal.classList.remove("hidden");
    cvModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeCVModal = () => {
    cvModal.classList.add("hidden");
    cvModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  // Bind all potential CV preview triggers on any page
  document
    .querySelectorAll("#preview-cv-nav-btn, #btn-preview-cv-hero, #preview-cv-exp-btn, .btn-preview-cv, [data-open-cv]")
    .forEach((btn) => {
      btn.addEventListener("click", openCVModal);
    });

  if (closeBtn) closeBtn.addEventListener("click", closeCVModal);
  if (backdrop) backdrop.addEventListener("click", closeCVModal);
  cvModal.addEventListener("click", (e) => {
    if (e.target === cvModal) closeCVModal();
  });
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

/* ============================================
   HAMBURGER MOBILE MENU
   ============================================ */
const setupHamburgerMenu = () => {
  const hamburger = document.getElementById("hamburger-btn");
  const overlay = document.getElementById("mobile-nav-overlay");
  const closeBtn = document.getElementById("mobile-nav-close");
  const mobileTerminalBtn = document.getElementById("mobile-terminal-btn");

  if (!hamburger || !overlay) return;

  const open = () => {
    overlay.classList.add("open");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    overlay.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  hamburger.addEventListener("click", () => {
    overlay.classList.contains("open") ? close() : open();
  });

  if (closeBtn) closeBtn.addEventListener("click", close);

  // Close overlay when a nav link is clicked
  overlay.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  // Mobile terminal button inside overlay
  if (mobileTerminalBtn) {
    mobileTerminalBtn.addEventListener("click", () => {
      close();
      const termDrawer = document.getElementById("terminal-drawer");
      if (termDrawer) {
        termDrawer.classList.remove("hidden");
        const termInput = document.getElementById("terminal-input");
        if (termInput) setTimeout(() => termInput.focus(), 300);
      }
    });
  }

  // Escape key closes overlay
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });
};

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
const setupBackToTop = () => {
  const btn = document.getElementById("back-to-top-btn");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 400) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

/* ============================================
   CONTACT FORM REAL-TIME VALIDATION
   ============================================ */
const setupContactFormValidation = () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const validateField = (field) => {
    if (!field.value.trim()) {
      field.classList.remove("valid");
      field.classList.add("invalid");
      return false;
    }
    if (field.type === "email") {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(field.value.trim())) {
        field.classList.remove("valid");
        field.classList.add("invalid");
        return false;
      }
    }
    field.classList.remove("invalid");
    field.classList.add("valid");
    return true;
  };

  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) validateField(field);
    });
  });
};

/* ============================================
   INTERACTIVE FAQ ACCORDION
   ============================================ */
const setupFAQAccordion = () => {
  const faqGrid = document.querySelector("#faq-section .faq-grid");
  if (!faqGrid) return;

  faqGrid.querySelectorAll(".card").forEach((card) => {
    card.style.cursor = "pointer";
    card.style.transition = "all 0.3s ease";

    const question = card.querySelector("h5");
    const answer = card.querySelector("p");

    if (question) {
      question.style.display = "flex";
      question.style.justifyContent = "space-between";
      question.style.alignItems = "center";

      const arrow = document.createElement("span");
      arrow.textContent = "▼";
      arrow.style.fontSize = "0.75rem";
      arrow.style.transition = "transform 0.3s ease";
      arrow.style.color = "var(--brand)";
      question.appendChild(arrow);
    }

    if (answer) {
      answer.style.marginTop = "8px";
    }

    card.addEventListener("click", () => {
      const isOpen = card.classList.contains("faq-open");
      if (isOpen) {
        card.classList.remove("faq-open");
        const arrow = card.querySelector("h5 span:last-child");
        if (arrow) arrow.style.transform = "rotate(0deg)";
        if (answer) answer.style.display = "none";
      } else {
        card.classList.add("faq-open");
        const arrow = card.querySelector("h5 span:last-child");
        if (arrow) arrow.style.transform = "rotate(180deg)";
        if (answer) answer.style.display = "block";
      }
    });
  });
};
