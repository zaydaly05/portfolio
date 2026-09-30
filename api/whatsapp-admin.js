const fs = require('fs');
const path = require('path');
const { WhatsAppClient } = require('@kapso/whatsapp-cloud-api');
const { connectDB, Contact } = require('../db');

const KAPSO_API_KEY = process.env.KAPSO_API_KEY || process.env.WHATSAPP_TOKEN || 'c676aaa27bb56c780e049a192598345c821f11647327cbecafc84686e91c9471';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '1423905784128972';
const ADMIN_PHONE = (process.env.WHATSAPP_PHONE || process.env.RECIPIENT_PHONE || '201017741741').replace(/[^0-9]/g, '');
const BASE_URL = process.env.KAPSO_BASE_URL || 'https://api.kapso.ai/meta/whatsapp';

let kapsoClient = null;
if (KAPSO_API_KEY) {
  kapsoClient = new WhatsAppClient({
    baseUrl: BASE_URL,
    kapsoApiKey: KAPSO_API_KEY
  });
}

// Local store for contacts who interacted via WhatsApp
const WHATSAPP_CONTACTS_FILE = path.join(__dirname, '..', 'scratch', 'whatsapp-contacts.json');

function getStoredWhatsAppContacts() {
  try {
    if (fs.existsSync(WHATSAPP_CONTACTS_FILE)) {
      return JSON.parse(fs.readFileSync(WHATSAPP_CONTACTS_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveWhatsAppContact(phone, name = 'WhatsApp Contact') {
  if (!phone) return;
  const contacts = getStoredWhatsAppContacts();
  const clean = phone.replace(/[^0-9]/g, '');
  if (!contacts.some(c => c.phone === clean)) {
    contacts.push({ phone: clean, name, addedAt: new Date().toISOString() });
    try {
      const dir = path.dirname(WHATSAPP_CONTACTS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(WHATSAPP_CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf8');
    } catch (e) {}
  }
}

/**
 * Verify if the request comes from Zayd's admin phone number
 */
function isAdminNumber(fromNumber) {
  const clean = (fromNumber || '').replace(/[^0-9]/g, '');
  return clean === ADMIN_PHONE || ADMIN_PHONE.endsWith(clean) || clean.endsWith(ADMIN_PHONE);
}

/**
 * AI Suggestions Generator for Topics, Styling & Customization
 */
function generateAISuggestion(queryTopic) {
  const query = (queryTopic || '').toLowerCase();

  if (query.includes('style') || query.includes('color') || query.includes('design') || query.includes('theme')) {
    return "🎨 *AI Styling & UI Recommendations for Zayd's Portfolio*:\n\n" +
      "1. *Glassmorphism Dark Theme*:\n   - Background: `#0B0F19` (Deep Obsidian)\n   - Glass Card: `rgba(255, 255, 255, 0.04)` with `backdrop-filter: blur(16px)`\n   - Accent Gradient: `linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)`\n\n" +
      "2. *Typography*:\n   - Primary Font: *Outfit* or *Inter* (Google Fonts)\n   - Monospace Accent: *Fira Code* for technical snippets\n\n" +
      "3. *Micro-Animations*:\n   - Hover glow effects on project cards\n   - Smooth scroll parallax & reveal animations on sections";
  }

  if (query.includes('feature') || query.includes('customization') || query.includes('idea') || query.includes('add')) {
    return "🚀 *AI Feature & Customization Ideas*:\n\n" +
      "1. *Interactive Terminal Widget*:\n   - Let visitors run CLI commands directly on your portfolio site (e.g. `zayd --skills`, `zayd --contact`).\n\n" +
      "2. *Live WhatsApp Bot Status Badge*:\n   - Add a glowing indicator on your header: 🟢 *WhatsApp AI Agent Online*\n\n" +
      "3. *Automated PDF CV Builder*:\n   - Enable one-click LaTeX CV downloading with live dynamic sync.";
  }

  return "💡 *AI Portfolio Master Suggestions*:\n\n" +
    "🎨 *Styling*: Reply `!suggest styling` for color palettes, typography & glassmorphism tips.\n" +
    "🚀 *Features*: Reply `!suggest features` for modern interactive widgets & tools.\n" +
    "📢 *Broadcast*: Reply `!broadcast <message>` to send a template message to all contacts.\n" +
    "📊 *Stats*: Reply `!stats` to view contact count & bot analytics.";
}

/**
 * Send Broadcast Message / Template to All Contacts (Admin ONLY)
 */
async function executeBroadcast(messageOrTemplate, isTemplate = false) {
  const contacts = getStoredWhatsAppContacts();
  const targetPhones = new Set(contacts.map(c => c.phone));
  
  // Include default admin recipient
  targetPhones.add(ADMIN_PHONE);

  const total = targetPhones.size;
  console.log(`📢 [WhatsApp Admin] Starting broadcast to ${total} contacts...`);

  let successCount = 0;
  let failCount = 0;

  for (const phone of targetPhones) {
    try {
      if (isTemplate) {
        await kapsoClient.messages.sendTemplate({
          phoneNumberId: PHONE_NUMBER_ID,
          to: phone,
          template: {
            name: messageOrTemplate,
            language: { code: 'en_US' }
          }
        });
      } else {
        await kapsoClient.messages.sendText({
          phoneNumberId: PHONE_NUMBER_ID,
          to: phone,
          body: `📢 *UPDATE FROM ZAYD'S PORTFOLIO*\n\n${messageOrTemplate}`
        });
      }
      successCount++;
    } catch (e) {
      console.error(`❌ Broadcast error sending to ${phone}:`, e.message);
      failCount++;
    }
  }

  return { total, successCount, failCount };
}

module.exports = {
  isAdminNumber,
  generateAISuggestion,
  executeBroadcast,
  saveWhatsAppContact,
  getStoredWhatsAppContacts,
  ADMIN_PHONE
};
