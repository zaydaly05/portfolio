// Which webhook deliveries count as incoming messages, and that the bot never answers itself.
const test = require("node:test");
const assert = require("node:assert/strict");

process.env.WHATSAPP_ENABLED = "true";
process.env.KAPSO_WEBHOOK_SECRET = "test-secret-0123456789";
process.env.WHATSAPP_PHONE = "201017741741";
delete process.env.WHATSAPP_PHONE_NUMBER_ID;

const hook = require("../lib/whatsapp-webhook");
const { extractInboundMessages } = hook;

const inbound = (extra = {}) => ({
  message: { id: "m1", from: "201234567890", type: "text", text: { body: "hello there" }, kapso: { direction: "inbound" } },
  conversation: { phone_number: "+201234567890" },
  phone_number_id: "PNID",
  ...extra
});

test("Meta-shaped inbound messages are read", () => {
  const body = { object: "whatsapp_business_account", entry: [{ changes: [{ value: { metadata: { phone_number_id: "PNID" }, messages: [{ from: "201234567890", type: "text", text: { body: "hi" } }] } }] }] };
  assert.deepEqual(extractInboundMessages(body), [{ from: "201234567890", text: "hi", phoneId: "PNID" }]);
});

test("a Meta status-only delivery is not a message", () => {
  const body = { object: "whatsapp_business_account", entry: [{ changes: [{ value: { statuses: [{ id: "x", status: "delivered" }] } }] }] };
  assert.deepEqual(extractInboundMessages(body), []);
});

test("Kapso v2: a received event is read, from the conversation number when needed", () => {
  const body = inbound();
  assert.deepEqual(extractInboundMessages(body, { "x-webhook-event": "whatsapp.message.received" }), [{ from: "201234567890", text: "hello there", phoneId: "PNID" }]);
  const noFrom = inbound();
  delete noFrom.message.from;
  assert.equal(extractInboundMessages(noFrom, { "x-webhook-event": "whatsapp.message.received" })[0].from, "+201234567890");
});

test("Kapso batches deliver several messages at once", () => {
  const body = { batch: true, data: [inbound(), inbound({ message: { id: "m2", from: "201111111111", type: "text", text: { body: "second" }, kapso: { direction: "inbound" } } })], batch_info: { size: 2 } };
  const out = extractInboundMessages(body, { "x-webhook-event": "whatsapp.message.received" });
  assert.deepEqual(out.map((m) => m.text), ["hello there", "second"]);
});

test("sent, delivered, read and failed events never produce a reply", () => {
  for (const event of ["whatsapp.message.sent", "whatsapp.message.delivered", "whatsapp.message.read", "whatsapp.message.failed", "whatsapp.conversation.ended"]) {
    assert.deepEqual(extractInboundMessages(inbound(), { "x-webhook-event": event }), [], event);
  }
});

test("our own outbound messages and SMB echoes are ignored even without an event header", () => {
  const outbound = inbound();
  outbound.message.kapso.direction = "outbound";
  assert.deepEqual(extractInboundMessages(outbound), []);
  const echo = inbound();
  echo.message.kapso = { direction: "inbound", source: "smb_message_echo" };
  assert.deepEqual(extractInboundMessages(echo), []);
});

test("empty text (images, reactions) and junk bodies are ignored", () => {
  const media = inbound();
  media.message = { id: "m3", from: "201234567890", type: "image", kapso: { direction: "inbound" } };
  assert.deepEqual(extractInboundMessages(media), []);
  assert.deepEqual(extractInboundMessages(null), []);
  assert.deepEqual(extractInboundMessages("nope"), []);
  assert.deepEqual(extractInboundMessages({}), []);
});

test("the handler answers only after the replies were sent, and answers 200 even when sending fails", async () => {
  const sent = [];
  hook.setKapsoClientForTests({ messages: { sendText: async (m) => { await new Promise((r) => setTimeout(r, 30)); sent.push(m); } } });
  hook.setPortfolioProvider(() => ({ profile: { name: "Sara Hassan" } }));
  let status = null;
  let answeredAfter = null;
  const res = { headersSent: false, status(code) { status = code; return this; }, json() { answeredAfter = sent.length; this.headersSent = true; } };
  await hook.handleWebhookEvent(
    { body: { batch: true, data: [inbound(), inbound({ message: { id: "m2", from: "201111111111", type: "text", text: { body: "second" }, kapso: { direction: "inbound" } } })] }, headers: { "x-webhook-event": "whatsapp.message.received" }, rawBody: Buffer.from("{}") },
    res
  );
  assert.equal(status, 200);
  assert.equal(answeredAfter, 2, "both replies were sent before the response");
  assert.deepEqual(sent.map((m) => m.to), ["201234567890", "201111111111"]);

  hook.setKapsoClientForTests({ messages: { sendText: async () => { throw new Error("kapso down"); } } });
  let status2 = null;
  await hook.handleWebhookEvent({ body: inbound(), headers: {}, rawBody: Buffer.from("{}") }, { headersSent: false, status(c) { status2 = c; return this; }, json() { this.headersSent = true; } });
  assert.equal(status2, 200);
});
