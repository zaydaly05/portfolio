const { WhatsAppClient } = require("@kapso/whatsapp-cloud-api");
const { getKey } = require("../keys");
const { verifySignature } = require("./webhook-signature");
const { buildReply } = require("./assistant");
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

/** Answers owner replies about pending changes (set by server.js). Returns reply text or null. */
let ownerReplyHandler = async () => null;
function setOwnerReplyHandler(fn) {
  ownerReplyHandler = fn;
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

/** Sent / delivered / read / failed / conversation events are not messages from a person. */
const NON_INBOUND_EVENT = /(sent|deliver|read|fail|status|conversation|contact|thread|standby|preference)/i;

/**
 * Pulls the genuine incoming text messages out of a webhook delivery.
 * Understands Meta's own shape, Kapso v2 events and Kapso batches (several messages in one delivery).
 * Anything that is not an inbound message from a person (statuses, our own sends, echoes) is skipped,
 * so the bot can never answer itself.
 */
function extractInboundMessages(body, headers = {}) {
  if (!body || typeof body !== "object") return [];

  const eventName = String(headers["x-webhook-event"] || body.event || body.type || "");
  if (eventName && NON_INBOUND_EVENT.test(eventName) && !/received|inbound/i.test(eventName)) return [];

  const out = [];
  const textOf = (msg) => {
    if (!msg) return "";
    if (msg.type === "interactive") return msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || "";
    return msg.text?.body || (typeof msg.text === "string" ? msg.text : "") || msg.body || msg.content || "";
  };

  // Meta Cloud API shape: entry[].changes[].value.messages[]
  const metaEntries = body.object === "whatsapp_business_account" ? body.entry || [] : [];
  metaEntries.forEach((entry) =>
    (entry.changes || []).forEach((change) => {
      const value = change.value || {};
      (value.messages || []).forEach((msg) => {
        out.push({ from: msg.from, text: textOf(msg), phoneId: value.metadata?.phone_number_id });
      });
    })
  );
  if (out.length || metaEntries.length) return out.filter((m) => m.from && String(m.text).trim());

  // Kapso v2: one event, or a batch whose `data` is a list of events
  const items = Array.isArray(body.data) ? body.data : body.data && typeof body.data === "object" ? [body.data] : [body];
  items.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const msg = item.message && typeof item.message === "object" ? item.message : item;
    const direction = String(msg.kapso?.direction || item.kapso?.direction || msg.direction || item.direction || "").toLowerCase();
    if (direction === "outbound") return;
    if (msg.kapso?.source === "smb_message_echo") return;
    if (!direction && !msg.from && !item.conversation && !item.phone_number) return; // not a message at all
    const from = msg.from || item.conversation?.phone_number || item.phone_number || item.sender;
    const phoneId = item.phone_number_id || item.conversation?.phone_number_id || msg.phone_number_id || item.metadata?.phone_number_id;
    out.push({ from, text: textOf(msg) || textOf(item), phoneId });
  });

  return out.filter((m) => m.from && String(m.text).trim());
}

/**
 * POST Webhook Handler for Incoming WhatsApp Messages
 */
const WEBHOOK_SECRET = getKey("webhook_secret");
const whatsappEnabled = () => String(process.env.WHATSAPP_ENABLED || "").toLowerCase() === "true";

/** Handles one inbound text message (owner commands on signed requests, auto-replies for everyone else). */
async function processMessage(parsed, signed) {
  try {
    const fromNumber = String(parsed.from).replace(/\D/g, "");
    const userText = String(parsed.text || "");
    const phoneId = parsed.phoneId;
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
        const added = await addMultiplePersonalContacts(rawNumbers);

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
        const contacts = await getStoredPersonalContacts();
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
        if (report.disabled) {
          if (kapsoClient && activePhoneId) {
            await kapsoClient.messages.sendText({ phoneNumberId: activePhoneId, to: fromNumber, body: "Bulk sending from the server is off. Send the monthly broadcast from Kapso." });
          }
          return;
        }

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
        if (report.disabled) {
          if (kapsoClient && activePhoneId) {
            await kapsoClient.messages.sendText({ phoneNumberId: activePhoneId, to: fromNumber, body: "Bulk sending from the server is off. Send the monthly broadcast from Kapso." });
          }
          return;
        }

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

      // 5b. Reply about a pending portfolio change (approve / modify / reject), stored in the database
      const changeReply = await ownerReplyHandler(userText);
      if (changeReply) {
        if (kapsoClient && activePhoneId) {
          await kapsoClient.messages.sendText({ phoneNumberId: activePhoneId, to: fromNumber, body: changeReply });
        }
        return;
      }

      // 6. Check if Admin is responding to an in-memory Approval Request (1 / 2 / 3)
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

async function handleWebhookEvent(req, res) {
  try {
    // WhatsApp automation is off until explicitly enabled (WHATSAPP_ENABLED=true).
    if (whatsappEnabled()) {
      // Only requests signed with the shared secret may act as the admin. Without a configured secret
      // nobody is treated as the admin (visitors still get auto-replies).
      const signed = verifySignature(req.rawBody, req.headers, WEBHOOK_SECRET);
      const messages = extractInboundMessages(req.body, req.headers);
      if (!messages.length && req.body && typeof req.body === "object") {
        console.log("WhatsApp webhook: no inbound message in this delivery (keys:", Object.keys(req.body).join(", "), ")");
      }
      // Finish the work before answering: serverless functions can be frozen right after the response.
      for (const message of messages) await processMessage(message, signed);
    }
  } catch (error) {
    console.error("❌ WhatsApp webhook failed:", error.message || error);
  } finally {
    if (!res.headersSent) res.status(200).json({ status: "received" });
  }
}

/** Lets tests observe outgoing replies. */
function setKapsoClientForTests(client) {
  kapsoClient = client;
}

module.exports = {
  extractInboundMessages,
  setKapsoClientForTests,
  handleWebhookVerification,
  handleWebhookEvent,
  getAIResponse,
  setPortfolioProvider,
  setOwnerReplyHandler,
  toWhatsAppText
};
