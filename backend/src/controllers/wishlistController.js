import { Wishlist } from "../models/Wishlist.js";
import { Skill } from "../models/Skill.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Get user's wishlist
 */
export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const wishlistItems = await Wishlist.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "skill",
        populate: {
          path: "teacher",
          select: "fullName username profileImage location averageRating"
        }
      });

    const validSkills = wishlistItems
      .filter((item) => item.skill !== null)
      .map((item) => item.skill);

    return res
      .status(200)
      .json(ApiResponse.success(validSkills, "Wishlist retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Add a skill to wishlist
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { skillId } = req.body;

    if (!skillId) {
      throw ApiError.badRequest("Skill ID is required");
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      throw ApiError.notFound("Skill not found");
    }

    const existing = await Wishlist.findOne({ user: userId, skill: skillId });
    if (existing) {
      return res
        .status(200)
        .json(ApiResponse.success(existing, "Skill is already in your wishlist"));
    }

    const item = await Wishlist.create({
      user: userId,
      skill: skillId
    });

    return res
      .status(201)
      .json(ApiResponse.created(item, "Skill added to wishlist successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a skill from wishlist
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { skillId } = req.params;

    const result = await Wishlist.findOneAndDelete({
      user: userId,
      skill: skillId
    });

    if (!result) {
      throw ApiError.notFound("Item not found in wishlist");
    }

    return res
      .status(200)
      .json(ApiResponse.success(null, "Skill removed from wishlist"));
  } catch (error) {
    next(error);
  }
};

/**
 * Check if a skill is in user's wishlist
 */
export const checkWishlistStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { skillId } = req.params;

    const exists = await Wishlist.exists({ user: userId, skill: skillId });

    return res
      .status(200)
      .json(ApiResponse.success({ isWishlisted: Boolean(exists) }, "Wishlist status checked"));
  } catch (error) {
    next(error);
  }
};

