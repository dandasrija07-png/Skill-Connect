import { Review } from "../models/Review.js";
import { Skill } from "../models/Skill.js";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "../services/notificationService.js";

/**
 * Helper to update teacher and skill rating stats
 */
const updateRatingStats = async (teacherId, skillId) => {
  // Update Skill stats
  if (skillId) {
    const skillReviews = await Review.find({ skill: skillId });
    const count = skillReviews.length;
    const avg = count > 0 ? skillReviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    await Skill.findByIdAndUpdate(skillId, {
      rating: parseFloat(avg.toFixed(1)),
      reviewCount: count
    });
  }

  // Update Teacher stats across all skills
  if (teacherId) {
    const teacherReviews = await Review.find({ teacher: teacherId });
    const count = teacherReviews.length;
    const avg = count > 0 ? teacherReviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    // We can compute stats on the fly or update user if field exists
    await User.findByIdAndUpdate(teacherId, {
      averageRating: parseFloat(avg.toFixed(1)),
      totalReviews: count
    });
  }
};

/**
 * Create a new review
 */
export const createReview = async (req, res, next) => {
  try {
    const reviewerId = req.user._id;
    const { teacherId, skillId, sessionId, rating, comment } = req.body;

    if (!teacherId || !skillId || !rating || !comment) {
      throw ApiError.badRequest("Teacher, skill, rating (1-5), and comment are required");
    }

    if (reviewerId.toString() === teacherId.toString()) {
      throw ApiError.badRequest("You cannot review yourself");
    }

    const teacher = await User.findById(teacherId);
    if (!teacher) {
      throw ApiError.notFound("Teacher not found");
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      throw ApiError.notFound("Skill not found");
    }

    // Optional session check
    if (sessionId) {
      const session = await Session.findById(sessionId);
      if (session) {
        // Check duplicate review for same session
        const existingReview = await Review.findOne({
          reviewer: reviewerId,
          session: sessionId
        });
        if (existingReview) {
          throw ApiError.conflict("You have already reviewed this session");
        }
      }
    }

    const review = await Review.create({
      reviewer: reviewerId,
      teacher: teacherId,
      skill: skillId,
      session: sessionId || null,
      rating: Number(rating),
      comment: comment.trim()
    });

    // Recalculate stats
    await updateRatingStats(teacherId, skillId);

    const populatedReview = await Review.findById(review._id)
      .populate("reviewer", "fullName username profileImage")
      .populate("skill", "title category")
      .populate("teacher", "fullName username profileImage");

    // Send notification to teacher
    await createNotification({
      recipient: teacherId,
      sender: reviewerId,
      type: "new_review",
      title: "New Review Received",
      message: `${req.user.fullName} left you a ${rating}-star review for "${skill.title}"`,
      link: `/teacher/portal`
    });

    return res
      .status(201)
      .json(ApiResponse.created(populatedReview, "Review submitted successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Get reviews for a teacher
 */
export const getTeacherReviews = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments({ teacher: teacherId });

    const reviews = await Review.find({ teacher: teacherId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("reviewer", "fullName username profileImage")
      .populate("skill", "title category");

    // Calculate rating breakdown
    const allReviews = await Review.find({ teacher: teacherId }).select("rating");
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    allReviews.forEach((r) => {
      if (breakdown[r.rating] !== undefined) breakdown[r.rating]++;
      sum += r.rating;
    });
    const average = total > 0 ? parseFloat((sum / total).toFixed(1)) : 0;

    return res.status(200).json(
      ApiResponse.paginated(
        reviews,
        page,
        limit,
        total,
        "Teacher reviews retrieved successfully",
        { breakdown, averageRating: average, totalReviews: total }
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get reviews for a specific skill
 */
export const getSkillReviews = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments({ skill: skillId });

    const reviews = await Review.find({ skill: skillId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("reviewer", "fullName username profileImage")
      .populate("skill", "title category");

    return res
      .status(200)
      .json(
        ApiResponse.paginated(
          reviews,
          page,
          limit,
          total,
          "Skill reviews retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Add or update teacher's response to a review
 */
export const addTeacherResponse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherId = req.user._id;
    const { response } = req.body;

    if (!response || !response.trim()) {
      throw ApiError.badRequest("Response cannot be empty");
    }

    const review = await Review.findById(id);
    if (!review) {
      throw ApiError.notFound("Review not found");
    }

    if (review.teacher.toString() !== teacherId.toString()) {
      throw ApiError.forbidden("Only the teacher who received this review can respond");
    }

    review.teacherResponse = response.trim();
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate("reviewer", "fullName username profileImage")
      .populate("skill", "title category");

    return res
      .status(200)
      .json(ApiResponse.success(populatedReview, "Teacher response added successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a review (only by reviewer)
 */
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviewerId = req.user._id;

    const review = await Review.findOne({ _id: id, reviewer: reviewerId });
    if (!review) {
      throw ApiError.notFound("Review not found or unauthorized to delete");
    }

    const { teacher, skill } = review;
    await review.deleteOne();

    await updateRatingStats(teacher, skill);

    return res
      .status(200)
      .json(ApiResponse.success(null, "Review deleted successfully"));
  } catch (error) {
    next(error);
  }
};

