import { Router } from "express";
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markAsRead
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/conversations", protect, getConversations);
router.post("/conversations", protect, getOrCreateConversation);
router.get("/conversations/:conversationId", protect, getMessages);
router.post("/", protect, sendMessage);
router.patch("/conversations/:conversationId/read", protect, markAsRead);

export default router;

