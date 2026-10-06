const express = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { connectDB, Review, Star, Contact, CvConfig, LogRecord, PortfolioSection } = require("./db");
const { getKey } = require("./keys");
const { createAdminRouter, requireAdmin, SECTION_RULES } = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://res.cloudinary.com https://cdn.jsdelivr.net https://_vercel/ https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' data: blob: https: https://res.cloudinary.com https://github.com https://avatars.githubusercontent.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; media-src 'self' blob: https:; object-src 'self' https:; frame-src 'self' https:; connect-src 'self' https:; frame-ancestors 'self';"
  );
  next();
});

// Payload size limit to prevent memory exhaustion / payload flooding
app.use(express.json({ limit: "50kb" }));

// Basic In-Memory Rate Limiter for POST requests to prevent DDoS and spam abuse
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 mins
const MAX_POST_REQUESTS = 25; // max 25 POST requests per IP per window

const postRateLimiter = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  } else {
    clientData.count++;
  }

  rateLimitMap.set(ip, clientData);

  if (clientData.count > MAX_POST_REQUESTS) {
    return res.status(429).json({
      ok: false,
      error: "Too many requests. Please wait a few minutes before trying again."
    });
  }
  next();
};

// Normalize Vercel internal rewrites to ensure Express matches original requested URL while preserving query parameters
app.use((req, res, next) => {
  const matchedPath = req.headers["x-matched-path"] || req.headers["x-forwarded-uri"];
  if (matchedPath) {
    const queryIndex = req.url.indexOf("?");
    const queryString = queryIndex !== -1 ? req.url.slice(queryIndex) : "";
    req.url = matchedPath.includes("?") ? matchedPath : `${matchedPath}${queryString}`;
  }
  next();
});

// Input Sanitization Helper Function
const sanitize = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

// Serve assets from the Assets folder FIRST with explicit options
const assetCacheHeaders = (res, filePath) => {
  if (filePath.toLowerCase().endsWith(".pdf") || filePath.toLowerCase().includes("cv")) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="Zayd_Ali_Mohamed_CV.pdf"');
  } else {
    res.setHeader("Cache-Control", "public, max-age=86400");
  }
};

const assetDirs = [
  path.join(process.cwd(), "public", "assets"),
  path.join(process.cwd(), "Assets"),
  path.join(__dirname, "public", "assets"),
  path.join(__dirname, "..", "public", "assets"),
  path.join(__dirname, "Assets"),
  path.join(__dirname, "..", "Assets"),
  path.join(__dirname, "public"),
  path.join(__dirname, "..", "public"),
  path.join(process.cwd(), "public"),
  "/var/task/public/assets",
  "/var/task/public",
  "/var/task/Assets"
];

function findAssetFile(filename) {
  if (!filename) return null;
  const raw = filename.split("?")[0].split("#")[0];
  const decoded = decodeURIComponent(raw);
  const baseName = path.basename(decoded);
  const targets = [raw, decoded, baseName, "Zayd Ali Mohamed CV.pdf", "Zayd_Ali_Mohamed_CV.pdf", "cv.pdf"];

  for (const dir of assetDirs) {
    if (!fs.existsSync(dir)) continue;

    // First try exact paths
    for (const t of targets) {
      const file = path.join(dir, t);
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        return file;
      }
    }

    // Fallback: Case-insensitive scan for Linux / Vercel serverless
    try {
      const filesInDir = fs.readdirSync(dir);
      for (const t of targets) {
        const found = filesInDir.find(
          (f) =>
            f.toLowerCase() === t.toLowerCase() ||
            f.toLowerCase() === baseName.toLowerCase() ||
            (t.toLowerCase().endsWith(".pdf") &&
              f.toLowerCase().endsWith(".pdf") &&
              (f.toLowerCase().includes("zayd") || f.toLowerCase().includes("cv")))
        );
        if (found) {
          const matchFile = path.join(dir, found);
          if (fs.existsSync(matchFile) && fs.statSync(matchFile).isFile()) {
            return matchFile;
          }
        }
      }
    } catch {}
  }
  return null;
}

