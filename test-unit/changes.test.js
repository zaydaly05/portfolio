const test = require("node:test");
const assert = require("node:assert/strict");

const { createChangeStore, createChangeService, parseReply, parseEdits, shortPeriod, cvEntryFor } = require("../lib/changes");
const { createWhatsApp, oneLine } = require("../lib/whatsapp");

const repo = (name, extra = {}) => ({
  name,
  html_url: `https://github.com/me/${name}`,
  description: `${name} description`,
  language: "Dart",
  topics: ["flutter"],
  created_at: "2026-09-12T10:00:00Z",
  ...extra
});

const harness = ({ applyFails = false } = {}) => {
  const sent = [];
  const applied = [];
  const whatsapp = {
    sendText: async (text) => (sent.push({ kind: "text", text }), { sent: true }),
    sendApprovalRequest: async (req) => (sent.push({ kind: "approval", ...req }), { sent: true })
  };
  const service = createChangeService({
    store: createChangeStore({ connectDB: async () => null, models: null }),
    apply: async (change) => {
      if (applyFails) throw new Error("validation exploded");
      applied.push(change.code);
    },
    whatsapp
  });
  return { service, sent, applied };
};

test("reply parsing: approve, reject, modify, status, codes and noise", () => {
  assert.deepEqual(parseReply("1"), { intent: "approve", code: null });
  assert.deepEqual(parseReply("Approve"), { intent: "approve", code: null });
  assert.deepEqual(parseReply("1 k7q2"), { intent: "approve", code: "K7Q2" });
  assert.deepEqual(parseReply("approve K7Q2"), { intent: "approve", code: "K7Q2" });
  assert.deepEqual(parseReply("3"), { intent: "reject", code: null });
  assert.deepEqual(parseReply("reject K7Q2"), { intent: "reject", code: "K7Q2" });
  assert.equal(parseReply("2 name: X; stack: Y").intent, "modify");
  assert.equal(parseReply("modify: name=X").rest, "name=X");
  assert.deepEqual(parseReply("status"), { intent: "status", code: null });
  // casual words must NOT approve or reject anything
  for (const noise of ["ok", "okay", "sure", "hello", "thanks", "n", "y", "", "10", "yesterday"]) assert.equal(parseReply(noise), null, noise);
});

test("edit parsing: fields, aliases, project index, limits", () => {
  assert.deepEqual(parseEdits("name: My App; stack: Dart, Flutter; description: A short text"), {
    index: 0,
    fields: { name: "My App", stack: "Dart, Flutter", description: "A short text" }
  });
  assert.deepEqual(parseEdits("project 2 name = Second\nperiod: May 2026"), { index: 1, fields: { name: "Second", period: "May 2026" } });
  assert.deepEqual(parseEdits("date: June 2026; desc: Hi; secret: nope; github: https://evil"), { index: 0, fields: { period: "June 2026", description: "Hi" } });
  assert.deepEqual(parseEdits("just words"), { index: 0, fields: {} });
  assert.equal(parseEdits(`description: ${"x".repeat(2000)}`).fields.description.length, 600);
});

test("CV entries mirror portfolio projects", () => {
  assert.equal(shortPeriod("September 2026"), "Sep 2026");
  assert.equal(shortPeriod("May 2026"), "May 2026");
  assert.equal(shortPeriod("Spring"), "Spring");
  assert.deepEqual(cvEntryFor({ name: "A", stack: "Dart", period: "September 2026", description: "Does things" }), { name: "A", stack: "Dart", date: "Sep 2026", bullets: ["Does things"] });
  assert.deepEqual(cvEntryFor({ name: "A", period: "X" }).bullets, []);
});

test("proposal: new repos only, notifies the owner, never re-proposes decided repos", async () => {
  const { service, sent } = harness();
  const projects = [{ name: "Known", github: "https://github.com/me/known" }];
  const repos = [repo("known"), repo("fresh-app"), repo("no-description", { description: "", topics: [] }), repo("topics-only", { description: "", topics: ["x"] })];

  const first = await service.proposeNewProjects({ repos, projects });
  assert.equal(first.created.status, "pending");
  assert.equal(first.created.code.length, 4);
  assert.deepEqual(first.created.repos, ["fresh-app", "topics-only"]);
  assert.equal(first.created.payload.projects[0].name, "Fresh App");
  assert.equal(first.created.payload.cvProjects[0].date, "Sep 2026");
  assert.equal(first.notified, true);
  assert.equal(sent[0].kind, "approval");
  assert.equal(sent[0].code, first.created.code);
  assert.match(sent[0].longText, /Fresh App/);

  // asking again while pending creates nothing
  assert.equal((await service.proposeNewProjects({ repos, projects })).created, null);
  // after a rejection the repo is remembered and not proposed again
  await service.reject(first.created.code, "app");
  assert.equal((await service.proposeNewProjects({ repos, projects })).created, null);
});

test("approve applies once, is idempotent, and failures are recorded not thrown", async () => {
  const { service, applied } = harness();
  const { created } = await service.proposeNewProjects({ repos: [repo("a")], projects: [] });
  const ok = await service.approve(created.code, "app");
  assert.equal(ok.ok, true);
  assert.equal(ok.change.status, "applied");
  assert.equal(ok.change.decidedBy, "app");
  const again = await service.approve(created.code, "whatsapp");
  assert.equal(again.already, true);
  assert.deepEqual(applied, [created.code]);
  assert.equal((await service.reject(created.code, "app")).ok, false); // too late to reject

  const bad = harness({ applyFails: true });
  const change = (await bad.service.proposeNewProjects({ repos: [repo("b")], projects: [] })).created;
  const failed = await bad.service.approve(change.code, "app");
  assert.equal(failed.ok, false);
  assert.match(failed.error, /exploded/);
  assert.equal(failed.change.status, "failed");
  // a failed change may be proposed again
  assert.ok((await bad.service.proposeNewProjects({ repos: [repo("b")], projects: [] })).created);
});

