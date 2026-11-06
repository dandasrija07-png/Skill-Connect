import { ExchangeRequest } from "../models/ExchangeRequest.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createNotification } from "../services/notificationService.js";

export const getMatches = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) throw new ApiError(404, "User not found");

    const myOffered = (currentUser.skillsToTeach || []).map((s) => s.toLowerCase().trim());
    const myWanted = (currentUser.skillsToLearn || []).map((s) => s.toLowerCase().trim());

    // Find other active users
    const otherUsers = await User.find({
      _id: { $ne: currentUser._id },
      accountStatus: "active"
    }).select("fullName username profileImage headline bio location rating reviewCount skillsToTeach skillsToLearn availability badges joinedDate");

    const matches = [];

    for (const other of otherUsers) {
      const theirOffered = (other.skillsToTeach || []).map((s) => s.toLowerCase().trim());
      const theirWanted = (other.skillsToLearn || []).map((s) => s.toLowerCase().trim());

      // Overlaps
      const theyTeachWhatIWant = other.skillsToTeach.filter((teach) =>
        myWanted.some((want) => teach.toLowerCase().includes(want) || want.includes(teach.toLowerCase()))
      );

      const iTeachWhatTheyWant = (currentUser.skillsToTeach || []).filter((myTeach) =>
        theirWanted.some((theirWant) => myTeach.toLowerCase().includes(theirWant) || theirWant.includes(myTeach.toLowerCase()))
      );

      let matchType;
      let matchScore;
      let isMutual = false;

      if (theyTeachWhatIWant.length > 0 && iTeachWhatTheyWant.length > 0) {
        matchType = "Mutual";
        matchScore = "100% Mutual Match";
        isMutual = true;
      } else if (theyTeachWhatIWant.length > 0) {
        matchType = "They Teach";
        matchScore = "85% Skill Match";
      } else if (iTeachWhatTheyWant.length > 0) {
        matchType = "You Teach";
        matchScore = "75% Interest Match";
      } else {
        matchType = "Complementary";
        matchScore = "Community Match";
      }

      matches.push({
        user: other,
        matchType,
        matchScore,
        mutual: isMutual,
        offeredMatched: theyTeachWhatIWant,
        wantedMatched: iTeachWhatTheyWant,
        explanation: isMutual
          ? `Mutual match! You teach ${iTeachWhatTheyWant.join(", ")}, they teach ${theyTeachWhatIWant.join(", ")}.`
          : `Community match in ${other.location}`
      });
    }

    // Sort mutual matches first, then rating
    matches.sort((a, b) => (b.mutual ? 1 : 0) - (a.mutual ? 1 : 0) || b.user.rating - a.user.rating);

    return ApiResponse.success(res, 200, { matches }, "Potential skill matches computed successfully");
  } catch (error) {
    next(error);
  }
};

export const createExchange = async (req, res, next) => {
  try {
    const {
      receiverId,
      senderOfferedSkill,
      receiverOfferedSkill,
      message,
      preferredSchedule,
      totalPlannedSessions
    } = req.body;

    if (receiverId.toString() === req.user._id.toString()) {
      throw new ApiError(400, "You cannot propose a skill exchange with yourself.");
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      throw new ApiError(404, "Target user not found.");
    }

    const exchange = await ExchangeRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      senderOfferedSkill,
      receiverOfferedSkill,
      message: message || "Let's exchange skills!",
      preferredSchedule: preferredSchedule || "Flexible Evenings",
      totalPlannedSessions: Number(totalPlannedSessions) || 4,
      status: "pending"
    });

    await exchange.populate([
      { path: "sender", select: "fullName username profileImage location" },
      { path: "receiver", select: "fullName username profileImage location" }
    ]);

    // Notify receiver
    await createNotification({
      recipient: receiverId,
      sender: req.user._id,
      type: "exchange_request",
      title: "New Skill Exchange Proposal!",
      message: `${req.user.fullName} proposed a mutual swap: "${senderOfferedSkill}" for "${receiverOfferedSkill}".`,
      link: "/dashboard/exchange",
      relatedId: exchange._id
    });

    return ApiResponse.success(res, 201, { exchange }, "Skill exchange proposal sent successfully!");
  } catch (error) {
    next(error);
  }
};

export const getExchanges = async (req, res, next) => {
  try {
    const exchanges = await ExchangeRequest.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
      .populate("sender", "fullName username profileImage location")
      .populate("receiver", "fullName username profileImage location")
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 200, { exchanges }, "Exchanges retrieved");
  } catch (error) {
    next(error);
  }
};

export const getSentExchanges = async (req, res, next) => {
  try {
    const exchanges = await ExchangeRequest.find({ sender: req.user._id })
      .populate("receiver", "fullName username profileImage location")
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 200, { exchanges }, "Sent exchanges retrieved");
  } catch (error) {
    next(error);
  }
};

export const getReceivedExchanges = async (req, res, next) => {
  try {
    const exchanges = await ExchangeRequest.find({ receiver: req.user._id })
      .populate("sender", "fullName username profileImage location")
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 200, { exchanges }, "Received exchanges retrieved");
  } catch (error) {
    next(error);
  }
};

export const getExchangeById = async (req, res, next) => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id)
      .populate("sender", "fullName username profileImage location")
      .populate("receiver", "fullName username profileImage location");

    if (!exchange) throw new ApiError(404, "Exchange request not found.");

    const isMember =
      exchange.sender._id.toString() === req.user._id.toString() ||
      exchange.receiver._id.toString() === req.user._id.toString();

    if (!isMember) {
      throw new ApiError(403, "Not authorized to view this exchange proposal.");
    }

    return ApiResponse.success(res, 200, { exchange }, "Exchange retrieved");
  } catch (error) {
    next(error);
  }
};

export const acceptExchange = async (req, res, next) => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id);
    if (!exchange) throw new ApiError(404, "Exchange not found.");

    if (exchange.receiver.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Only the receiver can accept this exchange proposal.");
    }

    exchange.status = "accepted";
    await exchange.save();

    await createNotification({
      recipient: exchange.sender,
      sender: req.user._id,
      type: "exchange_accepted",
      title: "Skill Exchange Accepted! 🤝",
      message: `${req.user.fullName} accepted your skill exchange proposal!`,
      link: "/dashboard/exchange",
      relatedId: exchange._id
    });

    return ApiResponse.success(res, 200, { exchange }, "Exchange proposal accepted!");
  } catch (error) {
    next(error);
  }
};

export const rejectExchange = async (req, res, next) => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id);
    if (!exchange) throw new ApiError(404, "Exchange not found.");

    if (exchange.receiver.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Only the receiver can decline this proposal.");
    }

    exchange.status = "rejected";
    await exchange.save();

    return ApiResponse.success(res, 200, { exchange }, "Exchange proposal declined.");
  } catch (error) {
    next(error);
  }
};

export const cancelExchange = async (req, res, next) => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id);
    if (!exchange) throw new ApiError(404, "Exchange not found.");

    if (exchange.sender.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Only the sender can cancel this exchange proposal.");
    }

    exchange.status = "cancelled";
    await exchange.save();

    return ApiResponse.success(res, 200, { exchange }, "Exchange proposal cancelled.");
  } catch (error) {
    next(error);
  }
};

export const completeExchange = async (req, res, next) => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id);
    if (!exchange) throw new ApiError(404, "Exchange not found.");

    exchange.status = "completed";
    await exchange.save();

    return ApiResponse.success(res, 200, { exchange }, "Exchange marked as completed.");
  } catch (error) {
    next(error);
  }
};

