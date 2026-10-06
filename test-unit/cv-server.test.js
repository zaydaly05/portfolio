// The CV pipeline through the real server (no database => in-memory build state).
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

const app = require("../server");
const ADMIN = { "x-admin-key": process.env.ADMIN_API_KEY };
const BUILD = { "x-cv-build-key": process.env.CV_BUILD_KEY };
const fakePdf = () => Buffer.concat([Buffer.from("%PDF-1.5\n"), Buffer.alloc(3000, 32), Buffer.from("\n%%EOF\n")]);

const run = async (fn) => {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(async (method, p, { headers = {}, body, json = true } = {}) => {
      const res = await fetch(base + p, { method, headers: { ...(json && body && !Buffer.isBuffer(body) ? { "content-type": "application/json" } : {}), ...headers }, body: body && !Buffer.isBuffer(body) ? JSON.stringify(body) : body });
      const type = res.headers.get("content-type") || "";
      return { status: res.status, type, json: type.includes("json") ? await res.json() : null, buffer: type.includes("json") ? null : Buffer.from(await res.arrayBuffer()) };
    });
  } finally {
    server.close();
  }
};

test.after(() => {
  try {
    fs.rmSync(overrides);
  } catch {}
});

test("build runner endpoints need the build key (and the admin key does not work there)", async () => {
  await run(async (call) => {
    assert.equal((await call("GET", "/api/build/resume/source")).status, 401);
    assert.equal((await call("GET", "/api/build/resume/source", { headers: ADMIN })).status, 401);
    assert.equal((await call("POST", "/api/build/resume/result", { headers: { "content-type": "application/pdf" }, body: fakePdf() })).status, 401);
    assert.equal((await call("GET", "/api/build/resume/source", { headers: BUILD })).status, 200);
  });
});

test("editing CV content requests a build; the runner fetches the LaTeX and uploads the PDF", async () => {
  await run(async (call) => {
    const before = (await call("GET", "/api/admin/cv", { headers: ADMIN })).json;
    assert.equal(before.status, "idle");
    assert.equal(before.runnerConfigured, true);

    const edit = await call("PUT", "/api/admin/portfolio/cvSummary", { headers: ADMIN, body: { data: { summary: "Brand new summary with C# & 100% passion." } } });
    assert.equal(edit.status, 200);
    assert.equal(edit.json.cvBuildRequested, true);
    const requested = (await call("GET", "/api/admin/cv", { headers: ADMIN })).json;
    assert.equal(requested.status, "requested");
    assert.match(requested.reason, /cvSummary/);

    const source = (await call("GET", "/api/build/resume/source", { headers: BUILD })).json;
    assert.equal(source.status, "requested");
    assert.match(source.tex, /Brand new summary with C\\# \\& 100\\% passion\./);
    assert.ok(source.id);

    const upload = await call("POST", `/api/build/resume/result?id=${encodeURIComponent(source.id)}`, { headers: { ...BUILD, "content-type": "application/pdf" }, body: fakePdf(), json: false });
    assert.equal(upload.status, 200);
    assert.equal(upload.json.version, 1);

    const done = (await call("GET", "/api/admin/cv", { headers: ADMIN })).json;
    assert.equal(done.status, "done");
    assert.equal(done.url, "/api/document/resume?v=1");

    // the public site now links to the generated CV, and the file is served
    const site = (await call("GET", "/api/portfolio")).json;
    assert.equal(site.profile.cvUrl, "/api/document/resume?v=1");
    const pdf = await call("GET", "/api/document/resume?v=1");
    assert.equal(pdf.status, 200);
    assert.equal(pdf.type, "application/pdf");
    assert.equal(pdf.buffer.subarray(0, 5).toString(), "%PDF-");
  });
});

test("non-CV edits do not request a build; bad uploads and failures are handled", async () => {
  await run(async (call) => {
    await call("POST", "/api/admin/cv/rebuild", { headers: ADMIN }); // reset to a known state
    const src = (await call("GET", "/api/build/resume/source", { headers: BUILD })).json;
    await call("POST", `/api/build/resume/result?id=${encodeURIComponent(src.id)}`, { headers: { ...BUILD, "content-type": "application/pdf" }, body: fakePdf(), json: false });
    assert.equal((await call("GET", "/api/admin/cv", { headers: ADMIN })).json.status, "done");

    const faq = await call("PUT", "/api/admin/portfolio/faq", { headers: ADMIN, body: { data: [{ question: "Q?", answer: "A" }] } });
    assert.equal(faq.json.cvBuildRequested, false);
    assert.equal((await call("GET", "/api/admin/cv", { headers: ADMIN })).json.status, "done");

    const bad = await call("POST", "/api/build/resume/result", { headers: { ...BUILD, "content-type": "application/pdf" }, body: Buffer.from("not a pdf"), json: false });
    assert.equal(bad.status, 400);

    await call("POST", "/api/build/resume/result?status=failed", { headers: BUILD, body: { error: "! LaTeX Error: boom" } });
    const failed = (await call("GET", "/api/admin/cv", { headers: ADMIN })).json;
    assert.equal(failed.status, "failed");
    assert.match(failed.error, /boom/);

    // editing the profile (name/phone/email/links appear on the CV) also requests a build
    const profile = (await call("GET", "/api/portfolio")).json.profile;
    const edit = await call("PUT", "/api/admin/portfolio/profile", { headers: ADMIN, body: { data: profile } });
    assert.equal(edit.json.cvBuildRequested, true);
  });
});

test("the admin can read the generated LaTeX and the CV validates its sections", async () => {
  await run(async (call) => {
    const tex = await call("GET", "/api/admin/cv/source", { headers: ADMIN, json: false });
    assert.equal(tex.status, 200);
    assert.match(tex.buffer.toString(), /\\begin\{document\}/);
    const put = async (section, data) => (await call("PUT", `/api/admin/portfolio/${section}`, { headers: ADMIN, body: { data } })).status;
    assert.equal(await put("cvExperience", [{ role: "no company" }]), 400);
    assert.equal(await put("cvSkills", [{ label: "Languages", items: "JS, Go" }]), 200);
    assert.equal(await put("cvSoftSkills", [{ text: "Teamwork" }]), 200);
    assert.equal(await put("cvSoftSkills", [{ nothing: "x" }]), 400);
  });
});
