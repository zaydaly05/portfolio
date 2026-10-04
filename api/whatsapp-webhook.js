const { WhatsAppClient } = require("@kapso/whatsapp-cloud-api");
const { handleApprovalReply } = require("./whatsapp-approval");
const {
  isAdminNumber,
  generateAISuggestion,
  executePhoneBroadcast,
  addMultiplePersonalContacts,
  getStoredPersonalContacts
} = require("./whatsapp-admin");

/**
 * Kapso WhatsApp Cloud API Webhook & AI Assistant Endpoint
 */

const KAPSO_API_KEY = process.env.KAPSO_API_KEY || process.env.WHATSAPP_TOKEN || "c676aaa27bb56c780e049a192598345c821f11647327cbecafc84686e91c9471";
let PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "597907523413541";
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

  const isVerifiedToken = token === VERIFY_TOKEN || token === "zayd_portfolio_verify_token" || token === "890b68010af2d68248e40256406ab47b35dbf4abca4a0e16f94fbb88290e1272";
  if (mode === "subscribe" && isVerifiedToken) {
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

    const isFromAdmin = isAdminNumber(fromNumber);

    // -------------------------------------------------------------
    // ADMIN ONLY COMMANDS (Zayd's Phone Number 201017741741 Only)
    // -------------------------------------------------------------
    if (isFromAdmin) {
      const lower = userText.trim().toLowerCase();

      // 1. Add Personal Phone Contacts (!addcontact <numbers>)
      if (lower.startsWith("!addcontact")) {
        const rawNumbers = userText.replace(/^!addcontact/i, "").trim();
        const added = addMultiplePersonalContacts(rawNumbers);

        if (kapsoClient && activePhoneId) {
          await kapsoClient.messages.sendText({
            phoneNumberId: activePhoneId,
            to: fromNumber,
            body: `✅ *Saved ${added.length} phone numbers to your personal contacts list!*`
          });
        }
        return;
      }

      // 2. List Personal Contacts (!listcontacts)
      if (lower === "!listcontacts") {
        const contacts = getStoredPersonalContacts();
        let msg = `📱 *SAVED PHONE CONTACTS (${contacts.length})*:\n\n`;
        if (contacts.length === 0) {
          msg += "No contacts added yet. Use `!addcontact 201017741741, 201234567890` to add numbers.";
        } else {
          msg += contacts.map((c, i) => `${i + 1}. \`+${c.phone}\``).join("\n");
        }

        if (kapsoClient && activePhoneId) {
          await kapsoClient.messages.sendText({
            phoneNumberId: activePhoneId,
            to: fromNumber,
            body: msg
          });
        }
        return;
      }

      // 3. Broadcast to Personal Contacts or Specified Phone Numbers (!broadcast <numbers | message>)
      if (lower.startsWith("!broadcast") || lower.startsWith("!sendall")) {
        const payload = userText.replace(/^(!broadcast|!sendall)/i, "").trim();
        if (!payload) {
          if (kapsoClient && activePhoneId) {
            await kapsoClient.messages.sendText({
              phoneNumberId: activePhoneId,
              to: fromNumber,
              body: "⚠️ *Usage*:\n" +
                "1. Broadcast to saved contacts: `!broadcast Hello everyone!`\n" +
                "2. Broadcast to specific phone numbers: `!broadcast 201017741741, 201234567890 | Your message here`"
            });
          }
          return;
        }

        console.log(`📢 Admin requested phone broadcast: "${payload}"`);
        const report = await executePhoneBroadcast(payload, false);

        if (kapsoClient && activePhoneId) {
          await kapsoClient.messages.sendText({
            phoneNumberId: activePhoneId,
            to: fromNumber,
            body: `✅ *BROADCAST DELIVERY REPORT*\n\n` +
              `- *Total Targets*: ${report.total}\n` +
              `- *Delivered*: ${report.successCount}\n` +
              `- *Failed*: ${report.failCount}\n\n` +
              `📱 *Recipients*: ${report.targetPhones.map(p => '+' + p).join(', ')}`
          });
        }
        return;
      }

      // 4. Send Template Message to Phone Numbers (!sendtemplate <template_name | numbers>)
      if (lower.startsWith("!sendtemplate")) {
        const payload = userText.replace(/^!sendtemplate/i, "").trim();
        const report = await executePhoneBroadcast(payload, true);

        if (kapsoClient && activePhoneId) {
          await kapsoClient.messages.sendText({
            phoneNumberId: activePhoneId,
            to: fromNumber,
            body: `📋 *TEMPLATE BROADCAST REPORT*\n\n- *Delivered*: ${report.successCount}/${report.total}`
          });
        }
        return;
      }

      // 5. AI Suggestions Command (!suggest <topic> or !ai <topic>)
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

      // 6. Check if Admin is responding to an Approval Request (1 / 2 / 3)
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
