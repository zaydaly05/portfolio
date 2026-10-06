const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");

const { renderCvTex, esc, url } = require("../lib/cv-tex");
const { createCvBuilder, dispatchWorkflow, isPdf } = require("../lib/cv-build");
const defaults = require("../data/defaults");

const hasTool = (cmd) => spawnSync("which", [cmd]).status === 0;

test("LaTeX escaping covers every special character", () => {
  assert.equal(esc("C# & R&D 100% $5 _x_ {a} ~ ^ \\ < > |"), "C\\# \\& R\\&D 100\\% \\$5 \\_x\\_ \\{a\\} \\textasciitilde{} \\textasciicircum{} \\textbackslash{} \\textless{} \\textgreater{} \\textbar{}");
  assert.equal(esc("it’s “quoted” – ok … •"), "it's ``quoted'' -- ok \\ldots{} \\textbullet{}");
  assert.equal(esc("Café résumé"), "Café résumé"); // Latin-1 letters are fine
  assert.equal(esc("emoji 🚀 and عربي are dropped"), "emoji  and  are dropped");
  assert.equal(esc("  many   spaces\nand lines "), "many spaces and lines");
  assert.equal(esc(null), "");
  assert.equal(url("https://x.y/a b#c%d{e}"), "https://x.y/ab\\#c\\%de");
});

