import { Router } from "express";
import {
  getOverview,
  getTeachingOverview,
  getLearningOverview
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/overview", protect, getOverview);
router.get("/teaching", protect, getTeachingOverview);
router.get("/learning", protect, getLearningOverview);

export default router;

