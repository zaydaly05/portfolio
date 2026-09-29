const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve assets from the Assets folder FIRST with explicit options
app.use('/assets', express.static(path.join(__dirname, "Assets"), {
  setHeaders: (res, filePath) => {
    if (filePath.toLowerCase().endsWith("cv.pdf")) {
      res.setHeader("Cache-Control", "no-cache");
    } else {
      res.setHeader("Cache-Control", "public, max-age=86400");
    }
  }
}));

// Then serve public folder
app.use(express.static(path.join(__dirname, "public"), {
  index: false // Don't serve index.html for missing files
}));

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
      "Motivated junior computer science student who loves technology and problem solving. I enjoy learning new skills, building practical projects, and taking part in workshops that strengthen my software development knowledge."
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
      points: [
        "Contributed to developing the In Gaz API mobile application."
      ]
    },
    {
      company: "TAQA Arabia",
      role: "IT Department Intern",
      period: "August 2024 - September 2024",
      location: "Maadi, Cairo",
      points: [
        "Handled devices software management.",
        "Managed user accounts and access support."
      ]
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
      image: "/assets/employee-e1.png",
      pdfReport: "/assets/essmat-plastic-report.pdf",
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
    {
      category: "Languages",
      items: ["PHP", "C", "Python", "Java", "HTML", "CSS", "JavaScript", "SQL", "C++", "C#", "Flutter", "Dart", "Tailwind"]
    },
    {
      category: "Databases",
      items: ["SQL", "MongoDB", "Firebase"]
    },
    {
      category: "Frameworks",
      items: ["Node.js", "Express.js", "Spring Boot", "React"]
    },
    {
      category: "Developer Tools",
      items: ["VS Code", "Apache NetBeans", "XAMPP", "Git", "GitHub", "Android Studio"]
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
      items: ["Data Structures", "OOP"]
    }
  ],
  softSkills: [
    "Strong teamwork abilities",
    "Problem solving",
    "Time management and organizational skills"
  ],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "French", level: "Beginner" }
  ]
};

