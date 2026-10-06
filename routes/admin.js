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
  certificates: { type: "array", required: "title" }
};

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
  assertCleanJson(data);
}

function requireAdmin(req, res, next) {
  const expected = getKey("ADMIN_API_KEY");
  if (!expected || String(expected).length < MIN_KEY_LENGTH) {
    return res.status(503).json({
      ok: false,
      error: `Admin API is disabled. Set ADMIN_API_KEY (at least ${MIN_KEY_LENGTH} characters) on the server.`
    });
  }

  const ip = clientIp(req);
  const record = failedAttempts.get(ip);
  if (record && record.count >= MAX_FAILED_ATTEMPTS && Date.now() - record.first < LOCKOUT_WINDOW_MS) {
    return res.status(429).json({ ok: false, error: "Too many failed attempts. Try again later." });
  }

  const provided = req.headers["x-admin-key"];
  const valid = typeof provided === "string" && crypto.timingSafeEqual(sha256(provided), sha256(expected));
  if (!valid) {
    const now = Date.now();
    if (!record || now - record.first >= LOCKOUT_WINDOW_MS) failedAttempts.set(ip, { count: 1, first: now });
    else record.count += 1;
    return res.status(401).json({ ok: false, error: "Invalid admin key." });
  }

  failedAttempts.delete(ip);
  next();
}

/**
 * @param {object} deps
 * @param {object} deps.portfolioData live content object served by /api/portfolio
 * @param {object} deps.defaults pristine copy of the built-in content
 * @param {Function} deps.connectDB resolves a connection or null when no database is configured
 * @param {object} deps.models { Review, Contact, Star }
 * @param {Function} deps.saveOverride (section, data|null) => Promise persist or remove an override
 * @param {Function} deps.refreshOverrides (force) => Promise reload overrides into portfolioData
 * @param {Function} deps.overriddenSections () => string[]
 */
function createAdminRouter(deps) {
  const { portfolioData, defaults, connectDB, models, saveOverride, refreshOverrides, overriddenSections } = deps;
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

  router.get("/ping", (req, res) => res.json({ ok: true, message: "Admin API reachable" }));

  router.get(
    "/summary",
    handle(async (req, res) => {
      const db = await connectDB();
      const summary = { ok: true, dbConnected: Boolean(db), overridden: overriddenSections() };
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
      res.json({ ok: true, section, data });
    })
  );

  router.delete(
    "/portfolio/:section",
    handle(async (req, res) => {
      const { section } = req.params;
      if (!SECTION_RULES[section]) return res.status(400).json({ ok: false, error: `Unknown section "${section}".` });
      await saveOverride(section, null);
      portfolioData[section] = JSON.parse(JSON.stringify(defaults[section]));
      res.json({ ok: true, section, data: portfolioData[section] });
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

module.exports = { createAdminRouter, requireAdmin, validateSection, SECTION_RULES };