test("modify edits the project and its CV entry and keeps the change pending", async () => {
  const { service } = harness();
  const { created } = await service.proposeNewProjects({ repos: [repo("a"), repo("b")], projects: [] });
  const res = await service.modify(created.code, { index: 1, fields: { name: "Second App", stack: "Go", period: "May 2026", description: "New text", github: "ignored" } });
  assert.equal(res.ok, true);
  assert.deepEqual(res.edited.sort(), ["description", "name", "period", "stack"]);
  assert.equal(res.change.payload.projects[1].name, "Second App");
  assert.equal(res.change.payload.projects[1].github, "https://github.com/me/b"); // untouched
  assert.deepEqual(res.change.payload.cvProjects[1], { name: "Second App", stack: "Go", date: "May 2026", bullets: ["New text"] });
  assert.equal(res.change.status, "pending");
  assert.equal((await service.modify(created.code, { index: 5, fields: { name: "x" } })).ok, false);
  assert.equal((await service.modify(created.code, { index: 0, fields: {} })).ok, false);
  await service.approve(created.code, "app");
  assert.equal((await service.modify(created.code, { index: 0, fields: { name: "late" } })).ok, false);
});

test("WhatsApp conversation: approve, reject, modify, status, ambiguity, unknown codes", async () => {
  const { service, applied } = harness();
  assert.equal(await service.handleOwnerReply("hello there"), null);
  assert.equal(await service.handleOwnerReply("1"), null); // nothing pending: not our business
  assert.match(await service.handleOwnerReply("status"), /Nothing is waiting/);

  const a = (await service.proposeNewProjects({ repos: [repo("alpha")], projects: [] })).created;
  assert.match(await service.handleOwnerReply("status"), new RegExp(a.code));

  const edited = await service.handleOwnerReply("2 name: Alpha Pro; stack: Dart, Go");
  assert.match(edited, /Updated \(name, stack\)/);
  assert.match(edited, /Alpha Pro/);
  assert.match(await service.handleOwnerReply("2 nonsense"), /Nothing to change/);

  const b = (await service.proposeNewProjects({ repos: [repo("alpha"), repo("beta")], projects: [] })).created;
  assert.ok(b && b.code !== a.code);
  assert.match(await service.handleOwnerReply("1"), /More than one change/); // must say which one
  assert.deepEqual(applied, []);

  assert.match(await service.handleOwnerReply(`3 ${b.code.toLowerCase()}`), /rejected/);
  assert.match(await service.handleOwnerReply(`approve ${a.code}`), /approved/);
  assert.deepEqual(applied, [a.code]);
  assert.match(await service.handleOwnerReply("1 ZZZZ"), /could not find/);
});

// ---- WhatsApp sender ---------------------------------------------------------
test("WhatsApp sender: disabled, unconfigured, success, template fallback and errors", async () => {
  assert.match((await createWhatsApp({ enabled: false }).sendText("hi")).reason, /disabled/);
  assert.match((await createWhatsApp({ enabled: true, client: null, phoneNumberId: "1", ownerPhone: "201017741741" }).sendText("hi")).reason, /not fully configured/);

  const calls = [];
  const client = {
    messages: {
      sendText: async (p) => calls.push(["text", p]),
      sendDocument: async (p) => calls.push(["document", p]),
      sendTemplate: async (p) => {
        calls.push(["template", p]);
        if (p.template.name === "broken") throw new Error("template rejected");
      }
    }
  };
  const base = { enabled: true, client, phoneNumberId: "PN1", ownerPhone: "+20 101 774 1741" };
  const wa = createWhatsApp(base);
  assert.equal((await wa.sendText("hello")).sent, true);
  assert.deepEqual(calls[0], ["text", { phoneNumberId: "PN1", to: "201017741741", body: "hello" }]);
  await wa.sendDocument({ link: "https://x/y.pdf", filename: "CV.pdf", caption: "new" });
  assert.deepEqual(calls[1][1].document, { link: "https://x/y.pdf", filename: "CV.pdf", caption: "new" });

  // approval request: uses the approved template when configured
  const withTemplate = createWhatsApp({ ...base, approvalTemplate: "portfolio_change", templateLanguage: "en_US" });
  calls.length = 0;
  await withTemplate.sendApprovalRequest({ code: "K7Q2", summary: "New project\nline two", longText: "long" });
  assert.equal(calls[0][0], "template");
  assert.deepEqual(calls[0][1].template.components[0].parameters.map((p) => p.text), ["K7Q2", "New project | line two"]);

  // template failure falls back to a plain message
  calls.length = 0;
  const broken = createWhatsApp({ ...base, approvalTemplate: "broken" });
  const result = await broken.sendApprovalRequest({ code: "A", summary: "s", longText: "long text" });
  assert.equal(result.sent, true);
  assert.deepEqual(calls.map((c) => c[0]), ["template", "text"]);

  // client errors never throw
  const failing = createWhatsApp({ ...base, client: { messages: { sendText: async () => { throw new Error("131047 re-engagement"); } } } });
  const failed = await failing.sendText("x");
  assert.equal(failed.sent, false);
  assert.match(failed.reason, /131047/);
  assert.equal(oneLine("a\n\n b\t c    d"), "a | b | c d");
});
