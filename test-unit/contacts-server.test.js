// Contacts vault through the real server: admin API, auth, and the owner's WhatsApp commands.
const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const OWNER = "201017741741";
process.env.ADMIN_API_KEY = "test-admin-key-0123456789abcdef";
process.env.KAPSO_WEBHOOK_SECRET = "webhook-secret-for-tests";
process.env.WHATSAPP_ENABLED = "true";
process.env.WHATSAPP_PHONE = OWNER;
delete process.env.KAPSO_API_KEY;
delete process.env.MONGODB_URI;
delete process.env.VERCEL;
const dataDir = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "portfolio-test-"));
process.env.PORTFOLIO_DATA_DIR = dataDir; // each test file gets its own scratch folder (files run in parallel)
const overrides = path.join(dataDir, "portfolio-overrides.json");
try {
  fs.rmSync(overrides);
} catch {}

const app = require("../server");
const ADMIN = { "x-admin-key": process.env.ADMIN_API_KEY };

const run = async (fn) => {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, p, { headers = {}, body, raw } = {}) => {
    const res = await fetch(base + p, { method, headers: { ...(body && !raw ? { "content-type": "application/json" } : {}), ...headers }, body: raw !== undefined ? raw : body ? JSON.stringify(body) : undefined });
    return { status: res.status, json: (res.headers.get("content-type") || "").includes("json") ? await res.json() : null };
  };
  try {
    await fn(call);
  } finally {
    server.close();
  }
};
const whatsapp = (from, text) => {
  const raw = JSON.stringify({ object: "whatsapp_business_account", entry: [{ changes: [{ value: { metadata: { phone_number_id: "PN" }, messages: [{ from, type: "text", text: { body: text } }] } }] }] });
  return { raw, headers: { "content-type": "application/json", "x-hub-signature-256": `sha256=${crypto.createHmac("sha256", process.env.KAPSO_WEBHOOK_SECRET).update(raw).digest("hex")}` } };
};
const tick = () => new Promise((r) => setTimeout(r, 80));

test.after(() => {
  try {
    fs.rmSync(overrides);
  } catch {}
});

test("the contacts API needs the admin key", async () => {
  await run(async (call) => {
    for (const [method, p] of [["GET", "/api/admin/contacts"], ["POST", "/api/admin/contacts"], ["GET", "/api/admin/contacts/export"], ["POST", "/api/admin/contacts/import"], ["DELETE", "/api/admin/contacts/1"]]) {
      assert.equal((await call(method, p)).status, 401, `${method} ${p}`);
    }
  });
});

test("add, import, edit, trash, restore, export through the API", async () => {
  await run(async (call) => {
    const added = await call("POST", "/api/admin/contacts", { headers: ADMIN, body: { phone: "0100 000 0001", name: "Sara" } });
    assert.equal(added.status, 200);
    assert.equal(added.json.contact.phone, "201000000001");
    assert.equal((await call("POST", "/api/admin/contacts", { headers: ADMIN, body: { phone: "+201000000001" } })).status, 409);
    assert.equal((await call("POST", "/api/admin/contacts", { headers: ADMIN, body: { phone: "x" } })).status, 400);

    const imported = await call("POST", "/api/admin/contacts/import", { headers: ADMIN, body: { text: "Omar, 01111111111\nMina, 01222222222\nSara, 01000000001" } });
    assert.equal(imported.json.added, 2);
    assert.equal(imported.json.duplicates, 1);
    assert.equal((await call("POST", "/api/admin/contacts/import", { headers: ADMIN, body: { text: "  " } })).status, 400);

    const list = (await call("GET", "/api/admin/contacts", { headers: ADMIN })).json;
    assert.equal(list.counts.active, 3);
    const omar = list.contacts.find((c) => c.name === "Omar");

    assert.equal((await call("PUT", `/api/admin/contacts/${omar.id}`, { headers: ADMIN, body: { name: "Omar K", notes: "friend" } })).json.contact.name, "Omar K");
    assert.equal((await call("DELETE", `/api/admin/contacts/${omar.id}`, { headers: ADMIN })).json.contact.status, "trashed");
    const after = (await call("GET", "/api/admin/contacts", { headers: ADMIN })).json;
    assert.deepEqual(after.counts, { active: 2, trashed: 1 });
    assert.equal((await call("GET", "/api/admin/contacts?status=trashed", { headers: ADMIN })).json.contacts[0].name, "Omar K");
    assert.equal((await call("POST", `/api/admin/contacts/${omar.id}/restore`, { headers: ADMIN })).json.contact.status, "active");
    assert.equal((await call("DELETE", "/api/admin/contacts/nope", { headers: ADMIN })).status, 404);

    const exp = (await call("GET", "/api/admin/contacts/export", { headers: ADMIN })).json;
    assert.equal(exp.count, 3);
    assert.match(exp.csv, /^name,phone_e164,phone_digits,notes\n/);
    assert.match(exp.csv, /Omar K,\+201111111111,201111111111,friend/);
    assert.match(exp.filename, /^contacts-\d{4}-\d{2}-\d{2}\.csv$/);
    assert.equal((await call("GET", "/api/admin/summary", { headers: ADMIN })).json.contacts, 3);
  });
});

test("the owner's WhatsApp !addcontact saves to the vault; others and unsigned requests cannot", async () => {
  await run(async (call) => {
    const before = (await call("GET", "/api/admin/contacts", { headers: ADMIN })).json.counts.active;

    const intruder = whatsapp("201000000099", "!addcontact 01555555555");
    await call("POST", "/api/whatsapp/webhook", { headers: intruder.headers, raw: intruder.raw });
    const unsigned = whatsapp(OWNER, "!addcontact 01555555556");
    await call("POST", "/api/whatsapp/webhook", { headers: { "content-type": "application/json" }, raw: unsigned.raw });
    await tick();
    assert.equal((await call("GET", "/api/admin/contacts", { headers: ADMIN })).json.counts.active, before);

    const owner = whatsapp(OWNER, "!addcontact 01555555557, 01555555558");
    await call("POST", "/api/whatsapp/webhook", { headers: owner.headers, raw: owner.raw });
    await tick();
    const list = (await call("GET", "/api/admin/contacts", { headers: ADMIN })).json;
    assert.equal(list.counts.active, before + 2);
    assert.ok(list.contacts.some((c) => c.phone === "201555555557"));
  });
});
