import { User } from "../models/User.js";
import { Skill } from "../models/Skill.js";
import { Review } from "../models/Review.js";
import { Session } from "../models/Session.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return ApiResponse.success(res, 200, { user }, "User profile retrieved");
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    // Safe public representation
    const publicProfile = {
      _id: user._id,
      id: user._id,
      fullName: user.fullName,
      name: user.fullName,
      username: user.username,
      profileImage: user.profileImage,
      avatar: user.profileImage,
      headline: user.headline,
      bio: user.bio,
      location: user.location,
      experienceLevel: user.experienceLevel,
      skillsToTeach: user.skillsToTeach,
      skillsOffered: user.skillsToTeach,
      skillsToLearn: user.skillsToLearn,
      skillsWanted: user.skillsToLearn,
      interests: user.interests,
      preferredLearningMethod: user.preferredLearningMethod,
      learningMethod: user.preferredLearningMethod,
      availability: user.availability,
      rating: user.rating,
      reviewCount: user.reviewCount,
      hoursTaught: user.hoursTaught,
      hoursLearned: user.hoursLearned,
      badges: user.badges,
      createdAt: user.createdAt
    };

    return ApiResponse.success(res, 200, { user: publicProfile }, "User retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "fullName",
      "headline",
      "bio",
      "location",
      "experienceLevel",
      "skillsToTeach",
      "skillsToLearn",
      "interests",
      "preferredLearningMethod",
      "availability",
      "profileImage"
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // Support frontend alias field names
    if (req.body.name && !updates.fullName) updates.fullName = req.body.name;
    if (req.body.avatar && !updates.profileImage) updates.profileImage = req.body.avatar;
    if (req.body.skillsOffered && !updates.skillsToTeach) updates.skillsToTeach = req.body.skillsOffered;
    if (req.body.skillsWanted && !updates.skillsToLearn) updates.skillsToLearn = req.body.skillsWanted;
    if (req.body.learningMethod && !updates.preferredLearningMethod) updates.preferredLearningMethod = req.body.learningMethod;

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true });

    return ApiResponse.success(res, 200, { user }, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

export const updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file && !req.body.imageUrl) {
      throw new ApiError(400, "Please provide an image file or imageUrl.");
    }

    let imageUrl = req.body.imageUrl;

    if (req.file) {
      if (isCloudinaryConfigured) {
        // Upload stream to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "skillconnect/profiles",
              transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }]
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        imageUrl = uploadResult.secure_url;
      } else {
        // Data URI fallback when Cloudinary is not configured
        const base64 = req.file.buffer.toString("base64");
        imageUrl = `data:${req.file.mimetype};base64,${base64}`;
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, { profileImage: imageUrl }, { new: true });

    return ApiResponse.success(res, 200, { user, profileImage: imageUrl }, "Profile image updated successfully");
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { q, category, skill, limit = 20, page = 1 } = req.query;
    const query = { accountStatus: "active" };

    if (q) {
      query.$or = [
        { fullName: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
        { headline: { $regex: q, $options: "i" } },
        { skillsToTeach: { $regex: q, $options: "i" } },
        { skillsToLearn: { $regex: q, $options: "i" } }
      ];
    }

    if (skill) {
      query.skillsToTeach = { $regex: skill, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(query).skip(skip).limit(Number(limit)).sort({ rating: -1 });
    const total = await User.countDocuments(query);

    return ApiResponse.success(
      res,
      200,
      {
        users,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit))
        }
      },
      "Users retrieved"
    );
  } catch (error) {
    next(error);
  }
};

export const getUserSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ teacher: req.params.id, status: "Active" }).sort({ createdAt: -1 });
    return ApiResponse.success(res, 200, { skills }, "Teacher skills retrieved");
  } catch (error) {
    next(error);
  }
};

export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ teacher: req.params.id })
      .populate("reviewer", "fullName username profileImage")
      .populate("skill", "title category")
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 200, { reviews }, "User reviews retrieved");
  } catch (error) {
    next(error);
  }
};

export const getUserStatistics = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found.");

    const [skillsTaughtCount, completedSessionsCount] = await Promise.all([
      Skill.countDocuments({ teacher: userId, status: "Active" }),
      Session.countDocuments({ $or: [{ teacher: userId }, { learner: userId }], status: { $in: ["Completed", "completed"] } })
    ]);

    return ApiResponse.success(
      res,
      200,
      {
        statistics: {
          hoursTaught: user.hoursTaught,
          hoursLearned: user.hoursLearned,
          rating: user.rating,
          reviewCount: user.reviewCount,
          skillsTaught: skillsTaughtCount,
          completedSessions: completedSessionsCount
        }
      },
      "Statistics retrieved"
    );
  } catch (error) {
    next(error);
  }
};

