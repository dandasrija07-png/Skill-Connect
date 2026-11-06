import { User } from "../models/User.js";
import { Skill } from "../models/Skill.js";
import { Session } from "../models/Session.js";
import { LearningRequest } from "../models/LearningRequest.js";
import { ExchangeRequest } from "../models/ExchangeRequest.js";
import { Notification } from "../models/Notification.js";
import { Message } from "../models/Message.js";
import { Progress } from "../models/Progress.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Get comprehensive overview data for main dashboard
 */
export const getOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Concurrently fetch overview metrics
    const [
      teachingSkillsCount,
      upcomingSessions,
      pendingReceivedRequestsCount,
      pendingExchangeCount,
      recentNotifications,
      unreadMessagesCount,
      completedSessionsCount,
      progressRecords
    ] = await Promise.all([
      Skill.countDocuments({ teacher: userId, status: "active" }),
      Session.find({
        $or: [{ teacher: userId }, { learner: userId }],
        status: { $in: ["scheduled", "confirmed"] },
        scheduledAt: { $gte: new Date(Date.now() - 3600 * 1000) }
      })
        .sort({ scheduledAt: 1 })
        .limit(3)
        .populate("teacher", "fullName username profileImage")
        .populate("learner", "fullName username profileImage")
        .populate("skill", "title category"),
      LearningRequest.countDocuments({ teacher: userId, status: "pending" }),
      ExchangeRequest.countDocuments({
        $or: [{ sender: userId }, { recipient: userId }],
        status: "pending"
      }),
      Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("sender", "fullName username profileImage"),
      Message.countDocuments({ receiver: userId, readAt: null }),
      Session.countDocuments({
        $or: [{ teacher: userId }, { learner: userId }],
        status: "completed"
      }),
      Progress.find({ user: userId })
    ]);

    // Calculate total learning hours
    const totalHours = progressRecords.reduce((sum, r) => sum + (r.learningHours || 0), 0);

    // Mock weekly activity dataset for chart rendering
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyActivity = days.map((day, idx) => ({
      day,
      hours: [1.5, 2.0, 0.5, 3.0, 1.0, 4.0, 2.5][idx] || 1.0,
      sessions: [1, 2, 0, 2, 1, 3, 2][idx] || 1
    }));

    return res.status(200).json(
      ApiResponse.success(
        {
          stats: {
            teachingSkillsCount,
            learningSkillsCount: progressRecords.length,
            completedSessionsCount,
            totalHours,
            pendingRequestsCount: pendingReceivedRequestsCount + pendingExchangeCount,
            unreadMessagesCount
          },
          upcomingSessions,
          recentNotifications,
          weeklyActivity
        },
        "Dashboard overview retrieved successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get teaching portal dashboard statistics and listings
 */
export const getTeachingOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [mySkills, receivedRequests, upcomingTeachingSessions, completedSessions] =
      await Promise.all([
        Skill.find({ teacher: userId }).sort({ createdAt: -1 }),
        LearningRequest.find({ teacher: userId })
          .sort({ createdAt: -1 })
          .populate("learner", "fullName username profileImage location bio")
          .populate("skill", "title category"),
        Session.find({
          teacher: userId,
          status: { $in: ["scheduled", "confirmed"] }
        })
          .sort({ scheduledAt: 1 })
          .populate("learner", "fullName username profileImage")
          .populate("skill", "title category"),
        Session.find({
          teacher: userId,
          status: "completed"
        })
      ]);

    // Calculate distinct students taught
    const studentIds = new Set(completedSessions.map((s) => s.learner.toString()));
    const totalTeachingMinutes = completedSessions.reduce((sum, s) => sum + (s.duration || 60), 0);
    const totalTeachingHours = parseFloat((totalTeachingMinutes / 60).toFixed(1));

    return res.status(200).json(
      ApiResponse.success(
        {
          skills: mySkills,
          requests: receivedRequests,
          upcomingSessions: upcomingTeachingSessions,
          metrics: {
            totalSkills: mySkills.length,
            activeSkills: mySkills.filter((s) => s.status === "active").length,
            totalStudents: studentIds.size,
            totalTeachingHours,
            pendingRequestsCount: receivedRequests.filter((r) => r.status === "pending").length
          }
        },
        "Teaching overview retrieved successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get learner portal dashboard statistics and active courses
 */
export const getLearningOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [sentRequests, upcomingLearningSessions, progressRecords] = await Promise.all([
      LearningRequest.find({ learner: userId })
        .sort({ createdAt: -1 })
        .populate("teacher", "fullName username profileImage")
        .populate("skill", "title category"),
      Session.find({
        learner: userId,
        status: { $in: ["scheduled", "confirmed"] }
      })
        .sort({ scheduledAt: 1 })
        .populate("teacher", "fullName username profileImage")
        .populate("skill", "title category"),
      Progress.find({ user: userId })
        .populate("skill", "title category image level")
        .populate("teacher", "fullName username profileImage")
    ]);

    const totalLearningHours = progressRecords.reduce(
      (sum, r) => sum + (r.learningHours || 0),
      0
    );

    return res.status(200).json(
      ApiResponse.success(
        {
          progress: progressRecords,
          requests: sentRequests,
          upcomingSessions: upcomingLearningSessions,
          metrics: {
            enrolledSkillsCount: progressRecords.length,
            totalLearningHours,
            pendingRequestsCount: sentRequests.filter((r) => r.status === "pending").length,
            upcomingCount: upcomingLearningSessions.length
          }
        },
        "Learning overview retrieved successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

