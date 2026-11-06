import { Router } from "express";
import {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  getRequestById,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest
} from "../controllers/requestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createRequest);
router.get("/sent", protect, getSentRequests);
router.get("/received", protect, getReceivedRequests);
router.get("/:id", protect, getRequestById);
router.patch("/:id/accept", protect, acceptRequest);
router.patch("/:id/reject", protect, rejectRequest);
router.patch("/:id/cancel", protect, cancelRequest);
router.patch("/:id/complete", protect, completeRequest);

export default router;

