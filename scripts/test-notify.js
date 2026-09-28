/**
 * Notification Test Trigger
 * Run `npm run test-notify` from terminal to verify all notification channels!
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE || '201017741741';
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY || '';
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

const sampleMsg = "🚀 Test Notification from Zayd Portfolio System!\nAll automated GitHub sync and notification channels are working properly.";

console.log("==================================================");
console.log("🔔 TESTING ALL NOTIFICATION CHANNELS FROM TERMINAL");
console.log("==================================================");

// 1. Mobile Pushbullet Notification (Android / iOS)
const PUSHBULLET_TOKEN = process.env.PUSHBULLET_TOKEN || '';
if (PUSHBULLET_TOKEN) {
  fetch('https://api.pushbullet.com/v2/pushes', {
    method: 'POST',
    headers: {
      'Access-Token': PUSHBULLET_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ type: 'note', title: 'Zayd Portfolio Alert', body: sampleMsg })
  })
  .then(res => console.log("✅ 1. Mobile Pushbullet notification sent to phone!"))
  .catch(err => console.log("❌ 1. Pushbullet notification error:", err.message));
} else {
  console.log("ℹ️ 1. Pushbullet Mobile Notification (Set PUSHBULLET_TOKEN in env for direct phone pushes).");
}

// 2. Direct WhatsApp Link
const directWhatsAppLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(sampleMsg)}`;
console.log(`✅ 2. Direct WhatsApp Link: ${directWhatsAppLink}`);

// 3. Make Webhook
if (MAKE_WEBHOOK_URL) {
  fetch(MAKE_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: sampleMsg, phone: WHATSAPP_PHONE })
  })
  .then(res => console.log("✅ 3. Make/Zapier Webhook delivered!"))
  .catch(err => console.log("❌ 3. Webhook error:", err.message));
} else {
  console.log("ℹ️ 3. Make Webhook skipped (Set MAKE_WEBHOOK_URL in environment).");
}

// 4. Telegram
if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: sampleMsg })
  })
  .then(res => console.log("✅ 4. Telegram Bot alert delivered!"))
  .catch(err => console.log("❌ 4. Telegram error:", err.message));
} else {
  console.log("ℹ️ 4. Telegram skipped (Set TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID in environment).");
}

// 5. Local Audit Log
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
const logEntry = `[${new Date().toISOString()}] TEST NOTIFICATION\n${sampleMsg}\n----------------------------------------\n`;
fs.appendFileSync(path.join(logsDir, 'sync-audit.log'), logEntry, 'utf8');
console.log("✅ 5. Logged to logs/sync-audit.log");

console.log("==================================================");
