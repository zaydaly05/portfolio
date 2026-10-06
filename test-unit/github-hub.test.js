// /api/github only returns repositories that back a project in the Project Hub.
const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

process.env.ADMIN_API_KEY = "test-admin-key-0123456789abcdef";
delete process.env.MONGODB_URI;
delete process.env.VERCEL;
delete process.env.GITHUB_TOKEN;
const fs = require("node:fs");
const path = require("node:path");
const overrides = path.join(__dirname, "..", "logs", "portfolio-overrides.json");
try {
  fs.rmSync(overrides);
} catch {}

const repo = (name, extra = {}) => ({ name, description: `${name} description`, html_url: `https://github.com/zaydaly05/${name}`, stargazers_count: 1, forks_count: 0, language: "JS", updated_at: "2026-01-01T00:00:00Z", ...extra });
const realFetch = global.fetch;
global.fetch = async (url, opts) => {
  const u = String(url);
  if (u.startsWith("https://api.github.com/users/") && u.includes("/repos")) {
    return { ok: true, json: async () => [repo("portfolio"), repo("cv-portfolio"), repo("Car_Rental_Website"), repo("zaydentity"), repo("random-experiment")] };
  }
  if (u.startsWith("https://api.github.com/users/")) {
    return { ok: true, json: async () => ({ login: "zaydaly05", avatar_url: "a", bio: "b", public_repos: 15, followers: 6, html_url: "https://github.com/zaydaly05" }) };
  }
  return realFetch(url, opts);
};

const app = require("../server");

test.after(() => {
  global.fetch = realFetch;
  try {
    fs.rmSync(overrides);
  } catch {}
});

test("only repositories of Project Hub projects are listed, in the hub's order", async () => {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  try {
    const res = await realFetch(`http://127.0.0.1:${server.address().port}/api/github`);
    const body = await res.json();
    assert.equal(res.status, 200);
    const names = body.topRepos.map((r) => r.name);
    assert.deepEqual(names, ["Car_Rental_Website", "zaydentity"]); // hub order; portfolio, cv-portfolio and random-experiment excluded
    assert.equal(body.publicRepos, 15); // account stats are unchanged
    assert.equal(body.allRepos, undefined); // internal list is not exposed
  } finally {
    server.close();
  }
});
