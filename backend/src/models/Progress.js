import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      index: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    skillTitle: {
      type: String
    },
    totalSessions: {
      type: Number,
      default: 6
    },
    completedSessions: {
      type: Number,
      default: 0
    },
    learningHours: {
      type: Number,
      default: 0
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    milestones: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date }
      }
    ],
    goals: [
      {
        text: { type: String, required: true },
        completed: { type: Boolean, default: false }
      }
    ],
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

progressSchema.index({ user: 1, skill: 1 });

export const Progress = mongoose.model("Progress", progressSchema);

