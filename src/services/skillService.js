import { STORAGE_KEYS, getItem, setItem } from "../utils/storage";
import { initialSkills, initialWishlist } from "../data/mockData";
import { api } from "./api";

export const normalizeSkill = (s) => {
  if (!s) return null;
  const teacherObj = typeof s.teacher === "object" && s.teacher !== null ? s.teacher : null;

  return {
    id: s._id || s.id,
    _id: s._id || s.id,
    title: s.title,
    category: s.category || "Other Skills",
    teacherId: teacherObj?._id || s.teacher || s.teacherId,
    teacher: teacherObj
      ? {
          id: teacherObj._id || teacherObj.id,
          name: teacherObj.fullName || teacherObj.name,
          username: teacherObj.username,
          avatar: teacherObj.profileImage || teacherObj.avatar,
          location: teacherObj.location,
          rating: teacherObj.averageRating || teacherObj.rating || 5.0
        }
      : s.teacher,
    level: s.level ? (s.level.charAt(0).toUpperCase() + s.level.slice(1).replace("_", " ")) : "All Levels",
    format: s.format ? (s.format === "one-on-one" ? "1-on-1 Mentorship" : s.format) : "Online (Video Call)",
    duration: s.duration || "4 weeks",
    rating: s.rating || 5.0,
    reviewCount: s.reviewCount || 0,
    activeLearners: s.activeLearners || 0,
    coverImage: s.image || s.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
    shortDesc: s.shortDesc || (s.description ? s.description.slice(0, 120) + "..." : ""),
    description: s.description || "",
    topics: s.syllabus && Array.isArray(s.syllabus) ? s.syllabus.map((t) => t.title || t) : (s.topics || []),
    outcomes: s.learningOutcomes || s.outcomes || [],
    prerequisites: s.prerequisites || "None required.",
    schedule: s.schedule || "Flexible weekends",
    exchangeArrangement: s.exchangeType || s.exchangeArrangement || "Open to skill exchange",
    status: s.status ? (s.status.charAt(0).toUpperCase() + s.status.slice(1)) : "Active",
    createdDate: s.createdAt ? new Date(s.createdAt).toISOString().split("T")[0] : s.createdDate || "Recent"
  };
};

