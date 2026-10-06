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
const dataDir = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "portfolio-test-"));
process.env.PORTFOLIO_DATA_DIR = dataDir; // each test file gets its own scratch folder (files run in parallel)
const overrides = path.join(dataDir, "portfolio-overrides.json");
try {
  fs.rmSync(overrides);
} catch {}

const repo = (name, extra = {}) => ({ name, full_name: `zaydaly05/${name}`, languages_url: `https://api.github.com/repos/zaydaly05/${name}/languages`, description: `${name} description`, html_url: `https://github.com/zaydaly05/${name}`, stargazers_count: 1, forks_count: 0, language: "JS", updated_at: "2026-01-01T00:00:00Z", ...extra });
const realFetch = global.fetch;
global.fetch = async (url, opts) => {
  const u = String(url);
  if (/\/repos\/[^/]+\/[^/]+\/commits/.test(u)) {
    // every repository has 25 commits (GitHub reports the last page number of a 1-per-page listing)
    return { ok: true, status: 200, headers: { get: (h) => (h.toLowerCase() === "link" ? `<${u}&page=2>; rel="next", <${u}&page=25>; rel="last"` : null) }, json: async () => [{}] };
  }
  if (u.includes("/languages")) {
    // 3800 bytes per repo => 100 lines each
    return { ok: true, json: async () => ({ JavaScript: 3000, CSS: 800 }) };
  }
  if (u.startsWith("https://api.github.com/users/") && u.includes("/repos")) {
    return { ok: true, json: async () => [repo("portfolio"), repo("cv-portfolio"), repo("Car_Rental_Website"), repo("zaydentity"), repo("random-experiment"), repo("Gulf_Limousine_App"), repo("EssmatPlastic"), repo("drNaglaBio"), repo("forked-lib", { fork: true })] };
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
    // hub order, only the first four; portfolio, cv-portfolio and random-experiment never appear
    assert.deepEqual(names, ["Gulf_Limousine_App", "EssmatPlastic", "drNaglaBio", "Car_Rental_Website"]);
    assert.equal(body.publicRepos, 15); // account stats are unchanged
    assert.equal(body.allRepos, undefined); // internal list is not exposed
    // 8 own repositories x 3800 bytes / 38 bytes per line; the fork is not counted
    assert.equal(body.linesOfCode, 800);
    assert.equal(body.commits, 8 * 25); // forks are not counted
  } finally {
    server.close();
  }
});
