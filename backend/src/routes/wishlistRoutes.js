import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getWishlist);
router.post("/", protect, addToWishlist);
router.delete("/:skillId", protect, removeFromWishlist);
router.get("/check/:skillId", protect, checkWishlistStatus);

export default router;

