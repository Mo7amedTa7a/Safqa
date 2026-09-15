// Notification Controller
// - Belongs to: Member 5

import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from "./notification.service.js";

const getUserNotificationsController = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const notifications = await getUserNotifications(userId);
    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};

const markAsReadController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    const notification = await markAsRead(id, userId);
    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (err) {
    next(err);
  }
};

const markAllAsReadController = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const result = await markAllAsRead(userId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export {
  getUserNotificationsController,
  markAsReadController,
  markAllAsReadController,
};
