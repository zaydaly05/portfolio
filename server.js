const express = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { connectDB, Review, Star, Contact, CvConfig, LogRecord, PortfolioSection, CvBuild, CvFile } = require("./db");
const { getKey } = require("./keys");
const { createAdminRouter, requireAdmin, makeKeyGuard, SECTION_RULES } = require("./routes/admin");
const { createCvBuilder, dispatchWorkflow, CvBuildError } = require("./lib/cv-build");
const githubLib = require("./lib/github");
const { buildReply } = require("./lib/assistant");

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://res.cloudinary.com https://cdn.jsdelivr.net https://_vercel/ https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' data: blob: https: https://res.cloudinary.com https://github.com https://avatars.githubusercontent.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; media-src 'self' blob: https:; object-src 'self' https:; frame-src 'self' https:; connect-src 'self' https:; frame-ancestors 'self';"
  );
  next();
});

// Payload size limit to prevent memory exhaustion / payload flooding
// Keep the raw body so signed webhooks (WhatsApp) can be verified byte-for-byte
app.use(
  express.json({
    limit: "50kb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

// Basic In-Memory Rate Limiter for POST requests to prevent DDoS and spam abuse
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 mins
const MAX_POST_REQUESTS = 25; // max 25 POST requests per IP per window

const postRateLimiter = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  } else {
    clientData.count++;
  }

  rateLimitMap.set(ip, clientData);

  if (clientData.count > MAX_POST_REQUESTS) {
    return res.status(429).json({
      ok: false,
      error: "Too many requests. Please wait a few minutes before trying again."
    });
  }
  next();
};

// Normalize Vercel internal rewrites to ensure Express matches original requested URL while preserving query parameters
app.use((req, res, next) => {
  const matchedPath = req.headers["x-matched-path"] || req.headers["x-forwarded-uri"];
  if (matchedPath) {
    const queryIndex = req.url.indexOf("?");
    const queryString = queryIndex !== -1 ? req.url.slice(queryIndex) : "";
    req.url = matchedPath.includes("?") ? matchedPath : `${matchedPath}${queryString}`;
  }
  next();
});

// Input Sanitization Helper Function
const sanitize = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

// Serve assets from the Assets folder FIRST with explicit options
const assetCacheHeaders = (res, filePath) => {
  if (filePath.toLowerCase().endsWith(".pdf") || filePath.toLowerCase().includes("cv")) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="Zayd_Ali_Mohamed_CV.pdf"');
  } else {
    res.setHeader("Cache-Control", "public, max-age=86400");
  }
};

const assetDirs = [
  path.join(process.cwd(), "public", "assets"),
  path.join(process.cwd(), "Assets"),
  path.join(__dirname, "public", "assets"),
  path.join(__dirname, "..", "public", "assets"),
  path.join(__dirname, "Assets"),
  path.join(__dirname, "..", "Assets"),
  path.join(__dirname, "public"),
  path.join(__dirname, "..", "public"),
  path.join(process.cwd(), "public"),
  "/var/task/public/assets",
  "/var/task/public",
  "/var/task/Assets"
];

function findAssetFile(filename) {
  if (!filename) return null;
  const raw = filename.split("?")[0].split("#")[0];
  const decoded = decodeURIComponent(raw);
  const baseName = path.basename(decoded);
  const targets = [raw, decoded, baseName, "Zayd Ali Mohamed CV.pdf", "Zayd_Ali_Mohamed_CV.pdf", "cv.pdf"];

  for (const dir of assetDirs) {
    if (!fs.existsSync(dir)) continue;

    // First try exact paths
    for (const t of targets) {
      const file = path.join(dir, t);
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        return file;
      }
    }

    // Fallback: Case-insensitive scan for Linux / Vercel serverless
    try {
      const filesInDir = fs.readdirSync(dir);
      for (const t of targets) {
        const found = filesInDir.find(
          (f) =>
            f.toLowerCase() === t.toLowerCase() ||
            f.toLowerCase() === baseName.toLowerCase() ||
            (t.toLowerCase().endsWith(".pdf") &&
              f.toLowerCase().endsWith(".pdf") &&
              (f.toLowerCase().includes("zayd") || f.toLowerCase().includes("cv")))
        );
        if (found) {
          const matchFile = path.join(dir, found);
          if (fs.existsSync(matchFile) && fs.statSync(matchFile).isFile()) {
            return matchFile;
          }
        }
      }
    } catch {}
  }
  return null;
}

