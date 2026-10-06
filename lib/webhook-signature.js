const crypto = require("crypto");

/**
 * Verifies the HMAC-SHA256 signature of a webhook request body.
 * Accepts the signature in `x-hub-signature-256` (Meta) or `x-webhook-signature` (Kapso), with or
 * without a "sha256=" prefix.
 */
function verifySignature(rawBody, headers, secret) {
  if (!secret || !rawBody) return false;
  const provided = String(headers["x-hub-signature-256"] || headers["x-webhook-signature"] || "").replace(/^sha256=/i, "").trim();
  if (!provided) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = { verifySignature };
