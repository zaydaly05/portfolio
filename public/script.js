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
  "https://res.cloudinary.com/delnnzcph/image/upload/v1791135534/main-photo.jpg"
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
      company: "WE (Telecom Egypt)",
      role: "Android Development Intern",
      period: "June 26, 2026 - July 26, 2026",
      location: "Smart Village, Cairo",
      points: [
        "Engineered native Android applications utilizing Kotlin and declarative Jetpack Compose UI.",
        "Architected mobile applications using MVVM pattern, managing unidirectional data flow via Kotlin Coroutines & StateFlow.",
        "Integrated network operations and local persistence using Retrofit and Room Database for offline-first architecture.",
        "Implemented dependency injection using Hilt to ensure decoupled, scalable enterprise mobile software design.",
        "Managed application lifecycles and mitigated native process death constraints effectively under direct supervision of Khaled Mamdouh (Android Developer Supervisor, WE)."
      ]
    },
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
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135561/app_icon.png",
      github: "https://github.com/zaydaly05/Gulf_Limousine_App",
      description:
        "Cross-platform luxury limousine reservation & fleet tracking mobile app featuring real-time driver allocation, vehicle selection, fare estimation, and client booking management."
    },
    {
      name: "Essmat Plastic Factory Management System",
      period: "September 2026",
      stack: "C#, .NET, SQL Server, Entity Framework",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/esmatPlastic.jpg",
      pdfReport:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/esmatPlastic.jpg",
      github: "https://github.com/zaydaly05/EssmatPlastic",
      description:
        "Enterprise inventory and production management solution for plastic manufacturing, optimizing raw material tracking, order processing, and factory billing workflows."
    },
    {
      name: "Dr. Naglaa Academic Biography Portal",
      period: "September 2026",
      stack: "HTML5, CSS3, JavaScript, Responsive UI",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135540/Screenshot_2026-10-04_180005.png",
      github: "https://github.com/zaydaly05/drNaglaBio",
      description:
        "Modern academic portfolio & publication showcase website designed for university faculty, featuring curriculum vitae integration, research paper archives, and student contact channels."
    },
    {
      name: "Food Ordering Management System",
      period: "May 2026",
      stack: "Spring Boot, Tailwind, React, MongoDB",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135562/foodApplogo.png",
      github: "https://github.com/zaydaly05/food_ordering_system",
      description:
        "Developed a full-stack food ordering system with Spring Boot and a React + Tailwind frontend. Built RESTful APIs for authentication, menu management, cart operations, and order processing with MongoDB. Implemented role-based Admin and Customer flows with CRUD, order tracking, and analytics such as top-selling items and profit insights."
    },
    {
      name: "In Gaz API System",
      period: "July 2025",
      stack: "C#, Flutter, .NET Core Web API",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135564/Screenshot_2026-10-04_180451.png",
      github: "https://github.com/zaydaly05/InGazAPI",
      description:
        "Built a Flutter frontend integrated with a C# .NET Core Web API backend using MVC, secure role-based access, CRUD operations, and Swagger testing."
    },
    {
      name: "Employee Attendance & Leave System",
      period: "December 2025",
      stack: "HTML, CSS, PHP, MySQL",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135381/EALMS_Logo.png",
      github: "https://github.com/zaydaly05/Employee_Attendance-Leave_Management_System",
      description:
        "Developed a web-based attendance and leave platform with automated tracking and approval, event/announcement features, and secure relational role-based access."
    },
    {
      name: "Car Rental Website",
      period: "May 2025",
      stack: "HTML, CSS, MongoDB, Node.js, JavaScript",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135540/logo00.png",
      github: "https://github.com/zaydaly05/Car_Rental_Website",
      description:
        "Developed a comprehensive e-commerce style platform for users to browse and rent cars with authentication, catalog management, and order processing."
    },
    {
      name: "Restaurant Management System",
      period: "December 2024",
      stack: "Java, JavaFX",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/restaurant_management_system_icon_v3.png",
      github: "https://github.com/zaydaly05/Restaurant_Management_System",
      description:
        "Created a recruitment system with a graphical user interface for managing job postings, applications, and interviews using Java and JavaFX."
    },
    {
      name: "Sleeping Alert System",
      period: "December 2025",
      stack: "Python, Flutter",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135566/sleeping_alert_eye_icon.png",
      github: "https://github.com/zaydaly05/Sleep_Alert_System",
      description:
        "Developed a sleeping alert system for an HCI course, applying usability and interaction design principles with a responsive mobile interface."
    },
    {
      name: "Zaydentity Digital Identity Platform",
      period: "September 2026",
      stack: "HTML5, CSS3, JavaScript",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1791141032/zayd-portfolio/showcase/Zaydentity%20Digital%20Identity%20Platform/Logo%20Icon/Screenshot_2026-10-04_175842.png",
      github: "https://github.com/zaydaly05/zaydentity",
      description:
        "Digital personal branding & bio-link platform consolidating developer links, project highlights, and verified professional credentials in a unified interactive card UI."
    },
    {
      name: "WE Telecom Training Suite",
      period: "August 2026",
      stack: "Networking, C++, Telecommunications",
      image: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135568/1200x630wa.png",
      github: "https://github.com/zaydaly05/WE_Intern",
      description:
        "Technical codebase & project artifacts developed during Telecom Egypt (WE) training, focusing on network protocol fundamentals, system administration, and enterprise infrastructure."
    }
  ],

  featuredStack: [
    {
      name: "Android & Kotlin",
      category: "Native Mobile",
      level: 88,
      color: "#3ddc84",
      icon: "🤖",
      projectsCount: 2,
      highlights: "Jetpack Compose, MVVM Architecture, Coroutines & StateFlow, Retrofit, Room, Hilt"
    },
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
      items: ["Java", "Kotlin", "Python", "C#", "C++", "C", "PHP", "Dart", "JavaScript", "SQL", "HTML5", "CSS3"]
    },
    {
      category: "Frameworks",
      items: ["Spring Boot", "React", "Flutter", "Jetpack Compose", "Express.js", "Node.js", ".NET Core Web API", "JavaFX", "Tailwind CSS"]
    },
    { category: "Databases", items: ["PostgreSQL", "MongoDB", "Firebase", "MySQL", "SQL Server", "Room Database"] },
    {
      category: "Developer Tools",
      items: ["Android Studio", "VS Code", "Git", "GitHub", "Apache NetBeans", "XAMPP", "Docker", "Postman", "Swagger"]
    },
    { category: "Microsoft Office 365", items: ["Word", "Excel", "PowerPoint", "Access"] },
    { category: "Design Tools", items: ["Adobe Photoshop", "Adobe InDesign", "Adobe Premiere", "Filmora"] },
    { category: "Data Analysis", items: ["Orange Data Mining"] },
    {
      category: "Other Skills",
      items: [
        "Android MVVM Architecture",
        "Kotlin Coroutines & StateFlow",
        "Retrofit Network Operations",
        "Hilt Dependency Injection",
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
        "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Exp_Letter_Y25_Taqa.jpg",
      pdf: "https://res.cloudinary.com/delnnzcph/image/upload/v1791137222/Certificate_Year_25_Taqa.jpg",
      desc: "Official engineering internship certificate recognizing contribution to the In Gaz API mobile platform."
    },
    {
      title: "Cisco JavaScript Essentials 1 & 2",
      issuer: "Cisco Networking Academy & OpenEDG JS Institute",
      date: "July 2025",
      category: "Full-Stack Development",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1791135787/js1_certificate.png",
      pdf: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135787/js1_certificate.png",
      desc: "Advanced JavaScript ES6+, asynchronous programming, object-oriented concepts, and DOM manipulation."
    },
    {
      title: "Cisco C Essentials 1 Certification",
      issuer: "Cisco Networking Academy & OpenEDG C Institute",
      date: "July 2025",
      category: "Systems & Core Programming",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1791135536/c-essentials-1.png",
      pdf: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135536/c-essentials-1.png",
      desc: "Low-level system programming, memory management, pointers, and algorithmic structures in C."
    },
    {
      title: "Introduction to Cybersecurity Certification",
      issuer: "Cisco Networking Academy",
      date: "July 2025",
      category: "Cybersecurity & Networks",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1791135537/Introduction_To_Cybersecurity_C.png",
      pdf: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135537/Introduction_To_Cybersecurity_C.png",
      desc: "Network security protocols, vulnerability analysis, encryption fundamentals, and threat mitigation."
    },
    {
      title: "CSS & Modern Web Development",
      issuer: "Cisco OpenEDG Academy",
      date: "July 2025",
      category: "Frontend Architecture",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1791135536/css-essentials.png",
      pdf: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135538/CSS.png",
      desc: "Responsive layout design, Flexbox, CSS Grid, animation frameworks, and modern CSS3 aesthetics."
    },
    {
      title: "Cairo Higher Institute Experience Letter",
      issuer: "Cairo Higher Institute — IT Dept",
      date: "September 2025",
      category: "Industry Experience",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
      pdf: "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
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
    const isLight = theme === "light";
    toggle.innerHTML = `<span class="theme-icon" aria-hidden="true">${isLight ? "🌙" : "☀️"}</span><span class="theme-label"> ${isLight ? "Dark Mode" : "Light Mode"}</span>`;
    toggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
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
    const isMobile = window.innerWidth <= 768;
    this.particleCount = isMobile ? 18 : 35;
    this.connectionDistance = isMobile ? 80 : 100;
    this.mouseRadius = isMobile ? 100 : 130;
    this.animating = true;

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
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.15
      });
    }
  }

  bindEvents() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
        this.createParticles();
      }, 200);
    }, { passive: true });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener("mouseout", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.animating = false;
      } else {
        if (!this.animating) {
          this.animating = true;
          this.animate();
        }
      }
    });
  }

  animate() {
    if (!this.animating || document.hidden) return;

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
        const distSq = dx * dx + dy * dy;
        const radiusSq = this.mouseRadius * this.mouseRadius;
        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq);
          const force = (this.mouseRadius - dist) / this.mouseRadius;
          p.vx += (dx / (dist || 1)) * force * 0.015;
          p.vy += (dy / (dist || 1)) * force * 0.015;
        }
      }

      // Speed damping
      p.vx *= 0.99;
      p.vy *= 0.99;

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
        const distSq = dx * dx + dy * dy;
        const connDistSq = this.connectionDistance * this.connectionDistance;

        if (distSq < connDistSq) {
          const dist = Math.sqrt(distSq);
          const lineOpacity = (1 - dist / this.connectionDistance) * 0.12;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(${lineColor}, ${lineOpacity})`;
          this.ctx.lineWidth = 0.5;
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
const modalMediaState = { media: [], index: 0, keysBound: false };

const escapeAttr = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildMediaHtml = (media) =>
  media
    .map((item, idx) => {
      const isVideo = item.type === "video";
      const label = escapeAttr(item.alt || (isVideo ? "Video demo" : `Screenshot ${idx + 1}`));
      const inner = isVideo
        ? `<span class="pm-thumb-video" aria-hidden="true">▶</span>`
        : `<img src="${escapeAttr(item.src)}" alt="" loading="${idx < 8 ? "eager" : "lazy"}" decoding="async" />`;
      return `<button type="button" class="pm-thumb" data-media-index="${idx}" aria-label="Show ${label}">${inner}</button>`;
    })
    .join("");

const markMediaLoaded = (img) => {
  img.classList.add("loaded");
  const holder = img.closest(".pm-viewer-frame");
  if (holder) holder.classList.add("is-loaded");
};

// Original file first, then H.264/AAC and WebM re-encodes. Browsers that can't decode the
// original (e.g. OpenCV "mp4v" files) fall through to the next source.
const buildVideoSources = (src) => {
  const marker = "/video/upload/";
  if (!src.includes("res.cloudinary.com") || !src.includes(marker)) {
    return [{ src, type: /\.webm($|\?)/i.test(src) ? "video/webm" : "video/mp4" }];
  }
  const withTransform = (transform, ext) =>
    src.replace(marker, `${marker}${transform}/`).replace(/\.[a-z0-9]+($|\?)/i, `.${ext}$1`);
  return [
    { src, type: "video/mp4" },
    { src: withTransform("f_mp4,vc_h264,ac_aac,q_auto", "mp4"), type: "video/mp4" },
    { src: withTransform("f_webm,vc_vp9,q_auto", "webm"), type: "video/webm" }
  ];
};

const showModalMedia = (index) => {
  const { media } = modalMediaState;
  const frame = document.getElementById("modal-viewer-frame");
  if (!frame || !media.length) return;

  const total = media.length;
  const next = Math.max(0, Math.min(total - 1, index));
  modalMediaState.index = next;
  const item = media[next];
  const label = item.alt || (item.type === "video" ? "Video demo" : `Screenshot ${next + 1}`);

  frame.classList.remove("is-loaded");
  frame.innerHTML = "";
  const viewer = frame.closest(".pm-viewer");
  if (viewer) viewer.classList.toggle("pm-viewer--video", item.type === "video");
  if (item.type === "video") {
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-label", label);
    buildVideoSources(item.src).forEach(({ src, type }) => {
      const source = document.createElement("source");
      source.src = src;
      source.type = type;
      video.appendChild(source);
    });
    // Only the last source's error means every format failed
    video.lastElementChild.addEventListener("error", () => {
      const note = document.createElement("div");
      note.className = "pm-video-error";
      note.innerHTML = `<p>This video couldn't be played in your browser.</p><a class="pm-btn pm-btn-secondary" target="_blank" rel="noopener" href="${escapeAttr(item.src)}">Open video in new tab ↗</a>`;
      frame.replaceChildren(note);
    });
    frame.appendChild(video);
    frame.classList.add("is-loaded");
    frame.classList.remove("is-zoomable");
  } else {
    const img = document.createElement("img");
    img.alt = label;
    img.decoding = "async";
    img.addEventListener("load", () => markMediaLoaded(img), { once: true });
    img.addEventListener("error", () => markMediaLoaded(img), { once: true });
    img.src = item.src;
    frame.appendChild(img);
    frame.classList.add("is-zoomable");
  }

  const counter = document.getElementById("modal-counter");
  if (counter) counter.textContent = `${next + 1} / ${total}`;
  const prev = document.getElementById("modal-prev");
  const nextBtn = document.getElementById("modal-next");
  if (prev) prev.disabled = next === 0;
  if (nextBtn) nextBtn.disabled = next === total - 1;

  document.querySelectorAll("#modal-media .pm-thumb").forEach((thumb) => {
    const active = Number(thumb.dataset.mediaIndex) === next;
    thumb.classList.toggle("is-active", active);
    if (active) {
      thumb.setAttribute("aria-current", "true");
      thumb.scrollIntoView({ block: "nearest", inline: "nearest" });
    } else {
      thumb.removeAttribute("aria-current");
    }
  });
};

