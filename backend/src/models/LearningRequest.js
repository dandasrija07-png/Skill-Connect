import mongoose from "mongoose";

const learningRequestSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Learner is required"],
      index: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher is required"],
      index: true
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: [true, "Skill is required"],
      index: true
    },
    introduction: {
      type: String,
      required: [true, "Personal introduction is required"],
      trim: true
    },
    learningGoals: {
      type: String,
      required: [true, "Learning goals are required"],
      trim: true
    },
    preferredSchedule: {
      type: String,
      default: "Weekday Evenings"
    },
    learningMethod: {
      type: String,
      default: "Online (Video Call)"
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent multiple pending requests by the same learner for the same skill
learningRequestSchema.index({ learner: 1, skill: 1, status: 1 });

export const LearningRequest = mongoose.model("LearningRequest", learningRequestSchema);

