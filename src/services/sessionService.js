import { STORAGE_KEYS, getItem, setItem } from "../utils/storage";
import { initialSessions } from "../data/mockData";
import { api } from "./api";

const normalizeSession = (s) => {
  if (!s) return null;
  const teacherObj = typeof s.teacher === "object" && s.teacher !== null ? s.teacher : null;
  const learnerObj = typeof s.learner === "object" && s.learner !== null ? s.learner : null;
  const skillObj = typeof s.skill === "object" && s.skill !== null ? s.skill : null;

  return {
    id: s._id || s.id,
    _id: s._id || s.id,
    title: s.title || skillObj?.title || "SkillConnect Learning Session",
    skillId: skillObj?._id || s.skill || s.skillId || "",
    skillTitle: skillObj?.title || s.title || "Skill Session",
    teacherId: teacherObj?._id || s.teacher || s.teacherId,
    teacherName: teacherObj?.fullName || s.teacherName || "Teacher",
    learnerId: learnerObj?._id || s.learner || s.learnerId,
    learnerName: learnerObj?.fullName || s.learnerName || "Learner",
    date: s.scheduledAt ? new Date(s.scheduledAt).toISOString().split("T")[0] : s.date || new Date().toISOString().split("T")[0],
    time: s.time || (s.scheduledAt ? new Date(s.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "18:00 - 19:00"),
    status: s.status === "scheduled" || s.status === "confirmed" ? "Upcoming" : (s.status ? (s.status.charAt(0).toUpperCase() + s.status.slice(1)) : "Upcoming"),
    format: s.format || "Online (Video Call)",
    meetingLink: s.meetingLink || "https://meet.skillconnect.app/room-" + (s._id || s.id),
    notes: s.notes || s.description || "Live interactive skill exchange session.",
    type: s.sessionType ? (s.sessionType.charAt(0).toUpperCase() + s.sessionType.slice(1)) : (s.type || "Learning")
  };
};

export const sessionService = {
  async getAllSessions() {
    try {
      const res = await api.get("/sessions");
      if (res?.data && res.data.length > 0) {
        return res.data.map(normalizeSession);
      }
    } catch {
      // Offline fallback
    }

    let sessions = getItem(STORAGE_KEYS.SESSIONS);
    if (!sessions || !Array.isArray(sessions)) {
      sessions = initialSessions;
      setItem(STORAGE_KEYS.SESSIONS, sessions);
    }
    return sessions.map(normalizeSession);
  },

  async getUserSessions(userId) {
    const all = await this.getAllSessions();
    return all.filter((s) => s.teacherId === userId || s.learnerId === userId);
  },

  async createSession(sessionData) {
    try {
      const payload = {
        title: sessionData.title,
        skillId: sessionData.skillId,
        learnerId: sessionData.learnerId,
        scheduledAt: sessionData.date ? new Date(`${sessionData.date}T10:00:00Z`) : new Date(),
        duration: 60,
        meetingLink: sessionData.meetingLink,
        sessionType: (sessionData.type || "learning").toLowerCase()
      };

      const res = await api.post("/sessions", payload);
      if (res?.data) {
        return normalizeSession(res.data);
      }
    } catch {
      // Offline fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const all = await this.getAllSessions();

    const newSession = normalizeSession({
      id: `sess-${Date.now()}`,
      title: sessionData.title || "SkillConnect Learning Session",
      skillId: sessionData.skillId || "",
      teacherId: sessionData.teacherId,
      teacherName: sessionData.teacherName || "Teacher",
      learnerId: sessionData.learnerId,
      learnerName: sessionData.learnerName || "Learner",
      date: sessionData.date || new Date().toISOString().split("T")[0],
      time: sessionData.time || "18:00 - 19:30 IST",
      status: "Upcoming",
      format: sessionData.format || "Online (Video Call)",
      meetingLink: sessionData.meetingLink || "https://meet.skillconnect.app/room-demo",
      notes: sessionData.notes || "Live interactive skill exchange session.",
      type: sessionData.type || "Learning"
    });

    const updated = [newSession, ...all];
    setItem(STORAGE_KEYS.SESSIONS, updated);
    return newSession;
  },

  async updateSessionStatus(sessionId, status) {
    const lower = status.toLowerCase();
    try {
      if (lower === "completed") {
        await api.patch(`/sessions/${sessionId}/complete`);
      } else if (lower === "cancelled") {
        await api.patch(`/sessions/${sessionId}/cancel`);
      }
    } catch {
      // Offline fallback
    }

    const all = await this.getAllSessions();
    const index = all.findIndex((s) => s.id === sessionId || s._id === sessionId);

    if (index !== -1) {
      all[index] = {
        ...all[index],
        status
      };
      setItem(STORAGE_KEYS.SESSIONS, all);
      return all[index];
    }
    return null;
  },

  async rescheduleSession(sessionId, newDate, newTime) {
    try {
      await api.put(`/sessions/${sessionId}`, {
        scheduledAt: new Date(`${newDate}T10:00:00Z`),
        time: newTime
      });
    } catch {
      // Offline fallback
    }

    const all = await this.getAllSessions();
    const index = all.findIndex((s) => s.id === sessionId || s._id === sessionId);

    if (index !== -1) {
      all[index] = {
        ...all[index],
        date: newDate,
        time: newTime,
        status: "Upcoming"
      };
      setItem(STORAGE_KEYS.SESSIONS, all);
      return all[index];
    }
    return null;
  }
};
