# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: portfolio.spec.js >> Zayd Portfolio Full End-to-End Suite >> Homepage loads correctly with Hero Slider, Counters, and Navigation
- Location: tests\portfolio.spec.js:5:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#stat-counters-row')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('#stat-counters-row') with timeout 5000ms
  - waiting for locator('#stat-counters-row')

```

```yaml
- navigation:
  - link "Zayd Ali Mohamed home":
    - /url: "#hero"
    - img "ZA"
  - button "CLI":
    - img
    - text: CLI
  - button "Light Mode"
  - link "Hire Me":
    - /url: "#contact"
- banner:
  - text: Available for Roles •
  - img
  - text: "Cairo Time: 01:45:07 AM"
  - paragraph: Software Developer Portfolio
  - heading "Zayd Ali Mohamed" [level=1]
  - heading [level=2]
  - paragraph: Motivated junior computer science student who loves technology and problem solving. I enjoy learning new skills, building practical projects, and taking part in workshops that strengthen my software development knowledge.
  - text: 📍 Maadi, Cairo ✉ zaydaly0501@gmail.com 📱 01017741741
  - img "Zayd Ali Mohamed"
  - link "LinkedIn":
    - /url: https://www.linkedin.com/in/zayd-ali-17a85a1a0
  - link "GitHub":
    - /url: https://github.com/zaydaly05
  - button "Preview CV":
    - img
    - text: Preview CV
  - link "Download CV":
    - /url: /assets/Zayd%20Ali%20Mohamed%20CV.pdf
    - img
    - text: Download CV
  - img "Zayd Coding at Dual Monitor Workspace"
  - text: 💻 Full-Stack Development
  - heading "Engineering Scalable Web Applications" [level=3]
  - paragraph: Building high-performance REST APIs with Spring Boot, React, Node.js & MongoDB.
  - link "Explore Web Projects ↗":
    - /url: "#projects"
  - img "Zayd Mobile App Development"
  - text: 📱 Mobile Architecture
  - heading "Cross-Platform Flutter & Dart Solutions" [level=3]
  - paragraph: Developing native-feeling iOS and Android apps with real-time API integrations.
  - link "View Mobile Apps ↗":
    - /url: "#projects"
  - img "Zayd Software Architecture & Blueprint Design"
  - text: 🏗️ Software Architecture
  - heading "Designing Robust Enterprise Systems" [level=3]
  - paragraph: Architecting relational database schemas, MVC patterns, and secure cloud workflows.
  - link "View Tech Stack ↗":
    - /url: "#technical-skills"
  - button "Previous Slide": ‹
  - button "Next Slide": ›