// High-priority asset interceptor (handles Vercel serverless query params, asset rewrites and direct static requests)
app.use((req, res, next) => {
  // The admin API must never be answered by the static asset / CV file lookup below
  if (req.path.startsWith("/api/admin/")) return next();
  const assetQuery = req.query.asset;
  const fullUrl = req.originalUrl || req.headers["x-matched-path"] || req.url || req.path || "";
  const match = fullUrl.match(/\/(assets\/)?(.+)$/);
  const assetPath = assetQuery || (match ? match[2] : null);

  if (
    assetPath &&
    (assetPath.toLowerCase().endsWith(".pdf") || fullUrl.toLowerCase().includes("cv") || fullUrl.includes("/assets/"))
  ) {
    const file = findAssetFile(assetPath);
    if (file) {
      assetCacheHeaders(res, file);
      if (file.toLowerCase().endsWith(".pdf")) {
        res.contentType("application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="Zayd_Ali_Mohamed_CV.pdf"');
      }
      return res.sendFile(file);
    }
  }
  next();
});

assetDirs.forEach((dir) => {
  app.use(
    "/assets",
    express.static(dir, {
      setHeaders: assetCacheHeaders
    })
  );
});

// Then serve public folder
app.use(
  express.static(path.join(process.cwd(), "public"), {
    index: false // Don't serve index.html for missing files
  })
);

app.use(
  express.static(path.join(__dirname, "..", "public"), {
    index: false
  })
);

const portfolioData = {
  profile: {
    name: "Zayd Ali Mohamed",
    title: "Junior Computer Science Student | Software Developer",
    location: "Maadi, Cairo",
    phone: "01017741741",
    email: "zaydaly0501@gmail.com",
    linkedin: "https://www.linkedin.com/in/zayd-ali-17a85a1a0",
    github: "https://github.com/zaydaly05",
    summary:
      "Motivated senior computer science student who loves technology and problem solving. I enjoy learning new skills, building practical projects, and taking part in workshops that strengthen my software development knowledge."
  },
  education: [
    {
      institution: "Misr International University",
      degree: "Bachelor of Science in Computer Science",
      period: "Sep 2023 - Jun 2027"
    }
  ],
  activities: [
    {
      name: "ACPC Club",
      role: "Member",
      period: "2023 - Present"
    },
    {
      name: "IEEE Club",
      role: "Member",
      period: "2023 - Present"
    }
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
      pdfReport: "/assets/essmat-plastic-report.pdf",
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
    {
      category: "Databases",
      items: ["PostgreSQL", "MongoDB", "Firebase", "MySQL", "SQL Server", "Room Database"]
    },
    {
      category: "Developer Tools",
      items: ["Android Studio", "VS Code", "Git", "GitHub", "Apache NetBeans", "XAMPP", "Docker", "Postman", "Swagger"]
    },
    {
      category: "Microsoft Office 365",
      items: ["Word", "Excel", "PowerPoint", "Access"]
    },
    {
      category: "Design Tools",
      items: ["Adobe Photoshop", "Adobe InDesign", "Adobe Premiere", "Filmora"]
    },
    {
      category: "Data Analysis",
      items: ["Orange Data Mining"]
    },
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
      pdf: "/assets/Online%20Certificates/JavaScriptEssentials2Update20250713-27-31fbam.pdf",
      desc: "Advanced JavaScript ES6+, asynchronous programming, object-oriented concepts, and DOM manipulation."
    },
    {
      title: "Cisco C Essentials 1 Certification",
      issuer: "Cisco Networking Academy & OpenEDG C Institute",
      date: "July 2025",
      category: "Systems & Core Programming",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1791135536/c-essentials-1.png",
      pdf: "/assets/Online%20Certificates/CEssentials1Update20250709-29-hnum8q.pdf",
      desc: "Low-level system programming, memory management, pointers, and algorithmic structures in C."
    },
    {
      title: "Introduction to Cybersecurity Certification",
      issuer: "Cisco Networking Academy",
      date: "July 2025",
      category: "Cybersecurity & Networks",
      image:
        "https://res.cloudinary.com/delnnzcph/image/upload/v1791135537/Introduction_To_Cybersecurity_C.png",
      pdf: "/assets/Online%20Certificates/I2CSUpdate20250709-27-93jy0g.pdf",
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

const getShowcaseManifest = () => {
  const manifestPath = path.join(__dirname, 'scripts', 'showcase', 'showcase-manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {}
  }
  return { projects: {} };
};

// In-Memory Ring Buffer for Telemetry Logs & Crash Records
const systemLogBuffer = [];
const MAX_LOG_BUFFER = 200;

app.get("/api/logs", requireAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const level = req.query.level;

    let dbLogs = [];
    try {
      const db = await connectDB();
      if (db) {
        const query = level ? { level } : {};
        dbLogs = await LogRecord.find(query).sort({ timestamp: -1 }).limit(limit).lean();
      }
    } catch (_e) {}

    let combinedLogs = [...systemLogBuffer];
    if (dbLogs.length > 0) {
      const existingIds = new Set(combinedLogs.map((l) => l.id || l.logId));
      for (const d of dbLogs) {
        const recordId = d.logId || (d._id ? d._id.toString() : Math.random().toString(36).substr(2, 9));
        if (!existingIds.has(recordId)) {
          combinedLogs.push({
            id: recordId,
            timestamp: d.timestamp,
            level: d.level,
            message: d.message,
            details: d.details,
            url: d.url,
            path: d.path,
            ip: d.ip,
            userAgent: d.userAgent
          });
        }
      }
    }

    combinedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (level) {
      combinedLogs = combinedLogs.filter((l) => l.level === level);
    }

    res.json({
      success: true,
      count: combinedLogs.length,
      logs: combinedLogs.slice(0, limit)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, logs: systemLogBuffer });
  }
});

app.post("/api/logs", async (req, res) => {
  try {
    const logData = req.body || {};
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

    const entry = {
      id: logData.id || Math.random().toString(36).substring(2, 11),
      timestamp: logData.timestamp || new Date().toISOString(),
      level: logData.level || "info",
      message: logData.message || "Unspecified client log event",
      details: logData.details || {},
      url: logData.url || "",
      path: logData.path || "",
      ip: ip,
      userAgent: logData.userAgent || req.headers["user-agent"] || ""
    };

    systemLogBuffer.unshift(entry);
    if (systemLogBuffer.length > MAX_LOG_BUFFER) systemLogBuffer.pop();

    const prefix = entry.level === "crash" ? "🚨 [CRASH]" : entry.level === "error" ? "❌ [ERROR]" : "ℹ️ [LOG]";
    console.log(`${prefix} ${entry.message} (Path: ${entry.path}, IP: ${ip})`);

    try {
      const db = await connectDB();
      if (db) {
        LogRecord.create({
          logId: entry.id,
          timestamp: new Date(entry.timestamp),
          level: entry.level,
          message: entry.message,
          details: entry.details,
          url: entry.url,
          path: entry.path,
          ip: entry.ip,
          userAgent: entry.userAgent
        }).catch((err) => console.error("Failed to save LogRecord to DB:", err.message));
      }
    } catch (_e) {}

    res.json({ success: true, recorded: entry.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/logs", requireAdmin, (req, res) => {
  systemLogBuffer.length = 0;
  res.json({ success: true, message: "Logs cleared successfully" });
});

app.get("/api/portfolio", async (req, res) => {
  await refreshPortfolioOverrides();
  const showcase = getShowcaseManifest();
  const enrichedProjects = portfolioData.projects.map((p) => {
    const githubUrl = p.github || "";
    const match = githubUrl.match(/github\.com\/[^/]+\/([^/#?]+)/i);
    const slug = match ? match[1].replace(/\.git$/i, "") : p.name.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const pShowcase = (showcase.projects && showcase.projects[slug]) || {};
    return {
      ...p,
      slug,
      showcaseStatus: pShowcase.status || "Pending",
      showcaseReason: pShowcase.reason || null,
      screenshots: pShowcase.screenshots && pShowcase.screenshots.length ? pShowcase.screenshots : undefined
    };
  });
  res.json({ ...portfolioData, projects: enrichedProjects });
});

// Intelligent Automated Project Showcase API
app.get("/api/showcase/status", (req, res) => {
  const showcase = getShowcaseManifest();
  res.json({
    lastUpdated: showcase.lastUpdated || null,
    projects: showcase.projects || {}
  });
});

app.post("/api/showcase/generate", postRateLimiter, async (req, res) => {
  const { projectName } = req.body || {};
  try {
    const { processProjectShowcase, runAllShowcases } = require("./scripts/showcase/showcase-manager");
    res.json({ success: true, message: "Automated project showcase generation triggered in background." });

    if (projectName) {
      const target = portfolioData.projects.find((p) => p.name.toLowerCase().includes(projectName.toLowerCase()));
      if (target) {
        processProjectShowcase(target).catch((err) => console.error("Async Showcase Error:", err.message));
      }
    } else {
      runAllShowcases(portfolioData.projects).catch((err) => console.error("Async Showcase Error:", err.message));
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Live Status & Cairo Time API
app.get("/api/status", (req, res) => {
  const cairoTime = new Date().toLocaleString("en-US", {
    timeZone: "Africa/Cairo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  res.json({
    status: "Available for Software Engineering Internships & Roles",
    location: "Cairo, Egypt (UTC+2 / UTC+3)",
    cairoTime,
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// GitHub Live Sync Cache
let githubCache = { data: null, timestamp: 0 };
app.get("/api/github", async (req, res) => {
  const cacheDuration = 15 * 60 * 1000; // 15 mins
  if (githubCache.data && Date.now() - githubCache.timestamp < cacheDuration) {
    return res.json(githubCache.data);
  }

  const ghToken = getKey("github") || process.env.GITHUB_TOKEN;
  const headers = { "User-Agent": "Zayd-Portfolio-App" };
  if (ghToken) {
    headers["Authorization"] = `token ${ghToken}`;
  }

  try {
    const userRes = await fetch("https://api.github.com/users/zaydaly05", { headers });

    if (!userRes.ok) {
      if (githubCache.data) {
        return res.json(githubCache.data);
      }
      throw new Error(`GitHub API error: ${userRes.status}`);
    }

    const userData = await userRes.json();
    const reposRes = await fetch("https://api.github.com/users/zaydaly05/repos?sort=updated&per_page=6", { headers });
    const reposData = reposRes.ok ? await reposRes.json() : [];

    const formattedRepos = Array.isArray(reposData) ? reposData.map((r) => ({
      name: r.name,
      description: r.description || "Project repository by Zayd",
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language || "JavaScript",
      updatedAt: r.updated_at
    })) : [];

    const result = {
      username: userData.login,
      avatar: userData.avatar_url,
      bio: userData.bio || "Junior Computer Science Student | Software Developer",
      publicRepos: userData.public_repos,
      followers: userData.followers,
      profileUrl: userData.html_url,
      topRepos: formattedRepos
    };

    githubCache = { data: result, timestamp: Date.now() };
    res.json(result);
  } catch (err) {
    console.warn("GitHub fetch notice (using cache/fallback):", err.message);
    if (githubCache.data) {
      return res.json(githubCache.data);
    }
    // Fallback response if offline or rate limited
    res.json({
      username: "zaydaly05",
      avatar: "https://github.com/zaydaly05.png",
      bio: "Senior Computer Science Student | Software Developer",
      publicRepos: 12,
      followers: 10,
      profileUrl: "https://github.com/zaydaly05",
      topRepos: [
        {
          name: "Food-Ordering-System",
          description: "Full-stack food ordering platform built with Spring Boot, React, and MongoDB.",
          url: "https://github.com/zaydaly05",
          stars: 5,
          forks: 2,
          language: "Java",
          updatedAt: new Date().toISOString()
        },
        {
          name: "In-Gaz-API",
          description: "Mobile & API backend system with Flutter and C# .NET Core.",
          url: "https://github.com/zaydaly05",
          stars: 4,
          forks: 1,
          language: "C#",
          updatedAt: new Date().toISOString()
        },
        {
          name: "Car-Rental-Platform",
          description: "Car rental e-commerce site with Node.js, Express, and MongoDB.",
          url: "https://github.com/zaydaly05",
          stars: 3,
          forks: 1,
          language: "JavaScript",
          updatedAt: new Date().toISOString()
        }
      ]
    });
  }
});

// Professional Real-time GitHub Webhook
// This endpoint receives a push event from GitHub and instantly invalidates our cache
// so the next visitor sees the updated repository count immediately.
app.post("/api/github-webhook", express.json(), (req, res) => {
  // We can add signature verification here if a secret is configured
  console.log("GitHub Webhook received! Invalidating local GitHub cache...");

  // Instantly expire the cache
  githubCache.timestamp = 0;

  res.status(200).json({ success: true, message: "GitHub cache invalidated successfully. Ready for real-time sync." });
});

// AI Copilot Chatbot Endpoint
app.post("/api/chat", postRateLimiter, async (req, res) => {
  await refreshPortfolioOverrides();
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Please type a message!" });
  }

  const query = sanitize(message).toLowerCase().trim();
  let reply = "";
  let suggestions = [];

  if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("who are you")) {
    reply =
      "Hello! I am **Zayd's AI Assistant**. I can tell you all about Zayd's technical skills, software projects, internships at TAQA Arabia, education at MIU, certifications, or help you schedule a call with him!";
    suggestions = [
      "What is Zayd's tech stack?",
      "Tell me about TAQA Arabia internship",
      "Show top projects",
      "How to contact Zayd?"
    ];
  } else if (
    query.includes("skill") ||
    query.includes("stack") ||
    query.includes("language") ||
    query.includes("framework") ||
    query.includes("tool")
  ) {
    reply =
      "Zayd has a versatile technical skill set:\n\n" +
      "⚡ **Languages:** Java, C#, C++, C, Python, JavaScript, PHP, Dart, SQL, HTML/CSS, Tailwind\n" +
      "🛠️ **Frameworks & Libraries:** Spring Boot, React, Node.js, Express.js, Flutter, .NET Core Web API, JavaFX\n" +
      "🗄️ **Databases:** MongoDB, MySQL, Firebase, SQL\n" +
      "🔧 **Tools:** Git, GitHub, VS Code, Android Studio, XAMPP, NetBeans, Orange Data Mining";
    suggestions = ["Show projects", "Tell me about TAQA Arabia", "Download Zayd's CV"];
  } else if (
    query.includes("project") ||
    query.includes("food") ||
    query.includes("car") ||
    query.includes("in gaz") ||
    query.includes("sleeping") ||
    query.includes("restaurant")
  ) {
    reply =
      "Zayd has built several impressive full-stack & mobile software projects:\n\n" +
      "1️⃣ **Food Ordering Management System** (Spring Boot, React, Tailwind, MongoDB) - Full-stack web app with role-based auth, cart, analytics & profit insights.\n" +
      "2️⃣ **In Gaz API System** (Flutter, C# .NET Core Web API) - Mobile frontend integrated with RESTful C# API & Swagger testing.\n" +
      "3️⃣ **Car Rental Website** (Node.js, Express, MongoDB, JS) - E-commerce platform for car rentals.\n" +
      "4️⃣ **Employee Attendance & Leave System** (PHP, MySQL, HTML/CSS) - Relational DB & automated tracking.\n" +
      "5️⃣ **Sleeping Alert System** (Python, Flutter) - HCI usability project for driver alert system.";
    suggestions = ["Tell me about Spring Boot project", "GitHub repositories", "Contact Zayd"];
  } else if (
    query.includes("taqa") ||
    query.includes("cairo higher") ||
    query.includes("intern") ||
    query.includes("experience") ||
    query.includes("work")
  ) {
    reply =
      "Here is Zayd's hands-on professional experience:\n\n" +
      "🏢 **Cairo Higher Institute** (Aug 2025 - Sep 2025)\nIT Dept Intern — Domain emails management, WordPress front-end updates, official social media & video production.\n\n" +
      "⚡ **TAQA Arabia** (Jul 2025 - Aug 2025)\nSoftware Development Intern — Contributed to developing the **In Gaz API mobile app**.\n\n" +
      "💼 **TAQA Arabia** (Aug 2024 - Sep 2024)\nIT Department Intern — Software device management, user account management & IT support.";
    suggestions = ["What are Zayd's main projects?", "View Skills", "Schedule an Interview"];
  } else if (
    query.includes("education") ||
    query.includes("miu") ||
    query.includes("university") ||
    query.includes("acpc") ||
    query.includes("ieee") ||
    query.includes("study")
  ) {
    reply =
      "🎓 Zayd is currently pursuing a **Bachelor of Science in Computer Science** at **Misr International University (MIU)** (Sep 2023 - Jun 2027).\n\nHe is also an active member of both **ACPC Club** (Competitive Programming) and **IEEE Club**!";
    suggestions = ["What projects has Zayd built?", "Skills breakdown", "Contact info"];
  } else if (
    query.includes("certificate") ||
    query.includes("certification") ||
    query.includes("course") ||
    query.includes("training")
  ) {
    reply =
      "Zayd has completed multiple rigorous online certifications, including:\n\n" +
      "📜 **Cisco JavaScript Essentials 1 & 2**\n" +
      "📜 **Cisco Introduction to Cybersecurity**\n" +
      "📜 **Cisco C Essentials 1**\n" +
      "📜 **CSS Essentials** (OpenEDG)\n\n" +
      "He also holds official Experience Letters from his successful internships at **TAQA Arabia** and **Cairo Higher Institute**.";
    suggestions = ["Show experience", "What is Zayd's tech stack?", "Download CV"];
  } else if (query.includes("linkedin")) {
    reply =
      "💼 **Connect with Zayd Ali Mohamed on LinkedIn:**\n\n" +
      "🔗 [linkedin.com/in/zayd-ali-17a85a1a0](https://www.linkedin.com/in/zayd-ali-17a85a1a0)\n\n" +
      "Feel free to send a connection request or direct message to connect!";
    suggestions = ["Email Zayd", "Show experience", "Download CV"];
  } else if (
    query.includes("contact") ||
    query.includes("email") ||
    query.includes("phone") ||
    query.includes("hire") ||
    query.includes("reach")
  ) {
    reply =
      "📬 You can reach Zayd directly via:\n\n" +
      "📧 **Email:** [zaydaly0501@gmail.com](mailto:zaydaly0501@gmail.com)\n" +
      "📱 **Phone / WhatsApp:** +20 101 774 1741\n" +
      "💼 **LinkedIn:** [linkedin.com/in/zayd-ali-17a85a1a0](https://www.linkedin.com/in/zayd-ali-17a85a1a0)\n" +
      "💻 **GitHub:** [github.com/zaydaly05](https://github.com/zaydaly05)";
    suggestions = ["Download CV", "Ask for availability", "Show top projects"];
  } else if (
    query.includes("available") ||
    query.includes("opportunity") ||
    query.includes("role") ||
    query.includes("status")
  ) {
    reply =
      "🟢 **Zayd is currently AVAILABLE** for Software Engineering internships, full-stack development roles, and collaborative technical projects!";
    suggestions = ["Send a message", "Download CV", "View experience"];
  } else if (query.includes("cv") || query.includes("resume") || query.includes("pdf")) {
    reply = "📄 You can view Zayd's full CV right here in the web app or click **Download CV** in the navigation bar!";
    suggestions = ["Open CV Viewer", "Contact Zayd", "Show experience"];
  } else {
    reply =
      "That's a great question! Zayd is a Junior Computer Science student skilled in **Java (Spring Boot), React, Node.js, C# .NET, Flutter, PHP, and MongoDB**. Feel free to ask about his projects, internships, or contact details!";
    suggestions = ["What is Zayd's tech stack?", "Show experience", "Show top projects", "How to contact Zayd?"];
  }

  res.json({ reply, suggestions });
});

app.post("/api/contact", postRateLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "All fields are required." });
  }

  const cleanName = sanitize(name);
  const cleanEmail = sanitize(email);
  const cleanMessage = sanitize(message);

  try {
    const db = await connectDB();
    if (db) {
      await Contact.create({
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage
      });
    }
  } catch (err) {
    console.error("Error saving contact message to MongoDB:", err.message);
  }

  return res.json({
    ok: true,
    message: `Thanks ${cleanName}, your message has been received! Zayd will get back to you shortly at ${cleanEmail}.`
  });
});

// Community Reviews & Star Rating Store (MongoDB with Local JSON File Fallback)
const getWritablePath = (filename) => {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), filename);
  }
  const localLogsDir = path.join(__dirname, "logs");
  const localFilePath = path.join(localLogsDir, filename);
  try {
    if (!fs.existsSync(localLogsDir)) {
      fs.mkdirSync(localLogsDir, { recursive: true });
    }
    return localFilePath;
  } catch {
    return path.join(os.tmpdir(), filename);
  }
};

const REVIEWS_FILE = getWritablePath("user-reviews.json");
const STAR_FILE = getWritablePath("star-count.json");

const getStoredReviews = () => {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      return JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf8"));
    }
  } catch {}
  return [
    {
      id: "linkedin-1",
      name: "Mohammed Essam El Din",
      role: "SWE @ El Zatuna | IBM Student Ambassador @ MIU",
      rating: 5,
      comment:
        "I'm proud to recommend my friend and colleague, Zayd, whose dedication, knowledge, and willingness to help others truly set him apart. Throughout our time working and studying together, Zayd consistently demonstrated a strong commitment not only to his own learning but also to supporting those around him. One of Zayd's most admirable qualities is his willingness to help others.",
      date: "2025-07-09",
      isLinkedin: true
    },
    {
      id: "linkedin-2",
      name: "Ahmed Hatem",
      role: "Electronics and Communication Engineering Student @MIU",
      rating: 5,
      comment:
        "Zayd is a hardworking and creative Computer Science student with a strong passion for software engineering. He approaches every task with focus and a problem-solving mindset. I'm confident he has a bright future ahead in tech.",
      date: "2025-07-09",
      isLinkedin: true
    },
    {
      id: "linkedin-3",
      name: "Hazem Mohamed",
      role: "DevOps Engineer | 3x AWS Certified | Software Engineer",
      rating: 5,
      comment: "Zayd is a curious and motivated student who loves learning and always seeks to understand more.",
      date: "2025-07-01",
      isLinkedin: true
    }
  ];
};

const getStarCount = () => {
  try {
    if (fs.existsSync(STAR_FILE)) {
      const data = JSON.parse(fs.readFileSync(STAR_FILE, "utf8"));
      return data.stars || 48;
    }
  } catch {}
  return 48;
};

app.get("/api/reviews", async (req, res) => {
  let finalReviews = getStoredReviews(); // Always include LinkedIn static recommendations

  try {
    const db = await connectDB();
    if (db) {
      const dbReviews = await Review.find().sort({ createdAt: -1 }).lean();
      if (dbReviews && dbReviews.length > 0) {
        const mappedReviews = dbReviews.map((r) => ({
          id: r._id.toString(),
          name: r.name,
          role: r.role,
          rating: r.rating,
          comment: r.comment,
          date: r.date
        }));
        // Prepend MongoDB community reviews above the LinkedIn recommendations
        finalReviews = [...mappedReviews, ...finalReviews];
      }
    }
  } catch (err) {
    console.error("Error fetching reviews from MongoDB:", err.message);
  }
  res.json({ ok: true, reviews: finalReviews });
});

app.post("/api/reviews", postRateLimiter, async (req, res) => {
  const { name, role, rating, comment } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ ok: false, error: "Name and comment are required." });
  }

  const cleanName = sanitize(name).trim();
  const cleanRole = sanitize(role || "Visitor / Developer").trim();
  const cleanRating = Math.min(5, Math.max(1, parseInt(rating) || 5));
  const cleanComment = sanitize(comment).trim();
  const currentDate = new Date().toISOString().split("T")[0];

  const newReview = {
    id: Date.now(),
    name: cleanName,
    role: cleanRole,
    rating: cleanRating,
    comment: cleanComment,
    date: currentDate
  };

  try {
    const db = await connectDB();
    if (db) {
      const created = await Review.create({
        name: cleanName,
        role: cleanRole,
        rating: cleanRating,
        comment: cleanComment,
        date: currentDate
      });
      newReview.id = created._id.toString();
    }
  } catch (err) {
    console.error("Error saving review to MongoDB:", err.message);
  }

  const reviews = getStoredReviews();
  reviews.unshift(newReview);
  try {
    const filePath = getWritablePath("user-reviews.json");
    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2), "utf8");
  } catch {}

  res.json({ ok: true, message: "Review posted successfully!", review: newReview });
});