// High-priority asset interceptor (handles Vercel serverless query params, asset rewrites and direct static requests)
app.use((req, res, next) => {
  // The admin API must never be answered by the static asset / CV file lookup below
  if (req.path.startsWith("/api/admin/") || req.path.startsWith("/api/build/") || req.path.startsWith("/api/document/")) return next();
  const assetQuery = req.query.asset;
  const fullUrl = req.originalUrl || req.headers["x-matched-path"] || req.url || req.path || "";
  const match = fullUrl.match(/\/(assets\/)?(.+)$/);
  const assetPath = assetQuery || (match ? match[2] : null);

  if (
    assetPath &&
    (assetPath.toLowerCase().endsWith(".pdf") || fullUrl.toLowerCase().includes("cv") || fullUrl.includes("/assets/"))
  ) {
    const file = findAssetFile(assetPath);
    if (file) {
      assetCacheHeaders(res, file);
      if (file.toLowerCase().endsWith(".pdf")) {
        res.contentType("application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="Zayd_Ali_Mohamed_CV.pdf"');
      }
      return res.sendFile(file);
    }
  }
  next();
});

assetDirs.forEach((dir) => {
  app.use(
    "/assets",
    express.static(dir, {
      setHeaders: assetCacheHeaders
    })
  );
});

// Then serve public folder
app.use(
  express.static(path.join(process.cwd(), "public"), {
    index: false // Don't serve index.html for missing files
  })
);

app.use(
  express.static(path.join(__dirname, "..", "public"), {
    index: false
  })
);

// Built-in content lives in data/defaults.js. It seeds the database on first run and is the
// fallback if the database is unreachable; the database is the source of truth afterwards.
const portfolioDefaults = require("./data/defaults");
const portfolioData = JSON.parse(JSON.stringify(portfolioDefaults));

const getShowcaseManifest = () => {
  const manifestPath = path.join(__dirname, 'scripts', 'showcase', 'showcase-manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {}
  }
  return { projects: {} };
};

// In-Memory Ring Buffer for Telemetry Logs & Crash Records
const systemLogBuffer = [];
const MAX_LOG_BUFFER = 200;

app.get("/api/logs", requireAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const level = req.query.level;

    let dbLogs = [];
    try {
      const db = await connectDB();
      if (db) {
        const query = level ? { level } : {};
        dbLogs = await LogRecord.find(query).sort({ timestamp: -1 }).limit(limit).lean();
      }
    } catch (_e) {}

    let combinedLogs = [...systemLogBuffer];
    if (dbLogs.length > 0) {
      const existingIds = new Set(combinedLogs.map((l) => l.id || l.logId));
      for (const d of dbLogs) {
        const recordId = d.logId || (d._id ? d._id.toString() : Math.random().toString(36).substr(2, 9));
        if (!existingIds.has(recordId)) {
          combinedLogs.push({
            id: recordId,
            timestamp: d.timestamp,
            level: d.level,
            message: d.message,
            details: d.details,
            url: d.url,
            path: d.path,
            ip: d.ip,
            userAgent: d.userAgent
          });
        }
      }
    }

    combinedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (level) {
      combinedLogs = combinedLogs.filter((l) => l.level === level);
    }

    res.json({
      success: true,
      count: combinedLogs.length,
      logs: combinedLogs.slice(0, limit)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, logs: systemLogBuffer });
  }
});

