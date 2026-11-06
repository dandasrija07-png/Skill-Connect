import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getIO, isUserOnline } from "../config/socket.js";
import { createNotification } from "../services/notificationService.js";

/**
 * Get all conversations for current user
 */
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate("participants", "fullName username profileImage location bio")
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    // Calculate unread count and online status for each
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const otherParticipant = conv.participants.find(
          (p) => p._id.toString() !== userId.toString()
        );

        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          receiver: userId,
          readAt: null
        });

        const isOnline = otherParticipant ? isUserOnline(otherParticipant._id) : false;

        return {
          ...conv.toObject(),
          otherParticipant,
          unreadCount,
          isOnline
        };
      })
    );

    return res
      .status(200)
      .json(ApiResponse.success(enrichedConversations, "Conversations retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Get or create a conversation with another user
 */
export const getOrCreateConversation = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { recipientId } = req.body;

    if (!recipientId) {
      throw ApiError.badRequest("Recipient ID is required");
    }

    if (currentUserId.toString() === recipientId.toString()) {
      throw ApiError.badRequest("Cannot start a conversation with yourself");
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      throw ApiError.notFound("Recipient not found");
    }

    // Look for existing conversation between both users
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, recipientId] }
    }).populate("participants", "fullName username profileImage location bio");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, recipientId],
        lastMessage: "",
        lastMessageAt: new Date()
      });

      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "fullName username profileImage location bio"
      );
    }

    const otherParticipant = conversation.participants.find(
      (p) => p._id.toString() !== currentUserId.toString()
    );

    const unreadCount = await Message.countDocuments({
      conversation: conversation._id,
      receiver: currentUserId,
      readAt: null
    });

    const result = {
      ...conversation.toObject(),
      otherParticipant,
      unreadCount,
      isOnline: isUserOnline(recipientId)
    };

    return res
      .status(200)
      .json(ApiResponse.success(result, "Conversation ready"));
  } catch (error) {
    next(error);
  }
};

/**
 * Get messages for a specific conversation
 */
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw ApiError.notFound("Conversation not found");
    }

    const isMember = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isMember) {
      throw ApiError.forbidden("Access denied: You are not a participant in this conversation");
    }

    const total = await Message.countDocuments({ conversation: conversationId });

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "fullName username profileImage")
      .populate("receiver", "fullName username profileImage");

    return res.status(200).json(
      ApiResponse.paginated(
        messages,
        page,
        limit,
        total,
        "Messages retrieved successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Send a message in a conversation
 */
export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { conversationId, receiverId, content } = req.body;

    if (!content || !content.trim()) {
      throw ApiError.badRequest("Message content cannot be empty");
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw ApiError.notFound("Conversation not found");
      }
    } else if (receiverId) {
      conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId]
        });
      }
    } else {
      throw ApiError.badRequest("Either conversationId or receiverId must be provided");
    }

    // Determine actual receiver
    const actualReceiverId =
      receiverId ||
      conversation.participants.find((p) => p.toString() !== senderId.toString());

    if (!actualReceiverId) {
      throw ApiError.badRequest("Could not resolve receiver for this message");
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      receiver: actualReceiverId,
      content: content.trim()
    });

    // Update conversation lastMessage
    conversation.lastMessage = content.trim();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "fullName username profileImage")
      .populate("receiver", "fullName username profileImage");

    // Real-time broadcast via Socket.IO
    const io = getIO();
    if (io) {
      // Send to conversation room
      io.to(`conversation:${conversation._id}`).emit("new_message", populatedMessage);

      // Send alert to receiver's personal channel
      io.to(`user:${actualReceiverId}`).emit("message_notification", {
        message: populatedMessage,
        conversationId: conversation._id
      });
    }

    // Create persistent notification for receiver
    await createNotification({
      recipient: actualReceiverId,
      sender: senderId,
      type: "new_message",
      title: "New Message",
      message: `${req.user.fullName}: ${content.trim().slice(0, 80)}${content.trim().length > 80 ? "..." : ""}`,
      link: `/messages?conv=${conversation._id}`
    });

    return res
      .status(201)
      .json(ApiResponse.created(populatedMessage, "Message sent successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Mark messages in a conversation as read
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const result = await Message.updateMany(
      {
        conversation: conversationId,
        receiver: userId,
        readAt: null
      },
      {
        $set: { readAt: new Date() }
      }
    );

    const io = getIO();
    if (io) {
      io.to(`conversation:${conversationId}`).emit("messages_read", {
        conversationId,
        readBy: userId,
        readAt: new Date()
      });
    }

    return res
      .status(200)
      .json(ApiResponse.success({ modifiedCount: result.modifiedCount }, "Messages marked as read"));
  } catch (error) {
    next(error);
  }
};

