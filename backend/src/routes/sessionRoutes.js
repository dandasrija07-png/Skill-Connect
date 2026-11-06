import { Router } from "express";
import {
  createSession,
  getSessions,
  getUpcomingSessions,
  getSessionHistory,
  getSessionById,
  updateSession,
  cancelSession,
  completeSession
} from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createSession);
router.get("/", protect, getSessions);
router.get("/upcoming", protect, getUpcomingSessions);
router.get("/history", protect, getSessionHistory);
router.get("/:id", protect, getSessionById);
router.put("/:id", protect, updateSession);
router.patch("/:id/cancel", protect, cancelSession);
router.patch("/:id/complete", protect, completeSession);

export default router;

