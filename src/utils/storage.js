// LocalStorage helper with fallback and default seeding
export const STORAGE_KEYS = {
  USERS: "skillconnect_users",
  CURRENT_USER: "skillconnect_current_user",
  SKILLS: "skillconnect_skills",
  REQUESTS: "skillconnect_requests",
  EXCHANGES: "skillconnect_exchanges",
  SESSIONS: "skillconnect_sessions",
  REVIEWS: "skillconnect_reviews",
  NOTIFICATIONS: "skillconnect_notifications",
  CONVERSATIONS: "skillconnect_conversations",
  WISHLIST: "skillconnect_wishlist",
  USER_GOALS: "skillconnect_user_goals"
};

export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving localStorage key "${key}":`, error);
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

export const clearAll = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Error clearing skillconnect storage:", error);
  }
};

