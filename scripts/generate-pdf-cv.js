const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const generateCV = async () => {
  console.log("Generating Jake's Resume (JV's Resume) format PDF from portfolio data...");

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Zayd Ali Mohamed - Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Latin+Modern+Roman:wght@400;700&family=Inter:wght@400;500;600;700;800&display=swap');
    
    @page {
      size: A4;
      margin: 12mm 12mm 12mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #111827;
      background: #ffffff;
      line-height: 1.35;
      font-size: 9pt;
      -webkit-print-color-adjust: exact;
    }

    /* HEADER - JAKE'S RESUME CENTERED STYLE */
    .header {
      text-align: center;
      margin-bottom: 12px;
    }

    .name {
      font-size: 22pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: #000000;
      margin-bottom: 2px;
    }

    .subtitle {
      font-size: 9.5pt;
      font-weight: 500;
      color: #374151;
      margin-bottom: 4px;
    }

    .contact-row {
      font-size: 8.5pt;
      color: #374151;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }

    .contact-row a {
      color: #111827;
      text-decoration: none;
    }

    .sep {
      color: #9ca3af;
    }

    /* SECTIONS */
    .section-header {
      font-size: 10pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #000000;
      border-bottom: 1px solid #111827;
      padding-bottom: 1px;
      margin-top: 10px;
      margin-bottom: 5px;
    }

    /* SUBHEADINGS / ENTRIES */
    .entry {
      margin-bottom: 6px;
    }

    .entry-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 9pt;
    }

    .entry-bold {
      font-weight: 700;
      color: #000000;
    }

    .entry-italic {
      font-style: italic;
      color: #374151;
    }

    .entry-date {
      font-weight: 500;
      color: #111827;
      text-align: right;
    }

    /* BULLET LISTS */
    ul.bullets {
      padding-left: 14px;
      margin-top: 2px;
    }

    ul.bullets li {
      font-size: 8.5pt;
      color: #1f2937;
      margin-bottom: 1.5px;
      line-height: 1.35;
    }

    /* SKILLS SECTION */
    .skills-list {
      font-size: 8.5pt;
      color: #1f2937;
      line-height: 1.45;
    }

    .skills-list strong {
      color: #000000;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="name">Zayd Ali Mohamed</div>
    <div class="subtitle">Junior Computer Science Student | Software Developer</div>
    <div class="contact-row">
      <span>📞 01017741741</span> <span class="sep">|</span>
      <span>📧 <a href="mailto:zaydaly0501@gmail.com">zaydaly0501@gmail.com</a></span> <span class="sep">|</span>
      <span>💼 <a href="https://www.linkedin.com/in/zayd-ali-17a85a1a0">linkedin.com/in/zayd-ali</a></span> <span class="sep">|</span>
      <span>💻 <a href="https://github.com/zaydaly05">github.com/zaydaly05</a></span> <span class="sep">|</span>
      <span>📍 Cairo, Egypt</span>
    </div>
  </div>

  <!-- EDUCATION -->
  <div class="section-header">Education</div>
  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">Misr International University</span> <span class="sep">|</span> <span class="entry-italic">Bachelor of Science in Computer Science</span></div>
      <div class="entry-date">Sep 2023 – Jun 2027</div>
    </div>
  </div>

  <!-- EXPERIENCE -->
  <div class="section-header">Experience</div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">Software Development Intern</span> &bull; <span class="entry-italic">TAQA Arabia</span></div>
      <div class="entry-date">Jul 2025 – Aug 2025</div>
    </div>
    <ul class="bullets">
      <li>Contributed to developing the <strong>In Gaz API Mobile Application</strong> using Flutter frontend and C# .NET Core Web API backend.</li>
      <li>Engineered secure RESTful endpoints, MVC architecture, role-based access control, and Swagger testing documentation.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">IT Department Intern</span> &bull; <span class="entry-italic">Cairo Higher Institute</span></div>
      <div class="entry-date">Aug 2025 – Sep 2025</div>
    </div>
    <ul class="bullets">
      <li>Administered institutional user email accounts and custom domain security policies.</li>
      <li>Updated and maintained front-end web portal assets on the official institute website via WordPress.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">IT Department Intern</span> &bull; <span class="entry-italic">TAQA Arabia</span></div>
      <div class="entry-date">Aug 2024 – Sep 2024</div>
    </div>
    <ul class="bullets">
      <li>Managed software configurations, user account access control, and enterprise IT infrastructure support.</li>
    </ul>
  </div>

  <!-- PROJECTS -->
  <div class="section-header">Projects</div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">Gulf Limousine Luxury Booking App</span> <span class="sep">|</span> <span class="entry-italic">Flutter, Dart, Firebase, REST API</span></div>
      <div class="entry-date">Jul 2026</div>
    </div>
    <ul class="bullets">
      <li>Cross-platform luxury limousine reservation & fleet tracking mobile app featuring real-time driver allocation and fare estimation.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">Essmat Plastic Factory Management System</span> <span class="sep">|</span> <span class="entry-italic">C#, .NET, SQL Server, Entity Framework</span></div>
      <div class="entry-date">Sep 2026</div>
    </div>
    <ul class="bullets">
      <li>Enterprise inventory and production system optimizing raw material tracking, order processing, and factory billing.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">Food Ordering Management System</span> <span class="sep">|</span> <span class="entry-italic">Spring Boot, React, Tailwind CSS, MongoDB</span></div>
      <div class="entry-date">May 2026</div>
    </div>
    <ul class="bullets">
      <li>Full-stack ordering system with RESTful APIs, JWT authentication, cart state, order tracking, and Admin profit analytics.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">In Gaz API Mobile & REST System</span> <span class="sep">|</span> <span class="entry-italic">Flutter, C# .NET Core Web API, Swagger</span></div>
      <div class="entry-date">Jul 2025</div>
    </div>
    <ul class="bullets">
      <li>Flutter client integrated with C# ASP.NET Core API backend, role authentication, CRUD endpoints, and Swagger docs.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">Employee Attendance & Leave Platform</span> <span class="sep">|</span> <span class="entry-italic">PHP, MySQL, HTML/CSS</span></div>
      <div class="entry-date">Dec 2025</div>
    </div>
    <ul class="bullets">
      <li>Web platform for automated attendance check-ins, leave request processing, and HR relational database management.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">Dr. Naglaa Academic Biography Portal</span> <span class="sep">|</span> <span class="entry-italic">HTML5, CSS3, JavaScript</span></div>
      <div class="entry-date">Sep 2026</div>
    </div>
    <ul class="bullets">
      <li>Academic portfolio & publication showcase website featuring CV integration and research paper archives.</li>
    </ul>
  </div>

  <!-- TECHNICAL SKILLS -->
  <div class="section-header">Technical Skills</div>
  <div class="skills-list">
    <div><strong>Languages:</strong> Java, C#, C++, C, Python, JavaScript, PHP, Dart, SQL, HTML5, CSS3</div>
    <div><strong>Frameworks & Libraries:</strong> Spring Boot, React, Flutter, Express.js, Node.js, .NET Core Web API, JavaFX, Tailwind CSS</div>
    <div><strong>Databases & Cloud:</strong> PostgreSQL, MySQL, MongoDB, Firebase, SQL Server</div>
    <div><strong>Tools & Practices:</strong> Git, GitHub, Docker, VS Code, Android Studio, Postman, Swagger, OOP, REST APIs</div>
    <div><strong>Languages & Soft Skills:</strong> Arabic (Native), English (Fluent) | Problem Solving, Teamwork, Rapid Upskilling</div>
  </div>

  <!-- ACTIVITIES & CERTIFICATIONS -->
  <div class="section-header">Activities & Certifications</div>
  <div class="entry" style="margin-bottom: 2px;">
    <div class="entry-row">
      <div><span class="entry-bold">ACPC Club (Arab Competitive Programming Contest)</span> &bull; <span class="entry-italic">Active Member</span></div>
      <div class="entry-date">2023 – Present</div>
    </div>
  </div>
  <div class="entry" style="margin-bottom: 2px;">
    <div class="entry-row">
      <div><span class="entry-bold">IEEE Student Branch</span> &bull; <span class="entry-italic">Active Member</span></div>
      <div class="entry-date">2023 – Present</div>
    </div>
  </div>
  <div class="entry" style="margin-bottom: 2px;">
    <div class="entry-row">
      <div><span class="entry-bold">TAQA Arabia Software Engineering Internship Certificate</span> &bull; <span class="entry-italic">TAQA Arabia</span></div>
      <div class="entry-date">Aug 2025</div>
    </div>
  </div>
  <div class="entry" style="margin-bottom: 2px;">
    <div class="entry-row">
      <div><span class="entry-bold">Cisco JavaScript Essentials 1 & 2 | Cisco C Essentials 1</span> &bull; <span class="entry-italic">Cisco OpenEDG Academy</span></div>
      <div class="entry-date">Jul 2025</div>
    </div>
  </div>

</body>
</html>
  `;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle" });

  const targetPath1 = path.join(__dirname, "..", "Assets", "cv.pdf");
  const targetPath2 = path.join(__dirname, "..", "Assets", "Zayd Ali Mohamed CV.pdf");
  const publicTargetPath1 = path.join(__dirname, "..", "public", "assets", "cv.pdf");
  const publicTargetPath2 = path.join(__dirname, "..", "public", "assets", "Zayd Ali Mohamed CV.pdf");
  const publicRootPath1 = path.join(__dirname, "..", "public", "cv.pdf");
  const publicRootPath2 = path.join(__dirname, "..", "public", "Zayd Ali Mohamed CV.pdf");

  await page.pdf({
    path: targetPath1,
    format: "A4",
    printBackground: true,
    margin: { top: "8mm", bottom: "8mm", left: "10mm", right: "10mm" }
  });

  // Duplicate to all public & asset target locations
  fs.copyFileSync(targetPath1, targetPath2);
  fs.copyFileSync(targetPath1, publicTargetPath1);
  fs.copyFileSync(targetPath1, publicTargetPath2);
  fs.copyFileSync(targetPath1, publicRootPath1);
  fs.copyFileSync(targetPath1, publicRootPath2);

  console.log("Successfully generated updated Jake's Resume format PDF at:");
  console.log(" -", targetPath1);
  console.log(" -", targetPath2);
  console.log(" -", publicTargetPath1);
  console.log(" -", publicTargetPath2);
  console.log(" -", publicRootPath1);
  console.log(" -", publicRootPath2);

  await browser.close();
};

generateCV().catch((err) => {
  console.error("Failed to generate CV PDF:", err);
  process.exit(1);
});
