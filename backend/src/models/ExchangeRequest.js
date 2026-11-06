import mongoose from "mongoose";

const exchangeRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
      index: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
      index: true
    },
    senderOfferedSkill: {
      type: String,
      required: [true, "Offered skill is required"],
      trim: true
    },
    receiverOfferedSkill: {
      type: String,
      required: [true, "Wanted skill is required"],
      trim: true
    },
    message: {
      type: String,
      trim: true,
      default: "Let's exchange skills together!"
    },
    preferredSchedule: {
      type: String,
      default: "Flexible Evenings"
    },
    totalPlannedSessions: {
      type: Number,
      default: 4
    },
    sessionsCompleted: {
      type: Number,
      default: 0
    },
    matchScore: {
      type: String,
      default: "100% Mutual Match"
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

exchangeRequestSchema.index({ sender: 1, receiver: 1, status: 1 });

export const ExchangeRequest = mongoose.model("ExchangeRequest", exchangeRequestSchema);

