// New GitHub repo -> proposal -> approval (app and signed WhatsApp) -> portfolio + CV updated, build requested.
const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const OWNER = "201017741741";
process.env.ADMIN_API_KEY = "test-admin-key-0123456789abcdef";
process.env.CV_BUILD_KEY = "test-build-key-0123456789abcdef";
process.env.CRON_SECRET = "test-cron-secret-0123456789abcdef";
process.env.KAPSO_WEBHOOK_SECRET = "webhook-secret-for-tests";
process.env.WHATSAPP_ENABLED = "true";
process.env.WHATSAPP_PHONE = OWNER;
delete process.env.KAPSO_API_KEY; // no real sending: replies are computed but not delivered
delete process.env.MONGODB_URI;
delete process.env.VERCEL;
const overrides = path.join(__dirname, "..", "logs", "portfolio-overrides.json");
const cleanup = () => {
  try {
    fs.rmSync(overrides);
  } catch {}
};
cleanup();

// Fake GitHub; everything else (our own server) uses the real fetch
const realFetch = global.fetch;
let githubRepos = [];
global.fetch = async (url, opts) => {
  if (String(url).startsWith("https://api.github.com/users/")) {
    return { ok: true, status: 200, json: async () => githubRepos };
  }
  return realFetch(url, opts);
};

const app = require("../server");
const ADMIN = { "x-admin-key": process.env.ADMIN_API_KEY };

const run = async (fn) => {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, p, { headers = {}, body, raw } = {}) => {
    const res = await realFetch(base + p, {
      method,
      headers: { ...(body && !raw ? { "content-type": "application/json" } : {}), ...headers },
      body: raw !== undefined ? raw : body ? JSON.stringify(body) : undefined
    });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, json: type.includes("json") ? await res.json() : null };
  };
  try {
    await fn(call);
  } finally {
    server.close();
  }
};

const whatsappMessage = (from, text) => ({
  object: "whatsapp_business_account",
  entry: [{ changes: [{ value: { metadata: { phone_number_id: "PN" }, messages: [{ from, type: "text", text: { body: text } }] } }] }]
});
const signed = (body, secret = process.env.KAPSO_WEBHOOK_SECRET) => {
  const raw = JSON.stringify(body);
  return { raw, headers: { "content-type": "application/json", "x-hub-signature-256": `sha256=${crypto.createHmac("sha256", secret).update(raw).digest("hex")}` } };
};
const tick = () => new Promise((r) => setTimeout(r, 60));

test.after(() => {
  global.fetch = realFetch;
  cleanup();
});

test("the sync finds new repos and creates one pending change; the cron needs its secret", async () => {
  githubRepos = [
    { name: "brand-new-app", html_url: "https://github.com/zaydaly05/brand-new-app", description: "A brand new app", language: "Kotlin", topics: ["android"], created_at: "2026-10-01T09:00:00Z", fork: false, archived: false },
    { name: "forked-thing", html_url: "https://github.com/zaydaly05/forked-thing", description: "x", fork: true },
    { name: "Gulf_Limousine_App", html_url: "https://github.com/zaydaly05/Gulf_Limousine_App", description: "already listed", fork: false }
  ];
  await run(async (call) => {
    assert.equal((await call("GET", "/api/cron/sync")).status, 401);
    assert.equal((await call("GET", "/api/cron/sync", { headers: ADMIN })).status, 401);

    const cron = await call("GET", "/api/cron/sync", { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } });
    assert.equal(cron.status, 200);
    assert.ok(cron.json.created, "a change should be created");

    const pending = (await call("GET", "/api/admin/changes", { headers: ADMIN })).json.changes;
    assert.equal(pending.length, 1);
    assert.equal(pending[0].status, "pending");
    assert.deepEqual(pending[0].repos, ["brand-new-app"]);
    assert.equal(pending[0].payload.projects[0].name, "Brand New App");

    // running it again does not duplicate
    const again = (await call("POST", "/api/admin/changes/sync", { headers: ADMIN })).json;
    assert.equal(again.created, null);
    assert.equal((await call("GET", "/api/admin/summary", { headers: ADMIN })).json.pendingChanges, 1);
    // nothing changed on the public site yet
    const site = (await call("GET", "/api/portfolio")).json;
    assert.ok(!site.projects.some((p) => p.name === "Brand New App"));
  });
});

