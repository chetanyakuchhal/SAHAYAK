import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🚀 Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
}
