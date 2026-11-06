import { STORAGE_KEYS, getItem, setItem } from "../utils/storage";
import { initialLearningRequests } from "../data/mockData";
import { api } from "./api";

const normalizeRequest = (r) => {
  if (!r) return null;
  const learnerObj = typeof r.learner === "object" && r.learner !== null ? r.learner : null;
  const teacherObj = typeof r.teacher === "object" && r.teacher !== null ? r.teacher : null;
  const skillObj = typeof r.skill === "object" && r.skill !== null ? r.skill : null;

  return {
    id: r._id || r.id,
    _id: r._id || r.id,
    skillId: skillObj?._id || r.skill || r.skillId,
    skillTitle: skillObj?.title || r.skillTitle || "Skill Learning Request",
    teacherId: teacherObj?._id || r.teacher || r.teacherId,
    teacherName: teacherObj?.fullName || r.teacherName,
    learnerId: learnerObj?._id || r.learner || r.learnerId,
    learnerName: learnerObj?.fullName || r.learnerName,
    learnerAvatar: learnerObj?.profileImage || r.learnerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces",
    message: r.message || "",
    goals: r.goals || "Practical hands-on learning",
    preferredSchedule: r.preferredSchedule || "Flexible evenings",
    format: r.format || "Online (Video Call)",
    status: r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1)) : "Pending",
    date: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : r.date || "Recent"
  };
};

export const requestService = {
  async getAllRequests() {
    try {
      const [sentRes, receivedRes] = await Promise.allSettled([
        api.get("/requests/sent"),
        api.get("/requests/received")
      ]);

      const sent = sentRes.status === "fulfilled" && sentRes.value?.data ? sentRes.value.data : [];
      const received = receivedRes.status === "fulfilled" && receivedRes.value?.data ? receivedRes.value.data : [];
      const combined = [...sent, ...received];

      if (combined.length > 0) {
        return combined.map(normalizeRequest);
      }
    } catch {
      // Offline fallback
    }

    let reqs = getItem(STORAGE_KEYS.REQUESTS);
    if (!reqs || !Array.isArray(reqs)) {
      reqs = initialLearningRequests;
      setItem(STORAGE_KEYS.REQUESTS, reqs);
    }
    return reqs.map(normalizeRequest);
  },

  async getRequestsByLearner(learnerId) {
    try {
      const res = await api.get("/requests/sent");
      if (res?.data && res.data.length > 0) {
        return res.data.map(normalizeRequest);
      }
    } catch {
      // Offline fallback
    }

    const all = await this.getAllRequests();
    return all.filter((r) => r.learnerId === learnerId);
  },

  async getRequestsByTeacher(teacherId) {
    try {
      const res = await api.get("/requests/received");
      if (res?.data && res.data.length > 0) {
        return res.data.map(normalizeRequest);
      }
    } catch {
      // Offline fallback
    }

    const all = await this.getAllRequests();
    return all.filter((r) => r.teacherId === teacherId);
  },

  async createRequest(data) {
    try {
      const payload = {
        skillId: data.skillId,
        teacherId: data.teacherId,
        message: data.message || "Hello! I would love to learn this skill with you.",
        preferredSchedule: data.preferredSchedule || "Flexible hours",
        goals: data.goals || "Practical mastery"
      };

      const res = await api.post("/requests", payload);
      if (res?.data) {
        return normalizeRequest(res.data);
      }
    } catch {
      // Offline fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const all = await this.getAllRequests();

    const newReq = normalizeRequest({
      id: `req-${Date.now()}`,
      skillId: data.skillId,
      skillTitle: data.skillTitle,
      teacherId: data.teacherId,
      learnerId: data.learnerId,
      learnerName: data.learnerName,
      learnerAvatar: data.learnerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces",
      message: data.message || "Hello! I am eager to learn this skill with you.",
      goals: data.goals || "Gain practical hands-on mastery.",
      preferredSchedule: data.preferredSchedule || "Flexible evenings",
      format: data.format || "Online (Video Call)",
      status: "Pending",
      date: new Date().toISOString().split("T")[0]
    });

    const updated = [newReq, ...all];
    setItem(STORAGE_KEYS.REQUESTS, updated);
    return newReq;
  },

  async updateRequestStatus(requestId, newStatus) {
    const action = newStatus.toLowerCase();
    try {
      if (action === "accepted") {
        await api.patch(`/requests/${requestId}/accept`);
      } else if (action === "declined" || action === "rejected") {
        await api.patch(`/requests/${requestId}/reject`);
      } else if (action === "cancelled") {
        await api.patch(`/requests/${requestId}/cancel`);
      }
    } catch {
      // Offline fallback
    }

    const all = await this.getAllRequests();
    const index = all.findIndex((r) => r.id === requestId || r._id === requestId);

    if (index !== -1) {
      all[index] = {
        ...all[index],
        status: newStatus
      };
      setItem(STORAGE_KEYS.REQUESTS, all);
      return all[index];
    }
    return null;
  }
};
