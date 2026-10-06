const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

process.env.ADMIN_API_KEY = "test-admin-key-0123456789abcdef";
process.env.CV_BUILD_KEY = "test-build-key-0123456789abcdef";
delete process.env.MONGODB_URI;
delete process.env.VERCEL;
delete process.env.GITHUB_TOKEN;
const fs = require("node:fs");
const path = require("node:path");
const overrides = path.join(__dirname, "..", "logs", "portfolio-overrides.json");
try {
  fs.rmSync(overrides);
} catch {}

const { buildCvSections, shorten } = require("../lib/cv-sync");
const { renderCvTex } = require("../lib/cv-tex");
const app = require("../server");
const ADMIN = { "x-admin-key": process.env.ADMIN_API_KEY };

test.after(() => {
  try {
    fs.rmSync(overrides);
  } catch {}
});

test("shorten cuts at a clause and never leaves a dangling word", () => {
  assert.equal(shorten("Short text.", 50), "Short text.");
  const out = shorten("Digital personal branding platform consolidating developer links and verified credentials in a unified card", 90);
  assert.ok(out.length <= 91);
  assert.doesNotMatch(out, /\b(a|in|and|the)\.$/i);
});

test("portfolio sections become CV sections that render to LaTeX", () => {
  const sections = buildCvSections({
    experience: [{ company: "WE", role: "Intern", period: "June 2026 - July 2026", location: "Cairo", points: ["One.", "Two.", "Three."] }],
    projects: [{ name: "Gulf App", stack: "Flutter", period: "July 2026", description: "A booking app." }, { name: "" }],
    technicalSkills: [{ category: "Languages", items: ["Java", "Kotlin"] }, { category: "Empty", items: [] }]
  });
  assert.equal(sections.cvExperience[0].bullets.length, 2);
  assert.equal(sections.cvExperience[0].period, "June 2026 – July 2026");
  assert.deepEqual(sections.cvProjects, [{ name: "Gulf App", stack: "Flutter", date: "July 2026", bullets: ["A booking app."] }]);
  assert.deepEqual(sections.cvSkills, [{ label: "Languages", items: "Java, Kotlin" }]);
  const tex = renderCvTex({ profile: { name: "Zayd" }, ...sections });
  assert.match(tex, /Gulf App/);
  assert.match(tex, /Kotlin/);
});

test("POST /api/admin/cv/refresh copies the portfolio into the CV and requests a build", async () => {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(`${base}/api/admin/cv/refresh`, { method: "POST" })).status, 401);
    const res = await fetch(`${base}/api/admin/cv/refresh`, { method: "POST", headers: ADMIN });
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.ok(body.ok && body.projects >= 11 && body.experience >= 4);
    const portfolio = await (await fetch(`${base}/api/portfolio`)).json();
    assert.ok(portfolio.cvProjects.some((p) => p.name === "WE Telecom Training Suite"));
    assert.ok(portfolio.cvExperience.some((e) => /WE/.test(e.company)));
    const cv = await (await fetch(`${base}/api/admin/cv`, { headers: ADMIN })).json();
    assert.equal(cv.status, "requested");
  } finally {
    server.close();
  }
});
