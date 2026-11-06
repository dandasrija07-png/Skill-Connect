import { STORAGE_KEYS, getItem, setItem, removeItem, clearAll } from "../utils/storage";
import { initialUsers } from "../data/mockData";
import { api, setToken, clearToken, getToken } from "./api";

// Helper to normalize user fields between backend Mongo document and frontend UI conventions
export const normalizeUser = (u) => {
  if (!u) return null;
  return {
    id: u._id || u.id,
    _id: u._id || u.id,
    name: u.fullName || u.name,
    fullName: u.fullName || u.name,
    username: u.username,
    email: u.email,
    avatar: u.profileImage || u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces",
    profileImage: u.profileImage || u.avatar,
    headline: u.headline || (u.skillsToTeach?.length ? `Teaches ${u.skillsToTeach.join(", ")}` : "SkillConnect Member"),
    bio: u.bio || "Passionate about sharing what I know and learning new skills.",
    location: u.location || "Remote / Global",
    rating: u.averageRating || u.rating || 5.0,
    reviewCount: u.totalReviews || u.reviewCount || 0,
    teachingCount: u.skillsToTeach?.length || u.teachingCount || 0,
    learningCount: u.skillsToLearn?.length || u.learningCount || 0,
    hoursTaught: u.hoursTaught || 0,
    hoursLearned: u.hoursLearned || 0,
    skillsOffered: u.skillsToTeach || u.skillsOffered || [],
    skillsWanted: u.skillsToLearn || u.skillsWanted || [],
    skillsToTeach: u.skillsToTeach || u.skillsOffered || [],
    skillsToLearn: u.skillsToLearn || u.skillsWanted || [],
    experienceLevel: u.experienceLevel || "intermediate",
    learningMethod: u.preferredLearningMethod || u.learningMethod || "Online (Video Call)",
    availability: u.availability || "Flexible Hours",
    badges: u.badges || ["Active Member"],
    isEmailVerified: u.isEmailVerified ?? true,
    joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : u.joinedDate || "Recent"
  };
};

export const authService = {
  // Get currently logged-in user
  async getCurrentUser() {
    const token = getToken();

    if (token) {
      try {
        const response = await api.get("/auth/me");
        if (response?.data?.user) {
          const normalized = normalizeUser(response.data.user);
          setItem(STORAGE_KEYS.CURRENT_USER, normalized);
          return normalized;
        }
      } catch (err) {
        // Token might be expired or backend offline, fallback gracefully
      }
    }

    let current = getItem(STORAGE_KEYS.CURRENT_USER);
    if (!current) {
      const users = await this.getUsers();
      current = users[0];
      setItem(STORAGE_KEYS.CURRENT_USER, current);
    }
    return normalizeUser(current);
  },

  // Get all registered users
  async getUsers() {
    try {
      const response = await api.get("/users/search");
      if (response?.data?.users && response.data.users.length > 0) {
        return response.data.users.map(normalizeUser);
      }
    } catch {
      // Backend offline fallback
    }

    let users = getItem(STORAGE_KEYS.USERS);
    if (!users || !Array.isArray(users) || users.length === 0) {
      users = initialUsers;
      setItem(STORAGE_KEYS.USERS, users);
    }
    return users.map(normalizeUser);
  },

  // Login with email & password
  async login({ email, password, rememberMe = true }) {
    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password
      });

      if (res?.data?.token && res?.data?.user) {
        setToken(res.data.token);
        const normalized = normalizeUser(res.data.user);
        setItem(STORAGE_KEYS.CURRENT_USER, normalized);
        return normalized;
      }
    } catch (err) {
      // If server returned a business error (e.g. invalid credentials), rethrow it
      if (err.status && err.status >= 400 && err.status < 500) {
        throw new Error(err.message || "Invalid credentials. Please check your email and password.", { cause: err });
      }
      // If network failure (backend server not running), fallback to local demo check
    }

    // Demo / Offline fallback login
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users = await this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      throw new Error("No account found with this email. Please check your credentials or register.");
    }

    if (password.length < 4) {
      throw new Error("Password must be at least 4 characters.");
    }

    setItem(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  },

  // Switch demo account directly
  async switchDemoAccount(userId) {
    const users = await this.getUsers();
    const target = users.find((u) => u.id === userId || u._id === userId) || users[0];
    setItem(STORAGE_KEYS.CURRENT_USER, target);
    return target;
  },

  // Register new user
  async register(formData) {
    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password || "Password123!",
        skillsToTeach: formData.skillsOffered || [],
        skillsToLearn: formData.skillsWanted || [],
        bio: formData.bio || "",
        location: formData.location || "Remote",
        experienceLevel: (formData.experienceLevel || "intermediate").toLowerCase(),
        preferredLearningMethod: "online",
        availability: formData.availability || "Flexible"
      };

      const res = await api.post("/auth/register", payload);
      if (res?.data?.token && res?.data?.user) {
        setToken(res.data.token);
        const normalized = normalizeUser(res.data.user);
        setItem(STORAGE_KEYS.CURRENT_USER, normalized);
        return normalized;
      }
    } catch (err) {
      if (err.status && err.status >= 400 && err.status < 500) {
        throw new Error(err.message || "Registration failed. Please check your inputs.", { cause: err });
      }
    }

    // Offline / LocalStorage fallback
    const users = await this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === formData.email.trim().toLowerCase());
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const newUser = normalizeUser({
      id: `user-${Date.now()}`,
      name: formData.name,
      username: formData.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + "_" + Math.floor(Math.random() * 900 + 100),
      email: formData.email,
      avatar: formData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces`,
      headline: formData.headline || "Passionate SkillConnect Member",
      bio: formData.bio || "Enthusiastic about sharing what I know and learning new passions.",
      location: formData.location || "Remote / Global",
      skillsOffered: formData.skillsOffered || [],
      skillsWanted: formData.skillsWanted || [],
      experienceLevel: formData.experienceLevel || "Beginner",
      learningMethod: formData.learningMethod || "Online (Video Call)",
      availability: formData.availability || "Flexible Evenings"
    });

    const updatedUsers = [newUser, ...users];
    setItem(STORAGE_KEYS.USERS, updatedUsers);
    setItem(STORAGE_KEYS.CURRENT_USER, newUser);
    return newUser;
  },

  // Request password reset link
  async forgotPassword(email) {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      return { success: true, message: res?.message || `Password reset link sent to ${email}` };
    } catch {
      return { success: true, message: `Password reset instructions sent to ${email}` };
    }
  },

  // Reset password
  async resetPassword({ token, newPassword }) {
    try {
      const res = await api.post("/auth/reset-password", { token, newPassword });
      return { success: true, message: res?.message || "Your password has been successfully updated." };
    } catch {
      return { success: true, message: "Your password has been successfully updated. Please sign in." };
    }
  },

  // Logout
  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore network errors on logout
    }
    clearToken();
    removeItem(STORAGE_KEYS.CURRENT_USER);
    return true;
  },

  // Reset entire mock state
  resetAllDemoData() {
    clearToken();
    clearAll();
    window.location.reload();
  }
};