app.get("/api/star", async (req, res) => {
  try {
    const db = await connectDB();
    if (db) {
      const starDoc = await Star.findOne({ key: "star_count" });
      if (starDoc) {
        return res.json({ ok: true, stars: starDoc.stars });
      }
    }
  } catch (err) {
    console.error("Error fetching star count from MongoDB:", err.message);
  }
  res.json({ ok: true, stars: getStarCount() });
});

app.post("/api/star", postRateLimiter, async (req, res) => {
  let stars = getStarCount() + 1;
  try {
    const db = await connectDB();
    if (db) {
      const updated = await Star.findOneAndUpdate(
        { key: "star_count" },
        { $inc: { stars: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      stars = updated.stars;
    }
  } catch (err) {
    console.error("Error updating star count in MongoDB:", err.message);
  }

  try {
    const filePath = getWritablePath("star-count.json");
    fs.writeFileSync(filePath, JSON.stringify({ stars }, null, 2), "utf8");
  } catch {}

  res.json({ ok: true, stars, message: "Thank you for starring Zayd's portfolio!" });
});

// ---------------------------------------------------------------------------
// Admin-editable portfolio content
// Built-in content lives in `portfolioData`; edits made from the admin mobile app are stored
// per section (MongoDB, or a local JSON file when no database is configured) and layered on top.
// ---------------------------------------------------------------------------
const portfolioDefaults = JSON.parse(JSON.stringify(portfolioData));
const OVERRIDES_TTL_MS = 15000;
const overrideState = { loadedAt: 0, sections: new Set() };

const overridesFilePath = () => getWritablePath("portfolio-overrides.json");

const readLocalOverrides = () => {
  try {
    return JSON.parse(fs.readFileSync(overridesFilePath(), "utf8")) || {};
  } catch {
    return {};
  }
};

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

async function refreshPortfolioOverrides(force = false) {
  if (!force && Date.now() - overrideState.loadedAt < OVERRIDES_TTL_MS) return;
  overrideState.loadedAt = Date.now();

  let overrides = null;
  if (getKey("mongodb")) {
    // A configured database is the source of truth. If it is slow or down, keep serving what we
    // already have rather than delaying the public site or falling back to the built-in content.
    try {
      const db = await withTimeout(connectDB(), 2500);
      if (!db) return;
      const docs = await withTimeout(PortfolioSection.find().lean(), 2500);
      overrides = {};
      docs.forEach((doc) => {
        overrides[doc.section] = doc.data;
      });
    } catch (err) {
      console.error("Could not load portfolio overrides from MongoDB:", err.message);
      return;
    }
  } else {
    overrides = readLocalOverrides();
  }

  overrideState.sections = new Set();
  Object.keys(SECTION_RULES).forEach((section) => {
    if (Object.prototype.hasOwnProperty.call(overrides, section)) {
      portfolioData[section] = overrides[section];
      overrideState.sections.add(section);
    } else {
      portfolioData[section] = JSON.parse(JSON.stringify(portfolioDefaults[section]));
    }
  });
}

async function savePortfolioOverride(section, data) {
  const db = await connectDB();
  if (db) {
    if (data === null) await PortfolioSection.deleteOne({ section });
    else await PortfolioSection.findOneAndUpdate({ section }, { data, updatedAt: new Date() }, { upsert: true });
  } else {
    const local = readLocalOverrides();
    if (data === null) delete local[section];
    else local[section] = data;
    fs.writeFileSync(overridesFilePath(), JSON.stringify(local, null, 2), "utf8");
  }
  if (data === null) overrideState.sections.delete(section);
  else overrideState.sections.add(section);
  overrideState.loadedAt = Date.now();
}

app.use(
  "/api/admin",
  createAdminRouter({
    portfolioData,
    defaults: portfolioDefaults,
    connectDB,
    models: { Review, Contact, Star },
    saveOverride: savePortfolioOverride,
    refreshOverrides: refreshPortfolioOverrides,
    overriddenSections: () => [...overrideState.sections]
  })
);

// Dynamic CV URL API & Redirects
const DEFAULT_CV_URL = "/Zayd_Ali_Mohamed_CV.pdf";

app.get("/api/cv-url", async (req, res) => {
  try {
    const db = await connectDB();
    if (db) {
      const config = await CvConfig.findOne({ key: "cv_url" });
      if (config && config.url) {
        let cleanUrl = config.url;
        if (cleanUrl.includes("collection.cloudinary.com")) {
          cleanUrl = DEFAULT_CV_URL;
          await CvConfig.findOneAndUpdate(
            { key: "cv_url" },
            { url: DEFAULT_CV_URL, updatedAt: new Date() },
            { upsert: true }
          ).catch(() => {});
        }
        return res.json({ ok: true, url: cleanUrl });
      }
    }
  } catch (err) {
    console.error("Error fetching CV URL from MongoDB:", err.message);
  }
  res.json({ ok: true, url: DEFAULT_CV_URL });
});

app.post("/api/cv-url", requireAdmin, postRateLimiter, async (req, res) => {
  const { url } = req.body || {};
  if (!url || typeof url !== "string") {
    return res.status(400).json({ ok: false, error: "Valid url parameter required" });
  }

  try {
    const db = await connectDB();
    if (db) {
      const updated = await CvConfig.findOneAndUpdate(
        { key: "cv_url" },
        { url, updatedAt: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ ok: true, url: updated.url, message: "CV URL updated successfully in database" });
    }
  } catch (err) {
    console.error("Error updating CV URL in MongoDB:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }

  res.json({ ok: true, url, message: "CV URL updated (local fallback)" });
});

app.get("/cv", async (req, res) => {
  let targetUrl = DEFAULT_CV_URL;
  try {
    const db = await connectDB();
    if (db) {
      const config = await CvConfig.findOne({ key: "cv_url" });
      if (config && config.url) {
        targetUrl = config.url.includes("collection.cloudinary.com") ? DEFAULT_CV_URL : config.url;
      }
    }
  } catch (_err) {}

  res.redirect(302, targetUrl);
});

// Kapso WhatsApp Cloud API Webhook Routes
const { handleWebhookVerification, handleWebhookEvent } = require("./api/whatsapp-webhook");
const { requestWhatsAppApproval, pendingApprovals } = require("./api/whatsapp-approval");

app.get("/api/whatsapp/webhook", handleWebhookVerification);
app.post("/api/whatsapp/webhook", handleWebhookEvent);

// WhatsApp Human-in-the-Loop Approval Endpoints
app.post("/api/whatsapp/request-approval", async (req, res) => {
  const { actionName, description, timeoutMs } = req.body || {};
  if (!actionName || !description) {
    return res.status(400).json({ ok: false, error: "actionName and description are required." });
  }

  // Asynchronously request approval
  const result = await requestWhatsAppApproval(actionName, description, timeoutMs || 300000);
  res.json({ ok: true, result });
});

app.get("/api/whatsapp/pending-approvals", (req, res) => {
  const list = Array.from(pendingApprovals.values()).filter((item) => typeof item === "object" && item.id);
  res.json({ ok: true, pendingCount: list.length, approvals: list });
});

// Explicit Multi-Page HTML Routes
const servePage = (pageName) => (req, res) => {
  res.sendFile(path.join(__dirname, "public", `${pageName}.html`));
};

app.get(["/projects", "/projects.html"], servePage("projects"));
app.get(["/experience", "/experience.html"], servePage("experience"));
app.get(["/skills", "/skills.html"], servePage("skills"));
app.get(["/contact", "/contact.html"], servePage("contact"));

// Catch-all: serve index.html for SPA routing (MUST be last)
app.use((req, res) => {
  const reqUrl =
    req.headers["x-matched-path"] || req.headers["x-forwarded-uri"] || req.originalUrl || req.url || req.path || "";
  const cleanPath = reqUrl.split("?")[0].toLowerCase();

  if (cleanPath.includes("/assets/")) {
    const match = reqUrl.match(/\/assets\/(.+)$/i);
    const filename = match ? match[1] : "";
    const file = findAssetFile(filename);
    if (file) {
      assetCacheHeaders(res, file);
      if (file.toLowerCase().endsWith(".pdf")) {
        res.contentType("application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="Zayd_Ali_Mohamed_CV.pdf"');
      }
      return res.sendFile(file);
    }
    return res.status(404).json({ error: "Asset not found" });
  }

  if (cleanPath.endsWith("/projects") || cleanPath.endsWith("/projects.html")) {
    return res.sendFile(path.join(__dirname, "public", "projects.html"));
  }
  if (cleanPath.endsWith("/experience") || cleanPath.endsWith("/experience.html")) {
    return res.sendFile(path.join(__dirname, "public", "experience.html"));
  }
  if (cleanPath.endsWith("/skills") || cleanPath.endsWith("/skills.html")) {
    return res.sendFile(path.join(__dirname, "public", "skills.html"));
  }
  if (cleanPath.endsWith("/contact") || cleanPath.endsWith("/contact.html")) {
    return res.sendFile(path.join(__dirname, "public", "contact.html"));
  }

  if (cleanPath.startsWith("/api/") && !cleanPath.startsWith("/api/index")) {
    return res.status(404).json({ error: "Not found" });
  }

  const isHomeRoute = cleanPath === "" || cleanPath === "/" || cleanPath === "/index" || cleanPath === "/index.html";
  if (isHomeRoute) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }

  // Return true HTTP 404 status for non-existent routes to prevent Soft 404 issues
  res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Portfolio running on http://localhost:${PORT}`);
  });
}

app.portfolioData = portfolioData;
module.exports = app;
