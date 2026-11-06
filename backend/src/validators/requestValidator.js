import { body } from "express-validator";

export const createLearningRequestValidator = [
  body("skillId")
    .notEmpty()
    .withMessage("Skill ID is required")
    .isMongoId()
    .withMessage("Invalid skill ID format"),
  body("introduction")
    .trim()
    .notEmpty()
    .withMessage("Personal introduction is required")
    .isLength({ min: 5 })
    .withMessage("Introduction must be at least 5 characters long"),
  body("learningGoals")
    .trim()
    .notEmpty()
    .withMessage("Learning goals are required")
];

export const createExchangeValidator = [
  body("receiverId")
    .notEmpty()
    .withMessage("Receiver user ID is required")
    .isMongoId()
    .withMessage("Invalid receiver user ID"),
  body("senderOfferedSkill")
    .trim()
    .notEmpty()
    .withMessage("Offered skill is required"),
  body("receiverOfferedSkill")
    .trim()
    .notEmpty()
    .withMessage("Wanted skill is required")
];

