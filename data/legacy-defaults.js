/**
 * Earlier built-in versions of sections whose defaults were improved. If the database still holds
 * one of these exactly (the owner never edited it), it is upgraded to the current default.
 * Edited content never matches, so it is never overwritten.
 */
module.exports = {
  "faq": [
    [
      {
        "question": "🟢 Is {firstName} available for immediate hire or internship?",
        "answer": "Yes! {firstName} is actively open for Software Engineering internships, full-stack roles (Spring Boot, React, C#, Flutter), and collaborative projects."
      },
      {
        "question": "⚡ What is {firstName}'s typical response time?",
        "answer": "{firstName} typically responds within 2 to 6 hours for email inquiries and direct WhatsApp messages."
      },
      {
        "question": "🌍 Where is {firstName} located & is remote work supported?",
        "answer": "Based in Maadi, Cairo, Egypt (Cairo Local Time UTC+3). {firstName} is fully equipped for remote, hybrid, or on-site positions."
      },
      {
        "question": "📄 How can recruiters review official credentials?",
        "answer": "Click View CV in the header navigation or open the Experience & CV page to preview the LaTeX PDF resume."
      }
    ]
  ],
  "experience": [
    [
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
        ],
        "media": [
          {
            "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
            "alt": "WE (Telecom Egypt) Official Android Development Internship Experience Letter - Signed by Khaled Mamdouh (Android Developer Supervisor)"
          },
          {
            "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
            "alt": "WE (Telecom Egypt) Android Development Training Lab Photo"
          }
        ],
        "mediaBadge": "📜 Official Experience Letter"
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
            "alt": "Cairo Higher Institute experience photo"
          }
        ],
        "mediaBadge": "📸 Photo Available"
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
            "alt": "TAQA Software Development Internship experience photo"
          },
          {
            "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137222/Certificate_Year_25_Taqa.jpg",
            "alt": "TAQA Software Development Internship official certificate"
          }
        ],
        "mediaBadge": "📸 2 Photos & Certificate"
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
            "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Taqa_Cert_Y24.jpg",
            "alt": "TAQA IT Department internship photo 1"
          },
          {
            "src": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Taqa_Letter_24Y.jpg",
            "alt": "TAQA IT Department internship photo 2"
          }
        ],
        "mediaBadge": "📸 2 Photos"
      }
    ],
    [
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
    ]
  ],
  "certificates": [
    [
      {
        "title": "TAQA Arabia Software Internship Certificate",
        "issuer": "TAQA Arabia — Software Engineering Dept",
        "date": "August 2025",
        "category": "Industry Experience",
        "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Exp_Letter_Y25_Taqa.jpg",
        "pdf": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137222/Certificate_Year_25_Taqa.jpg",
        "desc": "Official engineering internship certificate recognizing contribution to the In Gaz API mobile platform."
      },
      {
        "title": "Cisco JavaScript Essentials 1 & 2",
        "issuer": "Cisco Networking Academy & OpenEDG JS Institute",
        "date": "July 2025",
        "category": "Full-Stack Development",
        "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135787/js1_certificate.png",
        "pdf": "/assets/Online%20Certificates/JavaScriptEssentials2Update20250713-27-31fbam.pdf",
        "desc": "Advanced JavaScript ES6+, asynchronous programming, object-oriented concepts, and DOM manipulation."
      },
      {
        "title": "Cisco C Essentials 1 Certification",
        "issuer": "Cisco Networking Academy & OpenEDG C Institute",
        "date": "July 2025",
        "category": "Systems & Core Programming",
        "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135536/c-essentials-1.png",
        "pdf": "/assets/Online%20Certificates/CEssentials1Update20250709-29-hnum8q.pdf",
        "desc": "Low-level system programming, memory management, pointers, and algorithmic structures in C."
      },
      {
        "title": "Introduction to Cybersecurity Certification",
        "issuer": "Cisco Networking Academy",
        "date": "July 2025",
        "category": "Cybersecurity & Networks",
        "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135537/Introduction_To_Cybersecurity_C.png",
        "pdf": "/assets/Online%20Certificates/I2CSUpdate20250709-27-93jy0g.pdf",
        "desc": "Network security protocols, vulnerability analysis, encryption fundamentals, and threat mitigation."
      },
      {
        "title": "CSS & Modern Web Development",
        "issuer": "Cisco OpenEDG Academy",
        "date": "July 2025",
        "category": "Frontend Architecture",
        "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135536/css-essentials.png",
        "pdf": "https://res.cloudinary.com/delnnzcph/image/upload/v1791135538/CSS.png",
        "desc": "Responsive layout design, Flexbox, CSS Grid, animation frameworks, and modern CSS3 aesthetics."
      },
      {
        "title": "Cairo Higher Institute Experience Letter",
        "issuer": "Cairo Higher Institute — IT Dept",
        "date": "September 2025",
        "category": "Industry Experience",
        "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
        "pdf": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137220/Experience_Letter_CHI.jpg",
        "desc": "Institutional user account management, website front-end maintenance, and digital content production."
      }
    ],
    [
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
    [
      {
        "title": "WE (Telecom Egypt) Experience Letter",
        "issuer": "WE (Telecom Egypt) — Android Development",
        "date": "July 2026",
        "category": "Experience Letter",
        "image": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Experience_Letter_WE.png",
        "pdf": "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Experience_Letter_WE.png",
        "desc": "Official experience letter confirming the Android development internship at Telecom Egypt (WE): Kotlin, Jetpack Compose, MVVM, Retrofit, Room and Hilt.",
        "kind": "letter"
      },
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
    ]
  ]
};