- main:
  - text: 💻 0+ Public GitHub Repositories 🚀 0+ Production Projects Built ⚡ 0+ Technical Skill Categories 🏢 0 Industry IT Internships 01
  - heading "Experience" [level=3]
  - button "Open IT Department Intern details":
    - heading "IT Department Intern" [level=4]
    - paragraph:
      - strong: Cairo Higher Institute
      - text: · 1st Settlement, Cairo
    - paragraph: August 2025 - September 2025
    - list:
      - listitem: Created and managed institutional user email accounts using the official domain.
      - listitem: Edited and updated the front-end of the institute website using WordPress.
      - listitem: Managed and maintained the institute's official social media accounts.
      - listitem: Clipped, edited, and produced videos and photos for digital content.
  - button "Open Software Development Intern details":
    - heading "Software Development Intern" [level=4]
    - paragraph:
      - strong: TAQA Arabia
      - text: · Maadi, Cairo
    - paragraph: July 2025 - August 2025
    - list:
      - listitem: Contributed to developing the In Gaz API mobile application.
  - button "Open IT Department Intern details":
    - heading "IT Department Intern" [level=4]
    - paragraph:
      - strong: TAQA Arabia
      - text: · Maadi, Cairo
    - paragraph: August 2024 - September 2024
    - list:
      - listitem: Handled devices software management.
      - listitem: Managed user accounts and access support.
  - text: "02"
  - heading "Projects" [level=3]
  - img
  - textbox "Search projects by stack, keyword or name (e.g. Spring, React, C#, Flutter)..."
  - button "All Projects"
  - button "Full-Stack"
  - button "Mobile & API"
  - button "Web Development"
  - button "Systems / HCI"
  - button "Open Gulf Limousine Booking App details":
    - img "Gulf Limousine Booking App"
    - heading "Gulf Limousine Booking App" [level=4]
    - text: ● Synced
    - paragraph: July 2026
    - paragraph:
      - strong: "Stack:"
      - text: Flutter, Dart, Firebase, REST API
    - paragraph: Cross-platform luxury limousine reservation & fleet tracking mobile app featuring real-time driver allocation, vehicle selection, fare estimation, and client booking management.
    - link "View GitHub Repo ↗":
      - /url: https://github.com/zaydaly05/Gulf_Limousine_App
      - img
      - text: View GitHub Repo ↗
  - button "Open Essmat Plastic Factory Management System details":
    - img "Essmat Plastic Factory Management System"
    - heading "Essmat Plastic Factory Management System" [level=4]
    - text: ● Synced
    - paragraph: September 2026
    - paragraph:
      - strong: "Stack:"
      - text: C#, .NET, SQL Server, Entity Framework
    - paragraph: Enterprise inventory and production management solution for plastic manufacturing, optimizing raw material tracking, order processing, and factory billing workflows.
    - link "View GitHub Repo ↗":
      - /url: https://github.com/zaydaly05/EssmatPlastic
      - img
      - text: View GitHub Repo ↗
    - link "📄 PDF Report 📥":
      - /url: /assets/essmat-plastic-report.pdf
  - button "Open Dr. Naglaa Academic Biography Portal details":
    - img "Dr. Naglaa Academic Biography Portal"
    - heading "Dr. Naglaa Academic Biography Portal" [level=4]
    - text: ● Synced
    - paragraph: September 2026
    - paragraph:
      - strong: "Stack:"
      - text: HTML5, CSS3, JavaScript, Responsive UI
    - paragraph: Modern academic portfolio & publication showcase website designed for university faculty, featuring curriculum vitae integration, research paper archives, and student contact channels.
    - link "View GitHub Repo ↗":
      - /url: https://github.com/zaydaly05/drNaglaBio
      - img
      - text: View GitHub Repo ↗
  - button "Open Food Ordering Management System details":
    - img "Food Ordering Management System"
    - heading "Food Ordering Management System" [level=4]
    - text: ● Synced
    - paragraph: May 2026
    - paragraph:
      - strong: "Stack:"
      - text: Spring Boot, Tailwind, React, MongoDB
    - paragraph: Developed a full-stack food ordering system with Spring Boot and a React + Tailwind frontend. Built RESTful APIs for authentication, menu management, cart operations, and order processing with MongoDB. Implemented role-based Admin and Customer flows with CRUD, order tracking, and analytics such as top-selling items and profit insights.
    - link "View GitHub Repo ↗":
      - /url: https://github.com/zaydaly05/food_ordering_system
      - img
      - text: View GitHub Repo ↗
  - button "Open In Gaz API System details":
    - img "In Gaz API System"
    - heading "In Gaz API System" [level=4]
    - text: ● Synced
    - paragraph: July 2025
    - paragraph:
      - strong: "Stack:"
      - text: C#, Flutter, .NET Core Web API
    - paragraph: Built a Flutter frontend integrated with a C# .NET Core Web API backend using MVC, secure role-based access, CRUD operations, and Swagger testing.
    - link "View GitHub Repo ↗":
      - /url: https://github.com/zaydaly05/InGazAPI
      - img
      - text: View GitHub Repo ↗
  - button "Open Employee Attendance & Leave System details":
    - img "Employee Attendance & Leave System"
    - heading "Employee Attendance & Leave System" [level=4]
    - text: ● Synced
    - paragraph: December 2025
    - paragraph:
      - strong: "Stack:"
      - text: HTML, CSS, PHP, MySQL
    - paragraph: Developed a web-based attendance and leave platform with automated tracking and approval, event/announcement features, and secure relational role-based access.
    - link "View GitHub Repo ↗":
      - /url: https://github.com/zaydaly05/Employee_Attendance-Leave_Management_System
      - img
      - text: View GitHub Repo ↗
  - button "Open Car Rental Website details":
    - img "Car Rental Website"
    - heading "Car Rental Website" [level=4]
    - text: ● Synced
    - paragraph: May 2025
    - paragraph:
      - strong: "Stack:"
      - text: HTML, CSS, MongoDB, Node.js, JavaScript
    - paragraph: Developed a comprehensive e-commerce style platform for users to browse and rent cars with authentication, catalog management, and order processing.
    - link "View GitHub Repo ↗":
      - /url: https://github.com/zaydaly05/Car_Rental_Website
      - img
      - text: View GitHub Repo ↗
  - button "Open Restaurant Management System details":
    - img "Restaurant Management System"
    - heading "Restaurant Management System" [level=4]
    - text: ● Synced
    - paragraph: December 2024
    - paragraph:
      - strong: "Stack:"
      - text: Java, JavaFX
    - paragraph: Created a recruitment system with a graphical user interface for managing job postings, applications, and interviews using Java and JavaFX.
    - link "View GitHub Repo ↗":
      - /url: https://github.com/zaydaly05/Restaurant_Management_System
      - img
      - text: View GitHub Repo ↗
  - button "Open Sleeping Alert System details":
    - img "Sleeping Alert System"
    - heading "Sleeping Alert System" [level=4]
    - text: ● Synced
    - paragraph: December 2025
    - paragraph:
      - strong: "Stack:"
      - text: Python, Flutter
    - paragraph: Developed a sleeping alert system for an HCI course, applying usability and interaction design principles with a responsive mobile interface.
    - link "View GitHub Repo ↗":
      - /url: https://github.com/zaydaly05/Sleep_Alert_System
      - img
      - text: View GitHub Repo ↗
  - button "Open Zaydentity Digital Identity Platform details":
    - img "Zaydentity Digital Identity Platform"
    - heading "Zaydentity Digital Identity Platform" [level=4]
    - text: ● Synced
    - paragraph: September 2026
    - paragraph:
      - strong: "Stack:"
      - text: HTML5, CSS3, JavaScript
    - paragraph: Digital personal branding & bio-link platform consolidating developer links, project highlights, and verified professional credentials in a unified interactive card UI.
    - link "View GitHub Repo ↗":
      - /url: https://github.com/zaydaly05/zaydentity
      - img
      - text: View GitHub Repo ↗
  - button "Open WE Telecom Training Suite details":
    - img "WE Telecom Training Suite"
    - heading "WE Telecom Training Suite" [level=4]
    - text: ● Synced
    - paragraph: August 2026
    - paragraph:
      - strong: "Stack:"
      - text: Networking, C++, Telecommunications
    - paragraph: Technical codebase & project artifacts developed during Telecom Egypt (WE) training, focusing on network protocol fundamentals, system administration, and enterprise infrastructure.
    - link "View GitHub Repo ↗":
      - /url: https://github.com/zaydaly05/WE_Intern
      - img
      - text: View GitHub Repo ↗
  - text: "03"
  - heading "Live GitHub Sync" [level=3]
  - img "Zayd GitHub Avatar"
  - heading "@zaydaly05" [level=4]
  - paragraph: Junior Computer Science Student | Software Developer
  - text: 12 Public Repos 10 Followers
  - link "Visit GitHub Profile ↗":
    - /url: https://github.com/zaydaly05
  - heading "Recent Public Repositories" [level=5]
  - text: Synced Food-Ordering-System
  - paragraph: Full-stack food ordering platform built with Spring Boot, React, and MongoDB.
  - text: Java ⭐ 5
  - link "View ↗":
    - /url: https://github.com/zaydaly05
  - text: In-Gaz-API
  - paragraph: Mobile & API backend system with Flutter and C# .NET Core.
  - text: C# ⭐ 4
  - link "View ↗":
    - /url: https://github.com/zaydaly05
  - text: Car-Rental-Platform
  - paragraph: Car rental e-commerce site with Node.js, Express, and MongoDB.
  - text: JavaScript ⭐ 3
  - link "View ↗":
    - /url: https://github.com/zaydaly05
  - text: "04"
  - heading "Education" [level=3]
  - article:
    - heading "Misr International University" [level=4]
    - paragraph: Bachelor of Science in Computer Science
    - paragraph: Sep 2023 - Jun 2027
  - text: "05"
  - heading "Activities" [level=3]
  - article:
    - heading "ACPC Club" [level=4]
    - paragraph: Member
    - paragraph: 2023 - Present
  - article:
    - heading "IEEE Club" [level=4]
    - paragraph: Member
    - paragraph: 2023 - Present
  - text: "06"
  - heading "Technical Skills" [level=3]
  - button "All Skills"
  - button "Languages"
  - button "Frameworks"
  - button "Databases"
  - button "Tools"
  - article:
    - heading "Languages" [level=4]
    - text: PHP C Python Java HTML CSS JavaScript SQL C++ C# Flutter Dart Tailwind
  - article:
    - heading "Databases" [level=4]
    - text: SQL MongoDB Firebase
  - article:
    - heading "Frameworks" [level=4]
    - text: Node.js Express.js Spring Boot React
  - article:
    - heading "Developer Tools" [level=4]
    - text: VS Code Apache NetBeans XAMPP Git GitHub Android Studio
  - article:
    - heading "Microsoft Office 365" [level=4]
    - text: Word Excel PowerPoint Access
  - article:
    - heading "Design Tools" [level=4]
    - text: Adobe Photoshop Adobe InDesign Adobe Premiere Filmora
  - article:
    - heading "Data Analysis" [level=4]
    - text: Orange Data Mining
  - article:
    - heading "Other Skills" [level=4]
    - text: Data Structures OOP
  - text: "07"
  - heading "Soft Skills" [level=3]
  - text: Strong teamwork abilities Problem solving Time management and organizational skills 08
  - heading "Languages" [level=3]
  - text: "Arabic: Native English: Fluent French: Beginner 09"
  - heading "Get In Touch" [level=3]
  - text: 📧 Email Address
  - strong: zaydaly0501@gmail.com
  - button "Copy"
  - text: 📱 Phone / WhatsApp
  - strong: +20 101 774 1741
  - button "Copy"
  - text: 📍 Location
  - strong: Maadi, Cairo, Egypt
  - heading "Schedule a Direct Meeting" [level=5]
  - paragraph: Looking for a candidate or want to discuss an opportunity? Let's connect directly.
  - link "Schedule an Interview ✉️":
    - /url: mailto:zaydaly0501@gmail.com?subject=Interview%20/%20Opportunity%20Inquiry%20-%20Zayd%20Ali
  - heading "Send Zayd a Direct Message" [level=4]
  - textbox "Your Name"
  - textbox "Your Email"
  - textbox "Your Message..."
  - button "Send Message":
    - text: Send Message
    - img
  - paragraph
