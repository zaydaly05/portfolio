const { GoogleGenerativeAI } = require("@google/generative-ai");
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 1. Initialize Gemini Free Tier AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function autoUpdateCVAndPortfolio() {
  const repoName = process.argv[2] || "unknown-repo";
  const commitMessage = process.argv[3] || "Major codebase update";

  console.log(`Starting Autonomous AI Analysis for ${repoName}...`);

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not found! Please add it to GitHub Secrets.");
    process.exit(1);
  }

  // 2. Use Gemini AI to generate CV bullet points based on the push
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    You are an expert tech recruiter and CV writer. 
    Zayd just pushed code to his repository "${repoName}" with the commit message: "${commitMessage}".
    Write one professional, 15-word CV bullet point summarizing this technical achievement.
    Do not use quotes, just return the bullet point text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const newAchievement = result.response.text().trim();
    console.log(`🧠 AI Generated CV Bullet: ${newAchievement}`);

    // 3. Generate a dynamic HTML CV (so Puppeteer can render it to PDF)
    const cvHtmlPath = path.join(__dirname, '..', 'public', 'assets', 'cv-template.html');
    
    // Create a very basic professional CV HTML template dynamically
    const cvHtmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Zayd Ali Mohamed - CV</title>
      <style>
        body { font-family: 'Helvetica', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
        h1 { color: #1e293b; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
        h2 { color: #6366f1; margin-top: 30px; }
        .experience { margin-bottom: 20px; }
        .latest-update { background: #f8fafc; padding: 15px; border-left: 4px solid #10b981; margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1>Zayd Ali Mohamed</h1>
      <p>Junior Computer Science Student & Full-Stack Software Developer</p>
      <p>Email: zaydaly05@example.com | GitHub: github.com/zaydaly05</p>
      
      <h2>Technical Highlights</h2>
      <ul>
        <li>Full-Stack Development with Spring Boot, React, Node.js, and MongoDB.</li>
        <li>Mobile App Development using Flutter and Dart.</li>
      </ul>

      <h2>Latest Autonomous Achievements (AI Generated)</h2>
      <div class="latest-update">
        <p><strong>${new Date().toLocaleDateString()} - ${repoName}</strong></p>
        <ul>
          <li>${newAchievement}</li>
        </ul>
      </div>
    </body>
    </html>
    `;

    fs.writeFileSync(cvHtmlPath, cvHtmlContent);
    console.log("📝 Created updated HTML CV Template");

    // 4. Use Puppeteer to compile the HTML into a new PDF!
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    await page.goto(`file://${cvHtmlPath}`, { waitUntil: 'networkidle0' });
    
    const pdfPath = path.join(__dirname, '..', 'public', 'assets', 'Zayd Ali Mohamed CV.pdf');
    
    await page.pdf({ 
      path: pdfPath, 
      format: 'A4', 
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();
    
    // Clean up temporary HTML
    fs.unlinkSync(cvHtmlPath);
    
    console.log(`✅ Successfully compiled new CV to PDF: ${pdfPath}`);

  } catch (err) {
    console.error("❌ AI CV Update Failed:", err);
  }
}

autoUpdateCVAndPortfolio();
