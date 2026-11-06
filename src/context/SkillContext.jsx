import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { skillService } from "../services/skillService";
import { requestService } from "../services/requestService";
import { exchangeService } from "../services/exchangeService";
import { sessionService } from "../services/sessionService";
import { notificationService } from "../services/notificationService";
import { reviewService } from "../services/reviewService";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const SkillContext = createContext(null);

export const SkillProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [skills, setSkills] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [requests, setRequests] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  const refreshAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [allSkills, wish, allReqs, allExch, allSess, allNotifs, allRevs] = await Promise.all([
        skillService.getAllSkills(),
        skillService.getWishlist(),
        requestService.getAllRequests(),
        exchangeService.getAllExchanges(),
        sessionService.getAllSessions(),
        notificationService.getAllNotifications(currentUser?.id),
        reviewService.getAllReviews()
      ]);

      setSkills(allSkills);
      setWishlist(wish);
      setRequests(allReqs);
      setExchanges(allExch);
      setSessions(allSess);
      setNotifications(allNotifs);
      setReviews(allRevs);
    } catch (err) {
      console.error("Error refreshing data in SkillContext:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Wishlist actions
  const toggleWishlist = async (skillId) => {
    const isSaved = wishlist.includes(skillId);
    const updated = await skillService.toggleWishlist(skillId);
    setWishlist(updated);
    addToast(isSaved ? "Removed from wishlist" : "Saved to wishlist!", isSaved ? "info" : "success");
  };

  // Skill CRUD
  const createSkill = async (skillData) => {
    try {
      const newSkill = await skillService.createSkill({
        ...skillData,
        teacherId: currentUser.id
      });
      setSkills((prev) => [newSkill, ...prev]);
      addToast("New skill published successfully!", "success");
      return newSkill;
    } catch (err) {
      addToast(err.message || "Failed to publish skill", "error");
      throw err;
    }
  };

  const updateSkill = async (skillId, updates) => {
    try {
      const updated = await skillService.updateSkill(skillId, updates);
      setSkills((prev) => prev.map((s) => (s.id === skillId ? updated : s)));
      addToast("Skill listing updated!", "success");
      return updated;
    } catch (err) {
      addToast(err.message || "Failed to update skill", "error");
      throw err;
    }
  };

  const deleteSkill = async (skillId) => {
    try {
      await skillService.deleteSkill(skillId);
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      addToast("Skill listing deleted.", "info");
    } catch (err) {
      addToast(err.message || "Failed to delete skill", "error");
      throw err;
    }
  };

  const toggleSkillStatus = async (skillId) => {
    try {
      const updated = await skillService.toggleSkillStatus(skillId);
      if (updated) {
        setSkills((prev) => prev.map((s) => (s.id === skillId ? updated : s)));
        addToast(`Skill status changed to ${updated.status}`, "info");
      }
    } catch (err) {
      addToast("Failed to toggle skill status", "error");
    }
  };

  // Learning Request actions
  const sendLearningRequest = async (requestData) => {
    try {
      const newReq = await requestService.createRequest({
        ...requestData,
        learnerId: currentUser.id,
        learnerName: currentUser.name,
        learnerAvatar: currentUser.avatar
      });
      setRequests((prev) => [newReq, ...prev]);

      // Also create a notification for the teacher
      await notificationService.addNotification({
        userId: requestData.teacherId,
        type: "request_received",
        title: "New Learning Request",
        message: `${currentUser.name} requested to learn "${requestData.skillTitle}".`,
        link: "/dashboard/teaching"
      });

      addToast("Learning request sent successfully!", "success");
      return newReq;
    } catch (err) {
      addToast(err.message || "Failed to send request", "error");
      throw err;
    }
  };

  const handleRequestStatus = async (requestId, status) => {
    try {
      const updated = await requestService.updateRequestStatus(requestId, status);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));

      // Notify learner
      await notificationService.addNotification({
        userId: updated.learnerId,
        type: status === "Accepted" ? "request_accepted" : "request_rejected",
        title: `Request ${status}`,
        message: `Your request for "${updated.skillTitle}" was ${status.toLowerCase()}.`,
        link: "/dashboard/learning"
      });

      addToast(`Request has been ${status.toLowerCase()}!`, "info");
      return updated;
    } catch (err) {
      addToast("Failed to update request", "error");
    }
  };

  // Exchange actions
  const sendExchangeRequest = async (exchangeData) => {
    try {
      const newExch = await exchangeService.createExchange({
        ...exchangeData,
        requesterId: currentUser.id,
        requesterName: currentUser.name,
        requesterAvatar: currentUser.avatar
      });
      setExchanges((prev) => [newExch, ...prev]);

      // Notify target user
      await notificationService.addNotification({
        userId: exchangeData.targetUserId,
        type: "exchange_match",
        title: "New Skill Exchange Request!",
        message: `${currentUser.name} wants to exchange skills with you!`,
        link: "/dashboard/exchange"
      });

      addToast("Skill exchange proposal sent!", "success");
      return newExch;
    } catch (err) {
      addToast(err.message || "Failed to send exchange request", "error");
      throw err;
    }
  };

  const handleExchangeStatus = async (exchangeId, status) => {
    try {
      const updated = await exchangeService.updateExchangeStatus(exchangeId, status);
      setExchanges((prev) => prev.map((e) => (e.id === exchangeId ? updated : e)));
      addToast(`Exchange marked as ${status}!`, "info");
      return updated;
    } catch (err) {
      addToast("Failed to update exchange status", "error");
    }
  };

  // Session actions
  const scheduleSession = async (sessionData) => {
    try {
      const newSess = await sessionService.createSession(sessionData);
      setSessions((prev) => [newSess, ...prev]);

      // Notify other user
      const targetId = sessionData.teacherId === currentUser.id ? sessionData.learnerId : sessionData.teacherId;
      await notificationService.addNotification({
        userId: targetId,
        type: "session_upcoming",
        title: "New Session Scheduled",
        message: `A session "${sessionData.title}" was scheduled for ${sessionData.date}.`,
        link: "/dashboard/sessions"
      });

      addToast("Session scheduled successfully!", "success");
      return newSess;
    } catch (err) {
      addToast(err.message || "Failed to schedule session", "error");
      throw err;
    }
  };

  const updateSessionStatus = async (sessionId, status) => {
    try {
      const updated = await sessionService.updateSessionStatus(sessionId, status);
      setSessions((prev) => prev.map((s) => (s.id === sessionId ? updated : s)));
      addToast(`Session marked as ${status}!`, "info");
      return updated;
    } catch (err) {
      addToast("Failed to update session status", "error");
    }
  };

  const rescheduleSession = async (sessionId, { date, time }) => {
    try {
      const updated = await sessionService.rescheduleSession(sessionId, { date, time });
      setSessions((prev) => prev.map((s) => (s.id === sessionId ? updated : s)));
      addToast("Session rescheduled!", "success");
      return updated;
    } catch (err) {
      addToast("Failed to reschedule session", "error");
    }
  };

  // Review submission
  const submitReview = async (reviewData) => {
    try {
      const newRev = await reviewService.createReview({
        ...reviewData,
        reviewerId: currentUser.id,
        reviewerName: currentUser.name,
        reviewerAvatar: currentUser.avatar
      });
      setReviews((prev) => [newRev, ...prev]);

      // Notify teacher
      await notificationService.addNotification({
        userId: reviewData.teacherId,
        type: "new_review",
        title: "New Review Received!",
        message: `${currentUser.name} gave you a ${reviewData.rating}-star review for "${reviewData.skillTitle}".`,
        link: "/dashboard/reviews"
      });

      addToast("Review submitted successfully! Thank you for your feedback.", "success");
      return newRev;
    } catch (err) {
      addToast(err.message || "Failed to submit review", "error");
      throw err;
    }
  };

  const addTeacherResponse = async (reviewId, responseText) => {
    try {
      const updated = await reviewService.addTeacherResponse(reviewId, responseText);
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
      addToast("Response posted!", "success");
      return updated;
    } catch (err) {
      addToast("Failed to post response", "error");
    }
  };

  // Notification actions
  const markNotificationRead = async (notifId) => {
    await notificationService.markAsRead(notifId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = async () => {
    await notificationService.markAllAsRead(currentUser?.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("All notifications marked as read", "info");
  };

  const deleteNotification = async (notifId) => {
    await notificationService.deleteNotification(notifId);
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  return (
    <SkillContext.Provider
      value={{
        skills,
        wishlist,
        requests,
        exchanges,
        sessions,
        notifications,
        reviews,
        loading,
        refreshAllData,
        toggleWishlist,
        createSkill,
        updateSkill,
        deleteSkill,
        toggleSkillStatus,
        sendLearningRequest,
        handleRequestStatus,
        sendExchangeRequest,
        handleExchangeStatus,
        scheduleSession,
        updateSessionStatus,
        rescheduleSession,
        submitReview,
        addTeacherResponse,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification
      }}
    >
      {children}
    </SkillContext.Provider>
  );
};

export const useSkills = () => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error("useSkills must be used within a SkillProvider");
  }
  return context;
};
