// Crawler files and the 404 page.
const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

process.env.ADMIN_API_KEY = "test-admin-key-0123456789abcdef";
process.env.PUBLIC_SITE_URL = "https://example.test";
process.env.WHATSAPP_VERIFY_TOKEN = "unit-test-verify-token-0123456789";
delete process.env.MONGODB_URI;
delete process.env.VERCEL;
const fs = require("node:fs");
const path = require("node:path");
const dataDir = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "portfolio-test-"));
process.env.PORTFOLIO_DATA_DIR = dataDir; // each test file gets its own scratch folder (files run in parallel)
const overrides = path.join(dataDir, "portfolio-overrides.json");
try {
  fs.rmSync(overrides);
} catch {}

const app = require("../server");

const get = async (p, opts = {}) => {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}${p}`, { redirect: "manual", ...opts });
    return { status: res.status, type: res.headers.get("content-type") || "", location: res.headers.get("location"), text: await res.text() };
  } finally {
    server.close();
  }
};

test.after(() => {
  try {
    fs.rmSync(overrides);
  } catch {}
});

test("robots.txt and sitemap.xml point crawlers at the public pages only", async () => {
  const robots = await get("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(robots.text, /Disallow: \/api\//);
  assert.match(robots.text, /Sitemap: https:\/\/example\.test\/sitemap\.xml/);
  const sitemap = await get("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.type, /xml/);
  for (const page of ["/projects", "/experience", "/skills", "/contact"]) assert.match(sitemap.text, new RegExp(`<loc>https://example\\.test${page}</loc>`));
  assert.doesNotMatch(sitemap.text, /\/api\//);
});

test("unknown pages get a real 404 page with links back, API paths stay JSON", async () => {
  const page = await get("/no-such-page");
  assert.equal(page.status, 404);
  assert.match(page.type, /html/);
  assert.match(page.text, /This page does not exist/);
  assert.match(page.text, /href="\/projects"/);
  const api = await get("/api/no-such-endpoint");
  assert.equal(api.status, 404);
  assert.match(api.type, /json/);
});

test("favicon.ico serves the profile logo instead of a 404", async () => {
  const icon = await get("/favicon.ico");
  assert.ok([302, 204].includes(icon.status));
  if (icon.status === 302) assert.match(icon.location, /^https:\/\//);
});

test("the WhatsApp webhook answers verification on both addresses (slash and hyphen)", async () => {
  for (const p of ["/api/whatsapp/webhook", "/api/whatsapp-webhook"]) {
    const ok = await get(`${p}?hub.mode=subscribe&hub.verify_token=${process.env.WHATSAPP_VERIFY_TOKEN}&hub.challenge=abc123`);
    assert.equal(ok.status, 200, p);
    assert.equal(ok.text, "abc123", p);
    const bad = await get(`${p}?hub.mode=subscribe&hub.verify_token=nope&hub.challenge=abc123`);
    assert.notEqual(bad.text, "abc123", p); // a wrong token never gets the challenge back
  }
});
