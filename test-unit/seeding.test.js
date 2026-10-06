// The database becomes the source of truth: first run seeds it, later runs read from it.
const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");

process.env.ADMIN_API_KEY = "test-admin-key-0123456789abcdef";
process.env.MONGODB_URI = "mongodb://fake-host/fake";
delete process.env.VERCEL;

// Replace ../db with an in-memory stand-in before server.js loads it
const state = { docs: [], bulkOps: [], connected: true, findFails: false };
const stub = () => ({ find: () => ({ lean: async () => [] }), countDocuments: async () => 0, findOne: () => ({ lean: async () => null }) });
const fakeDb = {
  connectDB: async () => (state.connected ? {} : null),
  Review: stub(),
  Star: stub(),
  Contact: stub(),
  CvConfig: stub(),
  PendingChange: { find: () => ({ sort: () => ({ limit: () => ({ lean: async () => [] }) }) }), findOne: () => ({ lean: async () => null }) },
  CvBuild: { findOne: () => ({ lean: async () => null }), findOneAndUpdate: async () => {} },
  CvFile: {},
  LogRecord: { find: () => ({ sort: () => ({ limit: () => ({ lean: async () => [] }) }) }) },
  PortfolioSection: {
    find: () => ({
      lean: async () => {
        if (state.findFails) throw new Error("db down");
        return state.docs;
      }
    }),
    bulkWrite: async (ops) => {
      state.bulkOps.push(...ops);
    },
    findOneAndUpdate: async (filter, update) => {
      const existing = state.docs.find((d) => d.section === filter.section);
      if (existing) Object.assign(existing, update);
      else state.docs.push({ section: filter.section, ...update });
    }
  }
};
require.cache[require.resolve("../db")] = { id: require.resolve("../db"), filename: require.resolve("../db"), loaded: true, exports: fakeDb };

const app = require("../server");
const defaults = require("../data/defaults");

const get = async (p) => {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}${p}`);
    return await res.json();
  } finally {
    server.close();
  }
};

// refresh results are cached for 15s; the admin "force" path is not, so drive refreshes through it
const adminGet = async (p) => {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}${p}`, { headers: { "x-admin-key": process.env.ADMIN_API_KEY } });
    return await res.json();
  } finally {
    server.close();
  }
};

test("first run: every built-in section is copied into the empty database", async () => {
  const data = await adminGet("/api/admin/portfolio");
  assert.equal(data.ok, true);
  const seeded = state.bulkOps.map((op) => op.updateOne.filter.section).sort();
  assert.deepEqual(seeded, Object.keys(data.sections).sort());
  assert.ok(seeded.includes("faq") && seeded.includes("site") && seeded.includes("projects"));
  // seeding never overwrites: it only sets data when inserting
  assert.ok(state.bulkOps.every((op) => op.updateOne.upsert === true && op.updateOne.update.$setOnInsert));
  assert.deepEqual(data.overridden, []);
});

test("later runs read stored content and only seed what is missing", async () => {
  state.bulkOps.length = 0;
  state.docs = [{ section: "projects", data: [{ name: "Stored In Db", github: "https://github.com/x/y" }] }];
  const data = await adminGet("/api/admin/portfolio");
  assert.equal(data.sections.projects[0].name, "Stored In Db");
  assert.equal(data.sections.faq.length, defaults.faq.length); // not stored yet -> default
  assert.ok(!state.bulkOps.some((op) => op.updateOne.filter.section === "projects"));
  assert.ok(state.bulkOps.some((op) => op.updateOne.filter.section === "faq"));
  assert.deepEqual(data.overridden, ["projects"]);
  const summary = await adminGet("/api/admin/summary");
  assert.deepEqual(summary.overridden, ["projects"]);
});

test("if the database is down the site keeps serving what it already has", async () => {
  state.findFails = true;
  state.bulkOps.length = 0;
  const data = await adminGet("/api/admin/portfolio");
  assert.equal(data.ok, true);
  assert.equal(data.sections.projects[0].name, "Stored In Db"); // unchanged, not reset to defaults
  assert.equal(state.bulkOps.length, 0);
  state.findFails = false;

  state.connected = false;
  const offline = await adminGet("/api/admin/portfolio");
  assert.equal(offline.sections.projects[0].name, "Stored In Db");
  state.connected = true;
});

test("public /api/portfolio serves the stored content with the extra sections", async () => {
  state.docs = [{ section: "profile", data: { ...defaults.profile, name: "Stored Name" } }];
  await adminGet("/api/admin/portfolio"); // force a refresh
  const pub = await get("/api/portfolio");
  assert.equal(pub.profile.name, "Stored Name");
  for (const key of ["site", "heroSlides", "stats", "gateways", "faq", "heroPills", "heroBadges"]) assert.ok(pub[key], key);
  assert.ok(path.isAbsolute(__filename));
});

test("an untouched old FAQ is upgraded to the new default; an edited FAQ is left alone", async () => {
  const legacy = require("../data/legacy-defaults");
  state.bulkOps.length = 0;
  state.docs = [{ section: "faq", data: legacy.faq[0] }];
  const upgraded = await adminGet("/api/admin/portfolio");
  assert.equal(upgraded.sections.faq.length, defaults.faq.length);
  const op = state.bulkOps.find((o) => o.updateOne.filter.section === "faq");
  assert.ok(op, "the stored document is replaced");
  assert.deepEqual(op.updateOne.filter.data, legacy.faq[0]); // only while it still holds the old text
  assert.deepEqual(op.updateOne.update.$set.data, defaults.faq);

  state.bulkOps.length = 0;
  const edited = [{ question: "My own question?", answer: "My own answer." }];
  state.docs = [{ section: "faq", data: edited }];
  const kept = await adminGet("/api/admin/portfolio");
  assert.deepEqual(kept.sections.faq, edited);
  assert.ok(!state.bulkOps.some((o) => o.updateOne.filter.section === "faq"));
});

