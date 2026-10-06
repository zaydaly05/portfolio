const mongoose = require("mongoose");
const { getKey } = require("./keys");

/**
 * Global variable for caching the database connection across serverless invocations.
 * Prevents multiple database connections being opened on Vercel API calls.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, lastErrorTime: 0 };
}

const FAILED_COOLDOWN_MS = 60000; // 60 seconds cooldown on failed connection attempt

async function connectDB() {
  const uri = getKey("mongodb");
  if (!uri) {
    // Return null if no URI configured - application will seamlessly fallback to local store
    return null;
  }

  // Check if connection is already established and active
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Circuit Breaker: If connection failed recently, avoid hanging requests for 60s
  if (cached.lastErrorTime && Date.now() - cached.lastErrorTime < FAILED_COOLDOWN_MS) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Increased to 10s for stability during setup
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log("🟢 Successfully connected to MongoDB");
        cached.lastErrorTime = 0;
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("⚠️ MongoDB Connection Error (using fast local fallback):", err.message);
        cached.promise = null;
        cached.conn = null;
        cached.lastErrorTime = Date.now(); // Record failure timestamp for cooldown
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch {
    cached.conn = null;
  }

  return cached.conn;
}

// Schemas
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: "Visitor / Developer" },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split("T")[0] },
  createdAt: { type: Date, default: Date.now }
});

const starSchema = new mongoose.Schema({
  key: { type: String, default: "star_count", unique: true },
  stars: { type: Number, default: 48 }
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const cvConfigSchema = new mongoose.Schema({
  key: { type: String, default: "cv_url", unique: true },
  url: {
    type: String,
    default: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790818/zayd-portfolio/Zayd_Ali_Mohamed_CV.pdf"
  },
  updatedAt: { type: Date, default: Date.now }
});

const logRecordSchema = new mongoose.Schema({
  logId: String,
  timestamp: { type: Date, default: Date.now },
  level: { type: String, default: "info" },
  message: { type: String, required: true },
  details: mongoose.Schema.Types.Mixed,
  url: String,
  path: String,
  ip: String,
  userAgent: String
});

// Admin-editable overrides for the portfolio content sections that ship as defaults in server.js
const portfolioSectionSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

// CV build pipeline: one state document + the generated PDFs (kept per version)
const cvBuildSchema = new mongoose.Schema({
  key: { type: String, default: "state", unique: true },
  status: { type: String, default: "idle" },
  requestedAt: String,
  reason: String,
  builtAt: Date,
  version: { type: Number, default: 0 },
  pages: Number,
  error: String
});

const cvFileSchema = new mongoose.Schema({
  version: { type: Number, required: true, unique: true },
  data: { type: Buffer, required: true },
  size: Number,
  createdAt: { type: Date, default: Date.now }
});

// Changes detected automatically (e.g. new GitHub repos) that wait for the owner's decision
const pendingChangeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, default: "add_projects" },
  status: { type: String, default: "pending" }, // pending | applied | rejected | failed
  source: { type: String, default: "github" },
  summary: String,
  repos: [String],
  payload: mongoose.Schema.Types.Mixed,
  notes: String,
  error: String,
  decidedBy: String,
  decidedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
const Star = mongoose.models.Star || mongoose.model("Star", starSchema);
const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
const CvConfig = mongoose.models.CvConfig || mongoose.model("CvConfig", cvConfigSchema);
const LogRecord = mongoose.models.LogRecord || mongoose.model("LogRecord", logRecordSchema);
const CvBuild = mongoose.models.CvBuild || mongoose.model("CvBuild", cvBuildSchema);
const CvFile = mongoose.models.CvFile || mongoose.model("CvFile", cvFileSchema);
const PendingChange = mongoose.models.PendingChange || mongoose.model("PendingChange", pendingChangeSchema);
const PortfolioSection =
  mongoose.models.PortfolioSection || mongoose.model("PortfolioSection", portfolioSectionSchema);

module.exports = {
  connectDB,
  Review,
  Star,
  Contact,
  CvConfig,
  LogRecord,
  PortfolioSection,
  CvBuild,
  CvFile,
  PendingChange
};
