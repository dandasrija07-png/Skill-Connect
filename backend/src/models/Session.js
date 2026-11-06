import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher reference is required"],
      index: true
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Learner reference is required"],
      index: true
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      index: true
    },
    learningRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningRequest"
    },
    exchangeRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExchangeRequest"
    },
    title: {
      type: String,
      required: [true, "Session title is required"],
      trim: true
    },
    sessionDate: {
      type: String,
      required: [true, "Session date is required"],
      index: true
    },
    time: {
      type: String,
      default: "19:00 - 20:30 IST"
    },
    startTime: {
      type: String
    },
    endTime: {
      type: String
    },
    learningFormat: {
      type: String,
      default: "Online (Video Call)"
    },
    meetingLink: {
      type: String,
      default: "https://meet.google.com/xyz-skillconnect-room"
    },
    location: {
      type: String,
      default: "Online Video Room"
    },
    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled", "Rescheduled", "scheduled", "completed", "cancelled", "rescheduled"],
      default: "Upcoming",
      index: true
    },
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

sessionSchema.index({ teacher: 1, sessionDate: 1, status: 1 });
sessionSchema.index({ learner: 1, sessionDate: 1, status: 1 });

export const Session = mongoose.model("Session", sessionSchema);

