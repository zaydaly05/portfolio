const { chromium } = require("@playwright/test");
const path = require("path");

const generateCV = async () => {
  console.log("Generating CV PDF matching exact desired structure...");

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Zayd Ali Mohamed - Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Latin+Modern+Roman:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
    
    @page {
      size: A4;
      margin: 10mm 12mm 10mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      color: #000000;
      background: #ffffff;
      line-height: 1.35;
      font-size: 9.5pt;
      -webkit-print-color-adjust: exact;
    }

    /* HEADER */
    .header {
      text-align: center;
      margin-bottom: 10px;
    }

    .name {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 24pt;
      font-weight: 400;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #000000;
      margin-bottom: 2px;
    }

    .address {
      font-size: 9.5pt;
      color: #222222;
      margin-bottom: 4px;
    }

    .contact-row {
      font-size: 9pt;
      color: #000000;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .contact-row a {
      color: #000000;
      text-decoration: underline;
    }

    /* SECTIONS */
    .section-header {
      font-size: 11pt;
      font-weight: 700;
      color: #000000;
      border-bottom: 1px solid #000000;
      padding-bottom: 1px;
      margin-top: 10px;
      margin-bottom: 5px;
    }

    /* SUMMARY */
    .summary-text {
      font-size: 9pt;
      color: #111111;
      text-align: justify;
      line-height: 1.35;
      margin-bottom: 4px;
    }

    /* ENTRIES */
    .entry {
      margin-bottom: 6px;
    }

    .entry-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 9.5pt;
    }

    .entry-bold {
      font-weight: 700;
      color: #000000;
    }

    .entry-italic {
      font-style: italic;
      color: #222222;
    }

    .entry-date {
      font-weight: 700;
      color: #000000;
      text-align: right;
    }

    /* BULLETS */
    ul.bullets {
      padding-left: 18px;
      margin-top: 2px;
      list-style-type: disc;
    }

    ul.bullets li {
      font-size: 9pt;
      color: #111111;
      margin-bottom: 2px;
      line-height: 1.3;
    }

    /* SKILLS */
    .skills-block {
      font-size: 9pt;
      line-height: 1.4;
      color: #111111;
    }

    .skills-block div {
      margin-bottom: 1px;
    }

    .skills-block strong {
      font-weight: 700;
      color: #000000;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="name">Zayd Ali Mohamed</div>
    <div class="address">Maadi, Cairo</div>
    <div class="contact-row">
      <span>📞 01017741741</span>
      <span>✉️ <a href="mailto:zaydaly0501@gmail.com">zaydaly0501@gmail.com</a></span>
      <span>💼 <a href="https://www.linkedin.com/in/zayd-ali-17a85a1a0">www.linkedin.com/in/zayd-ali-17a85a1a0</a></span>
      <span>💻 <a href="https://github.com/zaydaly05">github.com/zaydaly05</a></span>
    </div>
  </div>

  <!-- SUMMARY -->
  <div class="section-header">Summary</div>
  <div class="summary-text">
    Ambitious Junior Computer Science student with a strong foundation in problem-solving and a passion for technology, consistently advancing technical expertise through hands-on projects and workshops while striving to deliver impactful, scalable software solutions.
  </div>

  <!-- EXPERIENCE -->
  <div class="section-header">Experience</div>

  <div class="entry">
    <div class="entry-row">
      <div class="entry-bold">Cairo Higher Institute</div>
      <div class="entry-date">August 2025 – September 2025</div>
    </div>
    <div class="entry-row">
      <div class="entry-italic">Full-Time Internship in IT Department</div>
      <div class="entry-italic">1st Settlement, Cairo</div>
    </div>
    <ul class="bullets">
      <li>Managed institutional email accounts and maintained the website using WordPress.</li>
      <li>Oversaw social media accounts and created multimedia content to enhance digital presence.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-row">
      <div class="entry-bold">TAQA Arabia</div>
      <div class="entry-date">July 2025 – August 2025</div>
    </div>
    <div class="entry-row">
      <div class="entry-italic">Full-Time Internship in Software Development Department</div>
      <div class="entry-italic">Maadi, Cairo</div>
    </div>
    <ul class="bullets">
      <li>Developed an InGaz API Mobile Application</li>
    </ul>
  </div>

  <!-- PROJECTS -->
  <div class="section-header">Projects</div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">Restaurant Management System</span> <span style="color:#555;">|</span> <span class="entry-italic">Java, JavaFX</span></div>
      <div class="entry-date">Dec 2024</div>
    </div>
    <ul class="bullets">
      <li>GUI system for managing job postings, applications, and interviews using Java and JavaFX.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">InGaz API System</span> <span style="color:#555;">|</span> <span class="entry-italic">C#, Flutter</span></div>
      <div class="entry-date">Jul 2025</div>
    </div>
    <ul class="bullets">
      <li>Flutter mobile app integrated with .NET Core Web API with secure role-based access, CRUD operations, and Swagger testing.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">Employee Attendance System</span> <span style="color:#555;">|</span> <span class="entry-italic">HTML, CSS, PHP, MySQL</span></div>
      <div class="entry-date">Dec 2025</div>
    </div>
    <ul class="bullets">
      <li>Web-based system for attendance and leave management with automated tracking and secure database design.</li>
    </ul>
  </div>

  <div class="entry">
    <div class="entry-row">
      <div><span class="entry-bold">Food Ordering System</span> <span style="color:#555;">|</span> <span class="entry-italic">Spring Boot, React, MongoDB</span></div>
      <div class="entry-date">May 2026</div>
    </div>
    <ul class="bullets">
      <li>Full-stack system with authentication, CRUD operations, and analytics for orders and user activity.</li>
    </ul>
  </div>

  <!-- TECHNICAL SKILLS -->
  <div class="section-header">Technical Skills</div>
  <div class="skills-block">
    <div><strong>Languages:</strong> PHP, C, Python, Java, HTML, CSS, JavaScript, SQL, C++, C#, Flutter, Dart, Tailwind</div>
    <div><strong>Databases:</strong> SQL, MongoDB, Firebase</div>
    <div><strong>Developer Tools:</strong> VS Code, Apache NetBeans, XAMPP, Git, GitHub, Android Studio</div>
    <div><strong>Frameworks:</strong> NodeJs, ExpressJs, SpringBoot, React</div>
    <div><strong>Microsoft Office 365:</strong> Word, Excel, Powerpoint, Access</div>
    <div><strong>Design Tools:</strong> Adobe Photoshop, Adobe InDesign, Adobe Premiere, Filmora</div>
    <div><strong>Data Analysis:</strong> Orange Data Mining, Power BI</div>
    <div><strong>Other Skills:</strong> Data Structures, OOP</div>
  </div>

  <!-- SOFT SKILLS -->
  <div class="section-header">Soft Skills</div>
  <ul class="bullets">
    <li>Strong Teamwork Abilities</li>
    <li>Problem-Solving</li>
    <li>Time Management and Organizational Skills</li>
  </ul>

  <!-- EDUCATION -->
  <div class="section-header">Education</div>
  <div class="entry">
    <div class="entry-row">
      <div class="entry-bold">Misr International University</div>
      <div class="entry-date">September 2023 – June 2027</div>
    </div>
    <div class="entry-italic">Bachelor of Science in Computer Science</div>
  </div>

  <!-- LANGUAGES -->
  <div class="section-header">Languages</div>
  <ul class="bullets">
    <li>Arabic: Native</li>
    <li>English: Fluent</li>
    <li>French: Beginner</li>
  </ul>

</body>
</html>
  `;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle" });

  const singleCvPath = path.join(__dirname, "..", "public", "assets", "Zayd Ali Mohamed CV.pdf");
  const underscoreCvPath = path.join(__dirname, "..", "public", "assets", "Zayd_Ali_Mohamed_CV.pdf");
  const shortCvPath = path.join(__dirname, "..", "public", "assets", "cv.pdf");

  await page.pdf({
    path: singleCvPath,
    format: "A4",
    printBackground: true,
    margin: { top: "8mm", bottom: "8mm", left: "10mm", right: "10mm" }
  });

  const fs = require("fs");
  fs.copyFileSync(singleCvPath, underscoreCvPath);
  fs.copyFileSync(singleCvPath, shortCvPath);

  console.log("Successfully generated single updated CV PDF at:");
  console.log(" -", singleCvPath);
  console.log(" -", underscoreCvPath);
  console.log(" -", shortCvPath);

  await browser.close();
};

generateCV().catch((err) => {
  console.error("Failed to generate CV PDF:", err);
  process.exit(1);
});
