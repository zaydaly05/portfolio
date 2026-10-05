import { WhatsAppClient } from "@kapso/whatsapp-cloud-api";
import { getKey } from "./keys";

/**
 * Kapso WhatsApp Client - Message Sender Script (send.ts)
 *
 * All API Keys and credentials loaded centrally via keys.js:
 * - KAPSO_API_KEY
 * - WHATSAPP_PHONE_NUMBER_ID
 * - WHATSAPP_PHONE
 * - KAPSO_BASE_URL
 */

const KAPSO_API_KEY = getKey("kapso");
const PHONE_NUMBER_ID = getKey("whatsapp_phone_id");
const RECIPIENT_PHONE = getKey("whatsapp_phone");
const BASE_URL = getKey("kapso_base_url");

// Initialize the Kapso WhatsApp Client
export const kapsoClient = new WhatsAppClient({
  baseUrl: BASE_URL,
  kapsoApiKey: KAPSO_API_KEY
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
export async function sendTemplateMessage(to: string, templateName: string, languageCode = "en_US", components: any[] = []) {
  console.log(`📋 Sending template message '${templateName}' via Kapso to ${to}...`);

  const response = await kapsoClient.messages.sendTemplate({
    phoneNumberId: PHONE_NUMBER_ID,
    to: to.replace(/[^0-9]/g, ""),
    template: {
      name: templateName,
      language: { code: languageCode },
      components: components.length > 0 ? components : undefined
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
    await sendTemplateMessage(RECIPIENT_PHONE, "portfolio_published_alert", "en_US");
  } catch (error: any) {
    console.error("❌ Error sending message:", error.message || error);
    process.exit(1);
  }
}

// Run main script if executed directly
if (require.main === module) {
  main();
}