- contentinfo:
  - paragraph:
    - text: Crafted with passion by
    - strong: Zayd Ali Mohamed
    - text: .
  - button "Terminal CLI"
  - text: •
  - button "Ask AI Copilot"
  - text: •
  - link "GitHub Profile":
    - /url: https://github.com/zaydaly05
- text: zayd@portfolio-cli:~
- button "✕"
- paragraph: Welcome to Zayd Ali Mohamed's Interactive Terminal CLI v2.0!
- paragraph: Type help to see available commands (e.g., skills, projects, exp, contact, cv, clear).
- text: zayd@portfolio:~$
- textbox "type a command..."
- button "Toggle Ask Zayd AI Copilot":
  - img
  - text: Ask Zayd AI
- text: 🤖
- heading "Zayd Copilot AI" [level=5]
- paragraph: Instant answer assistant
- button "Close AI Chat": ✕
- text: 👋 Hi! I'm Zayd's AI assistant. Ask me anything about Zayd's technical background, projects, Spring Boot, React, C#, Flutter skills, or experience at TAQA Arabia!
- button "What is Zayd's tech stack?"
- button "Tell me about TAQA Arabia"
- button "Show top projects"
- button "How to contact Zayd?"
- textbox "Ask Zayd AI anything..."
- button "Send message":
  - img
