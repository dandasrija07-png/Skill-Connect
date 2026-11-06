import { Router } from "express";
import {
  createReview,
  getTeacherReviews,
  getSkillReviews,
  addTeacherResponse,
  deleteReview
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createReview);
router.get("/teacher/:teacherId", getTeacherReviews);
router.get("/skill/:skillId", getSkillReviews);
router.post("/:id/response", protect, addTeacherResponse);
router.delete("/:id", protect, deleteReview);

export default router;

