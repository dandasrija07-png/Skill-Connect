import { Notification } from "../models/Notification.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Get all notifications for current user
 */
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Notification.countDocuments({ recipient: userId });
    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "fullName username profileImage");

    return res.status(200).json(
      ApiResponse.paginated(
        notifications,
        page,
        limit,
        total,
        "Notifications retrieved successfully",
        { unreadCount }
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      throw ApiError.notFound("Notification not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success(notification, "Notification marked as read"));
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read for current user
 */
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json(
      ApiResponse.success(
        { modifiedCount: result.modifiedCount },
        "All notifications marked as read"
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId
    });

    if (!notification) {
      throw ApiError.notFound("Notification not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success(null, "Notification deleted successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Get count of unread notifications
 */
export const getUnreadNotificationCount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const count = await Notification.countDocuments({ recipient: userId, isRead: false });

    return res
      .status(200)
      .json(ApiResponse.success({ count }, "Unread notification count retrieved"));
  } catch (error) {
    next(error);
  }
};

