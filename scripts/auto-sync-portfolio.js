/**
 * Auto-Sync Portfolio Engine
 * Automatically detects new & updated GitHub repositories for zaydaly05,
 * validates project content, updates server.js portfolio data & skills,
 * and sends WhatsApp notifications via CallMeBot API.
 */

const fs = require('fs');
const path = require('path');

const GITHUB_USERNAME = 'zaydaly05';
const SERVER_JS_PATH = path.join(__dirname, '..', 'server.js');

async function fetchGitHubRepos() {
  console.log(`🔍 Fetching public repositories for ${GITHUB_USERNAME}...`);
  const headers = {
    'User-Agent': 'Portfolio-AutoSync-Bot'
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`, {
      headers
    });

    if (!response.ok) {
      console.warn(`⚠️ GitHub API returned status ${response.status}. Using cached repo check.`);
      return [];
    }

    const repos = await response.json();
    console.log(`✅ Found ${repos.length} total repositories.`);
    return repos;
  } catch (err) {
    console.warn(`⚠️ GitHub fetch note: ${err.message}`);
    return [];
  }
}



async function syncPortfolio() {
  try {
    // ☁️ 1. Run Cloudinary Media Sync & Link Replacement
    try {
      console.log("☁️ Running Cloudinary Media Sync & Link Replacement...");
      const { execSync } = require('child_process');
      execSync('node scripts/upload-to-cloudinary.js', { stdio: 'inherit' });
    } catch (cErr) {
      console.warn("⚠️ Cloudinary sync skipped or completed with note:", cErr.message);
    }

    const repos = await fetchGitHubRepos();
    if (!repos || repos.length === 0) {
      console.log("No repositories found.");
      return;
    }

    // Filter valid non-fork, non-empty repos
    const validRepos = repos.filter(r => !r.fork && r.size > 0);

    let serverContent = fs.readFileSync(SERVER_JS_PATH, 'utf8');

    const addedProjects = [];

    validRepos.forEach(repo => {
      const repoNameClean = repo.name.replace(/[-_]/g, ' ');
      // Check if project name already exists in server.js
      const exists = serverContent.toLowerCase().includes(repo.name.toLowerCase()) || 
                     serverContent.toLowerCase().includes(repoNameClean.toLowerCase());

      if (!exists && repo.description) {
        console.log(`✨ New valid project detected: ${repo.name} (${repo.language || 'Code'})`);
        addedProjects.push({
          name: repoNameClean.replace(/\b\w/g, l => l.toUpperCase()),
          period: new Date(repo.pushed_at || repo.updated_at).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
          stack: `${repo.language || 'Software'}, GitHub, Open-Source`,
          description: `${repo.description} (Automatically synced from GitHub repository: github.com/${GITHUB_USERNAME}/${repo.name})`
        });
      }
    });


    if (addedProjects.length > 0) {
      const projectDetails = addedProjects.map(p => `• *${p.name}* (${p.stack})`).join('\n');

      // WhatsApp Interactive Approval Gate (Enabled when ENABLE_WHATSAPP_APPROVAL=true or in interactive mode)
      if (process.env.ENABLE_WHATSAPP_APPROVAL === 'true' || process.env.REQUIRE_APPROVAL === 'true') {
        const { requestWhatsAppApproval } = require('../api/whatsapp-approval');
        console.log(`📱 Sending WhatsApp approval request for ${addedProjects.length} new project(s)...`);
        
        const approvalResult = await requestWhatsAppApproval(
          "Portfolio Auto-Sync: Update server.js",
          `Detected ${addedProjects.length} new GitHub project(s):\n${projectDetails}`,
          300000 // 5 min timeout
        );

        if (!approvalResult || !approvalResult.approved) {
          console.log(`🛑 WhatsApp Approval Status: ${approvalResult ? approvalResult.action : 'REJECTED'}. Modifications to server.js were cancelled.`);
          return;
        }
        console.log("✅ WhatsApp Approval Received! Proceeding to update server.js...");
      }

      console.log(`📝 Updating server.js with ${addedProjects.length} new projects...`);

      // Locate `projects: [` array inside server.js
      const projectInsertIndex = serverContent.indexOf('projects: [');
      if (projectInsertIndex !== -1) {
        const insertPos = projectInsertIndex + 'projects: ['.length;
        const newProjectBlocks = addedProjects.map(p => `
    {
      name: "${p.name}",
      period: "${p.period}",
      stack: "${p.stack}",
      description: "${p.description.replace(/"/g, '\\"')}"
    },`).join('\n');

        serverContent = serverContent.slice(0, insertPos) + '\n' + newProjectBlocks + serverContent.slice(insertPos);
        fs.writeFileSync(SERVER_JS_PATH, serverContent, 'utf8');
        console.log("✅ server.js successfully updated!");

        // Update latex-cv/Zayd_Ali_Mohamed_CV.tex if exists
        const latexCvPath = path.join(__dirname, '..', 'latex-cv', 'Zayd_Ali_Mohamed_CV.tex');
        if (fs.existsSync(latexCvPath)) {
          let latexContent = fs.readFileSync(latexCvPath, 'utf8');
          const latexInsertIndex = latexContent.indexOf('\\section{Key Projects}');
          if (latexInsertIndex !== -1) {
            const listStartIndex = latexContent.indexOf('\\resumeSubHeadingListStart', latexInsertIndex);
            if (listStartIndex !== -1) {
              const insertPosTex = listStartIndex + '\\resumeSubHeadingListStart'.length;
              const newTexProjects = addedProjects.map(p => `
      \\resumeProjectHeading
          {\\textbf{${p.name}} $|$ \\emph{${p.stack}}}{${p.period}}
          \\resumeItemListStart
            \\resumeItem{${p.description}}
          \\resumeItemListEnd`).join('\n');
              latexContent = latexContent.slice(0, insertPosTex) + '\n' + newTexProjects + latexContent.slice(insertPosTex);
              fs.writeFileSync(latexCvPath, latexContent, 'utf8');
              console.log("✅ latex-cv/Zayd_Ali_Mohamed_CV.tex successfully updated!");
            }
          }
        }

        const { sendWhatsAppAlert } = require('./whatsapp-notifier');
        await sendWhatsAppAlert(
          'SUCCESS',
          'Portfolio Auto-Sync Completed',
          `Detected & integrated ${addedProjects.length} new GitHub project(s):\n` + addedProjects.map(p => `• *${p.name}* (${p.stack})`).join('\n')
        );
      }
    } else {
      console.log("🎉 Portfolio is already up to date with all GitHub repositories!");
    }

    // 📄 Always regenerate executive CV PDF automatically
    try {
      console.log("📄 Automatically generating executive CV PDF...");
      const { execSync } = require('child_process');
      execSync('npx playwright install chromium && node scripts/generate-pdf-cv.js', { stdio: 'inherit' });

    } catch (pdfErr) {
      console.warn("⚠️ PDF auto-generation note:", pdfErr.message);
      const { sendWhatsAppAlert } = require('./whatsapp-notifier');
      await sendWhatsAppAlert('WARNING', 'PDF CV Auto-Generation Warning', pdfErr.message);
    }
  } catch (error) {
    console.error("❌ Sync Error:", error.message);
    try {
      const { sendWhatsAppAlert } = require('./whatsapp-notifier');
      await sendWhatsAppAlert('ERROR', 'Portfolio Sync Pipeline Failure', 'An error occurred during auto-sync execution.', { error: error.message });
    } catch {}


    process.exit(1);
  }
}

syncPortfolio();

