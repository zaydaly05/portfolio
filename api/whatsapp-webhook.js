const { WhatsAppClient } = require("@kapso/whatsapp-cloud-api");
const { handleApprovalReply } = require("./whatsapp-approval");
const { isAdminNumber, generateAISuggestion, executeBroadcast, saveWhatsAppContact, getStoredWhatsAppContacts } = require("./whatsapp-admin");

/**
 * Kapso WhatsApp Cloud API Webhook & AI Assistant Endpoint
 */

const KAPSO_API_KEY = process.env.KAPSO_API_KEY || process.env.WHATSAPP_TOKEN || "c676aaa27bb56c780e049a192598345c821f11647327cbecafc84686e91c9471";
let PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1423905784128972";
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "zayd_portfolio_verify_token";
const BASE_URL = process.env.KAPSO_BASE_URL || "https://api.kapso.ai/meta/whatsapp";

let kapsoClient = null;
if (KAPSO_API_KEY) {
  kapsoClient = new WhatsAppClient({
    baseUrl: BASE_URL,
    kapsoApiKey: KAPSO_API_KEY
  });
}

/**
 * Simple Portfolio Knowledge Base for AI Auto-Responder
 */
function getAIResponse(userText) {
  const query = (userText || "").toLowerCase();

  if (query.includes("project") || query.includes("work") || query.includes("portfolio")) {
    return "🚀 *Zayd's Featured Projects*:\n\n1. *AI Automation & Web Scraping Suite* - Enterprise data extraction\n2. *Dynamic Portfolio & Admin Dashboard* - Modern Node.js + MongoDB stack\n3. *WhatsApp AI Agent* - Automated messaging via Kapso Cloud API\n\nVisit: https://zayd05.vercel.app/projects for details!";
  }

  if (query.includes("skill") || query.includes("stack") || query.includes("tech")) {
    return "💡 *Zayd's Core Skills*:\n- *Languages*: JavaScript / TypeScript, Python, HTML/CSS\n- *Backend*: Node.js, Express, MongoDB, REST APIs\n- *AI & Automation*: Agentic Coding, Kapso WhatsApp Cloud API, Web Scraping\n- *Tools*: Git, Vercel, Docker, Playwright";
  }

  if (query.includes("experience") || query.includes("bio") || query.includes("about") || query.includes("who")) {
    return "👨‍💻 *About Zayd Ali Mohamed*:\nFull Stack & AI Engineer specialized in building modern web apps, intelligent automation tools, and scalable cloud solutions.";
  }

  if (query.includes("contact") || query.includes("email") || query.includes("hire") || query.includes("book") || query.includes("call")) {
    return "📬 *Get in Touch with Zayd*:\n- *Email*: zayd@example.com\n- *LinkedIn*: https://linkedin.com/in/zaydali\n- *GitHub*: https://github.com/zaydali\n\nOr leave your name and project details right here in WhatsApp!";
  }

  return "👋 *Hi! I am Zayd's AI Assistant on WhatsApp.*\n\nYou can ask me about:\n- 🚀 *Projects*\n- 💡 *Skills & Tech Stack*\n- 👨‍💻 *Experience*\n- 📬 *Contact & Booking*\n\nHow can I help you today?";
}

/**
 * GET Webhook Verification for Kapso / Meta
 */
function handleWebhookVerification(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if ((mode === "subscribe" && token === VERIFY_TOKEN) || req.query["verify"] === VERIFY_TOKEN) {
    console.log("✅ Kapso WhatsApp Webhook Verified Successfully!");
    return res.status(200).send(challenge || "OK");
  }

  return res.status(200).json({ status: "active", service: "Zayd Portfolio WhatsApp Webhook" });
}

/**
 * Helper to parse incoming message payload from Meta or Kapso v2
 */
function parseIncomingMessage(body) {
  if (!body) return null;

  // 1. Standard Meta Cloud API Payload
  if (body.object === "whatsapp_business_account") {
    const value = body.entry?.[0]?.changes?.[0]?.value;
    const msg = value?.messages?.[0];
    if (!msg) return null;

    const phoneId = value?.metadata?.phone_number_id;
    const from = msg.from;
    let text = "";

    if (msg.type === "text") {
      text = msg.text?.body || "";
    } else if (msg.type === "interactive") {
      text = msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || "";
    }

    return { from, text, phoneId };
  }

  // 2. Kapso Native v2 Payload
  if (body.event === "message.received" || body.type === "message" || body.data) {
    const data = body.data || body;
    const from = data.from || data.phone_number || data.sender;
    const phoneId = data.phone_number_id || data.metadata?.phone_number_id;
    const text = data.message?.text?.body || data.text || data.body || data.message?.body || "";

    if (from) {
      return { from, text, phoneId };
    }
  }

  return null;
}

/**
 * POST Webhook Handler for Incoming WhatsApp Messages
 */
