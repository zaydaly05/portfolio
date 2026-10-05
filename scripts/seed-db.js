const { connectDB, Star, CvConfig } = require("../db");

async function seed() {
  try {
    console.log("Connecting to MongoDB to seed data...");
    const connection = await connectDB();
    if (!connection) {
      throw new Error("Failed to establish MongoDB connection. Please verify that IP access is enabled in Atlas (0.0.0.0/0).");
    }

    // 1. Seed Star Count
    await Star.findOneAndUpdate(
      { key: "star_count" },
      { stars: 48 },
      { upsert: true, new: true }
    );
    console.log("✅ Star count seeded (48 stars)");

    // 2. Seed CV URL
    await CvConfig.findOneAndUpdate(
      { key: "cv_url" },
      { url: "https://res.cloudinary.com/delnnzcph/image/upload/v1790790818/zayd-portfolio/Zayd_Ali_Mohamed_CV.pdf" },
      { upsert: true, new: true }
    );
    console.log("✅ CV URL seeded");

    console.log("🚀 Database seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
