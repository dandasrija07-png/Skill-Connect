import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reviewer reference is required"],
      index: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher reference is required"],
      index: true
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: [true, "Skill reference is required"],
      index: true
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session"
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1 star"],
      max: [5, "Rating cannot exceed 5 stars"]
    },
    comment: {
      type: String,
      required: [true, "Review comment cannot be empty"],
      trim: true,
      maxlength: [1000, "Review comment cannot exceed 1000 characters"]
    },
    teacherResponse: {
      type: String,
      trim: true,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ reviewer: 1, session: 1 });
reviewSchema.index({ teacher: 1, createdAt: -1 });

export const Review = mongoose.model("Review", reviewSchema);

