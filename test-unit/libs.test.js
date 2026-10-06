const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

const github = require("../lib/github");
const { buildReply } = require("../lib/assistant");
const { sameNumber } = require("../lib/phone");
const { verifySignature } = require("../lib/webhook-signature");
const { toWhatsAppText, getAIResponse, setPortfolioProvider } = require("../api/whatsapp-webhook");
const defaults = require("../data/defaults");

test("github: username, names, periods, slugs", () => {
  assert.equal(github.usernameFromProfile({ github: "https://github.com/some-user/" }), "some-user");
  assert.equal(github.usernameFromProfile({ github: "plain-name" }), "plain-name");
  assert.equal(github.usernameFromProfile({ github: "" }), null);
  assert.equal(github.prettyRepoName("Employee_Attendance-Leave_Management_System"), "Employee Attendance Leave Management System");
  assert.equal(github.repoSlugFromUrl("https://github.com/u/My-Repo.git"), "my-repo");
  assert.equal(github.repoSlugFromUrl("nope"), null);
});

test("github: forks and archived repos are skipped when fetching", async () => {
  const pages = [
    [
      { name: "a", fork: false, archived: false },
      { name: "b", fork: true, archived: false },
      { name: "c", fork: false, archived: true }
    ]
  ];
  const fakeFetch = async () => ({ ok: true, json: async () => pages[0] });
  const repos = await github.fetchRepos("me", "", fakeFetch);
  assert.deepEqual(repos.map((r) => r.name), ["a"]);
  await assert.rejects(github.fetchRepos("me", "", async () => ({ ok: false, status: 403 })), /403/);
});

test("assistant answers come from the data, not from hard-coded text", () => {
  const data = JSON.parse(JSON.stringify(defaults));
  data.profile.name = "Sara Hassan";
  data.profile.email = "sara@example.org";
  data.profile.github = "https://github.com/sara-h";
  data.profile.linkedin = "https://www.linkedin.com/in/sara-h";
  data.profile.phone = "0100000000";
  data.projects = [{ name: "Moon Rover", stack: "Rust", description: "Drives on the moon" }];
  data.technicalSkills = [{ category: "Systems", items: ["Rust", "C"] }];
  data.experience = [{ company: "Acme", role: "Engineer", period: "2024", points: ["Built things"] }];

  const hi = buildReply("hello", data).reply;
  assert.match(hi, /Sara/);
  assert.doesNotMatch(hi, /Zayd/);
  assert.match(buildReply("what are your projects", data).reply, /Moon Rover/);
  assert.match(buildReply("skills?", data).reply, /Systems:\*\* Rust, C/);
  assert.match(buildReply("work experience", data).reply, /Acme/);
  const contact = buildReply("how do I contact you", data).reply;
  assert.match(contact, /sara@example\.org/);
  assert.doesNotMatch(contact, /zaydaly/);
  assert.ok(buildReply("something unrelated", data).suggestions.length > 0);
});

test("assistant covers languages, strengths, counts, soft skills and the CV link", () => {
  const data = JSON.parse(JSON.stringify(defaults));
  data.profile.name = "Sara Hassan";
  data.profile.cvUrl = "/api/document/resume?v=7";
  data.languages = [{ name: "Arabic", level: "Native", flag: "🇪🇬" }, { name: "German", level: "B1" }];
  data.featuredStack = [{ name: "Rust", level: 95 }, { name: "Go", level: 60 }];
  data.softSkills = [{ title: "Mentoring", desc: "Helps juniors grow" }];
  data.projects = Array.from({ length: 9 }, (_, i) => ({ name: `Project ${i + 1}` }));

  assert.match(buildReply("which languages do you speak?", data).reply, /German/);
  assert.match(buildReply("what are you strongest at", data).reply, /Rust.*95%/s);
  assert.match(buildReply("how many projects", data).reply, /\*\*9\*\* projects/);
  assert.match(buildReply("soft skills", data).reply, /Mentoring/);
  assert.match(buildReply("download cv", data).reply, /resume\?v=7/);
  const all = buildReply("show projects", data).reply;
  assert.match(all, /Project 9/);
  assert.match(all, /\*\*9\*\*/);
});

test("assistant copes with an empty portfolio", () => {
  const empty = {};
  for (const q of ["hi", "skills", "projects", "experience", "education", "certificates", "contact", "cv", "???"]) {
    const { reply } = buildReply(q, empty);
    assert.equal(typeof reply, "string");
    assert.ok(reply.length > 0);
  }
});

test("phone numbers: matching is strict and empty never matches", () => {
  assert.equal(sameNumber("+201017741741", "01017741741"), true);
  assert.equal(sameNumber("201017741741", "+20 101 774 1741"), true);
  assert.equal(sameNumber("201017741741", "201017741742"), false);
  assert.equal(sameNumber("", ""), false);
  assert.equal(sameNumber("201017741741", ""), false);
  assert.equal(sameNumber("1", "201017741741"), false);
  assert.equal(sameNumber("41", "201017741741"), false);
});

test("webhook signature: valid, wrong, missing and prefixed", () => {
  const secret = "s3cret-value";
  const body = Buffer.from('{"hello":"world"}');
  const good = crypto.createHmac("sha256", secret).update(body).digest("hex");
  assert.equal(verifySignature(body, { "x-hub-signature-256": `sha256=${good}` }, secret), true);
  assert.equal(verifySignature(body, { "x-webhook-signature": good }, secret), true);
  assert.equal(verifySignature(body, { "x-webhook-signature": good.replace(/.$/, "0") }, secret), false);
  assert.equal(verifySignature(body, {}, secret), false);
  assert.equal(verifySignature(body, { "x-webhook-signature": good }, ""), false);
  assert.equal(verifySignature(Buffer.from('{"hello":"tampered"}'), { "x-webhook-signature": good }, secret), false);
});

test("whatsapp replies are formatted for WhatsApp and use live data", () => {
  assert.equal(toWhatsAppText("**bold** and [site](https://x.y/z) and [mail](mailto:a@b.c)"), "*bold* and site: https://x.y/z and mail: a@b.c");
  setPortfolioProvider(() => ({ profile: { name: "Omar Nabil", summary: "Builds apps." }, projects: [{ name: "Alpha", stack: "Go" }] }));
  const reply = getAIResponse("show me your projects");
  assert.match(reply, /Alpha/);
  assert.match(reply, /Omar/);
  assert.doesNotMatch(reply, /Zayd/);
});

test("built-in defaults contain every dynamic section the site needs", () => {
  for (const key of ["profile", "education", "activities", "experience", "projects", "featuredStack", "technicalSkills", "softSkills", "languages", "certificates", "site", "heroPills", "heroBadges", "heroSlides", "stats", "gateways", "faq"]) {
    assert.ok(defaults[key], key);
  }
  assert.ok(defaults.profile.cvUrl.startsWith("https://"));
  assert.ok(defaults.projects.every((p) => p.name && p.github));
  assert.ok(defaults.projects.some((p) => p.featured));
  const sources = new Set(["github_repos", "projects", "skill_categories", "certificates", "internships", "fixed"]);
  assert.ok(defaults.stats.every((s) => sources.has(s.source)));
  // no secrets in the seed data
  assert.doesNotMatch(JSON.stringify(defaults), /api[_-]?key|secret|password|mongodb(\+srv)?:\/\//i);
});
