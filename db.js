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

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
const Star = mongoose.models.Star || mongoose.model("Star", starSchema);
const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
const CvConfig = mongoose.models.CvConfig || mongoose.model("CvConfig", cvConfigSchema);
const LogRecord = mongoose.models.LogRecord || mongoose.model("LogRecord", logRecordSchema);

module.exports = {
  connectDB,
  Review,
  Star,
  Contact,
  CvConfig,
  LogRecord
};
