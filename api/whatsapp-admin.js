const { WhatsAppClient } = require('@kapso/whatsapp-cloud-api');
const { getKey } = require('../keys');
const { sameNumber } = require('../lib/phone');

const KAPSO_API_KEY = getKey('kapso');
const PHONE_NUMBER_ID = getKey('whatsapp_phone_id');
const ADMIN_PHONE = getKey('whatsapp_phone').replace(/[^0-9]/g, '');
const BASE_URL = getKey('kapso_base_url');

let kapsoClient = null;
if (KAPSO_API_KEY) {
  kapsoClient = new WhatsAppClient({
    baseUrl: BASE_URL,
    kapsoApiKey: KAPSO_API_KEY
  });
}

// The owner's phone contacts live in the contacts vault (database), set by server.js.
let vault = null;
function setContactVault(instance) {
  vault = instance;
}

/** Active contacts as [{ phone, name }]. */
async function getStoredPersonalContacts() {
  return vault ? vault.activeContacts() : [];
}

/** Adds one number (restores it from the trash if needed). Returns false when it is not a valid number. */
async function savePersonalContact(phone, name = '') {
  if (!vault || !phone) return false;
  return (await vault.add({ phone, name }, 'whatsapp')).ok;
}

/** Adds every number found in the text; returns the numbers that were saved. */
async function addMultiplePersonalContacts(phoneListStr) {
  if (!vault) return [];
  const result = await vault.importText(phoneListStr || '', 'whatsapp');
  return result.numbers;
}

/**
 * Verify if the request comes from the owner's private (admin) phone number
 */
function isAdminNumber(fromNumber) {
  return sameNumber(fromNumber, ADMIN_PHONE);
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
    "📢 *Broadcast*: Reply `!broadcast <numbers> \| <message>` to send to specific phone numbers.\n" +
    "➕ *Add Contacts*: Reply `!addcontact 201017741741, 201234567890` to save phone contacts.";
}

/**
 * Send Broadcast Text / Template Message to specified numbers or saved personal contacts
 */
async function executePhoneBroadcast(inputPayload, isTemplate = false) {
  let targetPhones = [];
  let messageOrTemplateName = '';

  // Check if payload contains phone numbers separated by '|'
  if (inputPayload.includes('|')) {
    const parts = inputPayload.split('|');
    const numbersRaw = parts[0].trim();
    messageOrTemplateName = parts.slice(1).join('|').trim();

    targetPhones = numbersRaw.split(/[,; \n]+/).map(n => n.replace(/[^0-9]/g, '')).filter(Boolean);
  } else {
    // Default to stored personal phone contacts + admin phone
    const saved = await getStoredPersonalContacts();
    targetPhones = saved.map(c => c.phone);
    if (!targetPhones.includes(ADMIN_PHONE)) targetPhones.push(ADMIN_PHONE);
    messageOrTemplateName = inputPayload.trim();
  }

  // Remove duplicates
  targetPhones = Array.from(new Set(targetPhones));

  const total = targetPhones.length;
  console.log(`📢 [WhatsApp Admin] Sending broadcast to ${total} target phone numbers...`);

  let successCount = 0;
  let failCount = 0;

  for (const phone of targetPhones) {
    try {
      if (isTemplate) {
        await kapsoClient.messages.sendTemplate({
          phoneNumberId: PHONE_NUMBER_ID,
          to: phone,
          template: {
            name: messageOrTemplateName,
            language: { code: 'en_US' }
          }
        });
      } else {
        await kapsoClient.messages.sendText({
          phoneNumberId: PHONE_NUMBER_ID,
          to: phone,
          body: messageOrTemplateName
        });
      }
      successCount++;
    } catch (e) {
      console.error(`❌ Broadcast error sending to ${phone}:`, e.message);
      failCount++;
    }
  }

  return { total, successCount, failCount, targetPhones };
}

module.exports = {
  isAdminNumber,
  generateAISuggestion,
  executePhoneBroadcast,
  addMultiplePersonalContacts,
  savePersonalContact,
  getStoredPersonalContacts,
  setContactVault,
  ADMIN_PHONE
};
