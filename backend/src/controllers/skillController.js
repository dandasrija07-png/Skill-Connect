import { Skill } from "../models/Skill.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";

export const createSkill = async (req, res, next) => {
  try {
    const {
      title,
      category,
      shortDesc,
      description,
      coverImage,
      skillLevel,
      experience,
      topicsCovered,
      learningOutcomes,
      prerequisites,
      teachingFormat,
      availability,
      expectedDuration,
      exchangePreference,
      status
    } = req.body;

    let finalCoverImage = coverImage;
    if (req.file) {
      if (isCloudinaryConfigured) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "skillconnect/skills" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        finalCoverImage = uploadResult.secure_url;
      } else {
        finalCoverImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      }
    }

    const skill = await Skill.create({
      title,
      category,
      shortDesc: shortDesc || (description ? description.slice(0, 150) + "..." : ""),
      description,
      coverImage: finalCoverImage || undefined,
      teacher: req.user._id,
      skillLevel: skillLevel || "Intermediate",
      experience: experience || "Practical experience",
      topicsCovered: Array.isArray(topicsCovered) ? topicsCovered : (topicsCovered || "").split("\n").filter(Boolean),
      learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : (learningOutcomes || "").split("\n").filter(Boolean),
      prerequisites: prerequisites || "None required.",
      teachingFormat: teachingFormat || "Online (Video Call)",
      availability: availability || "Flexible schedule",
      expectedDuration: expectedDuration || "4 weeks (8 sessions)",
      exchangePreference: exchangePreference || "Open to skill exchange",
      status: status || "Active"
    });

    // Populate teacher before returning
    await skill.populate("teacher", "fullName username profileImage rating reviewCount location");

    return ApiResponse.success(res, 201, { skill }, "Skill listing published successfully!");
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (req, res, next) => {
  try {
    const {
      search,
      category,
      level,
      format,
      minRating,
      sort = "popularity",
      page = 1,
      limit = 12
    } = req.query;

    const query = { status: "Active" };

    if (category && category !== "All Categories" && category !== "All") {
      query.category = category;
    }

    if (level && level !== "All" && level !== "All Levels") {
      query.$or = [{ skillLevel: level }, { skillLevel: "All Levels" }];
    }

    if (format && format !== "All") {
      query.teachingFormat = { $regex: format, $options: "i" };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Search query: search skill title, description, or teacher name
    if (search) {
      // Find matching teachers first
      const matchedTeachers = await User.find({
        fullName: { $regex: search, $options: "i" }
      }).select("_id");

      const teacherIds = matchedTeachers.map((t) => t._id);

      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { teacher: { $in: teacherIds } }
      ];
    }

    // Sort order
    let sortOptions = { activeLearners: -1, createdAt: -1 };
    if (sort === "rating") sortOptions = { rating: -1, reviewCount: -1 };
    if (sort === "newest") sortOptions = { createdAt: -1 };
    if (sort === "popularity") sortOptions = { activeLearners: -1, rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [skills, total] = await Promise.all([
      Skill.find(query)
        .populate("teacher", "fullName username profileImage headline location rating reviewCount")
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Skill.countDocuments(query)
    ]);

    return ApiResponse.success(
      res,
      200,
      {
        skills,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit)
        }
      },
      "Skills retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
      "teacher",
      "fullName username profileImage headline bio location experienceLevel rating reviewCount hoursTaught badges"
    );

    if (!skill) {
      throw new ApiError(404, "Skill listing not found.");
    }

    // Also fetch similar skills in the same category
    const similarSkills = await Skill.find({
      category: skill.category,
      _id: { $ne: skill._id },
      status: "Active"
    })
      .populate("teacher", "fullName username profileImage rating location")
      .limit(3);

    return ApiResponse.success(res, 200, { skill, similarSkills }, "Skill details retrieved");
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      throw new ApiError(404, "Skill listing not found.");
    }

    if (skill.teacher.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You do not have permission to modify this skill listing.");
    }

    const updates = { ...req.body };
    delete updates.teacher; // Never reassign ownership

    if (req.body.topics) {
      updates.topicsCovered = Array.isArray(req.body.topics) ? req.body.topics : req.body.topics.split("\n").filter(Boolean);
    }
    if (req.body.outcomes) {
      updates.learningOutcomes = Array.isArray(req.body.outcomes) ? req.body.outcomes : req.body.outcomes.split("\n").filter(Boolean);
    }

    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true }).populate(
      "teacher",
      "fullName username profileImage rating reviewCount"
    );

    return ApiResponse.success(res, 200, { skill: updatedSkill }, "Skill updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      throw new ApiError(404, "Skill listing not found.");
    }

    if (skill.teacher.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You do not have permission to delete this skill listing.");
    }

    await skill.deleteOne();
    return ApiResponse.success(res, 200, {}, "Skill listing deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getMySkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ teacher: req.user._id }).sort({ createdAt: -1 });
    return ApiResponse.success(res, 200, { skills }, "My skills retrieved");
  } catch (error) {
    next(error);
  }
};

export const getFeaturedSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ status: "Active" })
      .populate("teacher", "fullName username profileImage rating location")
      .sort({ rating: -1, activeLearners: -1 })
      .limit(6);

    return ApiResponse.success(res, 200, { skills }, "Featured skills retrieved");
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Skill.aggregate([
      { $match: { status: "Active" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return ApiResponse.success(res, 200, { categories }, "Categories retrieved");
  } catch (error) {
    next(error);
  }
};

export const updateSkillStatus = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) throw new ApiError(404, "Skill not found.");
    if (skill.teacher.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Unauthorized.");
    }

    skill.status = skill.status === "Active" ? "Paused" : "Active";
    await skill.save();

    return ApiResponse.success(res, 200, { skill }, `Skill status changed to ${skill.status}`);
  } catch (error) {
    next(error);
  }
};

