import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/database.js";
import { initSocket } from "./config/socket.js";

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initSocket(server);

// Start server and connect to MongoDB asynchronously
const startServer = () => {
  try {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`====================================================`);
      console.log(`🚀 SkillConnect Backend Server running on port ${PORT}`);
      console.log(`📡 Real-time Socket.IO listening for client events`);
      console.log(`🌍 Client URL configured: ${CLIENT_URL}`);
      console.log(`⚙️  Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });

    // Attempt MongoDB connection in background
    connectDB().catch((err) => {
      console.error("MongoDB background connection error:", err.message);
    });
  } catch (error) {
    console.error("Failed to start SkillConnect server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = () => {
  console.log("\nInitiating graceful shutdown...");
  server.close(() => {
    console.log("SkillConnect HTTP and Socket server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

startServer();

export { server, io };
