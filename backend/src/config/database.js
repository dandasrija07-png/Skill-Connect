import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("❌ Fatal Error: MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: process.env.NODE_ENV !== "production"
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not crash server immediately in development so health check/documentation remains accessible
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return null;
  }
};

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.warn("⚠️ MongoDB connection disconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error(`❌ MongoDB connection error event: ${err.message}`);
});

