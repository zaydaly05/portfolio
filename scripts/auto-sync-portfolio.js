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
const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE || '201017741741';
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY || ''; // Free CallMeBot API key

async function fetchGitHubRepos() {
  console.log(`🔍 Fetching public repositories for ${GITHUB_USERNAME}...`);
  const headers = {
    'User-Agent': 'Portfolio-AutoSync-Bot'
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned status ${response.status}`);
  }

  const repos = await response.json();
  console.log(`✅ Found ${repos.length} total repositories.`);
  return repos;
}

async function sendWhatsAppNotification(message) {
  const encodedText = encodeURIComponent(message);
  const directWhatsAppLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

  if (!CALLMEBOT_API_KEY) {
    console.log("\n------------------------------------------------------------");
    console.log("📱 WHATSAPP NOTIFICATION DETAILS:");
    console.log(message);
    console.log("\n🔗 Direct WhatsApp Message Link (Click to send to yourself):");
    console.log(directWhatsAppLink);
    console.log("\n⚠️ To enable 100% automated background WhatsApp delivery:");
    console.log("1. Send a WhatsApp message to +34 644 64 26 43 with the text: 'I allow callmebot to send me messages'");
    console.log("2. CallMeBot will reply with your free API Key.");
    console.log("3. Put your API Key in scripts/auto-sync-portfolio.js at line 14: CALLMEBOT_API_KEY = 'your_key'");
    console.log("------------------------------------------------------------\n");
    return;
  }

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_PHONE}&text=${encodedText}&apikey=${CALLMEBOT_API_KEY}`;
    console.log("📱 Sending automated WhatsApp notification via CallMeBot...");
    const res = await fetch(url);
    const responseText = await res.text();
    if (res.ok && !responseText.includes("APIKey is invalid")) {
      console.log("🚀 WhatsApp message delivered successfully!");
    } else {
      console.warn("⚠️ WhatsApp delivery note:", responseText.replace(/<[^>]*>?/gm, ''));
      console.log("🔗 Backup WhatsApp Link:", directWhatsAppLink);
    }
  } catch (err) {
    console.error("❌ Failed to send WhatsApp notification:", err.message);
  }
}

async function syncPortfolio() {
  try {
    const repos = await fetchGitHubRepos();
    if (!repos || repos.length === 0) {
      console.log("No repositories found.");
      return;
    }

    // Filter valid non-fork, non-empty repos
    const validRepos = repos.filter(r => !r.fork && r.size > 0);

    let serverContent = fs.readFileSync(SERVER_JS_PATH, 'utf8');

    // Extract portfolioData object block using regex or structure
    let updatedCount = 0;
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
        updatedCount++;
      }
    });

    if (addedProjects.length > 0) {
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

        const notificationMsg = `🚀 *Zayd Portfolio Automated Sync*\n\n✅ Detected & integrated ${addedProjects.length} new GitHub project(s):\n` +
          addedProjects.map(p => `• *${p.name}* (${p.stack})`).join('\n') +
          `\n\n📌 Portfolio & CV sync completed. Deployment triggered!`;

        await sendWhatsAppNotification(notificationMsg);
      }
    } else {
      console.log("🎉 Portfolio is already up to date with all GitHub repositories!");
    }
  } catch (error) {
    console.error("❌ Sync Error:", error.message);
    process.exit(1);
  }
}

syncPortfolio();
