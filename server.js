const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve assets from the Assets folder FIRST with explicit options
app.use('/assets', express.static(path.join(__dirname, "Assets"), {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
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
      name: "Food Ordering Management System",
      period: "May 2026",
      stack: "Spring Boot, Tailwind, React, MongoDB",
      description:
        "Developed a full-stack food ordering system with Spring Boot and a React + Tailwind frontend. Built RESTful APIs for authentication, menu management, cart operations, and order processing with MongoDB. Implemented role-based Admin and Customer flows with CRUD, order tracking, and analytics such as top-selling items and profit insights."
    },
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
        "Developed a web-based attendance and leave platform with automated tracking and approval, event/announcement features, and secure relational role-based access."
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

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "All fields are required." });
  }

  return res.json({
    ok: true,
    message: `Thanks ${name}, your message has been received.`
  });
});

// Catch-all: serve index.html for SPA routing (MUST be last)
app.use((req, res) => {
  // Don't serve HTML for API or assets routes - Express static middleware already handled them
  if (req.path.startsWith('/api/') || req.path.startsWith('/assets/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Portfolio running on http://localhost:${PORT}`);
});
