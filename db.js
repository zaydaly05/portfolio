const mongoose = require("mongoose");

/**
 * Global variable for caching the database connection across serverless invocations.
 * Prevents multiple database connections being opened on Vercel API calls.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
  if (!uri) {
    // Return null if no URI configured - application will seamlessly fallback to local store
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log("Successfully connected to MongoDB");
      return mongooseInstance;
    }).catch((err) => {
      console.error("MongoDB Connection Error:", err.message);
      cached.promise = null;
      return null;
    });
  }

  cached.conn = await cached.promise;
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

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
const Star = mongoose.models.Star || mongoose.model("Star", starSchema);
const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

module.exports = {
  connectDB,
  Review,
  Star,
  Contact
};