app.post("/api/logs", async (req, res) => {
  try {
    const logData = req.body || {};
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

    const entry = {
      id: logData.id || Math.random().toString(36).substring(2, 11),
      timestamp: logData.timestamp || new Date().toISOString(),
      level: logData.level || "info",
      message: logData.message || "Unspecified client log event",
      details: logData.details || {},
      url: logData.url || "",
      path: logData.path || "",
      ip: ip,
      userAgent: logData.userAgent || req.headers["user-agent"] || ""
    };

    systemLogBuffer.unshift(entry);
    if (systemLogBuffer.length > MAX_LOG_BUFFER) systemLogBuffer.pop();

    const prefix = entry.level === "crash" ? "🚨 [CRASH]" : entry.level === "error" ? "❌ [ERROR]" : "ℹ️ [LOG]";
    console.log(`${prefix} ${entry.message} (Path: ${entry.path}, IP: ${ip})`);

    try {
      const db = await connectDB();
      if (db) {
        LogRecord.create({
          logId: entry.id,
          timestamp: new Date(entry.timestamp),
          level: entry.level,
          message: entry.message,
          details: entry.details,
          url: entry.url,
          path: entry.path,
          ip: entry.ip,
          userAgent: entry.userAgent
        }).catch((err) => console.error("Failed to save LogRecord to DB:", err.message));
      }
    } catch (_e) {}

    res.json({ success: true, recorded: entry.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/logs", requireAdmin, (req, res) => {
  systemLogBuffer.length = 0;
  res.json({ success: true, message: "Logs cleared successfully" });
});

app.get("/api/portfolio", async (req, res) => {
  await refreshPortfolioOverrides();
  const showcase = getShowcaseManifest();
  const enrichedProjects = portfolioData.projects.map((p) => {
    const githubUrl = p.github || "";
    const match = githubUrl.match(/github\.com\/[^/]+\/([^/#?]+)/i);
    const slug = match ? match[1].replace(/\.git$/i, "") : p.name.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const pShowcase = (showcase.projects && showcase.projects[slug]) || {};
    return {
      ...p,
      slug,
      showcaseStatus: pShowcase.status || "Pending",
      showcaseReason: pShowcase.reason || null,
      screenshots: pShowcase.screenshots && pShowcase.screenshots.length ? pShowcase.screenshots : p.screenshots
    };
  });
  res.json({ ...portfolioData, projects: enrichedProjects });
});

// Intelligent Automated Project Showcase API
app.get("/api/showcase/status", (req, res) => {
  const showcase = getShowcaseManifest();
  res.json({
    lastUpdated: showcase.lastUpdated || null,
    projects: showcase.projects || {}
  });
});

app.post("/api/showcase/generate", postRateLimiter, async (req, res) => {
  const { projectName } = req.body || {};
  try {
    const { processProjectShowcase, runAllShowcases } = require("./scripts/showcase/showcase-manager");
    res.json({ success: true, message: "Automated project showcase generation triggered in background." });

    if (projectName) {
      const target = portfolioData.projects.find((p) => p.name.toLowerCase().includes(projectName.toLowerCase()));
      if (target) {
        processProjectShowcase(target).catch((err) => console.error("Async Showcase Error:", err.message));
      }
    } else {
      runAllShowcases(portfolioData.projects).catch((err) => console.error("Async Showcase Error:", err.message));
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Live Status & Cairo Time API
app.get("/api/status", (req, res) => {
  const cairoTime = new Date().toLocaleString("en-US", {
    timeZone: "Africa/Cairo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  res.json({
    status: "Available for Software Engineering Internships & Roles",
    location: "Cairo, Egypt (UTC+2 / UTC+3)",
    cairoTime,
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// GitHub Live Sync Cache
let githubCache = { data: null, timestamp: 0 };
app.get("/api/github", async (req, res) => {
  await refreshPortfolioOverrides();
  const username = githubLib.usernameFromProfile(portfolioData.profile);
  if (!username) return res.status(404).json({ ok: false, error: "No GitHub account is set in the profile." });

  const cacheDuration = 15 * 60 * 1000; // 15 mins
  if (githubCache.data && githubCache.data.username.toLowerCase() === username.toLowerCase() && Date.now() - githubCache.timestamp < cacheDuration) {
    return res.json(githubCache.data);
  }

  const ghToken = getKey("github") || process.env.GITHUB_TOKEN;
  const headers = githubLib.headers(ghToken);

  try {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
    if (!userRes.ok) throw new Error(`GitHub API error: ${userRes.status}`);
    const userData = await userRes.json();
    const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`, { headers });
    const reposData = reposRes.ok ? await reposRes.json() : [];

    const formattedRepos = Array.isArray(reposData)
      ? reposData.map((r) => ({
          name: r.name,
          description: r.description || "",
          url: r.html_url,
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language || "",
          updatedAt: r.updated_at
        }))
      : [];

    const result = {
      username: userData.login,
      avatar: userData.avatar_url,
      bio: userData.bio || portfolioData.profile.title || "",
      publicRepos: userData.public_repos,
      followers: userData.followers,
      profileUrl: userData.html_url,
      topRepos: formattedRepos
    };

    githubCache = { data: result, timestamp: Date.now() };
    res.json(result);
  } catch (err) {
    console.warn("GitHub fetch notice (using cache):", err.message);
    // Serve the last good answer if we have one; otherwise report the failure honestly.
    if (githubCache.data && githubCache.data.username.toLowerCase() === username.toLowerCase()) return res.json(githubCache.data);
    res.status(502).json({ ok: false, error: "GitHub is unreachable right now.", profileUrl: portfolioData.profile.github || null });
  }
});

// Professional Real-time GitHub Webhook
// This endpoint receives a push event from GitHub and instantly invalidates our cache
// so the next visitor sees the updated repository count immediately.
app.post("/api/github-webhook", express.json(), (req, res) => {
  // We can add signature verification here if a secret is configured
  console.log("GitHub Webhook received! Invalidating local GitHub cache...");

  // Instantly expire the cache
  githubCache.timestamp = 0;

  res.status(200).json({ success: true, message: "GitHub cache invalidated successfully. Ready for real-time sync." });
});

// AI Copilot Chatbot Endpoint
app.post("/api/chat", postRateLimiter, async (req, res) => {
  await refreshPortfolioOverrides();
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Please type a message!" });
  }

  const { reply, suggestions } = buildReply(sanitize(message), portfolioData);

  res.json({ reply, suggestions });
});

app.post("/api/contact", postRateLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "All fields are required." });
  }

  const cleanName = sanitize(name);
  const cleanEmail = sanitize(email);
  const cleanMessage = sanitize(message);

  try {
    const db = await connectDB();
    if (db) {
      await Contact.create({
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage
      });
    }
  } catch (err) {
    console.error("Error saving contact message to MongoDB:", err.message);
  }

  return res.json({
    ok: true,
    message: `Thanks ${cleanName}, your message has been received! ${(portfolioData.profile.name || "The owner").split(" ")[0]} will get back to you shortly at ${cleanEmail}.`
  });
});

// Community Reviews & Star Rating Store (MongoDB with Local JSON File Fallback)
const getWritablePath = (filename) => {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), filename);
  }
  const localLogsDir = path.join(__dirname, "logs");
  const localFilePath = path.join(localLogsDir, filename);
  try {
    if (!fs.existsSync(localLogsDir)) {
      fs.mkdirSync(localLogsDir, { recursive: true });
    }
    return localFilePath;
  } catch {
    return path.join(os.tmpdir(), filename);
  }
};

const REVIEWS_FILE = getWritablePath("user-reviews.json");
const STAR_FILE = getWritablePath("star-count.json");

const getStoredReviews = () => {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      return JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf8"));
    }
  } catch {}
  return [
    {
      id: "linkedin-1",
      name: "Mohammed Essam El Din",
      role: "SWE @ El Zatuna | IBM Student Ambassador @ MIU",
      rating: 5,
      comment:
        "I'm proud to recommend my friend and colleague, Zayd, whose dedication, knowledge, and willingness to help others truly set him apart. Throughout our time working and studying together, Zayd consistently demonstrated a strong commitment not only to his own learning but also to supporting those around him. One of Zayd's most admirable qualities is his willingness to help others.",
      date: "2025-07-09",
      isLinkedin: true
    },
    {
      id: "linkedin-2",
      name: "Ahmed Hatem",
      role: "Electronics and Communication Engineering Student @MIU",
      rating: 5,
      comment:
        "Zayd is a hardworking and creative Computer Science student with a strong passion for software engineering. He approaches every task with focus and a problem-solving mindset. I'm confident he has a bright future ahead in tech.",
      date: "2025-07-09",
      isLinkedin: true
    },
    {
      id: "linkedin-3",
      name: "Hazem Mohamed",
      role: "DevOps Engineer | 3x AWS Certified | Software Engineer",
      rating: 5,
      comment: "Zayd is a curious and motivated student who loves learning and always seeks to understand more.",
      date: "2025-07-01",
      isLinkedin: true
    }
  ];
};

const getStarCount = () => {
  try {
    if (fs.existsSync(STAR_FILE)) {
      const data = JSON.parse(fs.readFileSync(STAR_FILE, "utf8"));
      return data.stars || 48;
    }
  } catch {}
  return 48;
};

app.get("/api/reviews", async (req, res) => {
  let finalReviews = getStoredReviews(); // Always include LinkedIn static recommendations

  try {
    const db = await connectDB();
    if (db) {
      const dbReviews = await Review.find().sort({ createdAt: -1 }).lean();
      if (dbReviews && dbReviews.length > 0) {
        const mappedReviews = dbReviews.map((r) => ({
          id: r._id.toString(),
          name: r.name,
          role: r.role,
          rating: r.rating,
          comment: r.comment,
          date: r.date
        }));
        // Prepend MongoDB community reviews above the LinkedIn recommendations
        finalReviews = [...mappedReviews, ...finalReviews];
      }
    }
  } catch (err) {
    console.error("Error fetching reviews from MongoDB:", err.message);
  }
  res.json({ ok: true, reviews: finalReviews });
});

app.post("/api/reviews", postRateLimiter, async (req, res) => {
  const { name, role, rating, comment } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ ok: false, error: "Name and comment are required." });
  }

  const cleanName = sanitize(name).trim();
  const cleanRole = sanitize(role || "Visitor / Developer").trim();
  const cleanRating = Math.min(5, Math.max(1, parseInt(rating) || 5));
  const cleanComment = sanitize(comment).trim();
  const currentDate = new Date().toISOString().split("T")[0];

  const newReview = {
    id: Date.now(),
    name: cleanName,
    role: cleanRole,
    rating: cleanRating,
    comment: cleanComment,
    date: currentDate
  };

  try {
    const db = await connectDB();
    if (db) {
      const created = await Review.create({
        name: cleanName,
        role: cleanRole,
        rating: cleanRating,
        comment: cleanComment,
        date: currentDate
      });
      newReview.id = created._id.toString();
    }
  } catch (err) {
    console.error("Error saving review to MongoDB:", err.message);
  }

  const reviews = getStoredReviews();
  reviews.unshift(newReview);
  try {
    const filePath = getWritablePath("user-reviews.json");
    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2), "utf8");
  } catch {}

  res.json({ ok: true, message: "Review posted successfully!", review: newReview });
});

app.get("/api/star", async (req, res) => {
  try {
    const db = await connectDB();
    if (db) {
      const starDoc = await Star.findOne({ key: "star_count" });
      if (starDoc) {
        return res.json({ ok: true, stars: starDoc.stars });
      }
    }
  } catch (err) {
    console.error("Error fetching star count from MongoDB:", err.message);
  }
  res.json({ ok: true, stars: getStarCount() });
});

app.post("/api/star", postRateLimiter, async (req, res) => {
  let stars = getStarCount() + 1;
  try {
    const db = await connectDB();
    if (db) {
      const updated = await Star.findOneAndUpdate(
        { key: "star_count" },
        { $inc: { stars: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      stars = updated.stars;
    }
  } catch (err) {
    console.error("Error updating star count in MongoDB:", err.message);
  }

  try {
    const filePath = getWritablePath("star-count.json");
    fs.writeFileSync(filePath, JSON.stringify({ stars }, null, 2), "utf8");
  } catch {}

  res.json({ ok: true, stars, message: "Thank you for starring Zayd's portfolio!" });
});

// ---------------------------------------------------------------------------
// Admin-editable portfolio content
// Built-in content lives in `portfolioData`; edits made from the admin mobile app are stored
// per section (MongoDB, or a local JSON file when no database is configured) and layered on top.
// ---------------------------------------------------------------------------
const OVERRIDES_TTL_MS = 15000;
const overrideState = { loadedAt: 0 };

const overridesFilePath = () => getWritablePath("portfolio-overrides.json");

const readLocalOverrides = () => {
  try {
    return JSON.parse(fs.readFileSync(overridesFilePath(), "utf8")) || {};
  } catch {
    return {};
  }
};

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

async function refreshPortfolioOverrides(force = false) {
  if (!force && Date.now() - overrideState.loadedAt < OVERRIDES_TTL_MS) return;
  overrideState.loadedAt = Date.now();

  let stored = null;
  let seedDb = false;
  if (getKey("mongodb")) {
    // A configured database is the source of truth. If it is slow or down, keep serving what we
    // already have rather than delaying the public site or falling back to the built-in content.
    try {
      const db = await withTimeout(connectDB(), 2500);
      if (!db) return;
      const docs = await withTimeout(PortfolioSection.find().lean(), 2500);
      stored = {};
      docs.forEach((doc) => {
        stored[doc.section] = doc.data;
      });
      seedDb = true;
    } catch (err) {
      console.error("Could not load portfolio content from MongoDB:", err.message);
      return;
    }
  } else {
    stored = readLocalOverrides();
  }

  const missing = [];
  Object.keys(SECTION_RULES).forEach((section) => {
    if (Object.prototype.hasOwnProperty.call(stored, section)) {
      portfolioData[section] = stored[section];
    } else {
      portfolioData[section] = JSON.parse(JSON.stringify(portfolioDefaults[section]));
      missing.push(section);
    }
  });

  // First run (or a section added in a later release): copy the built-in content into the database
  // so everything is stored there and editable. Never overwrites existing documents.
  if (seedDb && missing.length) {
    PortfolioSection.bulkWrite(
      missing.map((section) => ({
        updateOne: {
          filter: { section },
          update: { $setOnInsert: { data: portfolioDefaults[section], updatedAt: new Date() } },
          upsert: true
        }
      }))
    ).catch((err) => console.error("Could not seed portfolio content:", err.message));
  }
}

/** Sections whose content differs from the built-in defaults. */
const customisedSections = () =>
  Object.keys(SECTION_RULES).filter((section) => JSON.stringify(portfolioData[section]) !== JSON.stringify(portfolioDefaults[section]));

async function savePortfolioOverride(section, data) {
  const db = await connectDB();
  if (db) {
    await PortfolioSection.findOneAndUpdate({ section }, { data, updatedAt: new Date() }, { upsert: true });
  } else {
    const local = readLocalOverrides();
    local[section] = data;
    fs.writeFileSync(overridesFilePath(), JSON.stringify(local, null, 2), "utf8");
  }
  overrideState.loadedAt = Date.now();
}

// ---------------------------------------------------------------------------
// CV: generated from database content, compiled by a GitHub Action (see .github/workflows/build-cv.yml)
// ---------------------------------------------------------------------------
const cvBuilder = createCvBuilder({
  connectDB,
  models: { CvBuild, CvFile },
  getData: () => portfolioData,
  onBuilt: async ({ url }) => {
    // The site's CV link now points at the freshly built PDF
    const profile = { ...portfolioData.profile, cvUrl: url };
    await savePortfolioOverride("profile", profile);
    portfolioData.profile = profile;
  },
  dispatch: () => {
    const owner = process.env.VERCEL_GIT_REPO_OWNER;
    const slug = process.env.VERCEL_GIT_REPO_SLUG;
    return dispatchWorkflow({
      token: getKey("github") || process.env.GITHUB_TOKEN,
      repository: process.env.GITHUB_REPOSITORY || (owner && slug ? `${owner}/${slug}` : ""),
      ref: process.env.VERCEL_GIT_COMMIT_REF || "main"
    });
  }
});

const requireBuildKey = makeKeyGuard({ secretName: "CV_BUILD_KEY", header: "x-cv-build-key", label: "CV build" });

app.get("/api/build/resume/source", requireBuildKey, async (req, res) => {
  try {
    await refreshPortfolioOverrides(true);
    const { state, tex } = await cvBuilder.source();
    res.json({ ok: true, status: state.status || "idle", id: state.requestedAt || null, tex });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/build/resume/result", requireBuildKey, express.raw({ type: "application/pdf", limit: "4mb" }), async (req, res) => {
  try {
    if (req.query.status === "failed") {
      await cvBuilder.fail((req.body && req.body.error) || "The CV failed to compile.");
      return res.json({ ok: true });
    }
    const result = await cvBuilder.complete({ pdf: req.body, id: req.query.id });
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(err instanceof CvBuildError ? 400 : 500).json({ ok: false, error: err.message });
  }
});

app.get("/api/document/resume", async (req, res) => {
  try {
    const pdf = await cvBuilder.latestPdf();
    if (!pdf) return res.status(404).json({ ok: false, error: "No generated CV yet." });
    const base = String((portfolioData.profile && portfolioData.profile.name) || "CV").replace(/[^A-Za-z0-9]+/g, "_");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${base}_CV.pdf"`);
    res.setHeader("Cache-Control", "public, max-age=300");
    res.send(pdf);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use(
  "/api/admin",
  createAdminRouter({
    portfolioData,
    defaults: portfolioDefaults,
    connectDB,
    models: { Review, Contact, Star },
    saveOverride: savePortfolioOverride,
    refreshOverrides: refreshPortfolioOverrides,
    overriddenSections: customisedSections,
    fetchRepos: (username) => githubLib.fetchRepos(username, getKey("github") || process.env.GITHUB_TOKEN),
    cv: cvBuilder
  })
);

// Dynamic CV URL API & Redirects
const DEFAULT_CV_URL = "/Zayd_Ali_Mohamed_CV.pdf";

app.get("/api/cv-url", async (req, res) => {
  try {
    const db = await connectDB();
    if (db) {
      const config = await CvConfig.findOne({ key: "cv_url" });
      if (config && config.url) {
        let cleanUrl = config.url;
        if (cleanUrl.includes("collection.cloudinary.com")) {
          cleanUrl = DEFAULT_CV_URL;
          await CvConfig.findOneAndUpdate(
            { key: "cv_url" },
            { url: DEFAULT_CV_URL, updatedAt: new Date() },
            { upsert: true }
          ).catch(() => {});
        }
        return res.json({ ok: true, url: cleanUrl });
      }
    }
  } catch (err) {
    console.error("Error fetching CV URL from MongoDB:", err.message);
  }
  res.json({ ok: true, url: DEFAULT_CV_URL });
});

app.post("/api/cv-url", requireAdmin, postRateLimiter, async (req, res) => {
  const { url } = req.body || {};
  if (!url || typeof url !== "string") {
    return res.status(400).json({ ok: false, error: "Valid url parameter required" });
  }

  try {
    const db = await connectDB();
    if (db) {
      const updated = await CvConfig.findOneAndUpdate(
        { key: "cv_url" },
        { url, updatedAt: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ ok: true, url: updated.url, message: "CV URL updated successfully in database" });
    }
  } catch (err) {
    console.error("Error updating CV URL in MongoDB:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }

  res.json({ ok: true, url, message: "CV URL updated (local fallback)" });
});

app.get("/cv", async (req, res) => {
  let targetUrl = DEFAULT_CV_URL;
  try {
    const db = await connectDB();
    if (db) {
      const config = await CvConfig.findOne({ key: "cv_url" });
      if (config && config.url) {
        targetUrl = config.url.includes("collection.cloudinary.com") ? DEFAULT_CV_URL : config.url;
      }
    }
  } catch (_err) {}

  res.redirect(302, targetUrl);
});

// Kapso WhatsApp Cloud API Webhook Routes
const { handleWebhookVerification, handleWebhookEvent, setPortfolioProvider } = require("./api/whatsapp-webhook");
setPortfolioProvider(() => portfolioData);
const { requestWhatsAppApproval, pendingApprovals } = require("./api/whatsapp-approval");

app.get("/api/whatsapp/webhook", handleWebhookVerification);
app.post("/api/whatsapp/webhook", handleWebhookEvent);

// WhatsApp Human-in-the-Loop Approval Endpoints
app.post("/api/whatsapp/request-approval", requireAdmin, async (req, res) => {
  const { actionName, description, timeoutMs } = req.body || {};
  if (!actionName || !description) {
    return res.status(400).json({ ok: false, error: "actionName and description are required." });
  }

  // Asynchronously request approval
  const result = await requestWhatsAppApproval(actionName, description, timeoutMs || 300000);
  res.json({ ok: true, result });
});

app.get("/api/whatsapp/pending-approvals", requireAdmin, (req, res) => {
  const list = Array.from(pendingApprovals.values()).filter((item) => typeof item === "object" && item.id);
  res.json({ ok: true, pendingCount: list.length, approvals: list });
});

// Explicit Multi-Page HTML Routes
const servePage = (pageName) => (req, res) => {
  res.sendFile(path.join(__dirname, "public", `${pageName}.html`));
};

app.get(["/projects", "/projects.html"], servePage("projects"));
app.get(["/experience", "/experience.html"], servePage("experience"));
app.get(["/skills", "/skills.html"], servePage("skills"));
app.get(["/contact", "/contact.html"], servePage("contact"));

// Catch-all: serve index.html for SPA routing (MUST be last)
app.use((req, res) => {
  const reqUrl =
    req.headers["x-matched-path"] || req.headers["x-forwarded-uri"] || req.originalUrl || req.url || req.path || "";
  const cleanPath = reqUrl.split("?")[0].toLowerCase();

  if (cleanPath.includes("/assets/")) {
    const match = reqUrl.match(/\/assets\/(.+)$/i);
    const filename = match ? match[1] : "";
    const file = findAssetFile(filename);
    if (file) {
      assetCacheHeaders(res, file);
      if (file.toLowerCase().endsWith(".pdf")) {
        res.contentType("application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="Zayd_Ali_Mohamed_CV.pdf"');
      }
      return res.sendFile(file);
    }
    return res.status(404).json({ error: "Asset not found" });
  }

  if (cleanPath.endsWith("/projects") || cleanPath.endsWith("/projects.html")) {
    return res.sendFile(path.join(__dirname, "public", "projects.html"));
  }
  if (cleanPath.endsWith("/experience") || cleanPath.endsWith("/experience.html")) {
    return res.sendFile(path.join(__dirname, "public", "experience.html"));
  }
  if (cleanPath.endsWith("/skills") || cleanPath.endsWith("/skills.html")) {
    return res.sendFile(path.join(__dirname, "public", "skills.html"));
  }
  if (cleanPath.endsWith("/contact") || cleanPath.endsWith("/contact.html")) {
    return res.sendFile(path.join(__dirname, "public", "contact.html"));
  }

  if (cleanPath.startsWith("/api/") && !cleanPath.startsWith("/api/index")) {
    return res.status(404).json({ error: "Not found" });
  }

  const isHomeRoute = cleanPath === "" || cleanPath === "/" || cleanPath === "/index" || cleanPath === "/index.html";
  if (isHomeRoute) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }

  // Return true HTTP 404 status for non-existent routes to prevent Soft 404 issues
  res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Portfolio running on http://localhost:${PORT}`);
  });
}

app.portfolioData = portfolioData;
module.exports = app;
