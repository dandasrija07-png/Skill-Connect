import { Router } from "express";
import {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  getMySkills,
  getFeaturedSkills,
  getCategories,
  updateSkillStatus
} from "../controllers/skillController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createSkillValidator } from "../validators/skillValidator.js";

const router = Router();

router.get("/", optionalAuth, getSkills);
router.get("/featured", getFeaturedSkills);
router.get("/categories", getCategories);
router.get("/my-skills", protect, getMySkills);
router.get("/:id", optionalAuth, getSkillById);
router.post("/", protect, validate(createSkillValidator), createSkill);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);
router.patch("/:id/status", protect, updateSkillStatus);

export default router;

