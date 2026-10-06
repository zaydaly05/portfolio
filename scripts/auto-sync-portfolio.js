/**
 * Auto-Sync Portfolio Engine
 * Automatically detects new & updated GitHub repositories for zaydaly05,
 * validates project content, adds approved projects to the portfolio database (via the admin API),
 * and sends WhatsApp notifications via CallMeBot API.
 */

const fs = require('fs');
const path = require('path');

const GITHUB_USERNAME = 'zaydaly05';

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



/** Projects currently published: the live site if PORTFOLIO_URL is set, else the built-in seed data. */
async function loadCurrentProjects(siteUrl) {
  if (siteUrl) {
    try {
      const response = await fetch(`${siteUrl}/api/portfolio`);
      if (response.ok) return (await response.json()).projects || [];
    } catch (err) {
      console.warn(`⚠️ Could not read ${siteUrl}/api/portfolio (${err.message}); using built-in data.`);
    }
  }
  return require('../data/defaults').projects;
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

    // Projects now live in the database. Compare GitHub against what the live site currently shows.
    const siteUrl = (process.env.PORTFOLIO_URL || '').replace(/\/+$/, '');
    const adminKey = process.env.ADMIN_API_KEY || '';
    const currentProjects = await loadCurrentProjects(siteUrl);
    const knownText = JSON.stringify(currentProjects).toLowerCase();

    const addedProjects = [];

    validRepos.forEach(repo => {
      const repoNameClean = repo.name.replace(/[-_]/g, ' ');
      const exists = knownText.includes(repo.name.toLowerCase()) || knownText.includes(repoNameClean.toLowerCase());

      if (!exists && repo.description) {
        console.log(`✨ New valid project detected: ${repo.name} (${repo.language || 'Code'})`);
        addedProjects.push({
          repo: repo.name,
          name: repoNameClean.replace(/\b\w/g, l => l.toUpperCase()),
          stack: `${repo.language || 'Software'}`
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
          "Portfolio Auto-Sync: add new GitHub projects",
          `Detected ${addedProjects.length} new GitHub project(s):\n${projectDetails}`,
          300000 // 5 min timeout
        );

        if (!approvalResult || !approvalResult.approved) {
          console.log(`🛑 WhatsApp Approval Status: ${approvalResult ? approvalResult.action : 'REJECTED'}. The portfolio was not changed.`);
          return;
        }
        console.log("✅ WhatsApp Approval Received! Applying to the portfolio...");
      }

      if (!siteUrl || !adminKey) {
        console.log('ℹ️ Set PORTFOLIO_URL and ADMIN_API_KEY to apply these projects automatically (or use "Import from GitHub" in the admin app):\n' + projectDetails);
        return;
      }

      console.log(`📝 Adding ${addedProjects.length} new project(s) to the portfolio database...`);
      const response = await fetch(`${siteUrl}/api/admin/github/import`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ repos: addedProjects.map(p => p.repo) })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `Import failed (${response.status})`);
      console.log(`✅ Added: ${(result.added || []).join(', ')}`);

      const { sendWhatsAppAlert } = require('./whatsapp-notifier');
      await sendWhatsAppAlert(
        'SUCCESS',
        'Portfolio Auto-Sync Completed',
        `Detected & integrated ${addedProjects.length} new GitHub project(s):\n` + projectDetails
      );
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

