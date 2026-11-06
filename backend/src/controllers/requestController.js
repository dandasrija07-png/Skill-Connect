import { LearningRequest } from "../models/LearningRequest.js";
import { Skill } from "../models/Skill.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createNotification } from "../services/notificationService.js";

export const createRequest = async (req, res, next) => {
  try {
    const { skillId, introduction, learningGoals, preferredSchedule, learningMethod } = req.body;

    const skill = await Skill.findById(skillId).populate("teacher");
    if (!skill) {
      throw new ApiError(404, "Skill listing not found.");
    }

    if (skill.status !== "Active") {
      throw new ApiError(400, "This skill listing is currently not accepting new learners.");
    }

    if (skill.teacher._id.toString() === req.user._id.toString()) {
      throw new ApiError(400, "You cannot request to learn your own skill listing.");
    }

    // Check for existing pending request
    const existing = await LearningRequest.findOne({
      learner: req.user._id,
      skill: skillId,
      status: "pending"
    });

    if (existing) {
      throw new ApiError(400, "You already have a pending learning request for this skill.");
    }

    const request = await LearningRequest.create({
      learner: req.user._id,
      teacher: skill.teacher._id,
      skill: skillId,
      introduction,
      learningGoals,
      preferredSchedule: preferredSchedule || "Weekday Evenings",
      learningMethod: learningMethod || "Online (Video Call)",
      status: "pending"
    });

    await request.populate([
      { path: "learner", select: "fullName username profileImage location" },
      { path: "teacher", select: "fullName username profileImage location" },
      { path: "skill", select: "title category skillLevel coverImage" }
    ]);

    // Create notification for teacher
    await createNotification({
      recipient: skill.teacher._id,
      sender: req.user._id,
      type: "learning_request",
      title: "New Learning Request",
      message: `${req.user.fullName} requested to learn "${skill.title}".`,
      link: "/dashboard/teaching",
      relatedId: request._id
    });

    return ApiResponse.success(res, 201, { request }, "Learning request sent successfully!");
  } catch (error) {
    next(error);
  }
};

export const getSentRequests = async (req, res, next) => {
  try {
    const requests = await LearningRequest.find({ learner: req.user._id })
      .populate("teacher", "fullName username profileImage location rating")
      .populate("skill", "title category coverImage skillLevel")
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 200, { requests }, "Sent requests retrieved");
  } catch (error) {
    next(error);
  }
};

export const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await LearningRequest.find({ teacher: req.user._id })
      .populate("learner", "fullName username profileImage location rating bio")
      .populate("skill", "title category coverImage")
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 200, { requests }, "Received requests retrieved");
  } catch (error) {
    next(error);
  }
};

export const getRequestById = async (req, res, next) => {
  try {
    const request = await LearningRequest.findById(req.params.id)
      .populate("learner", "fullName username profileImage location rating")
      .populate("teacher", "fullName username profileImage location rating")
      .populate("skill");

    if (!request) throw new ApiError(404, "Request not found.");

    // Only participants can view
    const isParticipant =
      request.learner._id.toString() === req.user._id.toString() ||
      request.teacher._id.toString() === req.user._id.toString();

    if (!isParticipant) {
      throw new ApiError(403, "Not authorized to view this request.");
    }

    return ApiResponse.success(res, 200, { request }, "Request retrieved");
  } catch (error) {
    next(error);
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const request = await LearningRequest.findById(req.params.id).populate("skill");
    if (!request) throw new ApiError(404, "Request not found.");

    if (request.teacher.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Only the designated teacher can accept this request.");
    }

    request.status = "accepted";
    await request.save();

    // Increment active learners count on skill
    if (request.skill) {
      await Skill.findByIdAndUpdate(request.skill._id, { $inc: { activeLearners: 1 } });
    }

    // Notify learner
    await createNotification({
      recipient: request.learner,
      sender: req.user._id,
      type: "request_accepted",
      title: "Learning Request Accepted! 🎉",
      message: `${req.user.fullName} accepted your request to learn "${request.skill?.title || "skill"}".`,
      link: "/dashboard/learning",
      relatedId: request._id
    });

    return ApiResponse.success(res, 200, { request }, "Request accepted successfully!");
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const request = await LearningRequest.findById(req.params.id);
    if (!request) throw new ApiError(404, "Request not found.");

    if (request.teacher.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Only the designated teacher can decline this request.");
    }

    request.status = "rejected";
    await request.save();

    await createNotification({
      recipient: request.learner,
      sender: req.user._id,
      type: "request_rejected",
      title: "Learning Request Update",
      message: `Your learning request was declined by the instructor.`,
      link: "/dashboard/learning",
      relatedId: request._id
    });

    return ApiResponse.success(res, 200, { request }, "Request rejected.");
  } catch (error) {
    next(error);
  }
};

export const cancelRequest = async (req, res, next) => {
  try {
    const request = await LearningRequest.findById(req.params.id);
    if (!request) throw new ApiError(404, "Request not found.");

    if (request.learner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Only the learner who submitted this proposal can cancel it.");
    }

    request.status = "cancelled";
    await request.save();

    return ApiResponse.success(res, 200, { request }, "Request cancelled.");
  } catch (error) {
    next(error);
  }
};

export const completeRequest = async (req, res, next) => {
  try {
    const request = await LearningRequest.findById(req.params.id);
    if (!request) throw new ApiError(404, "Request not found.");

    request.status = "completed";
    await request.save();

    return ApiResponse.success(res, 200, { request }, "Request marked as completed.");
  } catch (error) {
    next(error);
  }
};

