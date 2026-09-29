const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const generateCV = async () => {
  console.log("Generating updated executive CV from portfolio data...");

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Zayd Ali Mohamed - Executive CV</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    @page {
      size: A4;
      margin: 7mm 10mm 7mm 10mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.35;
      font-size: 8.5pt;
      -webkit-print-color-adjust: exact;
    }

    /* HEADER */
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 6px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-left h1 {
      font-size: 18pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin-bottom: 1px;
    }

    .header-left h1 span {
      color: #0284c7;
    }

    .header-title {
      font-size: 9.5pt;
      font-weight: 600;
      color: #0284c7;
      margin-bottom: 2px;
    }

    .header-right {
      text-align: right;
      font-size: 8pt;
      color: #475569;
    }

    .header-right div {
      margin-bottom: 1px;
    }

    .header-right a {
      color: #0284c7;
      text-decoration: none;
      font-weight: 500;
    }

    /* SUMMARY */
    .summary {
      font-size: 8.2pt;
      color: #334155;
      margin-bottom: 8px;
      background: #f8fafc;
      padding: 6px 10px;
      border-left: 3px solid #0284c7;
      border-radius: 0 4px 4px 0;
      line-height: 1.38;
    }

    /* SECTION TITLES */
    .section-title {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 2px;
      margin-top: 6px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .section-title-icon {
      color: #0284c7;
    }

    /* EXPERIENCE & PROJECTS */
    .entry {
      margin-bottom: 5px;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1px;
    }

    .entry-title {
      font-weight: 700;
      font-size: 8.8pt;
      color: #0f172a;
    }

    .entry-company {
      font-weight: 600;
      color: #0284c7;
    }

    .entry-date {
      font-size: 7.8pt;
      font-weight: 600;
      color: #64748b;
    }

    .entry-stack {
      font-size: 7.8pt;
      font-weight: 600;
      color: #4f46e5;
      margin-bottom: 1px;
    }

    ul.bullets {
      padding-left: 12px;
      margin-top: 1px;
    }

    ul.bullets li {
      font-size: 8.1pt;
      color: #334155;
      margin-bottom: 1px;
    }

    /* 2-COLUMN GRID FOR SKILLS & CERTIFICATES */
    .grid-2col {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 12px;
      margin-top: 4px;
    }

    /* SKILL BADGES */
    .skill-cat {
      margin-bottom: 4px;
    }

    .skill-cat-title {
      font-weight: 700;
      font-size: 8pt;
      color: #0f172a;
      margin-bottom: 2px;
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
    }

    .tag {
      font-size: 7.2pt;
      font-weight: 600;
      background: #e0f2fe;
      color: #0369a1;
      padding: 1px 5px;
      border-radius: 3px;
    }

    .tag-purple {
      background: #f3e8ff;
      color: #6b21a8;
    }

    /* CERTIFICATE BADGES */
    .cert-item {
      font-size: 7.8pt;
      margin-bottom: 3px;
    }

    .cert-name {
      font-weight: 700;
      color: #0f172a;
    }

    .cert-issuer {
      color: #64748b;
      font-size: 7.4pt;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="header-left">
      <h1>Zayd Ali <span>Mohamed</span></h1>
      <div class="header-title">Junior Computer Science Student & Full-Stack Software Developer</div>
      <div style="font-size: 8pt; color: #475569;">📍 Maadi, Cairo, Egypt &bull; Open for Software Engineering Internships & Roles</div>
    </div>
    <div class="header-right">
      <div>📱 <strong>+20 101 774 1741</strong></div>
      <div>📧 <a href="mailto:zaydaly0501@gmail.com">zaydaly0501@gmail.com</a></div>
      <div>💼 <a href="https://www.linkedin.com/in/zayd-ali-17a85a1a0">linkedin.com/in/zayd-ali-17a85a1a0</a></div>
      <div>💻 <a href="https://github.com/zaydaly05">github.com/zaydaly05</a></div>
    </div>
  </div>

  <!-- EXECUTIVE SUMMARY -->
  <div class="summary">
    Motivated Junior CS student at <strong>Misr International University (MIU)</strong> skilled in enterprise backends (Spring Boot, .NET Core Web API), web applications (React, Node.js, Express), mobile (Flutter/Dart), and relational/NoSQL databases (MongoDB, PostgreSQL, MySQL). Proven experience during technical internships at <strong>TAQA Arabia</strong> & <strong>Cairo Higher Institute</strong> building production REST APIs, mobile apps, and institutional web systems. Active competitive programmer in <strong>ACPC</strong> and <strong>IEEE</strong>.
  </div>

  <!-- EDUCATION & ACTIVITIES -->
  <div class="section-title"><span class="section-title-icon">🎓</span> Education & Extracurricular Activities</div>
  <div class="entry">
    <div class="entry-header">
      <div><span class="entry-title">Bachelor of Science in Computer Science</span> &bull; <span class="entry-company">Misr International University (MIU)</span></div>
      <div class="entry-date">Sep 2023 – Jun 2027 | Cairo, Egypt</div>
    </div>
    <ul class="bullets">
      <li><strong>Coursework:</strong> Data Structures & Algorithms, OOP, Database Schema Design, Web Architecture, HCI Usability, Software Engineering.</li>
      <li><strong>ACPC Club Member (2023 – Present):</strong> Active participant in competitive programming workshops, algorithms, and team contests.</li>
      <li><strong>IEEE Student Branch Member (2023 – Present):</strong> Collaborated in software workshops, tech hackathons, and developer sessions.</li>
    </ul>
  </div>

  <!-- WORK EXPERIENCE -->
  <div class="section-title"><span class="section-title-icon">💼</span> Professional Experience</div>

  <div class="entry">
    <div class="entry-header">
      <div><span class="entry-title">Software Development Intern</span> &bull; <span class="entry-company">TAQA Arabia</span></div>
      <div class="entry-date">July 2025 – August 2025 | Maadi, Cairo</div>
    </div>
    <ul class="bullets">
      <li>Contributed to developing the <strong>In Gaz API Mobile Application</strong> using Flutter frontend and C# .NET Core Web API backend.</li>
      <li>Engineered secure RESTful endpoints, MVC architecture, role-based access control, and interactive mobile UI views.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-header">
      <div><span class="entry-title">IT Department Intern</span> &bull; <span class="entry-company">Cairo Higher Institute</span></div>
      <div class="entry-date">August 2025 – September 2025 | 1st Settlement, Cairo</div>
    </div>
    <ul class="bullets">
      <li>Administered domain email accounts and user credentials on the institute's official domain server.</li>
      <li>Updated and maintained the institute's official front-end web portal via WordPress and custom CSS/JS.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-header">
      <div><span class="entry-title">IT Department Intern</span> &bull; <span class="entry-company">TAQA Arabia</span></div>
      <div class="entry-date">August 2024 – September 2024 | Maadi, Cairo</div>
    </div>
    <ul class="bullets">
      <li>Managed software installations, security configurations, device management, and tier-1 IT helpdesk support.</li>
    </ul>
  </div>

  <!-- FEATURED TECHNICAL PROJECTS -->
  <div class="section-title"><span class="section-title-icon">🚀</span> Featured Software Engineering Projects</div>

  <div class="entry">
    <div class="entry-header">
      <div><span class="entry-title">Gulf Limousine Luxury Booking Platform</span></div>
      <div class="entry-date">July 2026</div>
    </div>
    <div class="entry-stack">Stack: Flutter, Dart, Firebase Firestore, REST API</div>
    <ul class="bullets">
      <li>Cross-platform luxury mobile booking app with real-time driver allocation, fleet selection, fare estimation, and booking management.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-header">
      <div><span class="entry-title">Essmat Plastic Factory Management System</span></div>
      <div class="entry-date">September 2026</div>
    </div>
    <div class="entry-stack">Stack: C#, .NET, SQL Server, Entity Framework</div>
    <ul class="bullets">
      <li>Enterprise inventory & production management system optimizing raw material tracking, order processing, and factory billing.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-header">
      <div><span class="entry-title">Food Ordering Management System</span></div>
      <div class="entry-date">May 2026</div>
    </div>
    <div class="entry-stack">Stack: Spring Boot, React.js, Tailwind CSS, MongoDB</div>
    <ul class="bullets">
      <li>Full-stack food ordering system with RESTful APIs, JWT authentication, shopping cart, order tracking, and Admin profit analytics.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-header">
      <div><span class="entry-title">Dr. Naglaa Academic Biography Portal</span></div>
      <div class="entry-date">September 2026</div>
    </div>
    <div class="entry-stack">Stack: HTML5, CSS3, JavaScript, Responsive Design</div>
    <ul class="bullets">
      <li>Academic showcase portal for faculty publications, research paper archives, CV downloads, and student contact channels.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-header">
      <div><span class="entry-title">In Gaz API Mobile & REST System</span></div>
      <div class="entry-date">July 2025</div>
    </div>
    <div class="entry-stack">Stack: Flutter, C# .NET Core Web API, Swagger</div>
    <ul class="bullets">
      <li>Flutter client integrated with C# ASP.NET Core API backend, role authentication, CRUD endpoints, and Swagger testing.</li>
    </ul>
  </div>

  <!-- SKILLS & CERTIFICATIONS GRID -->
  <div class="grid-2col">
    <div>
      <div class="section-title"><span class="section-title-icon">⚡</span> Technical Skills</div>

      <div class="skill-cat">
        <div class="skill-cat-title">Languages:</div>
        <div class="skill-tags">
          <span class="tag">Java</span>
          <span class="tag">C#</span>
          <span class="tag">C++</span>
          <span class="tag">C</span>
          <span class="tag">Python</span>
          <span class="tag">JavaScript</span>
          <span class="tag">PHP</span>
          <span class="tag">Dart</span>
          <span class="tag">SQL</span>
        </div>
      </div>

      <div class="skill-cat">
        <div class="skill-cat-title">Frameworks:</div>
        <div class="skill-tags">
          <span class="tag tag-purple">Spring Boot</span>
          <span class="tag tag-purple">React.js</span>
          <span class="tag tag-purple">Flutter</span>
          <span class="tag tag-purple">Express.js</span>
          <span class="tag tag-purple">.NET Core API</span>
          <span class="tag tag-purple">Node.js</span>
        </div>
      </div>

      <div class="skill-cat">
        <div class="skill-cat-title">Databases & Tools:</div>
        <div class="skill-tags">
          <span class="tag">PostgreSQL</span>
          <span class="tag">MongoDB</span>
          <span class="tag">Firebase</span>
          <span class="tag">MySQL</span>
          <span class="tag">Git</span>
          <span class="tag">GitHub</span>
          <span class="tag">Docker</span>
          <span class="tag">Postman</span>
        </div>
      </div>
    </div>

    <div>
      <div class="section-title"><span class="section-title-icon">📜</span> Industry Certifications</div>
      
      <div class="cert-item">
        <div class="cert-name">&bull; TAQA Arabia Software Internship Certificate</div>
        <div class="cert-issuer">TAQA Arabia Engineering Dept &bull; Aug 2025</div>
      </div>
      
      <div class="cert-item">
        <div class="cert-name">&bull; Cisco JavaScript Essentials 1 & 2</div>
        <div class="cert-issuer">Cisco Networking Academy & OpenEDG &bull; Jul 2025</div>
      </div>
      
      <div class="cert-item">
        <div class="cert-name">&bull; Cisco C Essentials 1 Certification</div>
        <div class="cert-issuer">Cisco Networking Academy & OpenEDG &bull; Jul 2025</div>
      </div>

      <div class="cert-item">
        <div class="cert-name">&bull; Introduction to Cybersecurity</div>
        <div class="cert-issuer">Cisco Networking Academy &bull; Jul 2025</div>
      </div>

      <div class="cert-item">
        <div class="cert-name">&bull; CSS & Modern Web Development</div>
        <div class="cert-issuer">Cisco OpenEDG Academy &bull; Jul 2025</div>
      </div>
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

  await page.pdf({
    path: targetPath1,
    format: "A4",
    printBackground: true,
    margin: { top: "6mm", bottom: "6mm", left: "10mm", right: "10mm" }
  });

  // Duplicate to Zayd Ali Mohamed CV.pdf
  fs.copyFileSync(targetPath1, targetPath2);

  console.log("Successfully generated updated 1-page executive CV at:");
  console.log(" -", targetPath1);
  console.log(" -", targetPath2);

  await browser.close();
};

generateCV().catch((err) => {
  console.error("Failed to generate CV PDF:", err);
  process.exit(1);
});
