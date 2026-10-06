const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const mongoose = require("mongoose");
const express = require("express");

process.env.ADMIN_API_KEY = "test-admin-key-0123456789abcdef";
const KEY = process.env.ADMIN_API_KEY;

const { createAdminRouter, validateSection } = require("../routes/admin");

// ---- minimal in-memory stand-ins for the mongoose models ----------------
const makeCollection = (seed = []) => {
  const docs = [...seed];
  const chain = (arr) => ({
    sort: () => chain(arr),
    limit: () => chain(arr),
    lean: async () => arr.map((d) => ({ ...d }))
  });
  return {
    docs,
    countDocuments: async () => docs.length,
    find: () => chain([...docs].reverse()),
    findOne: (q) => ({ lean: async () => docs.find((d) => Object.entries(q).every(([k, v]) => d[k] === v)) || null }),
    create: async (doc) => {
      const created = { _id: new mongoose.Types.ObjectId(), ...doc };
      docs.push(created);
      return created;
    },
    findByIdAndUpdate: async (id, fields) => {
      const doc = docs.find((d) => String(d._id) === String(id));
      if (doc) Object.assign(doc, fields);
      return doc || null;
    },
    findByIdAndDelete: async (id) => {
      const i = docs.findIndex((d) => String(d._id) === String(id));
      return i === -1 ? null : docs.splice(i, 1)[0];
    },
    findOneAndUpdate: async (q, fields) => {
      let doc = docs.find((d) => Object.entries(q).every(([k, v]) => d[k] === v));
      if (!doc) {
        doc = { ...q };
        docs.push(doc);
      }
      Object.assign(doc, fields);
      return doc;
    }
  };
};

const githubRepos = [
  { name: "P1", html_url: "https://github.com/me/P1", description: "already listed", language: "Dart", created_at: "2026-01-05T00:00:00Z" },
  { name: "new_cool-app", html_url: "https://github.com/me/new_cool-app", description: "A new repo", language: "Kotlin", topics: ["android", "jetpack-compose"], created_at: "2026-09-12T10:00:00Z", stargazers_count: 3 }
];

const buildApp = ({ dbConnected = true } = {}) => {
  const defaults = {
    profile: { name: "Zayd" },
    education: [{ institution: "MIU" }],
    activities: [],
    experience: [{ company: "TAQA", points: ["a"] }],
    projects: [{ name: "P1", stack: "x" }],
    featuredStack: [],
    technicalSkills: [],
    softSkills: [],
    languages: [],
    certificates: [],
    site: { home_eyebrow: "Hello" },
    heroPills: [],
    heroBadges: [],
    heroSlides: [],
    stats: [],
    gateways: [],
    faq: []
  };
  const portfolioData = JSON.parse(JSON.stringify(defaults));
  const overrides = {};
  const models = {
    Review: makeCollection([{ _id: new mongoose.Types.ObjectId(), name: "A", role: "r", rating: 5, comment: "c", date: "2026-01-01" }]),
    Contact: makeCollection([{ _id: new mongoose.Types.ObjectId(), name: "B", email: "b@x.com", message: "hi", createdAt: new Date() }]),
    Star: makeCollection([{ key: "star_count", stars: 48 }])
  };
  const app = express();
  app.use(express.json());
  app.use(
    "/api/admin",
    createAdminRouter({
      portfolioData,
      defaults,
      connectDB: async () => (dbConnected ? {} : null),
      models,
      saveOverride: async (section, data) => {
        if (data === null) delete overrides[section];
        else overrides[section] = data;
      },
      refreshOverrides: async () => {},
      overriddenSections: () => Object.keys(overrides),
      fetchRepos: async () => githubRepos
    })
  );
  return { app, portfolioData, overrides, models };
};

