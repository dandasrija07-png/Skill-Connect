import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { useToast } from "./ToastContext";
import { initClientSocket, disconnectClientSocket } from "../services/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        if (user) {
          initClientSocket();
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async ({ email, password, rememberMe }) => {
    try {
      const user = await authService.login({ email, password, rememberMe });
      setCurrentUser(user);
      initClientSocket();
      addToast(`Welcome back, ${user.name}!`, "success");
      return user;
    } catch (err) {
      addToast(err.message || "Failed to log in", "error");
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const user = await authService.register(formData);
      setCurrentUser(user);
      initClientSocket();
      addToast("Account created successfully! Welcome to SkillConnect.", "success");
      return user;
    } catch (err) {
      addToast(err.message || "Registration failed", "error");
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    disconnectClientSocket();
    setCurrentUser(null);
    addToast("Logged out successfully.", "info");
  };

  const switchAccount = async (userId) => {
    try {
      const user = await authService.switchDemoAccount(userId);
      setCurrentUser(user);
      addToast(`Switched account to ${user.name}`, "info");
      return user;
    } catch (err) {
      addToast("Failed to switch account", "error");
    }
  };

  const updateProfile = async (updates) => {
    if (!currentUser) return;
    try {
      const updated = await userService.updateProfile(currentUser.id, updates);
      setCurrentUser(updated);
      addToast("Profile updated successfully!", "success");
      return updated;
    } catch (err) {
      addToast(err.message || "Failed to update profile", "error");
      throw err;
    }
  };

  const resetAllData = () => {
    disconnectClientSocket();
    authService.resetAllDemoData();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        switchAccount,
        updateProfile,
        resetAllData,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