const initModalMedia = (container, media) => {
  if (!container || !media.length) return;
  modalMediaState.media = media;

  const stage = document.getElementById("modal-stage");
  if (stage) stage.classList.toggle("pm-stage--single", media.length === 1);

  container.querySelectorAll(".pm-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => showModalMedia(Number(thumb.dataset.mediaIndex)));
  });

  const prev = document.getElementById("modal-prev");
  const next = document.getElementById("modal-next");
  if (prev) prev.onclick = () => showModalMedia(modalMediaState.index - 1);
  if (next) next.onclick = () => showModalMedia(modalMediaState.index + 1);

  const openCurrentInLightbox = () => {
    const current = modalMediaState.media[modalMediaState.index];
    if (!current || current.type === "video") return;
    const images = modalMediaState.media.filter((item) => item.type !== "video");
    const imageIndex = modalMediaState.media
      .slice(0, modalMediaState.index)
      .filter((item) => item.type !== "video").length;
    openLightbox(images, imageIndex);
  };
  const zoomBtn = document.getElementById("modal-zoom");
  if (zoomBtn) zoomBtn.onclick = openCurrentInLightbox;
  const frame = document.getElementById("modal-viewer-frame");
  if (frame) {
    frame.onclick = (event) => {
      if (event.target.tagName === "IMG") openCurrentInLightbox();
    };
  }

  if (!modalMediaState.keysBound) {
    modalMediaState.keysBound = true;
    document.addEventListener("keydown", (event) => {
      if (lightboxState.open || !ModalManager.isOpen("details-modal")) return;
      if (event.target.closest && event.target.closest("video, input, textarea")) return;
      if (event.key === "ArrowLeft") showModalMedia(modalMediaState.index - 1);
      else if (event.key === "ArrowRight") showModalMedia(modalMediaState.index + 1);
    });
  }

  showModalMedia(0);
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

