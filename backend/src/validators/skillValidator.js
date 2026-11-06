import { body } from "express-validator";

export const createSkillValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Skill title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be between 3 and 150 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long")
];

