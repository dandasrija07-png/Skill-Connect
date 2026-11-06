import { STORAGE_KEYS, getItem, setItem } from "../utils/storage";
import { initialUsers } from "../data/mockData";
import { api } from "./api";
import { normalizeUser } from "./authService";

export const userService = {
  async getAllUsers() {
    try {
      const res = await api.get("/users/search");
      if (res?.data?.users && res.data.users.length > 0) {
        return res.data.users.map(normalizeUser);
      }
    } catch {
      // Offline fallback
    }

    let users = getItem(STORAGE_KEYS.USERS);
    if (!users || !Array.isArray(users)) {
      users = initialUsers;
      setItem(STORAGE_KEYS.USERS, users);
    }
    return users.map(normalizeUser);
  },

  async getUserById(userId) {
    try {
      const res = await api.get(`/users/${userId}`);
      if (res?.data?.user) {
        return normalizeUser(res.data.user);
      }
    } catch {
      // Offline fallback
    }

    const users = await this.getAllUsers();
    return users.find((u) => u.id === userId || u._id === userId) || null;
  },

  async updateProfile(userId, profileData) {
    try {
      const payload = {
        fullName: profileData.name || profileData.fullName,
        bio: profileData.bio,
        location: profileData.location,
        experienceLevel: profileData.experienceLevel ? profileData.experienceLevel.toLowerCase() : undefined,
        skillsToTeach: profileData.skillsOffered || profileData.skillsToTeach,
        skillsToLearn: profileData.skillsWanted || profileData.skillsToLearn,
        availability: profileData.availability
      };

      const res = await api.put("/users/profile", payload);
      if (res?.data?.user) {
        const normalized = normalizeUser(res.data.user);
        setItem(STORAGE_KEYS.CURRENT_USER, normalized);
        return normalized;
      }
    } catch {
      // Offline fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const users = await this.getAllUsers();
    const index = users.findIndex((u) => u.id === userId || u._id === userId);

    if (index === -1) {
      throw new Error("User not found");
    }

    const updatedUser = normalizeUser({
      ...users[index],
      ...profileData
    });

    users[index] = updatedUser;
    setItem(STORAGE_KEYS.USERS, users);

    const currentUser = getItem(STORAGE_KEYS.CURRENT_USER);
    if (currentUser && (currentUser.id === userId || currentUser._id === userId)) {
      setItem(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }

    return updatedUser;
  },

  async updateUserSkills(userId, { skillsOffered, skillsWanted }) {
    return this.updateProfile(userId, {
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || []
    });
  }
};
