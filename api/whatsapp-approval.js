const fs = require('fs');
const path = require('path');
const { WhatsAppClient } = require('@kapso/whatsapp-cloud-api');

const KAPSO_API_KEY = process.env.KAPSO_API_KEY || process.env.WHATSAPP_TOKEN || 'c676aaa27bb56c780e049a192598345c821f11647327cbecafc84686e91c9471';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '597907523413541';
const ADMIN_PHONE = (process.env.WHATSAPP_PHONE || process.env.RECIPIENT_PHONE || '201017741741').replace(/[^0-9]/g, '');
const BASE_URL = process.env.KAPSO_BASE_URL || 'https://api.kapso.ai/meta/whatsapp';

let kapsoClient = null;
if (KAPSO_API_KEY) {
  kapsoClient = new WhatsAppClient({
    baseUrl: BASE_URL,
    kapsoApiKey: KAPSO_API_KEY
  });
}

// In-Memory store for active approval requests
const pendingApprovals = new Map();

/**
 * Request Human Approval via WhatsApp
 * @param {string} actionName - Short name of the action (e.g. "Portfolio Auto-Sync")
 * @param {string} description - Details of proposed changes
 * @param {number} timeoutMs - Max wait time in ms (default: 5 minutes)
 * @returns {Promise<{ approved: boolean, action: 'APPROVE'|'REJECT'|'MODIFY', instructions?: string }>}
 */
async function requestWhatsAppApproval(actionName, description, timeoutMs = 300000) {
  const requestId = 'req_' + Date.now();
  console.log(`\n⏳ [WhatsApp Approval Engine] Creating approval request ${requestId}: "${actionName}"`);

  let resolvePromise;
  let timerId;

  const approvalPromise = new Promise((resolve) => {
    resolvePromise = resolve;
  });

  const requestObject = {
    id: requestId,
    actionName,
    description,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    resolve: resolvePromise
  };

  pendingApprovals.set(requestId, requestObject);
  // Also store as latest active request for simple quick-replies
  pendingApprovals.set('latest', requestObject);

  // Formulate WhatsApp message with clear instructions & buttons
  const approvalMsg = `🔔 *APPROVAL REQUIRED FOR AUTOMATION*\n\n` +
    `📌 *Action*: ${actionName}\n` +
    `📝 *Details*: ${description}\n\n` +
    `Reply to this message with one of the options below:\n\n` +
    `1️⃣ Reply *1* or *APPROVE* to proceed.\n` +
    `2️⃣ Reply *2* or *MODIFY: <your notes>* to edit.\n` +
    `3️⃣ Reply *3* or *REJECT* to ignore & cancel.\n\n` +
    `⏱️ *Request ID*: \`${requestId}\``;

  if (kapsoClient && PHONE_NUMBER_ID) {
    try {
      console.log(`📤 Sending WhatsApp approval request to ${ADMIN_PHONE}...`);
      await kapsoClient.messages.sendText({
        phoneNumberId: PHONE_NUMBER_ID,
        to: ADMIN_PHONE,
        body: approvalMsg
      });
      console.log('✅ Approval notification delivered via Kapso WhatsApp!');
    } catch (err) {
      console.error('❌ Failed to send WhatsApp approval message:', err.message);
    }
  } else {
    console.log('ℹ️ KAPSO_API_KEY/PHONE_NUMBER_ID missing. Simulated message:\n', approvalMsg);
  }

  // Set timeout fallback
  timerId = setTimeout(() => {
    if (pendingApprovals.has(requestId)) {
      console.warn(`⏰ Approval request ${requestId} timed out after ${timeoutMs / 1000}s.`);
      pendingApprovals.delete(requestId);
      if (pendingApprovals.get('latest')?.id === requestId) {
        pendingApprovals.delete('latest');
      }
      resolvePromise({ approved: false, action: 'TIMEOUT', instructions: 'Request timed out' });
    }
  }, timeoutMs);

  requestObject.timerId = timerId;

  return approvalPromise;
}

/**
 * Handle incoming response from Admin on WhatsApp
 */
function handleApprovalReply(fromPhone, text) {
  const cleanPhone = (fromPhone || '').replace(/[^0-9]/g, '');
  const lowerText = (text || '').trim().toLowerCase();

  // Verify response is from Admin phone number
  if (ADMIN_PHONE && cleanPhone !== ADMIN_PHONE && !ADMIN_PHONE.endsWith(cleanPhone)) {
    return null; // Not from admin
  }

  const latestReq = pendingApprovals.get('latest');
  if (!latestReq || latestReq.status !== 'PENDING') {
    return null; // No pending request waiting
  }

  let result = null;

  if (lowerText === '1' || lowerText === 'approve' || lowerText === 'proceed' || lowerText === 'yes' || lowerText === 'ok') {
    result = { approved: true, action: 'APPROVE' };
  } else if (lowerText === '3' || lowerText === 'reject' || lowerText === 'ignore' || lowerText === 'cancel' || lowerText === 'no') {
    result = { approved: false, action: 'REJECT' };
  } else if (lowerText === '2' || lowerText.startsWith('modify') || lowerText.startsWith('edit')) {
    const customNotes = text.replace(/^(2|modify:|edit:)/i, '').trim() || 'Modification requested by user';
    result = { approved: false, action: 'MODIFY', instructions: customNotes };
  }

  if (result) {
    clearTimeout(latestReq.timerId);
    latestReq.status = result.action;
    pendingApprovals.delete(latestReq.id);
    pendingApprovals.delete('latest');

    // Resolve background process
    latestReq.resolve(result);
    return { reqId: latestReq.id, result };
  }

  return null;
}

module.exports = {
  requestWhatsAppApproval,
  handleApprovalReply,
  pendingApprovals,
  ADMIN_PHONE
};