test("untouched old experience and certificates are upgraded to the corrected defaults", async () => {
  const legacy = require("../data/legacy-defaults");
  state.bulkOps.length = 0;
  state.docs = [
    { section: "experience", data: legacy.experience[0] },
    { section: "certificates", data: legacy.certificates[0] }
  ];
  const data = await adminGet("/api/admin/portfolio");
  assert.equal(data.sections.certificates.length, defaults.certificates.length);
  assert.ok(data.sections.certificates.some((c) => /^WE \(Telecom Egypt\) — Android Development Internship$/.test(c.title)));
  assert.ok(data.sections.certificates.some((c) => c.kind === "letter"));
  const we = data.sections.experience.find((e) => /^WE/.test(e.company));
  assert.equal(we.media.length, 1);
  assert.match(we.media[0].src, /Experience_Letter_WE\.png$/); // its own letter, not another company's
  const sections = state.bulkOps.map((o) => o.updateOne.filter.section);
  assert.ok(sections.includes("experience") && sections.includes("certificates"));
});

test("the previous (corrected-but-WE-less) experience and certificates also upgrade", async () => {
  const legacy = require("../data/legacy-defaults");
  assert.ok(legacy.experience.length >= 2 && legacy.certificates.length >= 2);
  state.bulkOps.length = 0;
  state.docs = [
    { section: "experience", data: legacy.experience[legacy.experience.length - 1] },
    { section: "certificates", data: legacy.certificates[legacy.certificates.length - 1] }
  ];
  const data = await adminGet("/api/admin/portfolio");
  assert.ok(data.sections.certificates.some((c) => /^WE \(Telecom Egypt\) — Android Development Internship$/.test(c.title)));
  assert.ok(data.sections.experience.find((e) => /^WE/.test(e.company)).media.length === 1);
});

test("the WE letter is added to edited stored content without touching the owner's edits", async () => {
  const live = {
    experience: [
      { company: "WE (Telecom Egypt)", role: "Android Development Intern", points: ["My own edited point"], mediaBadge: "📜 Experience Letter" },
      { company: "Cairo Higher Institute", role: "IT", points: [], media: [{ src: "x.jpg", alt: "x" }] }
    ],
    certificates: [{ title: "My own certificate", issuer: "Me", kind: "certificate", image: "a.png", pdf: "a.png" }]
  };
  state.bulkOps.length = 0;
  state.docs = [
    { section: "experience", data: JSON.parse(JSON.stringify(live.experience)) },
    { section: "certificates", data: JSON.parse(JSON.stringify(live.certificates)) }
  ];
  const data = await adminGet("/api/admin/portfolio");
  const we = data.sections.experience.find((e) => /^WE/.test(e.company));
  assert.equal(we.media.length, 1);
  assert.match(we.media[0].src, /Experience_Letter_WE\.png$/);
  assert.deepEqual(we.points, ["My own edited point"]); // edits kept
  assert.equal(data.sections.experience[1].media[0].src, "x.jpg"); // other cards untouched
  assert.equal(data.sections.certificates[0].title, "WE (Telecom Egypt) — Android Development Internship"); // letter added, then given the shared title
  assert.equal(data.sections.certificates[1].title, "My own certificate");
  const marker = state.bulkOps.find((o) => o.updateOne.filter.section === "_migrations");
  assert.ok(marker && marker.updateOne.upsert && marker.updateOne.update.$set.data.applied.length === 3);

  // already applied -> nothing is added again, even if the owner removed the letter
  state.bulkOps.length = 0;
  state.docs = [
    { section: "experience", data: [{ company: "WE (Telecom Egypt)", role: "x", points: [] }] },
    { section: "certificates", data: [{ title: "Only mine", issuer: "Me" }] },
    { section: "_migrations", data: { applied: marker.updateOne.update.$set.data.applied } }
  ];
  const again = await adminGet("/api/admin/portfolio");
  assert.equal(again.sections.certificates.length, 1);
  assert.equal(again.sections.experience[0].media, undefined);
  assert.ok(!state.bulkOps.some((o) => o.updateOne.filter.section === "_migrations"));
});

test("a stored certificate and its letter get the same title so they merge into one block", async () => {
  state.bulkOps.length = 0;
  state.docs = [
    {
      section: "certificates",
      data: [
        { title: "TAQA Arabia Software Internship Certificate", issuer: "TAQA", kind: "certificate", image: "c.jpg", pdf: "c.jpg", desc: "my own text" },
        { title: "TAQA Arabia Experience Letter (Software Development)", issuer: "TAQA", kind: "letter", image: "l.jpg", pdf: "l.jpg" },
        { title: "Cisco C Essentials 1 Certification", issuer: "Cisco", kind: "certificate", image: "b.png", pdf: "x.pdf" }
      ]
    },
    { section: "_migrations", data: { applied: ["2026-10-we-letter-experience", "2026-10-we-letter-certificates"] } }
  ];
  const data = await adminGet("/api/admin/portfolio");
  const titles = data.sections.certificates.map((c) => c.title);
  assert.deepEqual(titles, ["TAQA Arabia — Software Development Internship", "TAQA Arabia — Software Development Internship", "Cisco C Essentials 1 Certification"]);
  assert.equal(data.sections.certificates[0].desc, "my own text"); // everything else untouched
});