test("editing the proposal from the app, then approving updates the portfolio and the CV and requests a build", async () => {
  await run(async (call) => {
    const [change] = (await call("GET", "/api/admin/changes", { headers: ADMIN })).json.changes;
    const edit = await call("PATCH", `/api/admin/changes/${change.code}`, { headers: ADMIN, body: { index: 0, fields: { name: "Brand New App Pro", stack: "Kotlin, Compose", description: "Edited before approval" } } });
    assert.equal(edit.status, 200);

    // reset CV build state so we can observe the request
    const approve = await call("POST", `/api/admin/changes/${change.code}/approve`, { headers: ADMIN });
    assert.equal(approve.status, 200);
    assert.equal(approve.json.change.status, "applied");
    assert.equal((await call("POST", `/api/admin/changes/${change.code}/approve`, { headers: ADMIN })).json.already, true);

    const site = (await call("GET", "/api/portfolio")).json;
    const added = site.projects.find((p) => p.name === "Brand New App Pro");
    assert.ok(added, "project is on the public site");
    assert.equal(added.github, "https://github.com/zaydaly05/brand-new-app");
    assert.equal(site.projects.filter((p) => p.name === "Brand New App Pro").length, 1);
    assert.deepEqual(site.cvProjects.at(-1), { name: "Brand New App Pro", stack: "Kotlin, Compose", date: "Oct 2026", bullets: ["Edited before approval"] });

    const cv = (await call("GET", "/api/admin/cv", { headers: ADMIN })).json;
    assert.equal(cv.status, "requested");
    assert.match(cv.reason, /approved change/);

    const tex = await call("GET", "/api/admin/cv/source", { headers: ADMIN });
    assert.equal(tex.status, 200);

    // it is not proposed again
    assert.equal((await call("POST", "/api/admin/changes/sync", { headers: ADMIN })).json.created, null);
  });
});

test("WhatsApp: only signed messages from the owner's number can decide; replies change the portfolio", async () => {
  githubRepos = [{ name: "whatsapp-approved", html_url: "https://github.com/zaydaly05/whatsapp-approved", description: "Approved by reply", language: "Dart", created_at: "2026-10-02T09:00:00Z", fork: false }, { name: "reject-me", html_url: "https://github.com/zaydaly05/reject-me", description: "Will be rejected", language: "Go", created_at: "2026-10-03T09:00:00Z", fork: false }];
  await run(async (call) => {
    await call("POST", "/api/admin/changes/sync", { headers: ADMIN });
    const [change] = (await call("GET", "/api/admin/changes", { headers: ADMIN })).json.changes;
    assert.deepEqual(change.repos.sort(), ["reject-me", "whatsapp-approved"]);

    const send = async (from, text, secret) => {
      const msg = signed(whatsappMessage(from, text), secret);
      return call("POST", "/api/whatsapp/webhook", { headers: msg.headers, raw: msg.raw });
    };
    const status = async () => (await call("GET", "/api/admin/changes?status=all", { headers: ADMIN })).json.changes.find((c) => c.code === change.code).status;

    // attacker: wrong signature / unsigned / someone else's number -> ignored
    await send(OWNER, `1 ${change.code}`, "wrong-secret");
    await call("POST", "/api/whatsapp/webhook", { headers: { "content-type": "application/json" }, raw: JSON.stringify(whatsappMessage(OWNER, `1 ${change.code}`)) });
    await send("201000000000", `1 ${change.code}`);
    await tick();
    assert.equal(await status(), "pending");

    // the owner edits then approves by WhatsApp
    await send(OWNER, `2 name: Replied App; stack: Dart, Flutter`);
    await tick();
    let current = (await call("GET", "/api/admin/changes", { headers: ADMIN })).json.changes[0];
    assert.equal(current.payload.projects[0].name, "Replied App");
    assert.equal(await status(), "pending");

    await send(OWNER, `1 ${change.code}`);
    await tick();
    assert.equal(await status(), "applied");
    const site = (await call("GET", "/api/portfolio")).json;
    assert.ok(site.projects.some((p) => p.name === "Replied App"));
    assert.ok(site.cvProjects.some((p) => p.name === "Replied App" && p.stack === "Dart, Flutter"));
  });
});

test("WhatsApp rejection leaves the portfolio untouched; messages are ignored while WhatsApp is disabled", async () => {
  githubRepos = [{ name: "never-added", html_url: "https://github.com/zaydaly05/never-added", description: "Rejected project", language: "Go", created_at: "2026-10-04T09:00:00Z", fork: false }];
  await run(async (call) => {
    await call("POST", "/api/admin/changes/sync", { headers: ADMIN });
    const change = (await call("GET", "/api/admin/changes", { headers: ADMIN })).json.changes[0];
    const send = async (text) => {
      const msg = signed(whatsappMessage(OWNER, text));
      return call("POST", "/api/whatsapp/webhook", { headers: msg.headers, raw: msg.raw });
    };

    process.env.WHATSAPP_ENABLED = "false";
    await send(`3 ${change.code}`);
    await tick();
    assert.equal((await call("GET", "/api/admin/changes", { headers: ADMIN })).json.changes[0].status, "pending");

    process.env.WHATSAPP_ENABLED = "true";
    await send(`3 ${change.code}`);
    await tick();
    const all = (await call("GET", "/api/admin/changes?status=all", { headers: ADMIN })).json.changes;
    assert.equal(all.find((c) => c.code === change.code).status, "rejected");
    assert.ok(!(await call("GET", "/api/portfolio")).json.projects.some((p) => p.name === "Never Added"));
  });
});

test("approval endpoints validate input", async () => {
  await run(async (call) => {
    assert.equal((await call("POST", "/api/admin/changes/NOPE/approve", { headers: ADMIN })).status, 404);
    assert.equal((await call("POST", "/api/admin/changes/NOPE/reject", { headers: ADMIN })).status, 404);
    assert.equal((await call("PATCH", "/api/admin/changes/NOPE", { headers: ADMIN, body: { fields: { name: "x" } } })).status, 400);
    assert.equal((await call("GET", "/api/admin/changes")).status, 401);
  });
});