const openModal = (payload) => {
  // Wrap in setTimeout to break any potential recursive call stacks that cause freezes
  setTimeout(() => {
    ModalManager.open("details-modal", payload);

    // Initialize high-performance media gallery (Lazy Loading + Lightbox)
    const mediaContainer = document.getElementById("modal-media");
    if (mediaContainer && Array.isArray(payload.media) && payload.media.length) {
      mediaContainer.innerHTML = buildMediaHtml(payload.media);
      initModalMedia(mediaContainer, payload.media);
    }
  }, 0);
};

const closeModal = () => {
  if (lightboxState.open) closeLightbox();
  ModalManager.close("details-modal");
};

const attachCardModalHandlers = (selector, getPayload) => {
  document.querySelectorAll(selector).forEach((card, index) => {
    if (card.dataset.modalBound) return; // CRITICAL: Prevent duplicate event listeners causing freezes
    card.dataset.modalBound = "true";

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
    if (c.includes("we") || c.includes("telecom egypt"))
      return { color: "#d8b4fe", bg: "rgba(142, 59, 121, 0.25)", border: "rgba(192, 132, 252, 0.4)" };
    if (c.includes("taqa"))
      return { color: "var(--brand)", bg: "var(--brand-glow)", border: "rgba(101, 240, 255, 0.25)" };
    if (c.includes("cairo higher") || c.includes("chi"))
      return { color: "#c084fc", bg: "rgba(192, 132, 252, 0.15)", border: "rgba(192, 132, 252, 0.3)" };
    return { color: "#34d399", bg: "rgba(52, 211, 153, 0.15)", border: "rgba(52, 211, 153, 0.3)" };
  };

  const roleIcon = (role = "") => {
    const r = role.toLowerCase();
    if (r.includes("android") || r.includes("kotlin")) return "🤖";
    if (r.includes("software")) return "💻";
    if (r.includes("it department")) return "🖥️";
    if (r.includes("data")) return "📊";
    return "🏢";
  };

  const getMediaBadgeText = (company = "", role = "") => {
    const c = company.toLowerCase();
    const r = role.toLowerCase();
    if (c.includes("we") || c.includes("telecom egypt")) return "📜 Official Experience Letter";
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
                View Full Details &amp; Experience Letter ↗
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
    const compLower = (item.company || "").toLowerCase();
    const isWeTelecom = compLower.includes("we") || compLower.includes("telecom egypt");
    const isCairoHigherInstitute = compLower.includes("cairo higher institute");
    const isTaqaSoftwareDevelopment =
      compLower.includes("taqa arabia") && (item.role || "").toLowerCase().includes("software development intern");
    const isTaqaItDepartment =
      compLower.includes("taqa arabia") && (item.role || "").toLowerCase().includes("it department intern");
    return {
      tag: "Experience Details",
      title: item.role || "Experience",
      subtitle: `${item.company || ""} · ${item.location || ""} · ${item.period || ""}`,
      description: "Key Responsibilities, Achievements & Contributions:",
      points: item.points || [],
      media: isWeTelecom
        ? [
            {
              src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
              alt: "WE (Telecom Egypt) Official Android Development Internship Experience Letter - Signed by Khaled Mamdouh (Android Developer Supervisor)"
            },
            {
              src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
              alt: "WE (Telecom Egypt) Android Development Training Lab Photo"
            }
          ]
        : isCairoHigherInstitute
          ? [
              {
                src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
                alt: "Cairo Higher Institute experience photo"
              }
            ]
          : isTaqaSoftwareDevelopment
            ? [
                {
                  src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Exp_Letter_Y25_Taqa.jpg",
                  alt: "TAQA Software Development Internship experience photo"
                },
                {
                  src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791137222/Certificate_Year_25_Taqa.jpg",
                  alt: "TAQA Software Development Internship official certificate"
                }
              ]
            : isTaqaItDepartment
              ? [
                  {
                    src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Taqa_Cert_Y24.jpg",
                    alt: "TAQA IT Department internship photo 1"
                  },
                  {
                    src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Taqa_Letter_24Y.jpg",
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

  const getLogoMeta = (name) => {
    const nameLower = (name || "").toLowerCase();
    if (
      nameLower.includes("gulf limousine") ||
      nameLower.includes("ingaz") ||
      nameLower.includes("in gaz") ||
      nameLower.includes("food ordering") ||
      nameLower.includes("attendance") ||
      nameLower.includes("car rental")
    ) {
      return { class: "logo-zoom-wide" };
    }
    if (nameLower.includes("zaydentity")) {
      return { class: "logo-zoom-wide logo-dark-bg" };
    }
    if (nameLower.includes("we telecom") || nameLower.includes("we intern")) {
      return { class: "logo-zoom-square logo-light-bg" };
    }
    return { class: "logo-zoom-square" };
  };

  container.innerHTML = safeItems
    .map((item) => {
      const githubUrl = getGithubUrl(item.name, item.github);
      const imgUrl =
        item.image && !item.image.endsWith(".pdf")
          ? item.image
          : "https://res.cloudinary.com/delnnzcph/image/upload/v1791135540/Screenshot_2026-10-04_180005.png";
      const pdfUrl = item.pdfReport || (item.image && item.image.endsWith(".pdf") ? item.image : null);
      const logoMeta = getLogoMeta(item.name);

      return `
      <article class="card card-clickable reveal-card js-project-card" tabindex="0" role="button" aria-label="Open ${item.name || "project"} details">
        <div class="project-card-image-wrap">
          <div class="project-logo-badge ${logoMeta.class}">
            <img src="${imgUrl}" alt="${item.name || "Project logo"}" class="project-card-img" loading="lazy" />
          </div>
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

/* ============================================
   PROJECT GALLERY REPOSITORY & MODAL BUILDERS (SOLID SRP/OCP)
   ============================================ */
const PROJECT_GALLERY_REPOSITORY = {
  drNaglaBio: [
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/Screenshot_2026-10-04_175352.png", alt: "Dr Naglaa Academic Portal - Main Header & CV Overview" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/Screenshot_2026-10-04_175331.png", alt: "Dr Naglaa Academic Portal - Research & Publications Archive" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135547/Screenshot_2026-10-04_175253.png", alt: "Dr Naglaa Academic Portal - Student Channels & Courses" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135547/Screenshot_2026-10-04_175423.png", alt: "Dr Naglaa Academic Portal - Full Curriculum Vitae Section" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135545/Screenshot_2026-10-04_175406.png", alt: "Dr Naglaa Academic Portal - Faculty Contact Portal" }
  ],
  zaydentity: [
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135572/Screenshot_2026-10-04_174426.png", alt: "Zaydentity - Developer Digital Bio Card View" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135571/Screenshot_2026-10-04_174413.png", alt: "Zaydentity - Social & Professional Links Showcase" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135571/Screenshot_2026-10-04_174403.png", alt: "Zaydentity - Verified Credentials & Skill Highlights" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135570/Screenshot_2026-10-04_174321.png", alt: "Zaydentity - Project Showcase Grid View" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135570/Screenshot_2026-10-04_174349.png", alt: "Zaydentity - Responsive Mobile Layout Preview" }
  ],
  Car_Rental_Website: [
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135542/c1.png", alt: "Car Rental Website - Vehicle Fleet Catalog Overview" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135544/c2.png", alt: "Car Rental Website - Car Specifications & Features View" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135545/c3.png", alt: "Car Rental Website - Customer Booking & Checkout Form" }
  ],
  Gulf_Limousine_App: [
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135579/Screenshot_20261004_173939.png", alt: "Gulf Limousine App - Reservation Dashboard" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/Screenshot_20261004_173958.png", alt: "Gulf Limousine App - Vehicle Selection View" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/Screenshot_20261004_173450.png", alt: "Gulf Limousine App - Driver Allocation Screen" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135564/Screenshot_20261004_173925.png", alt: "Gulf Limousine App - Realtime Trip Fare Estimator" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135564/Screenshot_20261004_173759.png", alt: "Gulf Limousine App - Fleet Category Browser" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135564/Screenshot_20261004_173900.png", alt: "Gulf Limousine App - Pickup Location Selector" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/Screenshot_20261004_173426.png", alt: "Gulf Limousine App - Customer Booking Summary" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/Screenshot_20261004_173534.png", alt: "Gulf Limousine App - Firebase Realtime Sync Status" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/Screenshot_20261004_173343.png", alt: "Gulf Limousine App - Client Profile & History" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/Screenshot_20261004_173403.png", alt: "Gulf Limousine App - Mobile Settings View" }
  ],
  EssmatPlastic: [
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135549/WhatsApp_Image_2026-10-04_at_4.44.38_PM.jpg", alt: "Essmat Plastic - Main Factory Management Overview" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135549/WhatsApp_Image_2026-10-04_at_4.44.38_PM_5.jpg", alt: "Essmat Plastic - Raw Material Tracking Interface" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135549/WhatsApp_Image_2026-10-04_at_4.44.38_PM_4.jpg", alt: "Essmat Plastic - Production Line Operations View" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135549/WhatsApp_Image_2026-10-04_at_4.44.38_PM_3.jpg", alt: "Essmat Plastic - Inventory Stock & Warehouse Grid" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135549/WhatsApp_Image_2026-10-04_at_4.44.38_PM_2.jpg", alt: "Essmat Plastic - Customer Order Processing Form" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/WhatsApp_Image_2026-10-04_at_4.44.37_PM.jpg", alt: "Essmat Plastic - Factory Billing & Invoicing Module" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/WhatsApp_Image_2026-10-04_at_4.44.37_PM_1.jpg", alt: "Essmat Plastic - SQL Server Database Connection Status" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/WhatsApp_Image_2026-10-04_at_4.44.38_PM_1.jpg", alt: "Essmat Plastic - Enterprise C# .NET Management Console" }
  ],
  food_ordering_system: [
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/f9.png", alt: "Food Ordering System - Admin Analytics & Profit Dashboard" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/f6.png", alt: "Food Ordering System - Food Hub Menu Item Management" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135562/f7.png", alt: "Food Ordering System - Customer Cart & Order Checkout" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135561/f4.png", alt: "Food Ordering System - Menu Category Manager" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135561/f8.png", alt: "Food Ordering System - Order Tracking & Delivery Status" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135559/f5.png", alt: "Food Ordering System - Customer Review & Rating Portal" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135559/f16.png", alt: "Food Ordering System - User Authentication & Login Screen" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135558/f2.png", alt: "Food Ordering System - Full Restaurant Menu Showcase" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135558/f3.png", alt: "Food Ordering System - Customer Favorites & Dish Details" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135556/f13.png", alt: "Food Ordering System - Spring Boot Backend API Swagger" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135555/f15.png", alt: "Food Ordering System - Role-based Admin User Controls" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135554/f11.png", alt: "Food Ordering System - MongoDB Realtime Database Schema" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135554/f12.png", alt: "Food Ordering System - Restaurant Commission & Billing" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135554/f14.png", alt: "Food Ordering System - Top Selling Items Analytics" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135553/f1.png", alt: "Food Ordering System - Main Application Landing Banner" }
  ],
  InGazAPI: [
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135566/WhatsApp_Image_2026-05-05_at_10.01.56_PM_1.jpg", alt: "In Gaz API System - Flutter Mobile Customer Interface" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/WhatsApp_Image_2026-05-05_at_10.01.56_PM.jpg", alt: "In Gaz API System - .NET Core Web API Integration Screen" }
  ],
  Employee_Attendance: [
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791136236/EA1.png", alt: "Employee Attendance - Admin Dashboard Overview" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791136230/EA2.png", alt: "Employee Attendance - New Assessment & Post Announcement" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791136238/EA3.png", alt: "Employee Attendance - Login & Employee Landing Screen" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791136233/EA4.png", alt: "Employee Attendance - Leave History & Status Table" }
  ],
  Restaurant_Management_System: [
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135566/r5.png", alt: "Restaurant Management - Billing & Order Summary" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/r4.png", alt: "Restaurant Management - Table Reservation System" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/r3.png", alt: "Restaurant Management - Table Allocation Grid View" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/r2.png", alt: "Restaurant Management - Food Menu Order Interface" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/r1.png", alt: "Restaurant Management - JavaFX Login & Role Selection" }
  ],
  Sleep_Alert_System: [
    { src: "https://res.cloudinary.com/delnnzcph/video/upload/v1791135570/py1.mp4", type: "video", alt: "Sleeping Alert System - Realtime Facial Bounding Box Video Demo" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135567/py2.jpg", alt: "Sleeping Alert System - OpenCV Drowsiness Detection Photo" }
  ],
  WE_Intern: [
    { src: "https://res.cloudinary.com/delnnzcph/video/upload/v1791135632/emulator_screen_edited.mp4", type: "video", alt: "WE Telecom Training Suite - Android App Demo Video" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135572/IMG-20260821-WA0083.jpg", alt: "WE Telecom Suite - Network Topology & Protocol Testing" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135568/IMG-20260727-WA0038.jpg", alt: "WE Telecom Suite - System Administration & Server Artifacts" },
    { src: "https://res.cloudinary.com/delnnzcph/image/upload/v1791135568/IMG-20260809-WA0015.jpg", alt: "WE Telecom Suite - Smart Village Lab Infrastructure" }
  ]
};

const dedupeMedia = (list) => {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list.filter((m) => {
    if (!m || !m.src) return false;
    if (seen.has(m.src)) return false;
    seen.add(m.src);
    return true;
  });
};

const resolveProjectScreenshots = (item) => {
  if (Array.isArray(item.screenshots) && item.screenshots.length > 0) {
    return item.screenshots;
  }
  const nameLower = (item.name || "").toLowerCase();
  if (nameLower.includes("dr. naglaa") || nameLower.includes("drnagla")) return PROJECT_GALLERY_REPOSITORY.drNaglaBio;
  if (nameLower.includes("zaydentity")) return PROJECT_GALLERY_REPOSITORY.zaydentity;
  if (nameLower.includes("car rental")) return PROJECT_GALLERY_REPOSITORY.Car_Rental_Website;
  if (nameLower.includes("gulf limousine")) return PROJECT_GALLERY_REPOSITORY.Gulf_Limousine_App;
  if (nameLower.includes("essmat")) return PROJECT_GALLERY_REPOSITORY.EssmatPlastic;
  if (nameLower.includes("food ordering")) return PROJECT_GALLERY_REPOSITORY.food_ordering_system;
  if (nameLower.includes("in gaz")) return PROJECT_GALLERY_REPOSITORY.InGazAPI;
  if (nameLower.includes("employee attendance")) return PROJECT_GALLERY_REPOSITORY.Employee_Attendance;
  if (nameLower.includes("restaurant")) return PROJECT_GALLERY_REPOSITORY.Restaurant_Management_System;
  if (nameLower.includes("sleeping alert") || nameLower.includes("sleep alert")) return PROJECT_GALLERY_REPOSITORY.Sleep_Alert_System;
  if (nameLower.includes("we telecom") || nameLower.includes("we intern")) return PROJECT_GALLERY_REPOSITORY.WE_Intern;
  
  return [{ src: item.image || "https://res.cloudinary.com/delnnzcph/image/upload/v1791135540/Screenshot_2026-10-04_180005.png", alt: item.name }];
};

const createProjectModalPayload = (item) => {
  const githubUrl = getGithubUrl(item.name, item.github);
  const rawMediaList = resolveProjectScreenshots(item);
  const finalMediaList = dedupeMedia(rawMediaList);

  return {
    tag: item.showcaseStatus === "Completed" ? "✨ Featured Project Showcase" : "⚡ Project Highlights",
    title: item.name || "Project Details",
    subtitle: item.period || "",
    description: item.description || "",
    media: finalMediaList,
    stack: item.stack || "",
    githubUrl: githubUrl,
    pdfUrl: item.pdfReport || (item.image && item.image.endsWith(".pdf") ? item.image : null)
  };
};

  attachCardModalHandlers(".js-project-card", (index) => createProjectModalPayload(safeItems[index] || {}));
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
      subtitle: [item.issuer, item.category, item.date].filter(Boolean).join(" · "),
      description: item.desc,
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
      event.preventDefault();
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
              const badge =
                p.status === "Completed" ? `[COMPLETED - ${shotCount} shots]` : `[${p.status || "UNKNOWN"}]`;
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
      } else if (cmd === "matrix") {
        printLine(`Toggling Matrix digital code rain... 🟢`);
        if (window.MatrixRainManager) window.MatrixRainManager.toggle();
      } else if (cmd === "audio" || cmd === "sound") {
        if (window.AudioManager) {
          const isMuted = window.AudioManager.toggleMute();
          printLine(`Sound Effects are now: ${isMuted ? "MUTED 🔇" : "ENABLED 🔊"}`);
        }
      } else if (cmd === "speech" || cmd === "voice") {
        if (window.VoiceAssistantManager) {
          printLine(`Voice synthesis assistant activated! 🎙️`);
          window.VoiceAssistantManager.speak("Welcome to Zayd Ali Mohamed's interactive developer terminal!");
        }
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

    if (sender === "bot" && window.VoiceAssistantManager) {
      window.VoiceAssistantManager.speak(text);
    }

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

  const DEFAULT_CV_URL = "https://res.cloudinary.com/delnnzcph/image/upload/v1791142658/zayd-portfolio/Zayd_Ali_Mohamed_CV.pdf";
  let cachedCvUrl = DEFAULT_CV_URL;

  fetch("/api/cv-url")
    .then((res) => {
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        return res.json();
      }
      return null;
    })
    .then((data) => {
      if (data && data.url && typeof data.url === "string" && data.url.toLowerCase().endsWith(".pdf")) {
        cachedCvUrl = data.url;
      }
    })
    .catch(() => {});

  const openCVModal = async () => {
    let cvUrl = cachedCvUrl;

    const iframe = document.getElementById("cv-iframe");
    if (iframe && iframe.getAttribute("src") !== cvUrl) {
      iframe.setAttribute("src", cvUrl);
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

  const mobileCvBtn = document.getElementById("mobile-cv-btn");
  if (mobileCvBtn) mobileCvBtn.addEventListener("click", close);

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

/* ============================================
   DYNAMIC PUZZLE MOTION PRELOADER
   ============================================ */
const initPuzzlePreloader = () => {
  const screen = document.getElementById("puzzle-loader-screen");
  const stage = document.getElementById("puzzle-stage");
  const fill = document.getElementById("puzzle-progress-fill");
  const percentText = document.getElementById("puzzle-percent-text");
  const statusText = document.getElementById("puzzle-status-text");
  const flash = document.getElementById("puzzle-flash");
  const skipBtn = document.getElementById("puzzle-skip-btn");

  if (!screen || !stage) return;
  if (screen.dataset.initialized === "true") return;
  screen.dataset.initialized = "true";

  const alreadyShown = sessionStorage.getItem("zayd_puzzle_intro_shown");
  const totalDuration = alreadyShown ? 1800 : 5500;

  // Build 3x3 Puzzle Tiles
  stage.innerHTML = "";
  const tiles = [];
  const rows = 3;
  const cols = 3;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement("div");
      tile.className = "puzzle-tile";
      tile.style.backgroundPosition = `-${c * 90}px -${r * 90}px`;

      // 3D Scattered initial coordinates
      const angle = Math.random() * Math.PI * 2;
      const dist = 180 + Math.random() * 220;
      const scatterX = Math.cos(angle) * dist;
      const scatterY = Math.sin(angle) * dist;
      const scatterZ = 200 + Math.random() * 200;
      const scatterRot = (Math.random() - 0.5) * 240;

      tile.style.transform = `translate3d(${scatterX}px, ${scatterY}px, ${scatterZ}px) rotate(${scatterRot}deg)`;
      tile.style.opacity = "0";

      stage.appendChild(tile);
      tiles.push({ el: tile, index: r * 3 + c });
    }
  }

  let isDismissed = false;
  let animStart = null;

  const dismiss = () => {
    if (isDismissed) return;
    isDismissed = true;
    sessionStorage.setItem("zayd_puzzle_intro_shown", "true");

    if (fill) fill.style.width = "100%";
    if (percentText) percentText.textContent = "100%";
    if (statusText) statusText.textContent = "SYSTEM ARCHITECTURE READY";
    if (flash) flash.classList.add("active");

    tiles.forEach((t) => {
      t.el.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
      t.el.style.opacity = "1";
    });

    setTimeout(() => {
      screen.classList.add("fade-out");
      setTimeout(() => {
        screen.style.display = "none";
      }, 800);
    }, alreadyShown ? 300 : 700);
  };

  if (skipBtn) {
    skipBtn.addEventListener("click", dismiss);
  }

  const step = (now) => {
    if (isDismissed) return;
    if (!animStart) animStart = now;
    const progress = Math.min((now - animStart) / totalDuration, 1);
    const pct = Math.floor(progress * 100);

    if (fill) fill.style.width = `${pct}%`;
    if (percentText) percentText.textContent = `${pct}%`;

    if (statusText) {
      if (pct < 25) statusText.textContent = "CONNECTING PUZZLE MODULES...";
      else if (pct < 55) statusText.textContent = "ALIGNING EMBLEM CIRCUITS...";
      else if (pct < 85) statusText.textContent = "COMPOSING USER INTERFACE...";
      else statusText.textContent = "FINALIZING SYSTEM LAUNCH...";
    }

    // Sequentially assemble tiles into 3D grid
    tiles.forEach((item) => {
      const threshold = item.index / tiles.length;
      if (progress >= threshold * 0.75) {
        item.el.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        item.el.style.opacity = "1";
      }
    });

    if (progress >= 1) {
      dismiss();
    } else {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPuzzlePreloader);
} else {
  initPuzzlePreloader();
}
