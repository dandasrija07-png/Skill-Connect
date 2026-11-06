import { STORAGE_KEYS, getItem, setItem } from "../utils/storage";
import { initialSkillExchanges } from "../data/mockData";
import { userService } from "./userService";
import { api } from "./api";

const normalizeExchange = (e) => {
  if (!e) return null;
  const senderObj = typeof e.sender === "object" && e.sender !== null ? e.sender : null;
  const recipientObj = typeof e.recipient === "object" && e.recipient !== null ? e.recipient : null;
  const offeredObj = typeof e.offeredSkill === "object" && e.offeredSkill !== null ? e.offeredSkill : null;
  const requestedObj = typeof e.requestedSkill === "object" && e.requestedSkill !== null ? e.requestedSkill : null;

  return {
    id: e._id || e.id,
    _id: e._id || e.id,
    requesterId: senderObj?._id || e.sender || e.requesterId,
    requesterName: senderObj?.fullName || e.requesterName,
    requesterAvatar: senderObj?.profileImage || e.requesterAvatar,
    offeredSkill: offeredObj?.title || e.offeredSkill || "Skill",
    offeredCategory: offeredObj?.category || e.offeredCategory || "Skill Exchange",
    targetUserId: recipientObj?._id || e.recipient || e.targetUserId,
    targetUserName: recipientObj?.fullName || e.targetUserName,
    targetUserAvatar: recipientObj?.profileImage || e.targetUserAvatar,
    wantedSkill: requestedObj?.title || e.wantedSkill || "Skill",
    wantedCategory: requestedObj?.category || e.wantedCategory || "Skill Exchange",
    matchScore: e.matchScore || "Mutual Skill Exchange",
    status: e.status ? (e.status.charAt(0).toUpperCase() + e.status.slice(1)) : "Pending",
    note: e.message || e.note || "Let's exchange our skills!",
    sessionsCompleted: e.sessionsCompleted || 0,
    totalPlannedSessions: e.totalPlannedSessions || 4,
    createdDate: e.createdAt ? new Date(e.createdAt).toISOString().split("T")[0] : e.createdDate || "Recent"
  };
};

