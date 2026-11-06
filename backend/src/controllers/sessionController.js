import { Session } from "../models/Session.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createNotification } from "../services/notificationService.js";

export const createSession = async (req, res, next) => {
  try {
    const {
      teacherId,
      learnerId,
      skillId,
      title,
      sessionDate,
      time,
      learningFormat,
      meetingLink,
      notes
    } = req.body;

    const finalTeacher = teacherId || req.user._id;
    const finalLearner = learnerId;

    if (!finalLearner || !finalTeacher) {
      throw new ApiError(400, "Both teacher and learner are required to schedule a session.");
    }

    const session = await Session.create({
      teacher: finalTeacher,
      learner: finalLearner,
      skill: skillId || undefined,
      title: title || "SkillConnect Learning Session",
      sessionDate: sessionDate || new Date().toISOString().split("T")[0],
      time: time || "19:00 - 20:30 IST",
      learningFormat: learningFormat || "Online (Video Call)",
      meetingLink: meetingLink || "https://meet.google.com/xyz-skillconnect-room",
      notes: notes || "Live interactive 1-on-1 session.",
      status: "Upcoming"
    });

    await session.populate([
      { path: "teacher", select: "fullName username profileImage" },
      { path: "learner", select: "fullName username profileImage" },
      { path: "skill", select: "title category coverImage" }
    ]);

    // Notify the other party
    const targetUserId = finalTeacher.toString() === req.user._id.toString() ? finalLearner : finalTeacher;
    await createNotification({
      recipient: targetUserId,
      sender: req.user._id,
      type: "session_scheduled",
      title: "New Session Scheduled! 📅",
      message: `${req.user.fullName} scheduled "${session.title}" for ${session.sessionDate} (${session.time}).`,
      link: "/dashboard/sessions",
      relatedId: session._id
    });

    return ApiResponse.success(res, 201, { session }, "Session scheduled successfully!");
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {
      $or: [{ teacher: req.user._id }, { learner: req.user._id }]
    };

    if (status && status !== "All") {
      query.status = { $regex: new RegExp(`^${status}$`, "i") };
    }

    const sessions = await Session.find(query)
      .populate("teacher", "fullName username profileImage")
      .populate("learner", "fullName username profileImage")
      .populate("skill", "title category")
      .sort({ sessionDate: 1, createdAt: -1 });

    return ApiResponse.success(res, 200, { sessions }, "Sessions retrieved");
  } catch (error) {
    next(error);
  }
};

export const getUpcomingSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      $or: [{ teacher: req.user._id }, { learner: req.user._id }],
      status: { $in: ["Upcoming", "scheduled"] }
    })
      .populate("teacher", "fullName username profileImage")
      .populate("learner", "fullName username profileImage")
      .populate("skill", "title category")
      .sort({ sessionDate: 1 });

    return ApiResponse.success(res, 200, { sessions }, "Upcoming sessions retrieved");
  } catch (error) {
    next(error);
  }
};

export const getSessionHistory = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      $or: [{ teacher: req.user._id }, { learner: req.user._id }],
      status: { $in: ["Completed", "completed", "Cancelled", "cancelled"] }
    })
      .populate("teacher", "fullName username profileImage")
      .populate("learner", "fullName username profileImage")
      .populate("skill", "title category")
      .sort({ sessionDate: -1 });

    return ApiResponse.success(res, 200, { sessions }, "Session history retrieved");
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("teacher", "fullName username profileImage headline location")
      .populate("learner", "fullName username profileImage headline location")
      .populate("skill");

    if (!session) throw new ApiError(404, "Session not found.");

    const isMember =
      session.teacher._id.toString() === req.user._id.toString() ||
      session.learner._id.toString() === req.user._id.toString();

    if (!isMember) {
      throw new ApiError(403, "Not authorized to access this session.");
    }

    return ApiResponse.success(res, 200, { session }, "Session retrieved");
  } catch (error) {
    next(error);
  }
};

export const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) throw new ApiError(404, "Session not found.");

    const isMember =
      session.teacher.toString() === req.user._id.toString() ||
      session.learner.toString() === req.user._id.toString();

    if (!isMember) {
      throw new ApiError(403, "Not authorized to update this session.");
    }

    const { sessionDate, time, date, notes, status, meetingLink } = req.body;

    if (sessionDate || date) session.sessionDate = sessionDate || date;
    if (time) session.time = time;
    if (notes !== undefined) session.notes = notes;
    if (status) session.status = status;
    if (meetingLink) session.meetingLink = meetingLink;

    await session.save();
    await session.populate([
      { path: "teacher", select: "fullName username profileImage" },
      { path: "learner", select: "fullName username profileImage" },
      { path: "skill", select: "title category" }
    ]);

    // Notify other participant
    const targetUserId = session.teacher._id.toString() === req.user._id.toString() ? session.learner._id : session.teacher._id;
    await createNotification({
      recipient: targetUserId,
      sender: req.user._id,
      type: "session_updated",
      title: "Session Rescheduled / Updated",
      message: `Session "${session.title}" updated for ${session.sessionDate} at ${session.time}.`,
      link: "/dashboard/sessions",
      relatedId: session._id
    });

    return ApiResponse.success(res, 200, { session }, "Session updated successfully");
  } catch (error) {
    next(error);
  }
};

export const cancelSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) throw new ApiError(404, "Session not found.");

    const isMember =
      session.teacher.toString() === req.user._id.toString() ||
      session.learner.toString() === req.user._id.toString();

    if (!isMember) {
      throw new ApiError(403, "Not authorized.");
    }

    session.status = "Cancelled";
    await session.save();

    const targetUserId = session.teacher.toString() === req.user._id.toString() ? session.learner : session.teacher;
    await createNotification({
      recipient: targetUserId,
      sender: req.user._id,
      type: "session_cancelled",
      title: "Session Cancelled",
      message: `The session "${session.title}" was cancelled by ${req.user.fullName}.`,
      link: "/dashboard/sessions",
      relatedId: session._id
    });

    return ApiResponse.success(res, 200, { session }, "Session cancelled.");
  } catch (error) {
    next(error);
  }
};

export const completeSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) throw new ApiError(404, "Session not found.");

    const isMember =
      session.teacher.toString() === req.user._id.toString() ||
      session.learner.toString() === req.user._id.toString();

    if (!isMember) {
      throw new ApiError(403, "Not authorized.");
    }

    session.status = "Completed";
    await session.save();

    // Increment 1.5 hours on both teacher and learner
    await Promise.all([
      User.findByIdAndUpdate(session.teacher, { $inc: { hoursTaught: 1.5 } }),
      User.findByIdAndUpdate(session.learner, { $inc: { hoursLearned: 1.5 } })
    ]);

    const targetUserId = session.teacher.toString() === req.user._id.toString() ? session.learner : session.teacher;
    await createNotification({
      recipient: targetUserId,
      sender: req.user._id,
      type: "session_completed",
      title: "Session Completed! 🎉",
      message: `Session "${session.title}" has been completed. Don't forget to leave a review!`,
      link: "/dashboard/sessions",
      relatedId: session._id
    });

    return ApiResponse.success(res, 200, { session }, "Session marked as completed!");
  } catch (error) {
    next(error);
  }
};

