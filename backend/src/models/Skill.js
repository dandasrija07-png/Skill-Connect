import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Skill title is required"],
      trim: true,
      maxlength: [150, "Skill title cannot exceed 150 characters"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true
    },
    shortDesc: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"]
    },
    description: {
      type: String,
      required: [true, "Skill description is required"],
      trim: true
    },
    coverImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop"
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher is required"],
      index: true
    },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "Intermediate"
    },
    experience: {
      type: String,
      default: "Practical experience"
    },
    topicsCovered: {
      type: [String],
      default: []
    },
    learningOutcomes: {
      type: [String],
      default: []
    },
    prerequisites: {
      type: String,
      default: "None required."
    },
    teachingFormat: {
      type: String,
      enum: ["Online (Video Call)", "In-Person", "Hybrid"],
      default: "Online (Video Call)"
    },
    availability: {
      type: String,
      default: "Flexible schedule"
    },
    expectedDuration: {
      type: String,
      default: "4 weeks (8 sessions)"
    },
    exchangePreference: {
      type: String,
      default: "Open to valuable peer skill exchanges"
    },
    status: {
      type: String,
      enum: ["Active", "Paused", "Draft"],
      default: "Active",
      index: true
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    activeLearners: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Search indexes
skillSchema.index({ title: "text", description: "text", topicsCovered: "text", category: "text" });

export const Skill = mongoose.model("Skill", skillSchema);

