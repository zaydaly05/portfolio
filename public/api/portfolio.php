<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$data = [
    "profile" => [
        "name" => "Zayd Ali Mohamed",
        "title" => "Junior Computer Science Student | Software Developer",
        "location" => "Maadi, Cairo",
        "phone" => "01017741741",
        "email" => "zaydaly0501@gmail.com",
        "linkedin" => "https://www.linkedin.com/in/zayd-ali-17a85a1a0",
        "github" => "https://github.com/zaydaly05",
        "summary" => "Motivated senior computer science student who loves technology and problem solving. I enjoy learning new skills, building practical projects, and taking part in workshops that strengthen my software development knowledge."
    ],
    "education" => [
        [
            "institution" => "Misr International University",
            "degree" => "Bachelor of Science in Computer Science",
            "period" => "Sep 2023 - Jun 2027"
        ]
    ],
    "activities" => [
        ["name" => "ACPC Club", "role" => "Member", "period" => "2023 - Present"],
        ["name" => "IEEE Club", "role" => "Member", "period" => "2023 - Present"]
    ],
    "experience" => [
        [
            "company" => "Cairo Higher Institute",
            "role" => "IT Department Intern",
            "period" => "August 2025 - September 2025",
            "location" => "1st Settlement, Cairo",
            "points" => [
                "Created and managed institutional user email accounts using the official domain.",
                "Edited and updated the front-end of the institute website using WordPress.",
                "Managed and maintained the institute's official social media accounts.",
                "Clipped, edited, and produced videos and photos for digital content."
            ]
        ],
        [
            "company" => "TAQA Arabia",
            "role" => "Software Development Intern",
            "period" => "July 2025 - August 2025",
            "location" => "Maadi, Cairo",
            "points" => ["Contributed to developing the In Gaz API mobile application."]
        ],
        [
            "company" => "TAQA Arabia",
            "role" => "IT Department Intern",
            "period" => "August 2024 - September 2024",
            "location" => "Maadi, Cairo",
            "points" => ["Handled devices software management.", "Managed user accounts and access support."]
        ]
    ],
    "projects" => [
        [
            "name" => "Gulf Limousine Booking App",
            "period" => "July 2026",
            "stack" => "Flutter, Dart, Firebase, REST API",
            "image" => "/assets/gulf-limousine.jpg",
            "github" => "https://github.com/zaydaly05/Gulf_Limousine_App",
            "description" => "Cross-platform luxury limousine reservation & fleet tracking mobile app featuring real-time driver allocation, vehicle selection, fare estimation, and client booking management."
        ],
        [
            "name" => "Essmat Plastic Factory Management System",
            "period" => "September 2026",
            "stack" => "C#, .NET, SQL Server, Entity Framework",
            "image" => "/assets/employee-e1.png",
            "pdfReport" => "/assets/essmat-plastic-report.pdf",
            "github" => "https://github.com/zaydaly05/EssmatPlastic",
            "description" => "Enterprise inventory and production management solution for plastic manufacturing, optimizing raw material tracking, order processing, and factory billing workflows."
        ],
        [
            "name" => "Dr. Naglaa Academic Biography Portal",
            "period" => "September 2026",
            "stack" => "HTML5, CSS3, JavaScript, Responsive UI",
            "image" => "/assets/dr-nagla-bio.jpeg",
            "github" => "https://github.com/zaydaly05/drNaglaBio",
            "description" => "Modern academic portfolio & publication showcase website designed for university faculty, featuring curriculum vitae integration, research paper archives, and student contact channels."
        ],
        [
            "name" => "Food Ordering Management System",
            "period" => "May 2026",
            "stack" => "Spring Boot, Tailwind, React, MongoDB",
            "image" => "/assets/f1.png",
            "github" => "https://github.com/zaydaly05/food_ordering_system",
            "description" => "Developed a full-stack food ordering system with Spring Boot and a React + Tailwind frontend. Built RESTful APIs for authentication, menu management, cart operations, and order processing with MongoDB."
        ],
        [
            "name" => "In Gaz API System",
            "period" => "July 2025",
            "stack" => "C#, Flutter, .NET Core Web API",
            "image" => "/assets/ingaz-1.jpeg",
            "github" => "https://github.com/zaydaly05/InGazAPI",
            "description" => "Built a Flutter frontend integrated with a C# .NET Core Web API backend using MVC, secure role-based access, CRUD operations, and Swagger testing."
        ],
        [
            "name" => "Employee Attendance & Leave System",
            "period" => "December 2025",
            "stack" => "HTML, CSS, PHP, MySQL",
            "image" => "/assets/employee-e1.png",
            "github" => "https://github.com/zaydaly05/Employee_Attendance-Leave_Management_System",
            "description" => "Developed a web-based attendance and leave platform with automated tracking and approval, event/announcement features, and secure relational role-based access."
        ],
        [
            "name" => "Car Rental Website",
            "period" => "May 2025",
            "stack" => "HTML, CSS, MongoDB, Node.js, JavaScript",
            "image" => "/assets/gulf-limousine.jpg",
            "github" => "https://github.com/zaydaly05/Car_Rental_Website",
            "description" => "Developed a comprehensive e-commerce style platform for users to browse and rent cars with authentication, catalog management, and order processing."
        ],
        [
            "name" => "Restaurant Management System",
            "period" => "December 2024",
            "stack" => "Java, JavaFX",
            "image" => "/assets/restaurant-r1.png",
            "github" => "https://github.com/zaydaly05/Restaurant_Management_System",
            "description" => "Created a recruitment system with a graphical user interface for managing job postings, applications, and interviews using Java and JavaFX."
        ],
        [
            "name" => "Sleeping Alert System",
            "period" => "December 2025",
            "stack" => "Python, Flutter",
            "image" => "/assets/sleeping-alert-py2.jpeg",
            "github" => "https://github.com/zaydaly05/Sleep_Alert_System",
            "description" => "Developed a sleeping alert system for an HCI course, applying usability and interaction design principles with a responsive mobile interface."
        ],
        [
            "name" => "Zaydentity Digital Identity Platform",
            "period" => "September 2026",
            "stack" => "HTML5, CSS3, JavaScript",
            "image" => "/assets/main-photo.jpeg",
            "github" => "https://github.com/zaydaly05/zaydentity",
            "description" => "Digital personal branding & bio-link platform consolidating developer links, project highlights, and verified professional credentials."
        ],
        [
            "name" => "WE Telecom Training Suite",
            "period" => "August 2026",
            "stack" => "Networking, C++, Telecommunications",
            "image" => "/assets/chi-experience.jpeg",
            "github" => "https://github.com/zaydaly05/WE_Intern",
            "description" => "Technical codebase & project artifacts developed during Telecom Egypt (WE) training."
        ]
    ],
    "featuredStack" => [
        ["name" => "Java & Spring Boot", "category" => "Backend", "level" => 90, "color" => "#6db33f", "icon" => "☕", "projectsCount" => 3, "highlights" => "Enterprise REST APIs, Spring Security, Microservices, JavaFX"],
        ["name" => "React.js & Modern Web", "category" => "Frontend", "level" => 88, "color" => "#61dafb", "icon" => "⚛️", "projectsCount" => 4, "highlights" => "Dynamic UIs, SPA routing, Tailwind, State Management"],
        ["name" => "Flutter & Dart", "category" => "Mobile", "level" => 85, "color" => "#02569b", "icon" => "📱", "projectsCount" => 3, "highlights" => "Cross-platform iOS/Android, Firebase, State Management, REST integration"],
        ["name" => "C# & .NET Core", "category" => "Enterprise & API", "level" => 85, "color" => "#9b4f96", "icon" => "🔷", "projectsCount" => 3, "highlights" => "ASP.NET Core Web API, Entity Framework, C# Desktop Apps"],
        ["name" => "SQL & NoSQL Databases", "category" => "Data Architecture", "level" => 88, "color" => "#47a248", "icon" => "🗄️", "projectsCount" => 5, "highlights" => "PostgreSQL, MySQL, MongoDB, Firebase Firestore, Schema Design"],
        ["name" => "Node.js & Express", "category" => "Backend", "level" => 82, "color" => "#5fa04e", "icon" => "🟢", "projectsCount" => 2, "highlights" => "Node RESTful backends, JWT Authentication, Async I/O"],
        ["name" => "Python", "category" => "Scripting & AI", "level" => 80, "color" => "#3776ab", "icon" => "🐍", "projectsCount" => 2, "highlights" => "Data structures, Automation scripts, Computer Vision / OpenCV"],
        ["name" => "Git & Version Control", "category" => "DevOps & Tools", "level" => 92, "color" => "#f05032", "icon" => "🔀", "projectsCount" => 10, "highlights" => "Branching workflows, GitHub Sync, Collaborative Repos"]
    ],
    "technicalSkills" => [
        ["category" => "Languages", "items" => ["Java", "Python", "C#", "C++", "C", "PHP", "Dart", "JavaScript", "SQL", "HTML5", "CSS3"]],
        ["category" => "Frameworks", "items" => ["Spring Boot", "React", "Flutter", "Express.js", "Node.js", ".NET Core Web API", "JavaFX", "Tailwind CSS"]],
        ["category" => "Databases", "items" => ["PostgreSQL", "MongoDB", "Firebase", "MySQL", "SQL Server"]],
        ["category" => "Developer Tools", "items" => ["VS Code", "Git", "GitHub", "Android Studio", "Apache NetBeans", "XAMPP", "Docker", "Postman", "Swagger"]],
        ["category" => "Microsoft Office 365", "items" => ["Word", "Excel", "PowerPoint", "Access"]],
        ["category" => "Design Tools", "items" => ["Adobe Photoshop", "Adobe InDesign", "Adobe Premiere", "Filmora"]],
        ["category" => "Data Analysis", "items" => ["Orange Data Mining"]],
        ["category" => "Other Skills", "items" => ["Data Structures & Algorithms", "Object-Oriented Programming (OOP)", "RESTful API Architecture", "Database Schema Design"]]
    ],
    "softSkills" => [
        ["title" => "Problem Solving & Analytical Thinking", "icon" => "🧩", "desc" => "Deconstructing complex enterprise requirements into modular, scalable object-oriented software architectures."],
        ["title" => "Teamwork & Cross-functional Collaboration", "icon" => "🤝", "desc" => "Proven track record during TAQA Arabia & WE internships working alongside senior developers, IT teams, and stakeholders."],
        ["title" => "Time Management & Agile Execution", "icon" => "⏱️", "desc" => "Balancing rigorous university software engineering coursework with commercial software client deliverables and internships."],
        ["title" => "Adaptability & Continuous Upskilling", "icon" => "🚀", "desc" => "Rapidly mastering emerging frameworks (Spring Boot, Flutter, React) and integrating new tools into production."]
    ],
    "languages" => [
        ["name" => "Arabic", "level" => "Native Speaker", "percent" => 100, "flag" => "🇪🇬", "desc" => "Mother tongue — fluent in technical, written & verbal communication"],
        ["name" => "English", "level" => "Fluent / Professional", "percent" => 90, "flag" => "🇬🇧", "desc" => "Full professional proficiency in engineering documentation & teamwork"],
        ["name" => "French", "level" => "Elementary", "percent" => 35, "flag" => "🇫🇷", "desc" => "Basic conversational skills & foundational vocabulary"]
    ],
    "certificates" => [
        [
            "title" => "TAQA Arabia Software Internship Certificate",
            "issuer" => "TAQA Arabia — Software Engineering Dept",
            "date" => "August 2025",
            "category" => "Industry Experience",
            "image" => "/assets/Online%20Certificates/Exp%20letter%20taqa%202025.png",
            "pdf" => "/assets/Taqa25Crt.jpeg",
            "desc" => "Official engineering internship certificate recognizing contribution to the In Gaz API mobile platform."
        ],
        [
            "title" => "Cisco JavaScript Essentials 1 & 2",
            "issuer" => "Cisco Networking Academy & OpenEDG JS Institute",
            "date" => "July 2025",
            "category" => "Full-Stack Development",
            "image" => "/assets/Online%20Certificates/js1.png",
            "pdf" => "/assets/Online%20Certificates/JavaScriptEssentials2Update20250713-27-31fbam.pdf",
            "desc" => "Advanced JavaScript ES6+, asynchronous programming, object-oriented concepts, and DOM manipulation."
        ],
        [
            "title" => "Cisco C Essentials 1 Certification",
            "issuer" => "Cisco Networking Academy & OpenEDG C Institute",
            "date" => "July 2025",
            "category" => "Systems & Core Programming",
            "image" => "/assets/Online%20Certificates/c-essentials-1.png",
            "pdf" => "/assets/Online%20Certificates/CEssentials1Update20250709-29-hnum8q.pdf",
            "desc" => "Low-level system programming, memory management, pointers, and algorithmic structures in C."
        ],
        [
            "title" => "Introduction to Cybersecurity Certification",
            "issuer" => "Cisco Networking Academy",
            "date" => "July 2025",
            "category" => "Cybersecurity & Networks",
            "image" => "/assets/Online%20Certificates/Introduction%20To%20Cybersecurity%20C.png",
            "pdf" => "/assets/Online%20Certificates/I2CSUpdate20250709-27-93jy0g.pdf",
            "desc" => "Network security protocols, vulnerability analysis, encryption fundamentals, and threat mitigation."
        ],
        [
            "title" => "CSS & Modern Web Development",
            "issuer" => "Cisco OpenEDG Academy",
            "date" => "July 2025",
            "category" => "Frontend Architecture",
            "image" => "/assets/Online%20Certificates/css-essentials.png",
            "pdf" => "/assets/Online%20Certificates/CSS.png",
            "desc" => "Responsive layout design, Flexbox, CSS Grid, animation frameworks, and modern CSS3 aesthetics."
        ],
        [
            "title" => "Cairo Higher Institute Experience Letter",
            "issuer" => "Cairo Higher Institute — IT Dept",
            "date" => "September 2025",
            "category" => "Industry Experience",
            "image" => "/assets/Online%20Certificates/Experience%20letter%20CHI.jpg",
            "pdf" => "/assets/chi-experience.jpeg",
            "desc" => "Institutional user account management, website front-end maintenance, and digital content production."
        ]
    ]
];

echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