async function handleWebhookEvent(req, res) {
  // Always return 200 OK immediately
  res.status(200).json({ status: "received" });

  try {
    const body = req.body;
    const parsed = parseIncomingMessage(body);

    if (!parsed || !parsed.from) {
      return;
    }

    const { from: fromNumber, text: userText, phoneId } = parsed;
    const activePhoneId = PHONE_NUMBER_ID || phoneId;

    console.log(`📩 Incoming WhatsApp message from ${fromNumber}: "${userText}"`);

    // Auto-save contact for future broadcasts
    saveWhatsAppContact(fromNumber);

    const isFromAdmin = isAdminNumber(fromNumber);

    // -------------------------------------------------------------
    // ADMIN ONLY COMMANDS (Zayd's Phone Number 201017741741 Only)
    // -------------------------------------------------------------
    if (isFromAdmin) {
      const lower = userText.trim().toLowerCase();

      // 1. Admin Broadcast Command (!broadcast <message> or !sendall <message>)
      if (lower.startsWith("!broadcast") || lower.startsWith("!sendall")) {
        const msgToSend = userText.replace(/^(!broadcast|!sendall)/i, "").trim();
        if (!msgToSend) {
          if (kapsoClient && activePhoneId) {
            await kapsoClient.messages.sendText({
              phoneNumberId: activePhoneId,
              to: fromNumber,
              body: "⚠️ *Usage*: `!broadcast <Your message to all contacts>`"
            });
          }
          return;
        }

        console.log(`📢 Admin requested broadcast: "${msgToSend}"`);
        const report = await executeBroadcast(msgToSend);

        if (kapsoClient && activePhoneId) {
          await kapsoClient.messages.sendText({
            phoneNumberId: activePhoneId,
            to: fromNumber,
            body: `✅ *BROADCAST REPORT*\n\n- *Total Contacts*: ${report.total}\n- *Delivered*: ${report.successCount}\n- *Failed*: ${report.failCount}`
          });
        }
        return;
      }

      // 2. Admin AI Suggestions Command (!suggest <topic> or !ai <topic>)
      if (lower.startsWith("!suggest") || lower.startsWith("!ai")) {
        const topic = userText.replace(/^(!suggest|!ai)/i, "").trim();
        const suggestion = generateAISuggestion(topic);

        if (kapsoClient && activePhoneId) {
          await kapsoClient.messages.sendText({
            phoneNumberId: activePhoneId,
            to: fromNumber,
            body: suggestion
          });
        }
        return;
      }

      // 3. Admin Stats Command (!stats)
      if (lower === "!stats") {
        const contacts = getStoredWhatsAppContacts();
        const statsMsg = `📊 *PORTFOLIO BOT STATS*\n\n` +
          `👥 *Saved Contacts*: ${contacts.length}\n` +
          `🟢 *Status*: Live on Vercel\n` +
          `🔐 *Admin Phone*: Verified (${fromNumber})\n\n` +
          `*Admin Commands*:\n` +
          `- \`!broadcast <message>\` (Send message to all contacts)\n` +
          `- \`!suggest styling\` (Get AI design & styling tips)\n` +
          `- \`!suggest features\` (Get portfolio feature ideas)`;

        if (kapsoClient && activePhoneId) {
          await kapsoClient.messages.sendText({
            phoneNumberId: activePhoneId,
            to: fromNumber,
            body: statsMsg
          });
        }
        return;
      }

      // 4. Check if Admin is responding to an Approval Request (1 / 2 / 3)
      const approvalOutcome = handleApprovalReply(fromNumber, userText);
      if (approvalOutcome) {
        const { result } = approvalOutcome;
        let replyMsg = "";

        if (result.action === "APPROVE") {
          replyMsg = "✅ *Action Approved!* Proceeding with the modification now... 🚀";
        } else if (result.action === "REJECT") {
          replyMsg = "🔴 *Action Rejected.* Modification cancelled & ignored.";
        } else if (result.action === "MODIFY") {
          replyMsg = `✏️ *Edit Requested*: "${result.instructions}". Applying changes... 🛠️`;
        }

        if (kapsoClient && activePhoneId) {
          await kapsoClient.messages.sendText({
            phoneNumberId: activePhoneId,
            to: fromNumber,
            body: replyMsg
          });
        }
        return;
      }
    }

    // -------------------------------------------------------------
    // STANDARD USER AUTO-REPLY (For all visitors/users)
    // -------------------------------------------------------------
    const botReply = getAIResponse(userText);

    if (kapsoClient && activePhoneId) {
      console.log(`📤 Sending auto-reply via Kapso to ${fromNumber}...`);
      await kapsoClient.messages.sendText({
        phoneNumberId: activePhoneId,
        to: fromNumber,
        body: botReply
      });
      console.log("✅ Auto-reply delivered via Kapso!");
    }
  } catch (error) {
    console.error("❌ Error processing WhatsApp webhook event:", error.message || error);
  }
}

module.exports = {
  handleWebhookVerification,
  handleWebhookEvent,
  getAIResponse
};
