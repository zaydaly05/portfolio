/**
 * Custom WhatsApp & Mobile Notification Engine for zayd-portfolio
 * Supports categorized alerts: SUCCESS 🟢 | WARNING ⚠️ | ERROR 🚨
 */

const fs = require('fs');
const path = require('path');

// Read .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*"?([^"]+)"?\s*$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

const WHATSAPP_PHONE = (process.env.WHATSAPP_PHONE || '201017741741').replace(/[^0-9]/g, '');
const KAPSO_API_KEY = process.env.KAPSO_API_KEY || process.env.WHATSAPP_TOKEN || '';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '597907523413541';
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY || '';
const PUSHBULLET_TOKEN = process.env.PUSHBULLET_TOKEN || '';
const BASE_URL = process.env.KAPSO_BASE_URL || 'https://api.kapso.ai/meta/whatsapp';

/**
 * Format notification message based on type
 * @param {'SUCCESS'|'WARNING'|'ERROR'} type
 * @param {string} actionName
 * @param {string} details
 * @param {Object} [meta]
 */
function formatMessage(type, actionName, details, meta = {}) {
  const timeStr = new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' });
  let badge = 'ℹ️';
  let title = 'PORTFOLIO NOTIFICATION';

  switch ((type || '').toUpperCase()) {
    case 'SUCCESS':
      badge = '🟢';
      title = 'ACTION SUCCESSFUL';
      break;
    case 'WARNING':
      badge = '⚠️';
      title = 'ACTION WARNING';
      break;
    case 'ERROR':
      badge = '🚨';
      title = 'ACTION FAILED';
      break;
    default:
      badge = 'ℹ️';
      title = 'PORTFOLIO ALERT';
      break;
  }

  let msg = `${badge} *[${title}] Zayd Portfolio*\n\n` +
    `📌 *Action*: ${actionName}\n` +
    `📝 *Details*: ${details}\n`;

  if (meta.error) {
    msg += `❌ *Error Details*: ${meta.error}\n`;
  }
  if (meta.repo) {
    msg += `📦 *Repository*: ${meta.repo}\n`;
  }

  msg += `\n⏱️ *Time*: ${timeStr}`;
  return msg;
}

/**
 * Send customized notification across available WhatsApp / Push channels
 * @param {'SUCCESS'|'WARNING'|'ERROR'} type
 * @param {string} actionName
 * @param {string} details
 * @param {Object} [meta]
 */
async function sendWhatsAppAlert(type, actionName, details, meta = {}) {
  const formattedText = formatMessage(type, actionName, details, meta);
  console.log(`\n==================================================`);
  console.log(`📱 [WhatsApp Alert Engine] (${type.toUpperCase()}) -> ${actionName}`);
  console.log(`==================================================`);
  console.log(formattedText);
  console.log(`==================================================\n`);

  let sent = false;

  // 1. Kapso WhatsApp Cloud API Delivery via Kapso SDK
  if (KAPSO_API_KEY && PHONE_NUMBER_ID) {
    try {
      const { WhatsAppClient } = require('@kapso/whatsapp-cloud-api');
      const kapsoClient = new WhatsAppClient({
        baseUrl: BASE_URL,
        kapsoApiKey: KAPSO_API_KEY
      });

      const res = await kapsoClient.messages.sendText({
        phoneNumberId: PHONE_NUMBER_ID,
        to: WHATSAPP_PHONE,
        body: formattedText
      });

      console.log('✅ Sent via Kapso AI WhatsApp SDK!', res ? JSON.stringify(res) : '');
      sent = true;
    } catch (err) {
      console.warn('⚠️ Kapso WhatsApp dispatch note:', err.message);
    }
  }

  // 2. CallMeBot WhatsApp Delivery Fallback
  if (!sent && CALLMEBOT_API_KEY) {
    try {
      const encodedText = encodeURIComponent(formattedText);
      const callMeBotPhone = process.env.CALLMEBOT_PHONE || WHATSAPP_PHONE;
      const url = `https://api.callmebot.com/whatsapp.php?phone=${callMeBotPhone}&text=${encodedText}&apikey=${CALLMEBOT_API_KEY}`;
      const res = await fetch(url);
      const resText = await res.text();
      console.log('✅ Sent via CallMeBot WhatsApp API:', resText.replace(/<[^>]*>?/gm, ''));
      sent = true;
    } catch (err) {
      console.warn('⚠️ CallMeBot error:', err.message);
    }
  }

  // 3. Pushbullet Mobile App Fallback
  if (PUSHBULLET_TOKEN) {
    try {
      await fetch('https://api.pushbullet.com/v2/pushes', {
        method: 'POST',
        headers: {
          'Access-Token': PUSHBULLET_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'note',
          title: `Zayd Portfolio [${type.toUpperCase()}]`,
          body: `${actionName}: ${details}`
        })
      });
      console.log('✅ Sent via Pushbullet Mobile Push!');
    } catch (err) {
      console.warn('⚠️ Pushbullet error:', err.message);
    }
  }

  // 4. Generate Direct WhatsApp Mobile Link
  const directLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(formattedText)}`;
  console.log(`🔗 Direct WhatsApp Link: ${directLink}`);

  // Log to audit log
  try {
    const logPath = path.join(__dirname, '..', 'logs', 'sync-audit.log');
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] [${type.toUpperCase()}] ${actionName}: ${details}\n`);
  } catch (logErr) {
    // Ignore log errors
  }

  return { success: sent, message: formattedText, directLink };
}

module.exports = {
  sendWhatsAppAlert,
  formatMessage
};
