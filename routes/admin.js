/**
 * Private admin API used by the admin mobile app.
 *
 * Every route requires the `x-admin-key` header to match the ADMIN_API_KEY secret.
 * If ADMIN_API_KEY is not configured (or is too short) the whole API is disabled.
 */
const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const { getKey } = require("../keys");
const githubLib = require("../lib/github");
const { CV_SECTIONS } = require("../lib/cv-tex");
const { buildCvSections } = require("../lib/cv-sync");

const MIN_KEY_LENGTH = 20;
const MAX_FAILED_ATTEMPTS = 10;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const failedAttempts = new Map();

// Section name -> { type, required identifying field } for content validation
const SECTION_RULES = {
  profile: { type: "object", required: "name" },
  education: { type: "array", required: "institution" },
  activities: { type: "array", required: "name" },
  experience: { type: "array", required: "company" },
  projects: { type: "array", required: "name" },
  featuredStack: { type: "array", required: "name" },
  technicalSkills: { type: "array", required: "category" },
  softSkills: { type: "array", required: "title" },
  languages: { type: "array", required: "name" },
  certificates: { type: "array", required: "title" },
  site: { type: "object", required: "home_eyebrow" },
  heroPills: { type: "array", required: "label" },
  heroBadges: { type: "array", required: "text" },
  heroSlides: { type: "array", required: "title" },
  stats: { type: "array", required: "label" },
  gateways: { type: "array", required: "title" },
  faq: { type: "array", required: "question" },
  cvSummary: { type: "object", required: "summary" },
  cvExperience: { type: "array", required: "company" },
  cvProjects: { type: "array", required: "name" },
  cvSkills: { type: "array", required: "label" },
  cvSoftSkills: { type: "array", required: "text" },
  cvEducation: { type: "array", required: "institution" },
  cvLanguages: { type: "array", required: "text" }
};

const STAT_SOURCES = ["github_repos", "lines_of_code", "commits", "technologies", "projects", "skill_categories", "certificates", "internships", "fixed"];

const MAX_STRING_LENGTH = 5000;
const MAX_DEPTH = 4;
const MAX_ITEMS = 100;

const sha256 = (value) => crypto.createHash("sha256").update(String(value)).digest();

const clientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) return forwarded.split(",")[0].trim();
  return req.ip || (req.socket && req.socket.remoteAddress) || "unknown";
};

const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

/** Throws an Error with a readable message when the value is not safe, plain JSON content. */
function assertCleanJson(value, depth = 0) {
  if (depth > MAX_DEPTH) throw new Error("Content is nested too deeply.");
  if (typeof value === "string") {
    if (value.length > MAX_STRING_LENGTH) throw new Error(`A text value is longer than ${MAX_STRING_LENGTH} characters.`);
    return;
  }
  if (value === null || typeof value === "number" || typeof value === "boolean") return;
  if (Array.isArray(value)) {
    if (value.length > MAX_ITEMS) throw new Error(`A list has more than ${MAX_ITEMS} entries.`);
    value.forEach((v) => assertCleanJson(v, depth + 1));
    return;
  }
  if (isPlainObject(value)) {
    Object.keys(value).forEach((key) => {
      if (key === "__proto__" || key === "constructor" || key === "prototype" || key.startsWith("$") || key.includes(".")) {
        throw new Error(`Field name "${key}" is not allowed.`);
      }
      assertCleanJson(value[key], depth + 1);
    });
    return;
  }
  throw new Error("Unsupported value type.");
}

function validateSection(section, data) {
  const rule = SECTION_RULES[section];
  if (!rule) throw new Error(`Unknown section "${section}".`);
  if (rule.type === "array") {
    if (!Array.isArray(data)) throw new Error(`"${section}" must be a list.`);
    data.forEach((item, i) => {
      if (!isPlainObject(item)) throw new Error(`Item ${i + 1} must be an object.`);
      const identifier = item[rule.required];
      if (typeof identifier !== "string" || !identifier.trim()) {
        throw new Error(`Item ${i + 1} needs a non-empty "${rule.required}".`);
      }
    });
  } else {
    if (!isPlainObject(data)) throw new Error(`"${section}" must be an object.`);
    const identifier = data[rule.required];
    if (typeof identifier !== "string" || !identifier.trim()) throw new Error(`"${rule.required}" is required.`);
  }
  if (section === "stats") {
    data.forEach((item, i) => {
      if (!STAT_SOURCES.includes(item.source)) {
        throw new Error(`Stat ${i + 1}: "source" must be one of ${STAT_SOURCES.join(", ")}.`);
      }
      if (item.source === "fixed" && typeof item.value !== "number") {
        throw new Error(`Stat ${i + 1}: a fixed stat needs a numeric "value".`);
      }
    });
  }
  assertCleanJson(data);
}