- button "Close": ×
- text: ⭐
- heading "Enjoying Zayd's Portfolio?" [level=6]
- paragraph: Star the repo & leave a review on the Experience page!
- link "Leave Review & Star ↗":
  - /url: /experience#reviews-section
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | test.describe('Zayd Portfolio Full End-to-End Suite', () => {
  4   | 
  5   |   test('Homepage loads correctly with Hero Slider, Counters, and Navigation', async ({ page }) => {
  6   |     await page.goto('/');
  7   |     
  8   |     // Check title and brand
  9   |     await expect(page).toHaveTitle(/Zayd Ali Mohamed/i);
  10  |     await expect(page.locator('.logo img')).toBeVisible();
  11  | 
  12  |     // Verify navigation links
  13  |     await expect(page.locator('.nav-links')).toContainText('Home');
  14  |     await expect(page.locator('.nav-links')).toContainText('Projects Hub');
  15  |     await expect(page.locator('.nav-links')).toContainText('Experience & Reviews');
  16  | 
  17  |     // Verify Hero Slider is active
  18  |     await expect(page.locator('.slider-slide.active')).toBeVisible();
  19  | 
  20  |     // Verify stat counters exist
  21  |     const statsContainer = page.locator('#stat-counters-row');
> 22  |     await expect(statsContainer).toBeVisible();
      |                                  ^ Error: expect(locator).toBeVisible() failed
  23  | 
  24  |     // Verify Skills section
  25  |     const skillsSection = page.locator('#technical-skills');
  26  |     await expect(skillsSection).toBeVisible();
  27  |   });
  28  | 
  29  |   test('Projects Hub renders cards, filter pills, search bar, and GitHub API badge', async ({ page }) => {
  30  |     await page.goto('/projects');
  31  | 
  32  |     // Verify search bar and filter pills
  33  |     const searchInput = page.locator('#project-search-input');
  34  |     await expect(searchInput).toBeVisible();
  35  |     await expect(page.locator('#project-filter-pills')).toBeVisible();
  36  | 
  37  |     // Verify project list cards load
  38  |     const projectCards = page.locator('.js-project-card');
  39  |     await expect(projectCards.first()).toBeVisible();
  40  |     const count = await projectCards.count();
  41  |     expect(count).toBeGreaterThanOrEqual(5);
  42  | 
  43  |     // Verify search filtering works
  44  |     await searchInput.fill('React');
  45  |     await page.waitForTimeout(300);
  46  |     const filteredCount = await page.locator('.js-project-card').count();
  47  |     expect(filteredCount).toBeGreaterThan(0);
  48  | 
  49  |     // Reset search
  50  |     await searchInput.fill('');
  51  |   });
  52  | 
  53  |   test('Experience page loads timeline, CV modal, and community reviews API', async ({ page }) => {
  54  |     await page.goto('/experience');
  55  | 
  56  |     // Verify experience cards load
  57  |     const expCards = page.locator('.js-exp-card');
  58  |     await expect(expCards.first()).toBeVisible();
  59  | 
  60  |     // Verify CV Modal opening
  61  |     const cvBtn = page.locator('#preview-cv-exp-btn');
  62  |     await expect(cvBtn).toBeVisible();
  63  |     await cvBtn.click();
  64  | 
  65  |     const cvModal = page.locator('#cv-viewer-modal');
  66  |     await expect(cvModal).not.toHaveClass(/hidden/);
  67  |     
  68  |     // Close CV Modal
  69  |     await page.locator('#cv-modal-close').click();
  70  |     await expect(cvModal).toHaveClass(/hidden/);
  71  | 
  72  |     // Verify Star Repo button
  73  |     const starBtn = page.locator('#btn-star-repo');
  74  |     await expect(starBtn).toBeVisible();
  75  |   });
  76  | 
  77  |   test('Interactive Terminal CLI opens and responds to help command', async ({ page }) => {
  78  |     await page.goto('/');
  79  | 
  80  |     const cliNavBtn = page.locator('#open-terminal-nav-btn');
  81  |     await cliNavBtn.click();
  82  | 
  83  |     const terminalDrawer = page.locator('#terminal-drawer');
  84  |     await expect(terminalDrawer).not.toHaveClass(/hidden/);
  85  | 
  86  |     const termInput = page.locator('#terminal-input');
  87  |     await termInput.fill('help');
  88  |     await termInput.press('Enter');
  89  | 
  90  |     const output = page.locator('#terminal-output');
  91  |     await expect(output).toContainText('Available CLI Commands');
  92  |   });
  93  | 
  94  |   test('Ask Zayd AI Copilot Widget opens and sends prompt', async ({ page }) => {
  95  |     await page.goto('/');
  96  | 
  97  |     const aiToggleBtn = page.locator('#ai-chat-toggle-btn');
  98  |     await aiToggleBtn.click();
  99  | 
  100 |     const aiDrawer = page.locator('#ai-chat-drawer');
  101 |     await expect(aiDrawer).not.toHaveClass(/hidden/);
  102 | 
  103 |     const aiInput = page.locator('#ai-chat-input');
  104 |     await aiInput.fill('What is Zayd tech stack?');
  105 |     await page.locator('#ai-chat-form').dispatchEvent('submit');
  106 | 
  107 |     await page.waitForTimeout(1000);
  108 |     const body = page.locator('#ai-chat-body');
  109 |     await expect(body).toContainText('tech stack');
  110 |   });
  111 | 
  112 | });
  113 | 
```