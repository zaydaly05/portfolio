import { WhatsAppClient } from "@kapso/whatsapp-cloud-api";

/**
 * Kapso WhatsApp Client - Message Sender Script (send.ts)
 *
 * Required Environment Variables:
 * - KAPSO_API_KEY (or WHATSAPP_TOKEN): c676aaa27bb56c780e049a192598345c821f11647327cbecafc84686e91c9471
 * - WHATSAPP_PHONE_NUMBER_ID: Your WhatsApp Business Phone Number ID
 * - WHATSAPP_PHONE (or RECIPIENT_PHONE): Target phone number with country code (e.g. 201017741741)
 * - KAPSO_BASE_URL: (Optional) Base URL for Kapso proxy (default: https://api.kapso.ai/meta/whatsapp)
 */

const KAPSO_API_KEY = process.env.KAPSO_API_KEY || process.env.WHATSAPP_TOKEN || "";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
const RECIPIENT_PHONE = process.env.WHATSAPP_PHONE || process.env.RECIPIENT_PHONE || "201017741741";
const BASE_URL = process.env.KAPSO_BASE_URL || "https://api.kapso.ai/meta/whatsapp";

// Initialize the Kapso WhatsApp Client
export const kapsoClient = new WhatsAppClient({
  baseUrl: BASE_URL,
  kapsoApiKey: KAPSO_API_KEY,
  accessToken: KAPSO_API_KEY // Fallback for raw Meta API access
});

/**
 * Send a simple text message via Kapso WhatsApp Cloud API
 */
export async function sendTextMessage(to: string, messageBody: string) {
  if (!KAPSO_API_KEY) {
    throw new Error("❌ KAPSO_API_KEY is missing. Please set it in your environment or .env file.");
  }
  if (!PHONE_NUMBER_ID) {
    throw new Error("❌ WHATSAPP_PHONE_NUMBER_ID is missing. Please set it in your environment.");
  }

  console.log(`📱 Sending WhatsApp message via Kapso to ${to}...`);

  const response = await kapsoClient.messages.sendText({
    phoneNumberId: PHONE_NUMBER_ID,
    to: to.replace(/[^0-9]/g, ""),
    body: messageBody
  });

  console.log("✅ Message delivered successfully via Kapso!", response);
  return response;
}

/**
 * Send a pre-approved template message via Kapso
 */
export async function sendTemplateMessage(to: string, templateName: string, languageCode = "en_US") {
  console.log(`📋 Sending template message '${templateName}' via Kapso to ${to}...`);

  const response = await kapsoClient.messages.sendTemplate({
    phoneNumberId: PHONE_NUMBER_ID,
    to: to.replace(/[^0-9]/g, ""),
    template: {
      name: templateName,
      language: { code: languageCode }
    }
  });

  console.log("✅ Template message sent!", response);
  return response;
}

/**
 * Main Execution Block
 */
async function main() {
  console.log("==================================================");
  console.log("🚀 KAPSO WHATSAPP CLIENT SENDER (send.ts)");
  console.log("==================================================");

  try {
    const text = process.env.MSG_BODY || "🚀 Hello from Zayd's Portfolio Kapso WhatsApp Client!";
    await sendTextMessage(RECIPIENT_PHONE, text);
  } catch (error: any) {
    console.error("❌ Error sending message:", error.message || error);
    process.exit(1);
  }
}

// Run main script if executed directly
if (require.main === module) {
  main();
}