export const exchangeService = {
  async getAllExchanges() {
    try {
      const res = await api.get("/exchanges");
      if (res?.data && res.data.length > 0) {
        return res.data.map(normalizeExchange);
      }
    } catch {
      // Offline fallback
    }

    let list = getItem(STORAGE_KEYS.EXCHANGES);
    if (!list || !Array.isArray(list)) {
      list = initialSkillExchanges;
      setItem(STORAGE_KEYS.EXCHANGES, list);
    }
    return list.map(normalizeExchange);
  },

  async getUserExchanges(userId) {
    const all = await this.getAllExchanges();
    return all.filter((e) => e.requesterId === userId || e.targetUserId === userId);
  },

  // Discover potential skill matches for a given user
  async findPotentialMatches(currentUser) {
    if (!currentUser) return [];

    try {
      const res = await api.get("/exchanges/matches");
      if (res?.data && res.data.length > 0) {
        return res.data.map((m) => ({
          user: {
            id: m.user._id || m.user.id,
            name: m.user.fullName || m.user.name,
            username: m.user.username,
            avatar: m.user.profileImage || m.user.avatar,
            headline: m.user.bio || `Teaches ${(m.user.skillsToTeach || []).join(", ")}`,
            location: m.user.location,
            rating: m.user.averageRating || 5.0,
            skillsOffered: m.user.skillsToTeach || [],
            skillsWanted: m.user.skillsToLearn || []
          },
          matchType: m.matchType,
          matchScore: m.matchScore,
          mutual: m.mutual,
          offeredMatched: m.theyOfferToYou || [],
          wantedMatched: m.youOfferToThem || []
        }));
      }
    } catch {
      // Fallback to local calculation
    }

    const users = await userService.getAllUsers();
    const otherUsers = users.filter((u) => u.id !== currentUser.id && u._id !== currentUser.id);

    const matches = [];
    const myOffered = (currentUser.skillsOffered || currentUser.skillsToTeach || []).map((s) => s.toLowerCase());
    const myWanted = (currentUser.skillsWanted || currentUser.skillsToLearn || []).map((s) => s.toLowerCase());

    otherUsers.forEach((user) => {
      const theirOffered = (user.skillsOffered || user.skillsToTeach || []).map((s) => s.toLowerCase());
      const theirWanted = (user.skillsWanted || user.skillsToLearn || []).map((s) => s.toLowerCase());

      const theyOfferWhatIWant = theirOffered.some((offer) =>
        myWanted.some((want) => offer.includes(want) || want.includes(offer))
      );

      const iOfferWhatTheyWant = myOffered.some((offer) =>
        theirWanted.some((want) => offer.includes(want) || want.includes(offer))
      );

      let matchType;
      let matchScore;

      if (theyOfferWhatIWant && iOfferWhatTheyWant) {
        matchType = "Mutual";
        matchScore = "100% Mutual Match";
      } else if (theyOfferWhatIWant) {
        matchType = "They Teach";
        matchScore = "85% Skill Match";
      } else if (iOfferWhatTheyWant) {
        matchType = "You Teach";
        matchScore = "75% Interest Match";
      } else {
        matchType = "Complementary";
        matchScore = "Community Match";
      }

      matches.push({
        user,
        matchType,
        matchScore,
        mutual: matchType === "Mutual",
        offeredMatched: (user.skillsOffered || user.skillsToTeach || []).filter((so) =>
          myWanted.some((w) => so.toLowerCase().includes(w) || w.includes(so.toLowerCase()))
        ),
        wantedMatched: (user.skillsWanted || user.skillsToLearn || []).filter((sw) =>
          myOffered.some((o) => sw.toLowerCase().includes(o) || o.includes(sw.toLowerCase()))
        )
      });
    });

    return matches.sort((a, b) => (b.mutual ? 1 : 0) - (a.mutual ? 1 : 0) || (b.user.rating || 5) - (a.user.rating || 5));
  },

  async createExchange(data) {
    try {
      const payload = {
        recipientId: data.targetUserId,
        offeredSkillId: data.offeredSkillId,
        requestedSkillId: data.requestedSkillId,
        message: data.note || "Let's exchange our skills!",
        frequency: "weekly"
      };

      const res = await api.post("/exchanges", payload);
      if (res?.data) {
        return normalizeExchange(res.data);
      }
    } catch {
      // Offline fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const all = await this.getAllExchanges();

    const newExchange = normalizeExchange({
      id: `exch-${Date.now()}`,
      requesterId: data.requesterId,
      requesterName: data.requesterName,
      requesterAvatar: data.requesterAvatar,
      offeredSkill: data.offeredSkill,
      offeredCategory: data.offeredCategory || "Skill Exchange",
      targetUserId: data.targetUserId,
      targetUserName: data.targetUserName,
      targetUserAvatar: data.targetUserAvatar,
      wantedSkill: data.wantedSkill,
      wantedCategory: data.wantedCategory || "Skill Exchange",
      matchScore: data.matchScore || "Mutual Skill Exchange",
      status: "Pending",
      note: data.note || "Let's exchange our skills!",
      sessionsCompleted: 0,
      totalPlannedSessions: data.totalPlannedSessions || 4,
      createdDate: new Date().toISOString().split("T")[0]
    });

    const updated = [newExchange, ...all];
    setItem(STORAGE_KEYS.EXCHANGES, updated);
    return newExchange;
  },

  async updateExchangeStatus(exchangeId, newStatus) {
    const action = newStatus.toLowerCase();
    try {
      if (action === "accepted") {
        await api.patch(`/exchanges/${exchangeId}/accept`);
      } else if (action === "declined" || action === "rejected") {
        await api.patch(`/exchanges/${exchangeId}/reject`);
      } else if (action === "cancelled") {
        await api.patch(`/exchanges/${exchangeId}/cancel`);
      }
    } catch {
      // Offline fallback
    }

    const all = await this.getAllExchanges();
    const index = all.findIndex((e) => e.id === exchangeId || e._id === exchangeId);

    if (index !== -1) {
      all[index] = {
        ...all[index],
        status: newStatus
      };
      setItem(STORAGE_KEYS.EXCHANGES, all);
      return all[index];
    }
    return null;
  }
};
