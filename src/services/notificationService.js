import { STORAGE_KEYS, getItem, setItem } from "../utils/storage";
import { initialNotifications } from "../data/mockData";
import { api } from "./api";

const normalizeNotification = (n) => {
  if (!n) return null;
  return {
    id: n._id || n.id,
    _id: n._id || n.id,
    userId: n.recipient?._id || n.recipient || n.userId,
    type: n.type || "system",
    title: n.title,
    message: n.message,
    link: n.link || "/dashboard",
    read: n.isRead !== undefined ? n.isRead : Boolean(n.read),
    timestamp: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : n.timestamp || "Just now",
    date: n.createdAt ? new Date(n.createdAt).toISOString().split("T")[0] : n.date || "Recent"
  };
};

export const notificationService = {
  async getAllNotifications(userId) {
    try {
      const res = await api.get("/notifications");
      if (res?.data && res.data.length > 0) {
        return res.data.map(normalizeNotification);
      }
    } catch {
      // Offline fallback
    }

    let list = getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!list || !Array.isArray(list)) {
      list = initialNotifications;
      setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
    if (userId) {
      return list.filter((n) => !n.userId || n.userId === userId).map(normalizeNotification);
    }
    return list.map(normalizeNotification);
  },

  async addNotification(notifData) {
    const list = await this.getAllNotifications();
    const newNotif = normalizeNotification({
      id: `notif-${Date.now()}`,
      userId: notifData.userId || "user-1",
      type: notifData.type || "system",
      title: notifData.title,
      message: notifData.message,
      link: notifData.link || "/dashboard",
      read: false,
      timestamp: "Just now",
      date: new Date().toISOString().split("T")[0]
    });
    const updated = [newNotif, ...list];
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    return newNotif;
  },

  async markAsRead(notifId) {
    try {
      await api.patch(`/notifications/${notifId}/read`);
    } catch {
      // Offline fallback
    }

    const list = await this.getAllNotifications();
    const item = list.find((n) => n.id === notifId || n._id === notifId);
    if (item) {
      item.read = true;
      setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
    return list;
  },

  async markAllAsRead(userId) {
    try {
      await api.patch("/notifications/read-all");
    } catch {
      // Offline fallback
    }

    const list = await this.getAllNotifications();
    list.forEach((n) => {
      if (!userId || !n.userId || n.userId === userId) {
        n.read = true;
      }
    });
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  },

  async deleteNotification(notifId) {
    try {
      await api.delete(`/notifications/${notifId}`);
    } catch {
      // Offline fallback
    }

    let list = await this.getAllNotifications();
    list = list.filter((n) => n.id !== notifId && n._id !== notifId);
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  }
};