app.get("/api/portfolio", (req, res) => {
  res.json(portfolioData);
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

  try {
    const userRes = await fetch("https://api.github.com/users/zaydaly05", {
      headers: { "User-Agent": "Zayd-Portfolio-App" }
    });

    if (!userRes.ok) {
      throw new Error(`GitHub API error: ${userRes.status}`);
    }

    const userData = await userRes.json();
    const reposRes = await fetch("https://api.github.com/users/zaydaly05/repos?sort=updated&per_page=6", {
      headers: { "User-Agent": "Zayd-Portfolio-App" }
    });
    const reposData = reposRes.ok ? await reposRes.json() : [];

    const formattedRepos = reposData.map(r => ({
      name: r.name,
      description: r.description || "Project repository by Zayd",
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language || "JavaScript",
      updatedAt: r.updated_at
    }));

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
    console.error("GitHub fetch error:", err.message);
    // Fallback response if offline or rate limited
    res.json({
      username: "zaydaly05",
      avatar: "https://github.com/zaydaly05.png",
      bio: "Junior Computer Science Student | Software Developer",
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

// AI Copilot Chatbot Endpoint
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Please type a message!" });
  }

  const query = message.toLowerCase().trim();
  let reply = "";
  let suggestions = [];

  if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("who are you")) {
    reply = "Hello! I am **Zayd's AI Assistant**. I can tell you all about Zayd's technical skills, software projects, internships at TAQA Arabia, education at MIU, or help you schedule a call with him!";
    suggestions = ["What is Zayd's tech stack?", "Tell me about TAQA Arabia internship", "Show top projects", "How to contact Zayd?"];
  } else if (query.includes("skill") || query.includes("stack") || query.includes("language") || query.includes("framework") || query.includes("tool")) {
    reply = "Zayd has a versatile technical skill set:\n\n" +
      "⚡ **Languages:** Java, C#, C++, C, Python, JavaScript, PHP, Dart, SQL, HTML/CSS, Tailwind\n" +
      "🛠️ **Frameworks & Libraries:** Spring Boot, React, Node.js, Express.js, Flutter, .NET Core Web API, JavaFX\n" +
      "🗄️ **Databases:** MongoDB, MySQL, Firebase, SQL\n" +
      "🔧 **Tools:** Git, GitHub, VS Code, Android Studio, XAMPP, NetBeans, Orange Data Mining";
    suggestions = ["Show projects", "Tell me about TAQA Arabia", "Download Zayd's CV"];
  } else if (query.includes("project") || query.includes("food") || query.includes("car") || query.includes("in gaz") || query.includes("sleeping") || query.includes("restaurant")) {
    reply = "Zayd has built several impressive full-stack & mobile software projects:\n\n" +
      "1️⃣ **Food Ordering Management System** (Spring Boot, React, Tailwind, MongoDB) - Full-stack web app with role-based auth, cart, analytics & profit insights.\n" +
      "2️⃣ **In Gaz API System** (Flutter, C# .NET Core Web API) - Mobile frontend integrated with RESTful C# API & Swagger testing.\n" +
      "3️⃣ **Car Rental Website** (Node.js, Express, MongoDB, JS) - E-commerce platform for car rentals.\n" +
      "4️⃣ **Employee Attendance & Leave System** (PHP, MySQL, HTML/CSS) - Relational DB & automated tracking.\n" +
      "5️⃣ **Sleeping Alert System** (Python, Flutter) - HCI usability project for driver alert system.";
    suggestions = ["Tell me about Spring Boot project", "GitHub repositories", "Contact Zayd"];
  } else if (query.includes("taqa") || query.includes("cairo higher") || query.includes("intern") || query.includes("experience") || query.includes("work")) {
    reply = "Here is Zayd's hands-on professional experience:\n\n" +
      "🏢 **Cairo Higher Institute** (Aug 2025 - Sep 2025)\nIT Dept Intern — Domain emails management, WordPress front-end updates, official social media & video production.\n\n" +
      "⚡ **TAQA Arabia** (Jul 2025 - Aug 2025)\nSoftware Development Intern — Contributed to developing the **In Gaz API mobile app**.\n\n" +
      "💼 **TAQA Arabia** (Aug 2024 - Sep 2024)\nIT Department Intern — Software device management, user account management & IT support.";
    suggestions = ["What are Zayd's main projects?", "View Skills", "Schedule an Interview"];
  } else if (query.includes("education") || query.includes("miu") || query.includes("university") || query.includes("acpc") || query.includes("ieee") || query.includes("study")) {
    reply = "🎓 Zayd is currently pursuing a **Bachelor of Science in Computer Science** at **Misr International University (MIU)** (Sep 2023 - Jun 2027).\n\nHe is also an active member of both **ACPC Club** (Competitive Programming) and **IEEE Club**!";
    suggestions = ["What projects has Zayd built?", "Skills breakdown", "Contact info"];
  } else if (query.includes("linkedin")) {
    reply = "💼 **Connect with Zayd Ali Mohamed on LinkedIn:**\n\n" +
      "🔗 [linkedin.com/in/zayd-ali-17a85a1a0](https://www.linkedin.com/in/zayd-ali-17a85a1a0)\n\n" +
      "Feel free to send a connection request or direct message to connect!";
    suggestions = ["Email Zayd", "Show experience", "Download CV"];
  } else if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("hire") || query.includes("reach")) {
    reply = "📬 You can reach Zayd directly via:\n\n" +
      "📧 **Email:** [zaydaly0501@gmail.com](mailto:zaydaly0501@gmail.com)\n" +
      "📱 **Phone / WhatsApp:** +20 101 774 1741\n" +
      "💼 **LinkedIn:** [linkedin.com/in/zayd-ali-17a85a1a0](https://www.linkedin.com/in/zayd-ali-17a85a1a0)\n" +
      "💻 **GitHub:** [github.com/zaydaly05](https://github.com/zaydaly05)";
    suggestions = ["Download CV", "Ask for availability", "Show top projects"];
  } else if (query.includes("available") || query.includes("opportunity") || query.includes("role") || query.includes("status")) {
    reply = "🟢 **Zayd is currently AVAILABLE** for Software Engineering internships, full-stack development roles, and collaborative technical projects!";
    suggestions = ["Send a message", "Download CV", "View experience"];
  } else if (query.includes("cv") || query.includes("resume") || query.includes("pdf")) {
    reply = "📄 You can view Zayd's full CV right here in the web app or click **Download CV** in the navigation bar!";
    suggestions = ["Open CV Viewer", "Contact Zayd", "Show experience"];
  } else {
    reply = "That's a great question! Zayd is a Junior Computer Science student skilled in **Java (Spring Boot), React, Node.js, C# .NET, Flutter, PHP, and MongoDB**. Feel free to ask about his projects, internships, or contact details!";
    suggestions = ["What is Zayd's tech stack?", "Show experience", "Show top projects", "How to contact Zayd?"];
  }

  res.json({ reply, suggestions });
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "All fields are required." });
  }

  return res.json({
    ok: true,
    message: `Thanks ${name}, your message has been received! Zayd will get back to you shortly at ${email}.`
  });
});