/**
 * Builds an Express guard that checks a secret header against an environment secret.
 * Disabled (503) while the secret is unset or short; repeated failures lock the caller out.
 */
function makeKeyGuard({ secretName, header, label }) {
  const attempts = new Map();
  return function guard(req, res, next) {
    const expected = getKey(secretName);
    if (!expected || String(expected).length < MIN_KEY_LENGTH) {
      return res.status(503).json({
        ok: false,
        error: `${label} is disabled. Set ${secretName} (at least ${MIN_KEY_LENGTH} characters) on the server.`
      });
    }

    const ip = clientIp(req);
    const record = attempts.get(ip);
    if (record && record.count >= MAX_FAILED_ATTEMPTS && Date.now() - record.first < LOCKOUT_WINDOW_MS) {
      return res.status(429).json({ ok: false, error: "Too many failed attempts. Try again later." });
    }

    const provided = header === "authorization" ? String(req.headers.authorization || "").replace(/^Bearer\s+/i, "") : req.headers[header];
    const valid = typeof provided === "string" && provided.length > 0 && crypto.timingSafeEqual(sha256(provided), sha256(expected));
    if (!valid) {
      const now = Date.now();
      if (!record || now - record.first >= LOCKOUT_WINDOW_MS) attempts.set(ip, { count: 1, first: now });
      else record.count += 1;
      return res.status(401).json({ ok: false, error: `Invalid ${label.toLowerCase()} key.` });
    }

    attempts.delete(ip);
    next();
  };
}

const requireAdmin = makeKeyGuard({ secretName: "ADMIN_API_KEY", header: "x-admin-key", label: "Admin API" });

/**
 * @param {object} deps
 * @param {object} deps.portfolioData live content object served by /api/portfolio
 * @param {object} deps.defaults pristine copy of the built-in content
 * @param {Function} deps.connectDB resolves a connection or null when no database is configured
 * @param {object} deps.models { Review, Contact, Star }
 * @param {Function} deps.saveOverride (section, data|null) => Promise persist or remove an override
 * @param {Function} deps.refreshOverrides (force) => Promise reload overrides into portfolioData
 * @param {Function} deps.overriddenSections () => string[] sections that differ from the built-in content
 * @param {Function} deps.fetchRepos (username) => Promise<GitHub repo[]>
 * @param {object} [deps.changes] change service (lib/changes.js) and deps.runSync() => proposes new GitHub projects
 * @param {object} [deps.contacts] contacts vault (lib/contacts.js)
 * @param {object} [deps.cv] CV builder (lib/cv-build.js); when present, saving CV-related content requests a rebuild
 */