const withServer = async (app, fn) => {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, path, { body, key = KEY, headers = {} } = {}) => {
    const res = await fetch(base + path, {
      method,
      headers: { "content-type": "application/json", ...(key ? { "x-admin-key": key } : {}), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    return { status: res.status, json: await res.json() };
  };
  try {
    await fn(call);
  } finally {
    server.close();
  }
};

test("rejects missing and wrong keys, accepts the right one", async () => {
  await withServer(buildApp().app, async (call) => {
    assert.equal((await call("GET", "/api/admin/ping", { key: null })).status, 401);
    assert.equal((await call("GET", "/api/admin/ping", { key: "nope" })).status, 401);
    const ok = await call("GET", "/api/admin/ping");
    assert.equal(ok.status, 200);
    assert.equal(ok.json.ok, true);
  });
});

test("locks out an address after repeated failures", async () => {
  await withServer(buildApp().app, async (call) => {
    let last;
    for (let i = 0; i < 12; i += 1) last = await call("GET", "/api/admin/ping", { key: "bad", headers: { "x-forwarded-for": "9.9.9.9" } });
    assert.equal(last.status, 429);
    // a different address is unaffected
    assert.equal((await call("GET", "/api/admin/ping", { headers: { "x-forwarded-for": "8.8.8.8" } })).status, 200);
  });
});

test("API is disabled when the secret is missing or too short", async () => {
  const saved = process.env.ADMIN_API_KEY;
  try {
    process.env.ADMIN_API_KEY = "short";
    await withServer(buildApp().app, async (call) => {
      assert.equal((await call("GET", "/api/admin/ping", { key: "short" })).status, 503);
    });
    delete process.env.ADMIN_API_KEY;
    await withServer(buildApp().app, async (call) => {
      assert.equal((await call("GET", "/api/admin/ping", { key: "anything" })).status, 503);
    });
  } finally {
    process.env.ADMIN_API_KEY = saved;
  }
});

test("summary reports counts and database state", async () => {
  await withServer(buildApp().app, async (call) => {
    const { json } = await call("GET", "/api/admin/summary");
    assert.deepEqual(
      { reviews: json.reviews, messages: json.messages, stars: json.stars, db: json.dbConnected },
      { reviews: 1, messages: 1, stars: 48, db: true }
    );
  });
  await withServer(buildApp({ dbConnected: false }).app, async (call) => {
    const { json } = await call("GET", "/api/admin/summary");
    assert.equal(json.dbConnected, false);
    assert.equal(json.reviews, undefined);
  });
});

test("portfolio sections: edit, validate, and reset to default", async () => {
  const { app, portfolioData, overrides } = buildApp();
  await withServer(app, async (call) => {
    const edited = [{ name: "P1 renamed", stack: "Dart", period: "May 2026" }, { name: "P2" }];
    const put = await call("PUT", "/api/admin/portfolio/projects", { body: { data: edited } });
    assert.equal(put.status, 200);
    assert.deepEqual(portfolioData.projects, edited);
    assert.deepEqual(overrides.projects, edited);

    const listed = await call("GET", "/api/admin/portfolio");
    assert.equal(listed.json.sections.projects.length, 2);
    assert.deepEqual(listed.json.overridden, ["projects"]);

    const reset = await call("DELETE", "/api/admin/portfolio/projects");
    assert.equal(reset.status, 200);
    assert.deepEqual(portfolioData.projects, [{ name: "P1", stack: "x" }]);
    // reset stores the built-in content (the database stays complete) instead of deleting it
    assert.deepEqual(overrides.projects, [{ name: "P1", stack: "x" }]);

    const profile = await call("PUT", "/api/admin/portfolio/profile", { body: { data: { name: "Zayd A." } } });
    assert.equal(profile.status, 200);
  });
});

test("portfolio validation rejects bad content", async () => {
  await withServer(buildApp().app, async (call) => {
    const bad = async (section, data) => (await call("PUT", `/api/admin/portfolio/${section}`, { body: { data } })).status;
    assert.equal(await bad("nope", []), 400);
    assert.equal(await bad("projects", { name: "x" }), 400); // not a list
    assert.equal(await bad("projects", [{ stack: "no name" }]), 400);
    assert.equal(await bad("projects", [{ name: "   " }]), 400);
    assert.equal(await bad("projects", [{ name: "x", $where: "1" }]), 400);
    assert.equal(await bad("projects", [{ name: "x", notes: "y".repeat(5001) }]), 400);
    assert.equal(await bad("profile", [{ name: "x" }]), 400); // must be an object
    assert.equal((await call("DELETE", "/api/admin/portfolio/unknown")).status, 400);
  });
  assert.throws(() => validateSection("projects", [{ name: "x", ["__proto__"]: 1 }].map((o) => JSON.parse('{"name":"x","__proto__":{"a":1}}'))), /not allowed/);
});

test("reviews: create, edit, list, delete", async () => {
  await withServer(buildApp().app, async (call) => {
    const created = await call("POST", "/api/admin/reviews", { body: { name: "Sara", comment: "Great work", rating: 9 } });
    assert.equal(created.status, 200);
    const id = created.json.id;

    let list = await call("GET", "/api/admin/reviews");
    const mine = list.json.reviews.find((r) => r.id === id);
    assert.equal(mine.rating, 5); // clamped
    assert.equal(mine.role, "Visitor / Developer");

    assert.equal((await call("PUT", `/api/admin/reviews/${id}`, { body: { name: "Sara K", comment: "Updated", rating: 4, role: "CTO" } })).status, 200);
    list = await call("GET", "/api/admin/reviews");
    assert.equal(list.json.reviews.find((r) => r.id === id).comment, "Updated");

    assert.equal((await call("POST", "/api/admin/reviews", { body: { name: "", comment: "" } })).status, 400);
    assert.equal((await call("PUT", "/api/admin/reviews/not-an-id", { body: { name: "a", comment: "b" } })).status, 400);
    assert.equal((await call("DELETE", `/api/admin/reviews/${id}`)).status, 200);
    assert.equal((await call("DELETE", `/api/admin/reviews/${id}`)).status, 404);
  });
});

test("messages: list and delete", async () => {
  await withServer(buildApp().app, async (call) => {
    const { json } = await call("GET", "/api/admin/messages");
    assert.equal(json.messages.length, 1);
    assert.equal(json.messages[0].email, "b@x.com");
    assert.equal((await call("DELETE", `/api/admin/messages/${json.messages[0].id}`)).status, 200);
    assert.equal((await call("GET", "/api/admin/messages")).json.messages.length, 0);
  });
});

test("star count updates are validated", async () => {
  const { app, models } = buildApp();
  await withServer(app, async (call) => {
    assert.equal((await call("PUT", "/api/admin/stars", { body: { stars: 120 } })).status, 200);
    assert.equal(models.Star.docs[0].stars, 120);
    assert.equal((await call("PUT", "/api/admin/stars", { body: { stars: -1 } })).status, 400);
    assert.equal((await call("PUT", "/api/admin/stars", { body: { stars: "x" } })).status, 400);
  });
});

test("database-backed routes return 503 when the database is down", async () => {
  await withServer(buildApp({ dbConnected: false }).app, async (call) => {
    assert.equal((await call("GET", "/api/admin/reviews")).status, 503);
    assert.equal((await call("GET", "/api/admin/messages")).status, 503);
    assert.equal((await call("PUT", "/api/admin/stars", { body: { stars: 1 } })).status, 503);
  });
});

test("new sections validate (stats sources, faq, site)", async () => {
  await withServer(buildApp().app, async (call) => {
    const put = async (section, data) => (await call("PUT", `/api/admin/portfolio/${section}`, { body: { data } })).status;
    assert.equal(await put("faq", [{ question: "Q?", answer: "A" }]), 200);
    assert.equal(await put("faq", [{ answer: "no question" }]), 400);
    assert.equal(await put("site", { home_eyebrow: "Hi", about: "x" }), 200);
    assert.equal(await put("site", { about: "missing required key" }), 400);
    assert.equal(await put("stats", [{ label: "Repos", source: "github_repos" }]), 200);
    assert.equal(await put("stats", [{ label: "Years", source: "fixed", value: 3 }]), 200);
    assert.equal(await put("stats", [{ label: "Bad", source: "made_up" }]), 400);
    assert.equal(await put("stats", [{ label: "Fixed needs value", source: "fixed" }]), 400);
  });
});

test("GitHub: lists repositories that are not yet projects and imports them", async () => {
  const { app, portfolioData, overrides } = buildApp();
  portfolioData.profile.github = "https://github.com/me";
  portfolioData.projects = [{ name: "P1", github: "https://github.com/me/P1" }];
  await withServer(app, async (call) => {
    const listed = await call("GET", "/api/admin/github/new");
    assert.equal(listed.status, 200);
    assert.equal(listed.json.username, "me");
    assert.deepEqual(listed.json.repos.map((r) => r.name), ["new_cool-app"]);
    assert.deepEqual(listed.json.repos[0].project, {
      name: "New Cool App",
      period: "September 2026",
      stack: "Kotlin, Android, Jetpack Compose",
      image: "",
      github: "https://github.com/me/new_cool-app",
      description: "A new repo"
    });

    assert.equal((await call("POST", "/api/admin/github/import", { body: { repos: [] } })).status, 400);
    assert.equal((await call("POST", "/api/admin/github/import", { body: { repos: ["P1"] } })).status, 404); // already listed
    const imported = await call("POST", "/api/admin/github/import", { body: { repos: ["new_cool-app"] } });
    assert.equal(imported.status, 200);
    assert.deepEqual(imported.json.added, ["new_cool-app"]);
    assert.equal(portfolioData.projects.length, 2);
    assert.equal(overrides.projects.at(-1).name, "New Cool App");

    // nothing left to import afterwards
    assert.deepEqual((await call("GET", "/api/admin/github/new")).json.repos, []);
  });
});

test("GitHub: errors are reported clearly", async () => {
  const noProfile = buildApp();
  noProfile.portfolioData.profile.github = "";
  await withServer(noProfile.app, async (call) => {
    assert.equal((await call("GET", "/api/admin/github/new")).status, 400);
  });
});