test("rendered CV keeps the fixed preamble and escapes user content", () => {
  const data = JSON.parse(JSON.stringify(defaults));
  data.cvProjects.push({ name: "R&D Tool_v2 #1", stack: "C#, 100%", date: "May 2026", bullets: ["Saved $5k & more"] });
  data.cvExperience[0].bullets = []; // no bullets -> no empty itemize (that would break LaTeX)
  const tex = renderCvTex(data);
  assert.ok(tex.startsWith("%-------------------------"));
  assert.match(tex, /\\documentclass\[letterpaper,11pt\]\{article\}/);
  assert.match(tex, /\\textbf\{R\\&D Tool\\_v2 \\#1\} \$\|\$ \\emph\{C\\#, 100\\%\}/);
  assert.match(tex, /Saved \\\$5k \\& more/);
  assert.doesNotMatch(tex, /\\resumeItemListStart\s*\\resumeItemListEnd/);
  assert.equal((tex.match(/\\begin\{document\}/g) || []).length, 1);
  assert.equal((tex.match(/\\end\{document\}/g) || []).length, 1);
});

test("empty sections are left out instead of producing broken LaTeX", () => {
  const data = { profile: { name: "Only Name" } };
  const tex = renderCvTex(data);
  assert.match(tex, /Only Name/);
  for (const section of ["Summary", "Experience", "Projects", "Technical Skills", "Soft Skills", "Education", "Languages"]) {
    assert.ok(!tex.includes(`\\section{${section}}`), section);
  }
});

test("GOLDEN: the generated CV compiles to the same text as the current CV PDF", { skip: !hasTool("pdflatex") || !hasTool("pdftotext") }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cv-"));
  fs.writeFileSync(path.join(dir, "main.tex"), renderCvTex(defaults));
  execFileSync("pdflatex", ["-interaction=nonstopmode", "-halt-on-error", "main.tex"], { cwd: dir, stdio: "pipe" });
  const text = (pdf) => execFileSync("pdftotext", ["-layout", pdf, "-"]).toString().replace(/\s+/g, " ").trim();
  const info = execFileSync("pdfinfo", [path.join(dir, "main.pdf")]).toString();
  assert.match(info, /Pages:\s+1/);
  assert.match(info, /letter/);
  assert.equal(text(path.join(dir, "main.pdf")), text(path.join(__dirname, "..", "public", "assets", "cv.pdf")));
});

test("special characters in content still compile", { skip: !hasTool("pdflatex") }, () => {
  const data = JSON.parse(JSON.stringify(defaults));
  data.cvProjects[0] = { name: "A&B C# 100% {x} _y_ ^z ~ \\ $", stack: "<Rust> | Go", date: "2026", bullets: ["Naïve café – “quoted” … 🚀 عربي"] };
  data.cvSummary.summary = "Handles #hashtags & 50% of $ money_things {braces}.";
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cv-"));
  fs.writeFileSync(path.join(dir, "main.tex"), renderCvTex(data));
  execFileSync("pdflatex", ["-interaction=nonstopmode", "-halt-on-error", "main.tex"], { cwd: dir, stdio: "pipe" });
  assert.ok(fs.existsSync(path.join(dir, "main.pdf")));
});

// ---- builder ---------------------------------------------------------------
const fakePdf = (extra = 0) => Buffer.concat([Buffer.from("%PDF-1.5\n"), Buffer.alloc(2000 + extra, 32), Buffer.from("\n%%EOF\n")]);

const newBuilder = () => {
  const built = [];
  const dispatched = [];
  const builder = createCvBuilder({
    connectDB: async () => null,
    models: null,
    getData: () => defaults,
    onBuilt: async (info) => built.push(info),
    dispatch: async () => {
      dispatched.push(1);
      return true;
    }
  });
  return { builder, built, dispatched };
};

test("builder: request, fetch source, complete, serve latest", async () => {
  const { builder, built, dispatched } = newBuilder();
  assert.equal((await builder.getState()).status, "idle");
  const req = await builder.requestBuild("edited cvSummary");
  assert.equal(dispatched.length, 1);
  assert.equal(req.dispatched, true);
  const { state, tex } = await builder.source();
  assert.equal(state.status, "requested");
  assert.match(tex, /\\begin\{document\}/);

  const done = await builder.complete({ pdf: fakePdf(), id: state.requestedAt });
  assert.equal(done.version, 1);
  assert.equal(done.url, "/api/document/resume?v=1");
  assert.equal(done.stale, false);
  assert.equal(built.length, 1);
  assert.equal((await builder.getState()).status, "done");
  assert.ok((await builder.latestPdf()).subarray(0, 5).toString() === "%PDF-");
});

test("builder: a build that finishes after newer edits keeps a rebuild pending", async () => {
  const { builder } = newBuilder();
  const first = await builder.requestBuild("one");
  await new Promise((r) => setTimeout(r, 5));
  await builder.requestBuild("two"); // content changed while the first build was running
  const result = await builder.complete({ pdf: fakePdf(), id: first.requestedAt });
  assert.equal(result.stale, true);
  assert.equal((await builder.getState()).status, "requested");
});

test("builder: rejects non-PDF, tiny, oversized and truncated files", async () => {
  const { builder } = newBuilder();
  await assert.rejects(builder.complete({ pdf: Buffer.from("<html>nope</html>") }), /valid PDF/);
  await assert.rejects(builder.complete({ pdf: Buffer.from("%PDF-1.4 tiny") }), /valid PDF/);
  await assert.rejects(builder.complete({ pdf: Buffer.concat([Buffer.from("%PDF-1.4\n"), Buffer.alloc(5000, 1)]) }), /valid PDF/); // no %%EOF
  await assert.rejects(builder.complete({ pdf: fakePdf(4 * 1024 * 1024) }), /valid PDF/);
  assert.equal(isPdf(fakePdf()), true);
});

test("builder: failures are recorded, dispatch problems never break a request", async () => {
  const builder = createCvBuilder({
    connectDB: async () => null,
    models: null,
    getData: () => defaults,
    onBuilt: async () => {},
    dispatch: async () => {
      throw new Error("GitHub dispatch returned 404");
    }
  });
  const req = await builder.requestBuild("x");
  assert.equal(req.dispatched, false);
  assert.match(req.dispatchError, /404/);
  assert.equal((await builder.getState()).status, "requested");
  await builder.fail("! LaTeX Error: File `foo.sty' not found.");
  const state = await builder.getState();
  assert.equal(state.status, "failed");
  assert.match(state.error, /foo\.sty/);
});

test("builder: only the latest 10 versions are kept", async () => {
  const { builder } = newBuilder();
  for (let i = 0; i < 12; i += 1) await builder.complete({ pdf: fakePdf(i) });
  assert.equal((await builder.getState()).version, 12);
  assert.ok(await builder.latestPdf());
});

test("dispatchWorkflow talks to the GitHub API correctly", async () => {
  const calls = [];
  const ok = await dispatchWorkflow({
    token: "t",
    repository: "me/portfolio",
    ref: "main",
    fetchImpl: async (u, opts) => {
      calls.push({ u, opts });
      return { status: 204 };
    }
  });
  assert.equal(ok, true);
  assert.equal(calls[0].u, "https://api.github.com/repos/me/portfolio/actions/workflows/build-cv.yml/dispatches");
  assert.equal(JSON.parse(calls[0].opts.body).ref, "main");
  assert.equal(await dispatchWorkflow({ token: "", repository: "me/portfolio" }), false);
  await assert.rejects(dispatchWorkflow({ token: "t", repository: "me/portfolio", fetchImpl: async () => ({ status: 403 }) }), /403/);
});
