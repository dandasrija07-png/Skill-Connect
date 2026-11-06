import { io } from "socket.io-client";
import { getToken } from "./api";

const deriveSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
  }
  return "http://localhost:5000";
};

const SOCKET_URL = deriveSocketUrl();

let socket = null;

export const initClientSocket = () => {
  const token = getToken();
  if (!token) return null;

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    transports: ["websocket", "polling"]
  });

  socket.on("connect", () => {
    // console.log("Real-time socket connected to SkillConnect server");
  });

  socket.on("connect_error", () => {
    // Fallback gracefully without throwing
  });

  return socket;
};

export const getClientSocket = () => {
  if (!socket) {
    return initClientSocket();
  }
  return socket;
};

export const disconnectClientSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

