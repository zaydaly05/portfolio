/**
 * Built-in portfolio content.
 *
 * This is only the *seed and fallback*: on first run it is copied into the database, and from
 * then on the database is the source of truth (edit it from the admin app). Projects can also
 * be imported from GitHub. Nothing secret belongs in this file.
 */
module.exports = {
  "profile": {
    "name": "Zayd Ali Mohamed",
    "title": "Junior Computer Science Student | Software Developer",
    "location": "Maadi, Cairo",
    "phone": "01017741741",
    "email": "zaydaly0501@gmail.com",
    "linkedin": "https://www.linkedin.com/in/zayd-ali-17a85a1a0",
    "github": "https://github.com/zaydaly05",
    "summary": "Motivated senior computer science student who loves technology and problem solving. I enjoy learning new skills, building practical projects, and taking part in workshops that strengthen my software development knowledge.",
    "photo": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135534/main-photo.jpg",
    "whatsapp": "201017741741",
    "cvUrl": "https://res.cloudinary.com/delnnzcph/image/upload/v1791142658/zayd-portfolio/Zayd_Ali_Mohamed_CV.pdf",
    "availability": "Available for Roles",
    "timezone": "Africa/Cairo",
    "clockLabel": "Cairo Time",
    "logo": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135580/logo.jpg",
    "phoneIntl": "+201017741741",
    "phoneDisplay": "+20 101 774 1741",
    "locationLong": "Maadi, Cairo, Egypt (UTC+3)"
  },
  "education": [
    {
      "institution": "Misr International University",
      "degree": "Bachelor of Science in Computer Science",
      "period": "Sep 2023 - Jun 2027"
    }
  ],
  "activities": [
    {
      "name": "ACPC Club",
      "role": "Member",
      "period": "2023 - Present"
    },
    {
      "name": "IEEE Club",
      "role": "Member",
      "period": "2023 - Present"
    }
  ],
  "experience": [
    {
      "company": "WE (Telecom Egypt)",
      "role": "Android Development Intern",
      "period": "June 26, 2026 - July 26, 2026",
      "location": "Smart Village, Cairo",
      "points": [
        "Engineered native Android applications utilizing Kotlin and declarative Jetpack Compose UI.",
        "Architected mobile applications using MVVM pattern, managing unidirectional data flow via Kotlin Coroutines & StateFlow.",
        "Integrated network operations and local persistence using Retrofit and Room Database for offline-first architecture.",
        "Implemented dependency injection using Hilt to ensure decoupled, scalable enterprise mobile software design.",
        "Managed application lifecycles and mitigated native process death constraints effectively under direct supervision of Khaled Mamdouh (Android Developer Supervisor, WE)."
      ]
    },
    {
      "company": "Cairo Higher Institute",
      "role": "IT Department Intern",
      "period": "August 2025 - September 2025",
      "location": "1st Settlement, Cairo",
      "points": [
        "Created and managed institutional user email accounts using the official domain.",
        "Edited and updated the front-end of the institute website using WordPress.",
        "Managed and maintained the institute's official social media accounts.",
        "Clipped, edited, and produced videos and photos for digital content."
      ],
      "media": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
          "alt": "Cairo Higher Institute — Experience Letter (IT Department, 2025)"
        }
      ],
      "mediaBadge": "📜 Experience Letter"
    },
    {
      "company": "TAQA Arabia",
      "role": "Software Development Intern",
      "period": "July 2025 - August 2025",
      "location": "Maadi, Cairo",
      "points": [
        "Contributed to developing the In Gaz API mobile application."
      ],
      "media": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Exp_Letter_Y25_Taqa.jpg",
          "alt": "TAQA Arabia — Experience Letter (Software Development, 2025)"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137222/Certificate_Year_25_Taqa.jpg",
          "alt": "TAQA Arabia — Internship Certificate (Software Development, 2025)"
        }
      ],
      "mediaBadge": "📜 Letter & Certificate"
    },
    {
      "company": "TAQA Arabia",
      "role": "IT Department Intern",
      "period": "August 2024 - September 2024",
      "location": "Maadi, Cairo",
      "points": [
        "Handled devices software management.",
        "Managed user accounts and access support."
      ],
      "media": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Taqa_Letter_24Y.jpg",
          "alt": "TAQA Arabia — Experience Letter (IT Department, 2024)"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Taqa_Cert_Y24.jpg",
          "alt": "TAQA Arabia — Internship Certificate (IT Department, 2024)"
        }
      ],
      "mediaBadge": "📜 Letter & Certificate"
    }
  ],
  "projects": [
    {
      "name": "Gulf Limousine Booking App",
      "period": "July 2026",
      "stack": "Flutter, Dart, Firebase, REST API",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135561/app_icon.png",
      "github": "https://github.com/zaydaly05/Gulf_Limousine_App",
      "description": "Cross-platform luxury limousine reservation & fleet tracking mobile app featuring real-time driver allocation, vehicle selection, fare estimation, and client booking management.",
      "screenshots": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135579/Screenshot_20261004_173939.png",
          "alt": "Gulf Limousine App - Reservation Dashboard"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/Screenshot_20261004_173958.png",
          "alt": "Gulf Limousine App - Vehicle Selection View"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/Screenshot_20261004_173450.png",
          "alt": "Gulf Limousine App - Driver Allocation Screen"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135564/Screenshot_20261004_173925.png",
          "alt": "Gulf Limousine App - Realtime Trip Fare Estimator"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135564/Screenshot_20261004_173759.png",
          "alt": "Gulf Limousine App - Fleet Category Browser"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135564/Screenshot_20261004_173900.png",
          "alt": "Gulf Limousine App - Pickup Location Selector"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/Screenshot_20261004_173426.png",
          "alt": "Gulf Limousine App - Customer Booking Summary"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/Screenshot_20261004_173534.png",
          "alt": "Gulf Limousine App - Firebase Realtime Sync Status"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/Screenshot_20261004_173343.png",
          "alt": "Gulf Limousine App - Client Profile & History"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/Screenshot_20261004_173403.png",
          "alt": "Gulf Limousine App - Mobile Settings View"
        }
      ],
      "logoStyle": "wide",
      "featured": true,
      "tag": "Mobile App"
    },
    {
      "name": "Essmat Plastic Factory Management System",
      "period": "September 2026",
      "stack": "C#, .NET, SQL Server, Entity Framework",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/esmatPlastic.jpg",
      "pdfReport": "/assets/essmat-plastic-report.pdf",
      "github": "https://github.com/zaydaly05/EssmatPlastic",
      "description": "Enterprise inventory and production management solution for plastic manufacturing, optimizing raw material tracking, order processing, and factory billing workflows.",
      "screenshots": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135549/WhatsApp_Image_2026-10-04_at_4.44.38_PM.jpg",
          "alt": "Essmat Plastic - Main Factory Management Overview"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135549/WhatsApp_Image_2026-10-04_at_4.44.38_PM_5.jpg",
          "alt": "Essmat Plastic - Raw Material Tracking Interface"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135549/WhatsApp_Image_2026-10-04_at_4.44.38_PM_4.jpg",
          "alt": "Essmat Plastic - Production Line Operations View"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135549/WhatsApp_Image_2026-10-04_at_4.44.38_PM_3.jpg",
          "alt": "Essmat Plastic - Inventory Stock & Warehouse Grid"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135549/WhatsApp_Image_2026-10-04_at_4.44.38_PM_2.jpg",
          "alt": "Essmat Plastic - Customer Order Processing Form"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/WhatsApp_Image_2026-10-04_at_4.44.37_PM.jpg",
          "alt": "Essmat Plastic - Factory Billing & Invoicing Module"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/WhatsApp_Image_2026-10-04_at_4.44.37_PM_1.jpg",
          "alt": "Essmat Plastic - SQL Server Database Connection Status"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/WhatsApp_Image_2026-10-04_at_4.44.38_PM_1.jpg",
          "alt": "Essmat Plastic - Enterprise C# .NET Management Console"
        }
      ],
      "logoStyle": "square",
      "featured": true,
      "tag": "Enterprise C#"
    },
    {
      "name": "Dr. Naglaa Academic Biography Portal",
      "period": "September 2026",
      "stack": "HTML5, CSS3, JavaScript, Responsive UI",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135540/Screenshot_2026-10-04_180005.png",
      "github": "https://github.com/zaydaly05/drNaglaBio",
      "description": "Modern academic portfolio & publication showcase website designed for university faculty, featuring curriculum vitae integration, research paper archives, and student contact channels.",
      "screenshots": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/Screenshot_2026-10-04_175352.png",
          "alt": "Dr Naglaa Academic Portal - Main Header & CV Overview"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135548/Screenshot_2026-10-04_175331.png",
          "alt": "Dr Naglaa Academic Portal - Research & Publications Archive"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135547/Screenshot_2026-10-04_175253.png",
          "alt": "Dr Naglaa Academic Portal - Student Channels & Courses"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135547/Screenshot_2026-10-04_175423.png",
          "alt": "Dr Naglaa Academic Portal - Full Curriculum Vitae Section"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135545/Screenshot_2026-10-04_175406.png",
          "alt": "Dr Naglaa Academic Portal - Faculty Contact Portal"
        }
      ],
      "logoStyle": "square"
    },
    {
      "name": "Food Ordering Management System",
      "period": "May 2026",
      "stack": "Spring Boot, Tailwind, React, MongoDB",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135562/foodApplogo.png",
      "github": "https://github.com/zaydaly05/food_ordering_system",
      "description": "Developed a full-stack food ordering system with Spring Boot and a React + Tailwind frontend. Built RESTful APIs for authentication, menu management, cart operations, and order processing with MongoDB. Implemented role-based Admin and Customer flows with CRUD, order tracking, and analytics such as top-selling items and profit insights.",
      "screenshots": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/f9.png",
          "alt": "Food Ordering System - Admin Analytics & Profit Dashboard"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135563/f6.png",
          "alt": "Food Ordering System - Food Hub Menu Item Management"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135562/f7.png",
          "alt": "Food Ordering System - Customer Cart & Order Checkout"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135561/f4.png",
          "alt": "Food Ordering System - Menu Category Manager"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135561/f8.png",
          "alt": "Food Ordering System - Order Tracking & Delivery Status"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135559/f5.png",
          "alt": "Food Ordering System - Customer Review & Rating Portal"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135559/f16.png",
          "alt": "Food Ordering System - User Authentication & Login Screen"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135558/f2.png",
          "alt": "Food Ordering System - Full Restaurant Menu Showcase"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135558/f3.png",
          "alt": "Food Ordering System - Customer Favorites & Dish Details"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135556/f13.png",
          "alt": "Food Ordering System - Spring Boot Backend API Swagger"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135555/f15.png",
          "alt": "Food Ordering System - Role-based Admin User Controls"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135554/f11.png",
          "alt": "Food Ordering System - MongoDB Realtime Database Schema"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135554/f12.png",
          "alt": "Food Ordering System - Restaurant Commission & Billing"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135554/f14.png",
          "alt": "Food Ordering System - Top Selling Items Analytics"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135553/f1.png",
          "alt": "Food Ordering System - Main Application Landing Banner"
        }
      ],
      "logoStyle": "wide",
      "featured": true,
      "tag": "Full-Stack"
    },
    {
      "name": "In Gaz API System",
      "period": "July 2025",
      "stack": "C#, Flutter, .NET Core Web API",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135564/Screenshot_2026-10-04_180451.png",
      "github": "https://github.com/zaydaly05/InGazAPI",
      "description": "Built a Flutter frontend integrated with a C# .NET Core Web API backend using MVC, secure role-based access, CRUD operations, and Swagger testing.",
      "screenshots": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135566/WhatsApp_Image_2026-05-05_at_10.01.56_PM_1.jpg",
          "alt": "In Gaz API System - Flutter Mobile Customer Interface"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/WhatsApp_Image_2026-05-05_at_10.01.56_PM.jpg",
          "alt": "In Gaz API System - .NET Core Web API Integration Screen"
        }
      ],
      "logoStyle": "wide"
    },
    {
      "name": "Employee Attendance & Leave System",
      "period": "December 2025",
      "stack": "HTML, CSS, PHP, MySQL",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135381/EALMS_Logo.png",
      "github": "https://github.com/zaydaly05/Employee_Attendance-Leave_Management_System",
      "description": "Developed a web-based attendance and leave platform with automated tracking and approval, event/announcement features, and secure relational role-based access.",
      "screenshots": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791136236/EA1.png",
          "alt": "Employee Attendance - Admin Dashboard Overview"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791136230/EA2.png",
          "alt": "Employee Attendance - New Assessment & Post Announcement"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791136238/EA3.png",
          "alt": "Employee Attendance - Login & Employee Landing Screen"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791136233/EA4.png",
          "alt": "Employee Attendance - Leave History & Status Table"
        }
      ],
      "logoStyle": "wide"
    },
    {
      "name": "Car Rental Website",
      "period": "May 2025",
      "stack": "HTML, CSS, MongoDB, Node.js, JavaScript",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135540/logo00.png",
      "github": "https://github.com/zaydaly05/Car_Rental_Website",
      "description": "Developed a comprehensive e-commerce style platform for users to browse and rent cars with authentication, catalog management, and order processing.",
      "screenshots": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135542/c1.png",
          "alt": "Car Rental Website - Vehicle Fleet Catalog Overview"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135544/c2.png",
          "alt": "Car Rental Website - Car Specifications & Features View"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135545/c3.png",
          "alt": "Car Rental Website - Customer Booking & Checkout Form"
        }
      ],
      "logoStyle": "wide"
    },
    {
      "name": "Restaurant Management System",
      "period": "December 2024",
      "stack": "Java, JavaFX",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/restaurant_management_system_icon_v3.png",
      "github": "https://github.com/zaydaly05/Restaurant_Management_System",
      "description": "Created a recruitment system with a graphical user interface for managing job postings, applications, and interviews using Java and JavaFX.",
      "screenshots": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135566/r5.png",
          "alt": "Restaurant Management - Billing & Order Summary"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/r4.png",
          "alt": "Restaurant Management - Table Reservation System"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/r3.png",
          "alt": "Restaurant Management - Table Allocation Grid View"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/r2.png",
          "alt": "Restaurant Management - Food Menu Order Interface"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135565/r1.png",
          "alt": "Restaurant Management - JavaFX Login & Role Selection"
        }
      ],
      "logoStyle": "square"
    },
    {
      "name": "Sleeping Alert System",
      "period": "December 2025",
      "stack": "Python, Flutter",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135566/sleeping_alert_eye_icon.png",
      "github": "https://github.com/zaydaly05/Sleep_Alert_System",
      "description": "Developed a sleeping alert system for an HCI course, applying usability and interaction design principles with a responsive mobile interface.",
      "screenshots": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/video/upload/v1791135570/py1.mp4",
          "type": "video",
          "alt": "Sleeping Alert System - Realtime Facial Bounding Box Video Demo"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135567/py2.jpg",
          "alt": "Sleeping Alert System - OpenCV Drowsiness Detection Photo"
        }
      ],
      "logoStyle": "square"
    },
    {
      "name": "Zaydentity Digital Identity Platform",
      "period": "September 2026",
      "stack": "HTML5, CSS3, JavaScript",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791141032/zayd-portfolio/showcase/Zaydentity%20Digital%20Identity%20Platform/Logo%20Icon/Screenshot_2026-10-04_175842.png",
      "github": "https://github.com/zaydaly05/zaydentity",
      "description": "Digital personal branding & bio-link platform consolidating developer links, project highlights, and verified professional credentials in a unified interactive card UI.",
      "screenshots": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135572/Screenshot_2026-10-04_174426.png",
          "alt": "Zaydentity - Developer Digital Bio Card View"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135571/Screenshot_2026-10-04_174413.png",
          "alt": "Zaydentity - Social & Professional Links Showcase"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135571/Screenshot_2026-10-04_174403.png",
          "alt": "Zaydentity - Verified Credentials & Skill Highlights"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135570/Screenshot_2026-10-04_174321.png",
          "alt": "Zaydentity - Project Showcase Grid View"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135570/Screenshot_2026-10-04_174349.png",
          "alt": "Zaydentity - Responsive Mobile Layout Preview"
        }
      ],
      "logoStyle": "wide dark"
    },
    {
      "name": "WE Telecom Training Suite",
      "period": "August 2026",
      "stack": "Networking, C++, Telecommunications",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135568/1200x630wa.png",
      "github": "https://github.com/zaydaly05/WE_Intern",
      "description": "Technical codebase & project artifacts developed during Telecom Egypt (WE) training, focusing on network protocol fundamentals, system administration, and enterprise infrastructure.",
      "screenshots": [
        {
          "src": "https://res.cloudinary.com/delnnzcph/video/upload/v1791135632/emulator_screen_edited.mp4",
          "type": "video",
          "alt": "WE Telecom Training Suite - Android App Demo Video"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135572/IMG-20260821-WA0083.jpg",
          "alt": "WE Telecom Suite - Network Topology & Protocol Testing"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135568/IMG-20260727-WA0038.jpg",
          "alt": "WE Telecom Suite - System Administration & Server Artifacts"
        },
        {
          "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135568/IMG-20260809-WA0015.jpg",
          "alt": "WE Telecom Suite - Smart Village Lab Infrastructure"
        }
      ],
      "logoStyle": "square light"
    }
  ],
  "featuredStack": [
    {
      "name": "Android & Kotlin",
      "category": "Native Mobile",
      "level": 88,
      "color": "#3ddc84",
      "icon": "🤖",
      "projectsCount": 2,
      "highlights": "Jetpack Compose, MVVM Architecture, Coroutines & StateFlow, Retrofit, Room, Hilt"
    },
    {
      "name": "Java & Spring Boot",
      "category": "Backend",
      "level": 90,
      "color": "#6db33f",
      "icon": "☕",
      "projectsCount": 3,
      "highlights": "Enterprise REST APIs, Spring Security, Microservices, JavaFX"
    },
    {
      "name": "React.js & Modern Web",
      "category": "Frontend",
      "level": 88,
      "color": "#61dafb",
      "icon": "⚛️",
      "projectsCount": 4,
      "highlights": "Dynamic UIs, SPA routing, Tailwind, State Management"
    },
    {
      "name": "Flutter & Dart",
      "category": "Mobile",
      "level": 85,
      "color": "#02569b",
      "icon": "📱",
      "projectsCount": 3,
      "highlights": "Cross-platform iOS/Android, Firebase, State Management, REST integration"
    },
    {
      "name": "C# & .NET Core",
      "category": "Enterprise & API",
      "level": 85,
      "color": "#9b4f96",
      "icon": "🔷",
      "projectsCount": 3,
      "highlights": "ASP.NET Core Web API, Entity Framework, C# Desktop Apps"
    },
    {
      "name": "SQL & NoSQL Databases",
      "category": "Data Architecture",
      "level": 88,
      "color": "#47a248",
      "icon": "🗄️",
      "projectsCount": 5,
      "highlights": "PostgreSQL, MySQL, MongoDB, Firebase Firestore, Schema Design"
    },
    {
      "name": "Node.js & Express",
      "category": "Backend",
      "level": 82,
      "color": "#5fa04e",
      "icon": "🟢",
      "projectsCount": 2,
      "highlights": "Node RESTful backends, JWT Authentication, Async I/O"
    },
    {
      "name": "Python",
      "category": "Scripting & AI",
      "level": 80,
      "color": "#3776ab",
      "icon": "🐍",
      "projectsCount": 2,
      "highlights": "Data structures, Automation scripts, Computer Vision / OpenCV"
    },
    {
      "name": "Git & Version Control",
      "category": "DevOps & Tools",
      "level": 92,
      "color": "#f05032",
      "icon": "🔀",
      "projectsCount": 10,
      "highlights": "Branching workflows, GitHub Sync, Collaborative Repos"
    }
  ],
  "technicalSkills": [
    {
      "category": "Languages",
      "items": [
        "Java",
        "Kotlin",
        "Python",
        "C#",
        "C++",
        "C",
        "PHP",
        "Dart",
        "JavaScript",
        "SQL",
        "HTML5",
        "CSS3"
      ]
    },
    {
      "category": "Frameworks",
      "items": [
        "Spring Boot",
        "React",
        "Flutter",
        "Jetpack Compose",
        "Express.js",
        "Node.js",
        ".NET Core Web API",
        "JavaFX",
        "Tailwind CSS"
      ]
    },
    {
      "category": "Databases",
      "items": [
        "PostgreSQL",
        "MongoDB",
        "Firebase",
        "MySQL",
        "SQL Server",
        "Room Database"
      ]
    },
    {
      "category": "Developer Tools",
      "items": [
        "Android Studio",
        "VS Code",
        "Git",
        "GitHub",
        "Apache NetBeans",
        "XAMPP",
        "Docker",
        "Postman",
        "Swagger"
      ]
    },
    {
      "category": "Microsoft Office 365",
      "items": [
        "Word",
        "Excel",
        "PowerPoint",
        "Access"
      ]
    },
    {
      "category": "Design Tools",
      "items": [
        "Adobe Photoshop",
        "Adobe InDesign",
        "Adobe Premiere",
        "Filmora"
      ]
    },
    {
      "category": "Data Analysis",
      "items": [
        "Orange Data Mining"
      ]
    },
    {
      "category": "Other Skills",
      "items": [
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
  "softSkills": [
    {
      "title": "Problem Solving & Analytical Thinking",
      "icon": "🧩",
      "desc": "Deconstructing complex enterprise requirements into modular, scalable object-oriented software architectures."
    },
    {
      "title": "Teamwork & Cross-functional Collaboration",
      "icon": "🤝",
      "desc": "Proven track record during TAQA Arabia & WE internships working alongside senior developers, IT teams, and stakeholders."
    },
    {
      "title": "Time Management & Agile Execution",
      "icon": "⏱️",
      "desc": "Balancing rigorous university software engineering coursework with commercial software client deliverables and internships."
    },
    {
      "title": "Adaptability & Continuous Upskilling",
      "icon": "🚀",
      "desc": "Rapidly mastering emerging frameworks (Spring Boot, Flutter, React) and integrating new tools into production."
    }
  ],
  "languages": [
    {
      "name": "Arabic",
      "level": "Native Speaker",
      "percent": 100,
      "flag": "🇪🇬",
      "desc": "Mother tongue — fluent in technical, written & verbal communication"
    },
    {
      "name": "English",
      "level": "Fluent / Professional",
      "percent": 90,
      "flag": "🇬🇧",
      "desc": "Full professional proficiency in engineering documentation & teamwork"
    },
    {
      "name": "French",
      "level": "Elementary",
      "percent": 35,
      "flag": "🇫🇷",
      "desc": "Basic conversational skills & foundational vocabulary"
    }
  ],
  "certificates": [
    {
      "title": "TAQA Arabia Software Internship Certificate",
      "issuer": "TAQA Arabia — Software Engineering Dept",
      "date": "August 2025",
      "category": "Industry Experience",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137222/Certificate_Year_25_Taqa.jpg",
      "pdf": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137222/Certificate_Year_25_Taqa.jpg",
      "desc": "Official engineering internship certificate recognizing contribution to the In Gaz API mobile platform.",
      "kind": "certificate"
    },
    {
      "title": "TAQA Arabia Experience Letter (Software Development)",
      "issuer": "TAQA Arabia — Software Engineering Dept",
      "date": "August 2025",
      "category": "Experience Letter",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Exp_Letter_Y25_Taqa.jpg",
      "pdf": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Exp_Letter_Y25_Taqa.jpg",
      "desc": "Official experience letter confirming the software development internship and the In Gaz API mobile application work.",
      "kind": "letter"
    },
    {
      "title": "TAQA Arabia IT Internship Certificate",
      "issuer": "TAQA Arabia — IT Department",
      "date": "September 2024",
      "category": "Industry Experience",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Taqa_Cert_Y24.jpg",
      "pdf": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Taqa_Cert_Y24.jpg",
      "desc": "Official internship certificate for the IT Department internship: device software management and user account support.",
      "kind": "certificate"
    },
    {
      "title": "TAQA Arabia Experience Letter (IT Department)",
      "issuer": "TAQA Arabia — IT Department",
      "date": "September 2024",
      "category": "Experience Letter",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Taqa_Letter_24Y.jpg",
      "pdf": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Taqa_Letter_24Y.jpg",
      "desc": "Official experience letter confirming the IT Department internship.",
      "kind": "letter"
    },
    {
      "title": "Cairo Higher Institute Experience Letter",
      "issuer": "Cairo Higher Institute — IT Dept",
      "date": "September 2025",
      "category": "Experience Letter",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
      "pdf": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
      "desc": "Institutional user account management, website front-end maintenance, and digital content production.",
      "kind": "letter"
    },
    {
      "title": "Cisco JavaScript Essentials 1 & 2",
      "issuer": "Cisco Networking Academy & OpenEDG JS Institute",
      "date": "July 2025",
      "category": "Full-Stack Development",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135787/js1_certificate.png",
      "pdf": "/assets/Online%20Certificates/JavaScriptEssentials2Update20250713-27-31fbam.pdf",
      "desc": "Advanced JavaScript ES6+, asynchronous programming, object-oriented concepts, and DOM manipulation.",
      "kind": "certificate"
    },
    {
      "title": "Cisco C Essentials 1 Certification",
      "issuer": "Cisco Networking Academy & OpenEDG C Institute",
      "date": "July 2025",
      "category": "Systems & Core Programming",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135536/c-essentials-1.png",
      "pdf": "/assets/Online%20Certificates/CEssentials1Update20250709-29-hnum8q.pdf",
      "desc": "Low-level system programming, memory management, pointers, and algorithmic structures in C.",
      "kind": "certificate",
      "imageLabel": "Cisco digital badge"
    },
    {
      "title": "Introduction to Cybersecurity Certification",
      "issuer": "Cisco Networking Academy",
      "date": "July 2025",
      "category": "Cybersecurity & Networks",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135537/Introduction_To_Cybersecurity_C.png",
      "pdf": "/assets/Online%20Certificates/I2CSUpdate20250709-27-93jy0g.pdf",
      "desc": "Network security protocols, vulnerability analysis, encryption fundamentals, and threat mitigation.",
      "kind": "certificate"
    },
    {
      "title": "CSS & Modern Web Development",
      "issuer": "Cisco OpenEDG Academy",
      "date": "July 2025",
      "category": "Frontend Architecture",
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135536/css-essentials.png",
      "pdf": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135538/CSS.png",
      "desc": "Responsive layout design, Flexbox, CSS Grid, animation frameworks, and modern CSS3 aesthetics.",
      "kind": "certificate",
      "imageLabel": "Cisco digital badge"
    }
  ],
  "site": {
    "home_eyebrow": "Full-Stack & Mobile Software Developer",
    "featured_intro": "Top highlighted software systems engineered by {name}.",
    "featured_title": "Featured Flagship Projects",
    "gateways_title": "Explore Portfolio Sections",
    "preloader_subtitle": "SOFTWARE ENGINEER & FULL-STACK DEVELOPER",
    "projects_eyebrow": "Production Repositories & Applications",
    "projects_title": "Projects & GitHub Hub",
    "projects_intro": "Explore {projectsCount}+ production web applications, cross-platform mobile apps, enterprise backend systems, and live GitHub repositories.",
    "experience_eyebrow": "Career Timeline & Visitor Feedback",
    "experience_title": "Experience, CV & Community Reviews",
    "experience_intro": "Explore {firstName}'s internship history at TAQA Arabia and CHI, academic background, Overleaf LaTeX resume, and community visitor reviews.",
    "experience_section_title": "Industry Internships & Experience",
    "certificates_title": "Verified Online Certifications & Diplomas",
    "certificates_intro": "Official certifications, diplomas, and experience letters earned by {name} from Cisco Networking Academy, OpenEDG Institutes, and industry employers.",
    "cv_box_title": "Official LaTeX Resume",
    "cv_box_text": "Formatted and updated automatically via GitHub Actions from Overleaf LaTeX source code.",
    "reviews_cta_title": "Enjoying {firstName}'s Portfolio & Projects?",
    "reviews_cta_text": "Leave a star on GitHub & share your feedback or endorsement below!",
    "reviews_list_title": "Community Reviews & Feedback",
    "skills_eyebrow": "Technical Expertise & Competencies",
    "skills_title": "Skills, Tech Stack & Languages",
    "skills_intro": "A comprehensive overview of {firstName}'s core software engineering stack, languages, databases, developer tools, soft skills, and spoken languages.",
    "core_stack_title": "Core Engineering Tech Stack",
    "core_stack_intro": "Key technologies powering {firstName}'s production applications, APIs, and cross-platform projects with visual proficiency & project counts.",
    "all_skills_title": "All Technical Competencies",
    "soft_skills_title": "Soft Skills & Working Style",
    "languages_title": "Spoken & Communication Languages",
    "contact_eyebrow": "Let's Connect & Build Together",
    "contact_title": "Get In Touch & Hire {firstName}",
    "contact_intro": "Open for Software Engineering internships, junior developer positions, collaborative technical projects, and consulting opportunities.",
    "contact_form_title": "Send {firstName} a Direct Message",
    "contact_form_intro": "Fill out the form below to initiate a direct message conversation via email or WhatsApp.",
    "faq_title": "Frequently Asked Questions"
  },
  "heroPills": [
    {
      "label": "Spring Boot",
      "icon": "☕",
      "color": "#6db33f"
    },
    {
      "label": "React.js",
      "icon": "⚛️",
      "color": "#61dafb"
    },
    {
      "label": "Flutter & Dart",
      "icon": "📱",
      "color": "#02569b"
    },
    {
      "label": "C# .NET API",
      "icon": "🔷",
      "color": "#9b4f96"
    },
    {
      "label": "SQL & MongoDB",
      "icon": "🗄️",
      "color": "#47a248"
    }
  ],
  "heroBadges": [
    {
      "icon": "💼",
      "text": "TAQA Arabia Intern"
    },
    {
      "icon": "🎓",
      "text": "MIU CS Student"
    }
  ],
  "heroSlides": [
    {
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135535/hero-slide-1.jpg",
      "imageAlt": "Zayd Coding Full-Stack Architecture",
      "tag": "⚡ FULL-STACK ARCHITECTURE",
      "tagStyle": "tag-backend",
      "stackLine": "Spring Boot · React · MongoDB",
      "title": "Engineering Scalable Web Applications & Enterprise REST APIs",
      "description": "Building robust full-stack platforms with role-based access control, analytics dashboards, JWT authentication, and automated workflows.",
      "ctaLabel": "Explore Web Projects ↗",
      "ctaHref": "/projects",
      "btnStyle": "",
      "chips": [
        "Java",
        "Spring Boot",
        "React",
        "MongoDB"
      ]
    },
    {
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135535/hero-slide-2.jpg",
      "imageAlt": "Zayd Mobile App Development",
      "tag": "📱 MOBILE & CLOUD APIS",
      "tagStyle": "tag-mobile",
      "stackLine": "Flutter · Dart · Firebase · C#",
      "title": "Cross-Platform Mobile Apps & Real-Time Booking Solutions",
      "description": "Crafting responsive mobile experiences for luxury limousine booking, driver tracking, and enterprise API backends with C# .NET Core.",
      "ctaLabel": "View Mobile Apps ↗",
      "ctaHref": "/projects?search=flutter",
      "btnStyle": "slide-btn-mobile",
      "chips": [
        "Flutter",
        "Dart",
        "Firebase",
        "C# API"
      ]
    },
    {
      "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135535/hero-slide-3.jpg",
      "imageAlt": "Zayd Software Architecture & Blueprint Design",
      "tag": "🏢 ENTERPRISE MANAGEMENT SYSTEMS",
      "tagStyle": "tag-systems",
      "stackLine": "C# .NET · SQL Server · Entity Framework",
      "title": "Enterprise Inventory, Factory & Attendance Software",
      "description": "Designing production management solutions, automated employee leave tracking systems, and desktop application UI/UX built for stability.",
      "ctaLabel": "View Technical Stack ↗",
      "ctaHref": "/skills",
      "btnStyle": "slide-btn-systems",
      "chips": [
        "C# .NET",
        "SQL Server",
        "JavaFX",
        "OOP"
      ]
    }
  ],
  "stats": [
    {
      "icon": "💻",
      "label": "Public GitHub Repositories",
      "source": "github_repos",
      "value": 0,
      "suffix": "+"
    },
    {
      "icon": "🚀",
      "label": "Production Projects Built",
      "source": "projects",
      "value": 0,
      "suffix": "+"
    },
    {
      "icon": "⚡",
      "label": "Technical Skill Categories",
      "source": "skill_categories",
      "value": 0,
      "suffix": "+"
    },
    {
      "icon": "📜",
      "label": "Verified Certifications",
      "source": "certificates",
      "value": 0,
      "suffix": "+"
    },
    {
      "icon": "🏢",
      "label": "Industry IT Internships",
      "source": "internships",
      "value": 0,
      "suffix": ""
    }
  ],
  "gateways": [
    {
      "icon": "🚀",
      "tag": "{projectsCount}+ Projects Sync",
      "tagStyle": "eyebrow-brand",
      "title": "Projects Hub & Live GitHub Sync",
      "description": "Explore all {projectsCount}+ production full-stack, mobile, and system projects, live search filters, and real-time GitHub activity sync.",
      "href": "/projects",
      "ctaLabel": "Explore Projects Hub ↗",
      "btnStyle": "btn gateway-btn"
    },
    {
      "icon": "💼",
      "tag": "TAQA Arabia & CHI",
      "tagStyle": "eyebrow-purple",
      "title": "Experience, Resume & Reviews",
      "description": "Review TAQA Arabia & CHI internships, education background, interactive Overleaf LaTeX resume, and visitor reviews.",
      "href": "/experience",
      "ctaLabel": "View Experience & CV ↗",
      "btnStyle": "btn-outline gateway-btn gateway-btn-purple"
    },
    {
      "icon": "⚡",
      "tag": "Core Tech Stack",
      "tagStyle": "eyebrow-green",
      "title": "Skills, Tech Stack & Languages",
      "description": "Browse technical skills, category filters (Java, Spring Boot, React, C#, Flutter, SQL, Docker), soft skills, and languages.",
      "href": "/skills",
      "ctaLabel": "View Skills & Stack ↗",
      "btnStyle": "btn-outline gateway-btn gateway-btn-green",
      "id": "technical-skills"
    },
    {
      "icon": "📬",
      "tag": "Direct Contact",
      "tagStyle": "eyebrow-cyan",
      "title": "Get In Touch & Hire {firstName}",
      "description": "Direct messaging form, 1-click email/WhatsApp/LinkedIn copy chips, interview booking banner, and FAQ answers.",
      "href": "/contact",
      "ctaLabel": "Contact & Hire {firstName} ↗",
      "btnStyle": "btn gateway-btn"
    }
  ],
  "faq": [
    {
      "question": "🟢 Is {firstName} available for hire or an internship?",
      "answer": "Yes! {firstName} is open to software engineering internships, junior full-stack and mobile roles (Spring Boot, React, C#, Flutter, Kotlin), and collaborative projects."
    },
    {
      "question": "⚡ How quickly does {firstName} reply?",
      "answer": "Usually within 2 to 6 hours for emails and direct WhatsApp messages."
    },
    {
      "question": "🌍 Where is {firstName} based, and is remote work possible?",
      "answer": "Based in Maadi, Cairo, Egypt (Cairo time, UTC+3). {firstName} is set up for remote, hybrid or on-site work."
    },
    {
      "question": "🛠️ What does {firstName} specialise in?",
      "answer": "Full-stack web (Spring Boot, React, Node.js), mobile apps (Flutter and native Android with Kotlin), C# and .NET APIs, and SQL and NoSQL databases, across {skillCategoriesCount} skill categories."
    },
    {
      "question": "🚀 What has {firstName} built?",
      "answer": "{projectsCount}+ projects, from mobile booking apps and enterprise management systems to web platforms. Open the Projects Hub to browse them with screenshots and live GitHub links."
    },
    {
      "question": "💼 What professional experience does {firstName} have?",
      "answer": "{internshipsCount} internships, including WE (Telecom Egypt) in Android development, TAQA Arabia in software development and IT, and Cairo Higher Institute in IT. Details and experience letters are on the Experience page."
    },
    {
      "question": "🎓 What are {firstName}'s education and certifications?",
      "answer": "Studying Computer Science at Misr International University (graduating June 2027), with {certificatesCount} verified certifications from Cisco Networking Academy and OpenEDG."
    },
    {
      "question": "📄 Where can recruiters get the latest CV?",
      "answer": "Click View CV in the header. It always opens the most recent PDF, which is rebuilt from this portfolio whenever it changes, and it can be downloaded from the viewer."
    },
    {
      "question": "🗣️ Which languages does {firstName} speak?",
      "answer": "Arabic (native), English (fluent) and basic French."
    }
  ],
  "cvSummary": {
    "summary": "Ambitious Junior Computer Science student with a strong foundation in problem-solving and a passion for technology, consistently advancing technical expertise through hands-on projects and workshops while striving to deliver impactful, scalable software solutions."
  },
  "cvExperience": [
    {
      "company": "Cairo Higher Institute",
      "role": "Full-Time Internship in IT Department",
      "period": "August 2025 – September 2025",
      "location": "1st Settlement, Cairo",
      "bullets": [
        "Managed institutional email accounts and maintained the website using WordPress.",
        "Oversaw social media accounts and created multimedia content to enhance digital presence."
      ]
    },
    {
      "company": "TAQA Arabia",
      "role": "Full-Time Internship in Software Development Department",
      "period": "July 2025 – August 2025",
      "location": "Maadi, Cairo",
      "bullets": [
        "Developed an InGaz API Mobile Application"
      ]
    }
  ],
  "cvProjects": [
    {
      "name": "Restaurant Management System",
      "stack": "Java, JavaFX",
      "date": "Dec 2024",
      "bullets": [
        "GUI system for managing job postings, applications, and interviews using Java and JavaFX."
      ]
    },
    {
      "name": "InGaz API System",
      "stack": "C#, Flutter",
      "date": "Jul 2025",
      "bullets": [
        "Flutter mobile app integrated with .NET Core Web API with secure role-based access, CRUD operations, and Swagger testing."
      ]
    },
    {
      "name": "Employee Attendance System",
      "stack": "HTML, CSS, PHP, MySQL",
      "date": "Dec 2025",
      "bullets": [
        "Web-based system for attendance and leave management with automated tracking and secure database design."
      ]
    },
    {
      "name": "Food Ordering System",
      "stack": "Spring Boot, React, MongoDB",
      "date": "May 2026",
      "bullets": [
        "Full-stack system with authentication, CRUD operations, and analytics for orders and user activity."
      ]
    }
  ],
  "cvSkills": [
    {
      "label": "Languages",
      "items": "PHP, C, Python, Java, HTML, CSS, JavaScript, SQL, C++, C#, Flutter, Dart, Tailwind"
    },
    {
      "label": "Databases",
      "items": "SQL, MongoDB, Firebase"
    },
    {
      "label": "Developer Tools",
      "items": "VS Code, Apache NetBeans, XAMPP, Git, GitHub, Android Studio"
    },
    {
      "label": "Frameworks",
      "items": "NodeJs, ExpressJs, SpringBoot, React"
    },
    {
      "label": "Microsoft Office 365",
      "items": "Word, Excel, Powerpoint, Access"
    },
    {
      "label": "Design Tools",
      "items": "Adobe Photoshop, Adobe InDesign, Adobe Premiere, Filmora"
    },
    {
      "label": "Data Analysis",
      "items": "Orange Data Mining, Power BI"
    },
    {
      "label": "Other Skills",
      "items": "Data Structures, OOP"
    }
  ],
  "cvSoftSkills": [
    {
      "text": "Strong Teamwork Abilities"
    },
    {
      "text": "Problem-Solving"
    },
    {
      "text": "Time Management and Organizational Skills"
    }
  ],
  "cvEducation": [
    {
      "institution": "Misr International University",
      "degree": "Bachelor of Science in Computer Science",
      "period": "September 2023 – June 2027",
      "location": ""
    }
  ],
  "cvLanguages": [
    {
      "text": "Arabic: Native"
    },
    {
      "text": "English: Fluent"
    },
    {
      "text": "French: Beginner"
    }
  ]
};
