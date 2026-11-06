import { Server } from "socket.io";
import { verifyToken } from "../utils/generateToken.js";

let ioInstance = null;
const onlineUsers = new Map(); // userId -> Set of socketIds

const checkOrigin = (origin, callback) => {
  // Allow requests with no origin or matching Vercel/localhost/CLIENT_URL
  if (!origin) return callback(null, true);

  const clientUrl = process.env.CLIENT_URL;
  if (clientUrl && (origin === clientUrl || clientUrl.split(",").includes(origin))) {
    return callback(null, true);
  }

  if (origin.endsWith(".vercel.app") || origin.includes("localhost") || origin.includes("127.0.0.1")) {
    return callback(null, true);
  }

  // Permissive fallback so deployment preview URLs connect smoothly
  return callback(null, true);
};

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: checkOrigin,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true
    }
  });

  ioInstance = io;

  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace("Bearer ", "");
      if (!token) {
        return next(new Error("Authentication token required for real-time messaging"));
      }

      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      return next();
    } catch {
      return next(new Error("Invalid or expired socket token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    if (userId) {
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      // Join user's personal notification room
      socket.join(`user:${userId}`);

      // Broadcast online status
      io.emit("user_status", { userId, status: "online" });
    }

    // Join conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    // Leave conversation room
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Typing start
    socket.on("typing_start", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing_start", {
        conversationId,
        userId: socket.userId
      });
    });

    // Typing stop
    socket.on("typing_stop", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing_stop", {
        conversationId,
        userId: socket.userId
      });
    });

    // Message read receipt
    socket.on("message_read", ({ messageId, conversationId, readerId }) => {
      socket.to(`conversation:${conversationId}`).emit("message_read", {
        messageId,
        conversationId,
        readBy: readerId || socket.userId,
        readAt: new Date()
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      if (userId && onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          io.emit("user_status", { userId, status: "offline" });
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  return ioInstance;
};

export const isUserOnline = (userId) => {
  return onlineUsers.has(userId.toString()) && onlineUsers.get(userId.toString()).size > 0;
};
