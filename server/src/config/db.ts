import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("[FATAL DATABASE ERROR] MONGODB_URI is missing from environment variables.");
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database Connected] MongoDB Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("[Database Connection Error]:", error);
    process.exit(1);
  }
};

export default connectDB;