function createAdminRouter(deps) {
  const { portfolioData, defaults, connectDB, models, saveOverride, refreshOverrides, overriddenSections, fetchRepos, cv, changes, runSync, contacts } = deps;
  const router = express.Router();
  router.use(requireAdmin);

  const needDb = async (res) => {
    const db = await connectDB();
    if (!db) {
      res.status(503).json({ ok: false, error: "Database is not connected. Check MONGODB_URI on the server." });
      return null;
    }
    return db;
  };

  const text = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");
  const handle = (fn) => async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  };

  /** Asks for a CV rebuild after content that appears on the CV changed (never fails the save). */
  const cvAfterSave = async (section) => {
    if (!cv || !CV_SECTIONS.includes(section)) return null;
    try {
      return await cv.requestBuild(`edited ${section}`);
    } catch {
      return null;
    }
  };

  router.get("/ping", (req, res) => res.json({ ok: true, message: "Admin API reachable" }));

  router.get(
    "/summary",
    handle(async (req, res) => {
      const db = await connectDB();
      const summary = { ok: true, dbConnected: Boolean(db), overridden: overriddenSections() };
      if (contacts) {
        try {
          summary.contacts = (await contacts.list({ status: "all" })).counts.active;
        } catch {
          summary.contacts = null;
        }
      }
      if (changes) {
        try {
          summary.pendingChanges = (await changes.store.list("pending")).length;
        } catch {
          summary.pendingChanges = null;
        }
      }
      if (db) {
        const [reviews, messages, star] = await Promise.all([
          models.Review.countDocuments(),
          models.Contact.countDocuments(),
          models.Star.findOne({ key: "star_count" }).lean()
        ]);
        Object.assign(summary, { reviews, messages, stars: star ? star.stars : null });
      }
      res.json(summary);
    })
  );

  // ---- Portfolio content -------------------------------------------------
  router.get(
    "/portfolio",
    handle(async (req, res) => {
      await refreshOverrides(true);
      const sections = {};
      Object.keys(SECTION_RULES).forEach((name) => {
        sections[name] = portfolioData[name];
      });
      res.json({ ok: true, sections, overridden: overriddenSections() });
    })
  );

  router.put(
    "/portfolio/:section",
    handle(async (req, res) => {
      const { section } = req.params;
      const data = req.body && req.body.data;
      try {
        validateSection(section, data);
      } catch (err) {
        return res.status(400).json({ ok: false, error: err.message });
      }
      await saveOverride(section, data);
      portfolioData[section] = data;
      const build = await cvAfterSave(section);
      res.json({ ok: true, section, data, cvBuildRequested: Boolean(build) });
    })
  );

  // "Reset" restores the built-in content for a section (and stores it, so the database stays complete).
  router.delete(
    "/portfolio/:section",
    handle(async (req, res) => {
      const { section } = req.params;
      if (!SECTION_RULES[section]) return res.status(400).json({ ok: false, error: `Unknown section "${section}".` });
      const restored = JSON.parse(JSON.stringify(defaults[section]));
      await saveOverride(section, restored);
      portfolioData[section] = restored;
      const build = await cvAfterSave(section);
      res.json({ ok: true, section, data: restored, cvBuildRequested: Boolean(build) });
    })
  );

  // ---- GitHub: find repositories that are not in the portfolio yet and import them ----
  const githubRepos = async (res) => {
    const username = githubLib.usernameFromProfile(portfolioData.profile);
    if (!username) {
      res.status(400).json({ ok: false, error: "Set your GitHub link in the Profile first." });
      return null;
    }
    try {
      return { username, repos: await fetchRepos(username) };
    } catch (err) {
      res.status(502).json({ ok: false, error: `Could not reach GitHub: ${err.message}` });
      return null;
    }
  };

  router.get(
    "/github/new",
    handle(async (req, res) => {
      const result = await githubRepos(res);
      if (!result) return;
      const fresh = githubLib.newRepos(result.repos, portfolioData.projects);
      res.json({
        ok: true,
        username: result.username,
        total: result.repos.length,
        repos: fresh.map((r) => ({
          name: r.name,
          description: r.description || "",
          language: r.language || "",
          stars: r.stargazers_count || 0,
          createdAt: r.created_at,
          project: githubLib.repoToProject(r)
        }))
      });
    })
  );

  router.post(
    "/github/import",
    handle(async (req, res) => {
      const wanted = req.body && req.body.repos;
      if (!Array.isArray(wanted) || !wanted.length || wanted.some((n) => typeof n !== "string")) {
        return res.status(400).json({ ok: false, error: "repos must be a non-empty list of repository names." });
      }
      const result = await githubRepos(res);
      if (!result) return;
      const wantedSet = new Set(wanted.map((n) => n.toLowerCase()));
      const toAdd = githubLib
        .newRepos(result.repos, portfolioData.projects)
        .filter((r) => wantedSet.has(String(r.name).toLowerCase()));
      if (!toAdd.length) return res.status(404).json({ ok: false, error: "Those repositories were not found or are already in your projects." });

      const next = [...portfolioData.projects, ...toAdd.map(githubLib.repoToProject)];
      try {
        validateSection("projects", next);
      } catch (err) {
        return res.status(400).json({ ok: false, error: err.message });
      }
      await saveOverride("projects", next);
      portfolioData.projects = next;
      res.json({ ok: true, added: toAdd.map((r) => r.name), total: next.length });
    })
  );

  // ---- CV ----------------------------------------------------------------
  router.get(
    "/cv",
    handle(async (req, res) => {
      if (!cv) return res.status(503).json({ ok: false, error: "CV builder is not configured." });
      const state = await cv.getState();
      const runnerConfigured = String(getKey("CV_BUILD_KEY") || "").length >= MIN_KEY_LENGTH;
      res.json({
        ok: true,
        status: state.status || "idle",
        requestedAt: state.requestedAt || null,
        builtAt: state.builtAt || null,
        version: state.version || 0,
        reason: state.reason || null,
        pages: state.pages || null,
        error: state.error || null,
        url: state.version ? `/api/document/resume?v=${state.version}` : null,
        runnerConfigured
      });
    })
  );

  router.post(
    "/cv/rebuild",
    handle(async (req, res) => {
      if (!cv) return res.status(503).json({ ok: false, error: "CV builder is not configured." });
      const build = await cv.requestBuild("manual rebuild");
      res.json({ ok: true, ...build });
    })
  );

  // Copies the portfolio's experience, projects and skills into the CV sections, then rebuilds
  router.post(
    "/cv/refresh",
    handle(async (req, res) => {
      if (!cv) return res.status(503).json({ ok: false, error: "CV builder is not configured." });
      const sections = buildCvSections(portfolioData);
      for (const [name, data] of Object.entries(sections)) {
        try {
          validateSection(name, data);
        } catch (err) {
          return res.status(400).json({ ok: false, error: err.message });
        }
      }
      for (const [name, data] of Object.entries(sections)) {
        await saveOverride(name, data);
        portfolioData[name] = data;
      }
      const build = await cv.requestBuild("CV refreshed from portfolio");
      res.json({
        ok: true,
        experience: sections.cvExperience.length,
        projects: sections.cvProjects.length,
        skills: sections.cvSkills.length,
        ...build
      });
    })
  );

  router.get(
    "/cv/source",
    handle(async (req, res) => {
      if (!cv) return res.status(503).json({ ok: false, error: "CV builder is not configured." });
      res.type("text/plain").send((await cv.source()).tex);
    })
  );

  // ---- Automatic changes waiting for a decision ---------------------------------
  const needChanges = (res) => {
    if (changes) return true;
    res.status(503).json({ ok: false, error: "Change approval is not configured." });
    return false;
  };

  router.get(
    "/changes",
    handle(async (req, res) => {
      if (!needChanges(res)) return;
      const status = ["pending", "applied", "rejected", "failed", "all"].includes(req.query.status) ? req.query.status : "pending";
      res.json({ ok: true, changes: await changes.store.list(status) });
    })
  );

  router.post(
    "/changes/sync",
    handle(async (req, res) => {
      if (!needChanges(res)) return;
      try {
        const result = await runSync();
        res.json({ ok: true, ...result });
      } catch (err) {
        res.status(502).json({ ok: false, error: `Could not check GitHub: ${err.message}` });
      }
    })
  );

  router.post(
    "/changes/:code/approve",
    handle(async (req, res) => {
      if (!needChanges(res)) return;
      const result = await changes.approve(req.params.code, "app");
      res.status(result.ok ? 200 : result.change ? 500 : 404).json(result);
    })
  );

  router.post(
    "/changes/:code/reject",
    handle(async (req, res) => {
      if (!needChanges(res)) return;
      const result = await changes.reject(req.params.code, "app");
      res.status(result.ok ? 200 : 404).json(result);
    })
  );

  router.patch(
    "/changes/:code",
    handle(async (req, res) => {
      if (!needChanges(res)) return;
      const { index, fields } = req.body || {};
      const result = await changes.modify(req.params.code, { index: Number(index) || 0, fields: fields && typeof fields === "object" ? fields : {} });
      res.status(result.ok ? 200 : 400).json(result);
    })
  );

  // ---- Contacts vault (no hard delete; edits keep history; CSV export) -------------
  const needContacts = (res) => {
    if (contacts) return true;
    res.status(503).json({ ok: false, error: "Contacts vault is not configured." });
    return false;
  };
  const contactResult = (res, result) => res.status(result.ok ? 200 : result.duplicate ? 409 : 400).json(result);

  router.get(
    "/contacts",
    handle(async (req, res) => {
      if (!needContacts(res)) return;
      const status = ["active", "trashed", "all"].includes(req.query.status) ? req.query.status : "active";
      res.json({ ok: true, ...(await contacts.list({ status, q: String(req.query.q || "").slice(0, 80) })) });
    })
  );

  router.get(
    "/contacts/export",
    handle(async (req, res) => {
      if (!needContacts(res)) return;
      const status = ["active", "trashed", "all"].includes(req.query.status) ? req.query.status : "active";
      const { csv, count } = await contacts.exportCsv(status);
      res.json({ ok: true, filename: `contacts-${new Date().toISOString().slice(0, 10)}.csv`, count, csv });
    })
  );

  router.post(
    "/contacts/import",
    handle(async (req, res) => {
      if (!needContacts(res)) return;
      const text = req.body && req.body.text;
      if (typeof text !== "string" || !text.trim()) return res.status(400).json({ ok: false, error: "Paste some numbers or a vCard first." });
      if (text.length > 400000) return res.status(400).json({ ok: false, error: "That is too much text at once; import in smaller parts." });
      res.json({ ok: true, ...(await contacts.importText(text, "import")) });
    })
  );

  router.post(
    "/contacts",
    handle(async (req, res) => {
      if (!needContacts(res)) return;
      contactResult(res, await contacts.add(req.body || {}, "app"));
    })
  );

  router.put(
    "/contacts/:id",
    handle(async (req, res) => {
      if (!needContacts(res)) return;
      contactResult(res, await contacts.edit(req.params.id, req.body || {}, "app"));
    })
  );

  router.delete(
    "/contacts/:id",
    handle(async (req, res) => {
      if (!needContacts(res)) return;
      const result = await contacts.trash(req.params.id, "app");
      res.status(result.ok ? 200 : 404).json(result);
    })
  );

  router.post(
    "/contacts/:id/restore",
    handle(async (req, res) => {
      if (!needContacts(res)) return;
      const result = await contacts.restore(req.params.id, "app");
      res.status(result.ok ? 200 : 404).json(result);
    })
  );

  // ---- Reviews -----------------------------------------------------------
  const reviewFields = (body) => {
    const name = text(body.name, 100);
    const comment = text(body.comment, 2000);
    if (!name || !comment) return { error: "Name and comment are required." };
    const rating = Math.min(5, Math.max(1, parseInt(body.rating, 10) || 5));
    return {
      fields: { name, role: text(body.role, 150) || "Visitor / Developer", rating, comment }
    };
  };

  router.get(
    "/reviews",
    handle(async (req, res) => {
      if (!(await needDb(res))) return;
      const reviews = await models.Review.find().sort({ createdAt: -1 }).limit(200).lean();
      res.json({
        ok: true,
        reviews: reviews.map((r) => ({
          id: String(r._id),
          name: r.name,
          role: r.role,
          rating: r.rating,
          comment: r.comment,
          date: r.date
        }))
      });
    })
  );

  router.post(
    "/reviews",
    handle(async (req, res) => {
      if (!(await needDb(res))) return;
      const { fields, error } = reviewFields(req.body || {});
      if (error) return res.status(400).json({ ok: false, error });
      const created = await models.Review.create({ ...fields, date: new Date().toISOString().split("T")[0] });
      res.json({ ok: true, id: String(created._id) });
    })
  );

  router.put(
    "/reviews/:id",
    handle(async (req, res) => {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ ok: false, error: "Invalid id." });
      if (!(await needDb(res))) return;
      const { fields, error } = reviewFields(req.body || {});
      if (error) return res.status(400).json({ ok: false, error });
      const updated = await models.Review.findByIdAndUpdate(req.params.id, fields, { new: true });
      if (!updated) return res.status(404).json({ ok: false, error: "Review not found." });
      res.json({ ok: true });
    })
  );

  router.delete(
    "/reviews/:id",
    handle(async (req, res) => {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ ok: false, error: "Invalid id." });
      if (!(await needDb(res))) return;
      const removed = await models.Review.findByIdAndDelete(req.params.id);
      if (!removed) return res.status(404).json({ ok: false, error: "Review not found." });
      res.json({ ok: true });
    })
  );

  // ---- Contact messages --------------------------------------------------
  router.get(
    "/messages",
    handle(async (req, res) => {
      if (!(await needDb(res))) return;
      const messages = await models.Contact.find().sort({ createdAt: -1 }).limit(200).lean();
      res.json({
        ok: true,
        messages: messages.map((m) => ({
          id: String(m._id),
          name: m.name,
          email: m.email,
          message: m.message,
          createdAt: m.createdAt
        }))
      });
    })
  );

  router.delete(
    "/messages/:id",
    handle(async (req, res) => {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ ok: false, error: "Invalid id." });
      if (!(await needDb(res))) return;
      const removed = await models.Contact.findByIdAndDelete(req.params.id);
      if (!removed) return res.status(404).json({ ok: false, error: "Message not found." });
      res.json({ ok: true });
    })
  );

  // ---- Star count --------------------------------------------------------
  router.put(
    "/stars",
    handle(async (req, res) => {
      const stars = Number(req.body && req.body.stars);
      if (!Number.isInteger(stars) || stars < 0 || stars > 1000000) {
        return res.status(400).json({ ok: false, error: "stars must be a whole number between 0 and 1,000,000." });
      }
      if (!(await needDb(res))) return;
      await models.Star.findOneAndUpdate({ key: "star_count" }, { stars }, { upsert: true, setDefaultsOnInsert: true });
      res.json({ ok: true, stars });
    })
  );

  return router;
}

module.exports = { createAdminRouter, requireAdmin, makeKeyGuard, validateSection, SECTION_RULES };
