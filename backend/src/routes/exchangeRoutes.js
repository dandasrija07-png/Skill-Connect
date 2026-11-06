import { Router } from "express";
import {
  getMatches,
  createExchange,
  getExchanges,
  getSentExchanges,
  getReceivedExchanges,
  getExchangeById,
  acceptExchange,
  rejectExchange,
  cancelExchange,
  completeExchange
} from "../controllers/exchangeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/matches", protect, getMatches);
router.post("/", protect, createExchange);
router.get("/", protect, getExchanges);
router.get("/sent", protect, getSentExchanges);
router.get("/received", protect, getReceivedExchanges);
router.get("/:id", protect, getExchangeById);
router.patch("/:id/accept", protect, acceptExchange);
router.patch("/:id/reject", protect, rejectExchange);
router.patch("/:id/cancel", protect, cancelExchange);
router.patch("/:id/complete", protect, completeExchange);

export default router;