// Community Reviews & Star Rating Store (Persistent JSON File)
const REVIEWS_FILE = path.join(__dirname, "logs", "user-reviews.json");
const STAR_FILE = path.join(__dirname, "logs", "star-count.json");

const getStoredReviews = () => {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      return JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf8"));
    }
  } catch (e) {}
  return [
    {
      id: 1,
      name: "Ahmed Hassan",
      role: "Senior Software Engineer @ TechCorp",
      rating: 5,
      comment: "Zayd's full-stack work with Spring Boot and React is outstanding. Very clean code structure and impressive problem-solving abilities!",
      date: "2026-09-25"
    },
    {
      id: 2,
      name: "Mariam El-Din",
      role: "UI/UX Designer",
      rating: 5,
      comment: "The Flutter mobile application UI and responsive design are top notch. Great attention to detail!",
      date: "2026-09-20"
    }
  ];
};

const getStarCount = () => {
  try {
    if (fs.existsSync(STAR_FILE)) {
      const data = JSON.parse(fs.readFileSync(STAR_FILE, "utf8"));
      return data.stars || 48;
    }
  } catch (e) {}
  return 48;
};

app.get("/api/reviews", (req, res) => {
  res.json({ ok: true, reviews: getStoredReviews() });
});

app.post("/api/reviews", (req, res) => {
  const { name, role, rating, comment } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ ok: false, error: "Name and comment are required." });
  }

  const reviews = getStoredReviews();
  const newReview = {
    id: Date.now(),
    name: name.trim(),
    role: (role || "Visitor / Developer").trim(),
    rating: parseInt(rating) || 5,
    comment: comment.trim(),
    date: new Date().toISOString().split("T")[0]
  };

  reviews.unshift(newReview);
  try {
    const logsDir = path.join(__dirname, "logs");
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");
  } catch (e) {}

  res.json({ ok: true, message: "Review posted successfully!", review: newReview });
});

app.get("/api/star", (req, res) => {
  res.json({ ok: true, stars: getStarCount() });
});

app.post("/api/star", (req, res) => {
  let stars = getStarCount() + 1;
  try {
    const logsDir = path.join(__dirname, "logs");
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    fs.writeFileSync(STAR_FILE, JSON.stringify({ stars }, null, 2), "utf8");
  } catch (e) {}
  res.json({ ok: true, stars, message: "Thank you for starring Zayd's portfolio!" });
});

// Explicit Multi-Page HTML Routes
app.get("/projects", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "projects.html"));
});

app.get("/experience", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "experience.html"));
});

app.get("/skills", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "skills.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

// Catch-all: serve index.html for SPA routing (MUST be last)
app.use((req, res) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/assets/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Portfolio running on http://localhost:${PORT}`);
});
