const { WhatsAppClient } = require("@kapso/whatsapp-cloud-api");

/**
 * Kapso WhatsApp Cloud API Webhook & AI Assistant Endpoint
 */

const KAPSO_API_KEY = process.env.KAPSO_API_KEY || process.env.WHATSAPP_TOKEN || "c676aaa27bb56c780e049a192598345c821f11647327cbecafc84686e91c9471";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
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
    return "🚀 *Zayd's Featured Projects*:\n\n1. *AI Automation & Web Scraping Suite* - Enterprise data extraction\n2. *Dynamic Portfolio & Admin Dashboard* - Modern Node.js + MongoDB stack\n3. *WhatsApp AI Agent* - Automated messaging via Kapso Cloud API\n\nVisit: https://zayd-portfolio.vercel.app/projects for details!";
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

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Kapso WhatsApp Webhook Verified Successfully!");
    return res.status(200).send(challenge);
  }

  console.warn("⚠️ Kapso WhatsApp Webhook Verification Failed. Invalid Token.");
  return res.status(403).json({ error: "Verification token mismatch" });
}

/**
 * POST Webhook Handler for Incoming WhatsApp Messages
 */
async function handleWebhookEvent(req, res) {
  // Always return 200 OK quickly to avoid webhook timeout retries
  res.status(200).json({ status: "received" });

  try {
    const body = req.body;
    if (!body || body.object !== "whatsapp_business_account") {
      return;
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      return;
    }

    const message = messages[0];
    const fromNumber = message.from; // Sender phone number
    const messageType = message.type;

    let userText = "";
    if (messageType === "text") {
      userText = message.text?.body || "";
    } else if (messageType === "interactive") {
      userText = message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || "";
    }

    console.log(`📩 Incoming WhatsApp from ${fromNumber}: "${userText}"`);

    // Generate AI Auto-Reply
    const botReply = getAIResponse(userText);

    // Send reply via Kapso Cloud API if credentials are configured
    if (kapsoClient && PHONE_NUMBER_ID) {
      console.log(`📤 Sending AI reply via Kapso to ${fromNumber}...`);
      await kapsoClient.messages.sendText({
        phoneNumberId: PHONE_NUMBER_ID,
        to: fromNumber,
        body: botReply
      });
      console.log("✅ Auto-reply delivered via Kapso!");
    } else {
      console.log("ℹ️ KAPSO_API_KEY or WHATSAPP_PHONE_NUMBER_ID not set. Reply logged locally:\n", botReply);
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
