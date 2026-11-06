import { Router } from "express";
import {
  getProgressList,
  getProgressById,
  createProgress,
  updateProgress,
  toggleMilestone,
  addGoal,
  toggleGoal,
  deleteGoal,
  getProgressStatistics
} from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getProgressList);
router.get("/stats", protect, getProgressStatistics);
router.get("/:id", protect, getProgressById);
router.post("/", protect, createProgress);
router.put("/:id", protect, updateProgress);
router.patch("/:id/milestones/:milestoneIndex", protect, toggleMilestone);
router.post("/:id/goals", protect, addGoal);
router.patch("/:id/goals/:goalIndex", protect, toggleGoal);
router.delete("/:id/goals/:goalIndex", protect, deleteGoal);

export default router;

