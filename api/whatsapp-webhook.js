const { WhatsAppClient } = require("@kapso/whatsapp-cloud-api");
const { getKey } = require("../keys");
const { sameNumber } = require("../lib/phone");
const { verifySignature } = require("../lib/webhook-signature");
const { buildReply } = require("../lib/assistant");
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

const KAPSO_API_KEY = getKey("kapso");
let PHONE_NUMBER_ID = getKey("whatsapp_phone_id");
const VERIFY_TOKEN = getKey("whatsapp_verify");
const BASE_URL = getKey("kapso_base_url");

let kapsoClient = null;
if (KAPSO_API_KEY) {
  kapsoClient = new WhatsAppClient({
    baseUrl: BASE_URL,
    kapsoApiKey: KAPSO_API_KEY
  });
}

/** Supplies the live portfolio content (set by server.js) so replies never contain hard-coded facts. */
let portfolioProvider = () => ({});
function setPortfolioProvider(fn) {
  portfolioProvider = fn;
}

/** WhatsApp formatting: *bold* instead of **bold**, and plain links instead of [text](url). */
function toWhatsAppText(markdown) {
  return String(markdown)
    .replace(/\[([^\]]+)\]\((https?:[^)]+|mailto:[^)]+)\)/g, (m, text, url) => `${text}: ${url.replace(/^mailto:/, "")}`)
    .replace(/\*\*([^*]+)\*\*/g, "*$1*");
}

function getAIResponse(userText) {
  return toWhatsAppText(buildReply(userText, portfolioProvider()).reply);
}

/**
 * GET Webhook Verification for Kapso / Meta
 */
function handleWebhookVerification(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const isVerifiedToken = Boolean(VERIFY_TOKEN) && token === VERIFY_TOKEN;
  if (mode === "subscribe" && isVerifiedToken) {
    console.log("✅ Kapso WhatsApp Webhook Verified Successfully!");
    return res.status(200).send(challenge || "OK");
  }

  return res.status(200).json({ status: "active", service: "Portfolio WhatsApp Webhook" });
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
const WEBHOOK_SECRET = getKey("webhook_secret");
const whatsappEnabled = () => String(process.env.WHATSAPP_ENABLED || "").toLowerCase() === "true";

async function handleWebhookEvent(req, res) {
  res.status(200).json({ status: "received" });

  // WhatsApp automation is off until explicitly enabled (WHATSAPP_ENABLED=true).
  if (!whatsappEnabled()) return;

  // Only requests signed with the shared secret may act as the admin. Without a configured secret
  // nobody is treated as the admin (visitors still get auto-replies).
  const signed = verifySignature(req.rawBody, req.headers, WEBHOOK_SECRET);

  try {
    const body = req.body;
    const parsed = parseIncomingMessage(body);

    if (!parsed || !parsed.from) {
      return;
    }

    const { from: fromNumber, text: userText, phoneId } = parsed;
    const activePhoneId = PHONE_NUMBER_ID || phoneId;

    console.log(`📩 Incoming WhatsApp message from ${fromNumber}: "${userText}"`);

    const isFromAdmin = signed && isAdminNumber(fromNumber);

    // -------------------------------------------------------------
    // ADMIN ONLY COMMANDS (the owner's private number only, and only on signed requests)
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
  getAIResponse,
  setPortfolioProvider,
  toWhatsAppText
};
