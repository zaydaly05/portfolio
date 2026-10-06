/**
 * Outgoing WhatsApp messages to the owner (via Kapso). Nothing here ever throws: callers get
 * `{ sent, reason }` so a WhatsApp problem can never break a save, a sync or a build.
 *
 * Off unless WHATSAPP_ENABLED=true and the Kapso credentials + the owner's number are configured.
 * Note: WhatsApp only allows free-form messages within 24 hours of the owner's last message to the
 * business number. Outside that window use an approved template (WHATSAPP_APPROVAL_TEMPLATE).
 */
const { getKey } = require("../keys");
const { digits } = require("./phone");

function createWhatsApp({ client, phoneNumberId, ownerPhone, enabled, approvalTemplate, templateLanguage } = {}) {
  const isOn = () => (typeof enabled === "function" ? enabled() : Boolean(enabled));
  const ready = () => isOn() && Boolean(client) && Boolean(phoneNumberId) && digits(ownerPhone).length >= 9;

  async function attempt(fn) {
    if (!isOn()) return { sent: false, reason: "WhatsApp is disabled (set WHATSAPP_ENABLED=true)." };
    if (!ready()) return { sent: false, reason: "WhatsApp is not fully configured (Kapso key, phone number id and owner number)." };
    try {
      await fn();
      return { sent: true };
    } catch (err) {
      return { sent: false, reason: err && err.message ? err.message : String(err) };
    }
  }

  const to = () => digits(ownerPhone);

  const sendText = (body) => attempt(() => client.messages.sendText({ phoneNumberId, to: to(), body }));

  const sendDocument = ({ link, filename, caption }) =>
    attempt(() => client.messages.sendDocument({ phoneNumberId, to: to(), document: { link, filename, caption } }));

  const sendTemplate = (name, parameters, language = templateLanguage || "en_US") =>
    attempt(() =>
      client.messages.sendTemplate({
        phoneNumberId,
        to: to(),
        template: {
          name,
          language: { code: language },
          components: [{ type: "body", parameters: parameters.map((text) => ({ type: "text", text: oneLine(text) })) }]
        }
      })
    );

  /**
   * Asks the owner for a decision. Prefers the approved template (works outside the 24-hour window)
   * and falls back to a normal message.
   */
  async function sendApprovalRequest({ code, summary, longText }) {
    if (approvalTemplate) {
      const viaTemplate = await sendTemplate(approvalTemplate, [code, summary]);
      if (viaTemplate.sent) return viaTemplate;
    }
    return sendText(longText);
  }

  return { enabled: isOn, ready, sendText, sendDocument, sendTemplate, sendApprovalRequest };
}

/** WhatsApp template parameters cannot contain line breaks or long runs of spaces. */
const oneLine = (text) => String(text ?? "").replace(/\s*[\r\n\t]+\s*/g, " | ").replace(/ {2,}/g, " ").slice(0, 900);

/** The real instance, built from environment configuration. */
function createDefaultWhatsApp() {
  let client = null;
  const apiKey = getKey("kapso");
  if (apiKey) {
    try {
      const { WhatsAppClient } = require("@kapso/whatsapp-cloud-api");
      client = new WhatsAppClient({ baseUrl: getKey("kapso_base_url"), kapsoApiKey: apiKey });
    } catch {
      client = null;
    }
  }
  return createWhatsApp({
    client,
    phoneNumberId: getKey("whatsapp_phone_id"),
    ownerPhone: getKey("whatsapp_phone"),
    enabled: () => String(process.env.WHATSAPP_ENABLED || "").toLowerCase() === "true",
    approvalTemplate: process.env.WHATSAPP_APPROVAL_TEMPLATE || "",
    templateLanguage: process.env.WHATSAPP_APPROVAL_TEMPLATE_LANG || "en_US"
  });
}

/** Public base URL of the site (for links sent over WhatsApp). */
function siteUrl() {
  const explicit = process.env.PUBLIC_SITE_URL || process.env.PORTFOLIO_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "";
}

module.exports = { createWhatsApp, createDefaultWhatsApp, siteUrl, oneLine };
