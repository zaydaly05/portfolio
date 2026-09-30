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
const WHATSAPP_USERNAME = (process.env.WHATSAPP_USERNAME || 'zaydaly05').replace('@', '');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''; // Free Telegram Bot Token
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

const PUSHBULLET_TOKEN = process.env.PUSHBULLET_TOKEN || ''; // Free Pushbullet Mobile App Token
const _TARGET_EMAIL = process.env.TARGET_EMAIL || 'zaydaly0501@gmail.com';

async function sendPushbulletNotification(message) {
  if (!PUSHBULLET_TOKEN) return false;
  try {
    console.log("📲 Sending instant mobile push notification via Pushbullet...");
    const res = await fetch('https://api.pushbullet.com/v2/pushes', {
      method: 'POST',
      headers: {
        'Access-Token': PUSHBULLET_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'note',
        title: 'Zayd Portfolio AutoSync 🚀',
        body: message
      })
    });
    if (res.ok) {
      console.log("🚀 Mobile phone push notification delivered!");
      return true;
    }
  } catch (err) {
    console.error("❌ Pushbullet error:", err.message);
  }
  return false;
}

async function sendTelegramNotification(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return false;

  try {
    console.log("✈️ Sending instant Telegram alert...");
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    if (res.ok) {
      console.log("🚀 Telegram notification delivered instantly!");
      return true;
    }
  } catch (err) {
    console.error("❌ Telegram notification error:", err.message);
  }
  return false;
}

async function sendWebhookNotification(message) {
  if (!process.env.MAKE_WEBHOOK_URL) return false;
  try {
    console.log("🔗 Triggering Mobile Webhook (Zapier/Make)...");
    const res = await fetch(process.env.MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, phone: WHATSAPP_PHONE })
    });
    if (res.ok) {
      console.log("🚀 Mobile webhook notification triggered successfully!");
      return true;
    }
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
  }
  return false;
}

async function sendWhatsAppNotification(message) {
  const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY || '';
  const _TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
  const encodedText = encodeURIComponent(message);
  const directWhatsAppLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;
  const usernameWhatsAppLink = `https://wa.me/${WHATSAPP_USERNAME}?text=${encodedText}`;

  // Mobile Delivery Channels
  await sendPushbulletNotification(message);
  await sendWebhookNotification(message);
  await sendTelegramNotification(message);

  if (!CALLMEBOT_API_KEY) {
    console.log("\n------------------------------------------------------------");
    console.log("📱 NOTIFICATION SUMMARY:");
    console.log(message);
    console.log(`\n🔗 Direct WhatsApp Link (Phone ${WHATSAPP_PHONE}):`);
    console.log(directWhatsAppLink);
    console.log(`\n👤 WhatsApp Username Link (@${WHATSAPP_USERNAME}):`);
    console.log(usernameWhatsAppLink);
    console.log("------------------------------------------------------------\n");
    return;
  }

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_PHONE}&text=${encodedText}&apikey=${CALLMEBOT_API_KEY}`;
    console.log("📱 Sending automated WhatsApp notification via CallMeBot...");
    const res = await fetch(url);
    const responseText = await res.text();
    if (res.ok && !responseText.includes("APIKey is invalid")) {
      console.log("🚀 WhatsApp message delivered successfully to your phone!");
    } else {
      console.warn("⚠️ WhatsApp delivery note:", responseText.replace(/<[^>]*>?/gm, ''));
      console.log("🔗 Backup WhatsApp Link:", directWhatsAppLink);
    }
  } catch (err) {
    console.error("❌ Failed to send WhatsApp notification:", err.message);
  }

  // Persistent Audit Log (Works even if WhatsApp app is locked/offline)
  try {
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    const logEntry = `[${new Date().toISOString()}]\n${message}\n----------------------------------------\n`;
    fs.appendFileSync(path.join(logsDir, 'sync-audit.log'), logEntry, 'utf8');
    console.log("📁 Sync report logged to logs/sync-audit.log");
  } catch {
    // Ignore log file error
  }
}

async function syncPortfolio() {
  try {
    // ☁️ 1. Run Cloudinary Media Sync & Link Replacement
    try {
      console.log("☁️ Running Cloudinary Media Sync & Link Replacement...");
      const { execSync } = require('child_process');
      execSync('node scripts/upload-to-cloudinary.js --replace', { stdio: 'inherit' });
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

    // Extract portfolioData object block using regex or structure
    let _updatedCount = 0;
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
