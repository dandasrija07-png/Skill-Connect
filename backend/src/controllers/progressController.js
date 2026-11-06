import { Progress } from "../models/Progress.js";
import { Session } from "../models/Session.js";
import { Skill } from "../models/Skill.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Get all progress records for current user
 */
export const getProgressList = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const progressRecords = await Progress.find({ user: userId })
      .populate("skill", "title category image level")
      .populate("teacher", "fullName username profileImage")
      .sort({ updatedAt: -1 });

    return res
      .status(200)
      .json(ApiResponse.success(progressRecords, "Progress records retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Get single progress record
 */
export const getProgressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOne({ _id: id, user: userId })
      .populate("skill", "title category image level")
      .populate("teacher", "fullName username profileImage");

    if (!progress) {
      throw ApiError.notFound("Progress record not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success(progress, "Progress record retrieved"));
  } catch (error) {
    next(error);
  }
};

/**
 * Create or initialize progress for a skill
 */
export const createProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { skillId, teacherId, skillTitle, totalSessions, milestones, goals } = req.body;

    const existing = await Progress.findOne({ user: userId, skill: skillId });
    if (existing) {
      return res
        .status(200)
        .json(ApiResponse.success(existing, "Progress tracker already exists for this skill"));
    }

    // Default milestones from skill syllabus if available
    let initialMilestones = milestones;
    if (!initialMilestones && skillId) {
      const skill = await Skill.findById(skillId);
      if (skill && skill.syllabus && skill.syllabus.length > 0) {
        initialMilestones = skill.syllabus.map((s) => ({
          title: s.title || s,
          completed: false
        }));
      }
    }

    const progress = await Progress.create({
      user: userId,
      skill: skillId || null,
      teacher: teacherId || null,
      skillTitle: skillTitle || "Skill Learning Track",
      totalSessions: totalSessions || 6,
      completedSessions: 0,
      learningHours: 0,
      progressPercentage: 0,
      milestones: initialMilestones || [
        { title: "Introduction & Core Concepts", completed: false },
        { title: "Hands-on Practical Exercise", completed: false },
        { title: "Intermediate Project", completed: false },
        { title: "Advanced Techniques", completed: false },
        { title: "Final Evaluation & Polish", completed: false }
      ],
      goals: goals || []
    });

    return res
      .status(201)
      .json(ApiResponse.created(progress, "Progress tracker created successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Update progress details (hours, notes, etc.)
 */
export const updateProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { totalSessions, completedSessions, learningHours, notes, milestones, goals } = req.body;

    const progress = await Progress.findOne({ _id: id, user: userId });
    if (!progress) {
      throw ApiError.notFound("Progress record not found");
    }

    if (totalSessions !== undefined) progress.totalSessions = totalSessions;
    if (completedSessions !== undefined) progress.completedSessions = completedSessions;
    if (learningHours !== undefined) progress.learningHours = learningHours;
    if (notes !== undefined) progress.notes = notes;
    if (milestones !== undefined) progress.milestones = milestones;
    if (goals !== undefined) progress.goals = goals;

    // Recalculate percentage based on milestones or sessions
    if (progress.milestones && progress.milestones.length > 0) {
      const completedMilestones = progress.milestones.filter((m) => m.completed).length;
      progress.progressPercentage = Math.round(
        (completedMilestones / progress.milestones.length) * 100
      );
    } else if (progress.totalSessions > 0) {
      progress.progressPercentage = Math.min(
        100,
        Math.round((progress.completedSessions / progress.totalSessions) * 100)
      );
    }

    await progress.save();

    return res
      .status(200)
      .json(ApiResponse.success(progress, "Progress updated successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle milestone completion status
 */
export const toggleMilestone = async (req, res, next) => {
  try {
    const { id, milestoneIndex } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOne({ _id: id, user: userId });
    if (!progress) {
      throw ApiError.notFound("Progress record not found");
    }

    const idx = parseInt(milestoneIndex);
    if (idx < 0 || idx >= progress.milestones.length) {
      throw ApiError.badRequest("Invalid milestone index");
    }

    const currentStatus = progress.milestones[idx].completed;
    progress.milestones[idx].completed = !currentStatus;
    progress.milestones[idx].completedAt = !currentStatus ? new Date() : null;

    // Update progress percentage
    const completedCount = progress.milestones.filter((m) => m.completed).length;
    progress.progressPercentage = Math.round((completedCount / progress.milestones.length) * 100);

    await progress.save();

    return res
      .status(200)
      .json(ApiResponse.success(progress, "Milestone updated successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Add custom goal
 */
export const addGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      throw ApiError.badRequest("Goal text cannot be empty");
    }

    const progress = await Progress.findOne({ _id: id, user: userId });
    if (!progress) {
      throw ApiError.notFound("Progress record not found");
    }

    progress.goals.push({ text: text.trim(), completed: false });
    await progress.save();

    return res
      .status(201)
      .json(ApiResponse.created(progress, "Goal added successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle goal completion
 */
export const toggleGoal = async (req, res, next) => {
  try {
    const { id, goalIndex } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOne({ _id: id, user: userId });
    if (!progress) {
      throw ApiError.notFound("Progress record not found");
    }

    const idx = parseInt(goalIndex);
    if (idx < 0 || idx >= progress.goals.length) {
      throw ApiError.badRequest("Invalid goal index");
    }

    progress.goals[idx].completed = !progress.goals[idx].completed;
    await progress.save();

    return res
      .status(200)
      .json(ApiResponse.success(progress, "Goal updated successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete goal
 */
export const deleteGoal = async (req, res, next) => {
  try {
    const { id, goalIndex } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOne({ _id: id, user: userId });
    if (!progress) {
      throw ApiError.notFound("Progress record not found");
    }

    const idx = parseInt(goalIndex);
    if (idx < 0 || idx >= progress.goals.length) {
      throw ApiError.badRequest("Invalid goal index");
    }

    progress.goals.splice(idx, 1);
    await progress.save();

    return res
      .status(200)
      .json(ApiResponse.success(progress, "Goal removed successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Get aggregated progress statistics
 */
export const getProgressStatistics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const records = await Progress.find({ user: userId });
    const completedSessionsCount = await Session.countDocuments({
      learner: userId,
      status: "completed"
    });

    const totalHours = records.reduce((sum, r) => sum + (r.learningHours || 0), 0);
    const avgPercentage =
      records.length > 0
        ? Math.round(records.reduce((sum, r) => sum + (r.progressPercentage || 0), 0) / records.length)
        : 0;

    return res.status(200).json(
      ApiResponse.success(
        {
          totalSkillsTracked: records.length,
          completedSessions: completedSessionsCount,
          totalLearningHours: totalHours,
          overallAverageProgress: avgPercentage
        },
        "Progress statistics calculated"
      )
    );
  } catch (error) {
    next(error);
  }
};

