import { Router } from "express";
import {
  getProfile,
  getUserById,
  updateProfile,
  updateProfileImage,
  searchUsers,
  getUserSkills,
  getUserReviews,
  getUserStatistics
} from "../controllers/userController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile/image", protect, uploadSingle("image"), updateProfileImage);
router.get("/search", searchUsers);
router.get("/:id", optionalAuth, getUserById);
router.get("/:id/skills", getUserSkills);
router.get("/:id/reviews", getUserReviews);
router.get("/:id/stats", getUserStatistics);

export default router;