export const skillService = {
  async getAllSkills(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category && filters.category !== "All Categories") queryParams.append("category", filters.category);
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.level && filters.level !== "All Levels") queryParams.append("level", filters.level.toLowerCase().replace(" ", "_"));
      if (filters.format && filters.format !== "All Formats") queryParams.append("format", filters.format.toLowerCase());

      const res = await api.get(`/skills?${queryParams.toString()}`);
      if (res?.data?.skills && res.data.skills.length > 0) {
        return res.data.skills.map(normalizeSkill);
      }
    } catch {
      // Backend offline fallback
    }

    let skills = getItem(STORAGE_KEYS.SKILLS);
    if (!skills || !Array.isArray(skills)) {
      skills = initialSkills;
      setItem(STORAGE_KEYS.SKILLS, skills);
    }
    return skills.map(normalizeSkill);
  },

  async getSkillById(skillId) {
    try {
      const res = await api.get(`/skills/${skillId}`);
      if (res?.data?.skill) {
        return normalizeSkill(res.data.skill);
      }
    } catch {
      // Offline fallback
    }

    const skills = await this.getAllSkills();
    return skills.find((s) => s.id === skillId || s._id === skillId) || null;
  },

  async getSkillsByTeacher(teacherId) {
    try {
      const res = await api.get(`/users/${teacherId}/skills`);
      if (res?.data?.skills) {
        return res.data.skills.map(normalizeSkill);
      }
    } catch {
      // Offline fallback
    }

    const skills = await this.getAllSkills();
    return skills.filter((s) => s.teacherId === teacherId || (s.teacher && s.teacher.id === teacherId));
  },

  async createSkill(skillData) {
    try {
      const payload = {
        title: skillData.title,
        category: skillData.category || "Programming & Development",
        description: skillData.description || skillData.shortDesc || "No description provided",
        level: (skillData.level || "all_levels").toLowerCase().replace(" ", "_"),
        format: "one-on-one",
        exchangeType: "both",
        learningOutcomes: Array.isArray(skillData.outcomes) ? skillData.outcomes : (skillData.outcomes || "").split("\n").filter(Boolean),
        syllabus: (Array.isArray(skillData.topics) ? skillData.topics : (skillData.topics || "").split("\n").filter(Boolean)).map((title, i) => ({
          week: i + 1,
          title
        })),
        tags: [skillData.category || "Skill"]
      };

      const res = await api.post("/skills", payload);
      if (res?.data?.skill) {
        return normalizeSkill(res.data.skill);
      }
    } catch {
      // Offline fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const skills = await this.getAllSkills();

    const newSkill = normalizeSkill({
      id: `skill-${Date.now()}`,
      title: skillData.title,
      category: skillData.category || "Other Skills",
      teacherId: skillData.teacherId,
      level: skillData.level || "All Levels",
      format: skillData.format || "Online (Video Call)",
      duration: skillData.duration || "4 weeks",
      rating: 5.0,
      reviewCount: 0,
      activeLearners: 0,
      coverImage: skillData.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
      shortDesc: skillData.shortDesc || "",
      description: skillData.description || "",
      topics: Array.isArray(skillData.topics) ? skillData.topics : (skillData.topics || "").split("\n").filter(Boolean),
      outcomes: Array.isArray(skillData.outcomes) ? skillData.outcomes : (skillData.outcomes || "").split("\n").filter(Boolean),
      prerequisites: skillData.prerequisites || "None required.",
      schedule: skillData.schedule || "Flexible weekends",
      exchangeArrangement: skillData.exchangeArrangement || "Open to skill exchange",
      status: "Active",
      createdDate: new Date().toISOString().split("T")[0]
    });

    const updated = [newSkill, ...skills];
    setItem(STORAGE_KEYS.SKILLS, updated);
    return newSkill;
  },

  async updateSkill(skillId, updates) {
    try {
      const res = await api.put(`/skills/${skillId}`, updates);
      if (res?.data?.skill) {
        return normalizeSkill(res.data.skill);
      }
    } catch {
      // Offline fallback
    }

    const skills = await this.getAllSkills();
    const index = skills.findIndex((s) => s.id === skillId || s._id === skillId);

    if (index === -1) {
      throw new Error("Skill listing not found.");
    }

    const updatedSkill = normalizeSkill({
      ...skills[index],
      ...updates
    });

    skills[index] = updatedSkill;
    setItem(STORAGE_KEYS.SKILLS, skills);
    return updatedSkill;
  },

  async deleteSkill(skillId) {
    try {
      await api.delete(`/skills/${skillId}`);
    } catch {
      // Offline fallback
    }

    let skills = await this.getAllSkills();
    skills = skills.filter((s) => s.id !== skillId && s._id !== skillId);
    setItem(STORAGE_KEYS.SKILLS, skills);
    return true;
  },

  async toggleSkillStatus(skillId) {
    try {
      const res = await api.patch(`/skills/${skillId}/status`);
      if (res?.data?.skill) {
        return normalizeSkill(res.data.skill);
      }
    } catch {
      // Offline fallback
    }

    const skills = await this.getAllSkills();
    const skill = skills.find((s) => s.id === skillId || s._id === skillId);
    if (!skill) return null;
    const newStatus = skill.status === "Active" ? "Paused" : "Active";
    return this.updateSkill(skillId, { status: newStatus });
  },

  // Wishlist operations
  async getWishlist() {
    try {
      const res = await api.get("/wishlist");
      if (res?.data?.wishlist) {
        return res.data.wishlist.map((item) => item._id || item.id || item);
      }
    } catch {
      // Offline fallback
    }

    let list = getItem(STORAGE_KEYS.WISHLIST);
    if (!list || !Array.isArray(list)) {
      list = initialWishlist;
      setItem(STORAGE_KEYS.WISHLIST, list);
    }
    return list;
  },

  async toggleWishlist(skillId) {
    try {
      const currentList = await this.getWishlist();
      const isWishlisted = currentList.includes(skillId);

      if (isWishlisted) {
        await api.delete(`/wishlist/${skillId}`);
      } else {
        await api.post("/wishlist", { skillId });
      }
    } catch {
      // Offline fallback
    }

    let list = await this.getWishlist();
    if (list.includes(skillId)) {
      list = list.filter((id) => id !== skillId);
    } else {
      list = [...list, skillId];
    }
    setItem(STORAGE_KEYS.WISHLIST, list);
    return list;
  }
};
