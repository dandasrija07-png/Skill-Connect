import { Notification } from "../models/Notification.js";
import { getIO } from "../config/socket.js";

export const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  link = "/dashboard",
  relatedId = null
}) => {
  try {
    const notif = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      link,
      relatedId
    });

    // Real-time Socket.IO emission to user's room
    const io = getIO();
    if (io) {
      io.to(`user:${recipient}`).emit("new_notification", notif);
    }

    return notif;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
};

