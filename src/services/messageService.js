import { STORAGE_KEYS, getItem, setItem } from "../utils/storage";
import { initialConversations } from "../data/mockData";
import { userService } from "./userService";
import { api } from "./api";
import { getClientSocket } from "./socket";

export const messageService = {
  async getConversations() {
    try {
      const res = await api.get("/messages/conversations");
      if (res?.data && res.data.length > 0) {
        return res.data.map((c) => ({
          id: c._id || c.id,
          userId: c.otherParticipant?._id || c.userId,
          userName: c.otherParticipant?.fullName || c.userName || "SkillConnect Member",
          userAvatar: c.otherParticipant?.profileImage || c.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces",
          userHeadline: c.otherParticipant?.bio || c.userHeadline || "SkillConnect Member",
          lastMessage: c.lastMessage || "No messages yet",
          lastTimestamp: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now",
          unreadCount: c.unreadCount || 0,
          online: c.isOnline ?? true,
          messages: []
        }));
      }
    } catch {
      // Offline fallback
    }

    let convs = getItem(STORAGE_KEYS.CONVERSATIONS);
    if (!convs || !Array.isArray(convs)) {
      convs = initialConversations;
      setItem(STORAGE_KEYS.CONVERSATIONS, convs);
    }
    return convs;
  },

  async getConversationByUser(targetUserId) {
    try {
      const res = await api.post("/messages/conversations", { recipientId: targetUserId });
      if (res?.data) {
        const c = res.data;
        // Fetch conversation messages
        const msgsRes = await api.get(`/messages/conversations/${c._id}`);
        const messages = (msgsRes?.data || []).map((m) => ({
          id: m._id || m.id,
          senderId: m.sender?._id || m.sender,
          text: m.content,
          timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }));

        return {
          id: c._id,
          userId: c.otherParticipant?._id || targetUserId,
          userName: c.otherParticipant?.fullName || "SkillConnect Member",
          userAvatar: c.otherParticipant?.profileImage,
          userHeadline: c.otherParticipant?.bio,
          lastMessage: c.lastMessage,
          lastTimestamp: "Just now",
          unreadCount: c.unreadCount || 0,
          online: c.isOnline ?? true,
          messages
        };
      }
    } catch {
      // Offline fallback
    }

    const convs = await this.getConversations();
    let conv = convs.find((c) => c.userId === targetUserId);

    if (!conv) {
      const targetUser = await userService.getUserById(targetUserId);
      if (targetUser) {
        conv = {
          id: `conv-${Date.now()}`,
          userId: targetUser.id,
          userName: targetUser.name,
          userAvatar: targetUser.avatar,
          userHeadline: targetUser.headline,
          lastMessage: "Conversation started",
          lastTimestamp: "Just now",
          unreadCount: 0,
          online: true,
          messages: []
        };
        const updated = [conv, ...convs];
        setItem(STORAGE_KEYS.CONVERSATIONS, updated);
      }
    }
    return conv;
  },

  async sendMessage(targetUserId, senderId, text) {
    if (!text.trim()) return null;

    try {
      const res = await api.post("/messages", {
        receiverId: targetUserId,
        content: text.trim()
      });

      if (res?.data) {
        const m = res.data;
        return {
          id: m._id || m.id,
          senderId: m.sender?._id || senderId,
          text: m.content,
          timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
      }
    } catch {
      // Offline fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    const convs = await this.getConversations();
    const convIndex = convs.findIndex((c) => c.userId === targetUserId);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId,
      text: text.trim(),
      timestamp: timeString
    };

    if (convIndex === -1) {
      const targetUser = await userService.getUserById(targetUserId);
      const newConv = {
        id: `conv-${Date.now()}`,
        userId: targetUserId,
        userName: targetUser ? targetUser.name : "SkillConnect Member",
        userAvatar: targetUser ? targetUser.avatar : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces",
        userHeadline: targetUser ? targetUser.headline : "SkillConnect Member",
        lastMessage: text.trim(),
        lastTimestamp: timeString,
        unreadCount: 0,
        online: true,
        messages: [newMsg]
      };
      setItem(STORAGE_KEYS.CONVERSATIONS, [newConv, ...convs]);
      return newMsg;
    } else {
      const conv = convs[convIndex];
      conv.messages.push(newMsg);
      conv.lastMessage = text.trim();
      conv.lastTimestamp = timeString;

      convs.splice(convIndex, 1);
      convs.unshift(conv);

      setItem(STORAGE_KEYS.CONVERSATIONS, convs);
      return newMsg;
    }
  },

  async markConversationAsRead(targetUserId) {
    const convs = await this.getConversations();
    const conv = convs.find((c) => c.userId === targetUserId);
    if (conv) {
      conv.unreadCount = 0;
      setItem(STORAGE_KEYS.CONVERSATIONS, convs);
    }
  }
};
