// Runs the real server.js (no database configured) to check wiring: locked endpoints, override layering.
const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

process.env.ADMIN_API_KEY = "test-admin-key-0123456789abcdef";
delete process.env.MONGODB_URI;
delete process.env.VERCEL;
const KEY = process.env.ADMIN_API_KEY;

const overridesFile = path.join(__dirname, "..", "logs", "portfolio-overrides.json");
const cleanup = () => {
  try {
    fs.rmSync(overridesFile);
  } catch {}
};
cleanup();

const app = require("../server");

const run = async (fn) => {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(async (method, p, { body, key } = {}) => {
      const res = await fetch(base + p, {
        method,
        headers: { "content-type": "application/json", ...(key ? { "x-admin-key": key } : {}) },
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      let json = null;
      try {
        json = await res.json();
      } catch {}
      return { status: res.status, json };
    });
  } finally {
    server.close();
  }
};

test.after(cleanup);

test("sensitive endpoints now require the admin key", async () => {
  await run(async (call) => {
    // routes with "cv" in the path must reach the admin API (not the CV file interceptor)
    assert.equal((await call("GET", "/api/admin/cv-anything", { key: KEY })).status, 404);
    assert.equal((await call("GET", "/api/logs")).status, 401);
    assert.equal((await call("DELETE", "/api/logs")).status, 401);
    assert.equal((await call("GET", "/api/admin/summary")).status, 401);
    assert.equal((await call("GET", "/api/portfolio")).status, 200); // public site data stays public
  });
});

test("edits made through the admin API show up on the public /api/portfolio", async () => {
  await run(async (call) => {
    const before = (await call("GET", "/api/portfolio")).json;
    const original = before.projects.length;
    const edited = [...before.projects.map(({ slug, showcaseStatus, showcaseReason, screenshots, ...p }) => p), { name: "Brand New Project", period: "Oct 2026", stack: "Flutter", description: "x", image: "", github: "" }];

    assert.equal((await call("PUT", "/api/admin/portfolio/projects", { key: KEY, body: { data: edited } })).status, 200);
    const after = (await call("GET", "/api/portfolio")).json;
    assert.equal(after.projects.length, original + 1);
    assert.equal(after.projects.at(-1).name, "Brand New Project");

    const summary = (await call("GET", "/api/admin/summary", { key: KEY })).json;
    assert.deepEqual(summary.overridden, ["projects"]);
    assert.equal(summary.dbConnected, false);

    assert.equal((await call("DELETE", "/api/admin/portfolio/projects", { key: KEY })).status, 200);
    const reset = (await call("GET", "/api/portfolio")).json;
    assert.equal(reset.projects.length, original);
  });
});
