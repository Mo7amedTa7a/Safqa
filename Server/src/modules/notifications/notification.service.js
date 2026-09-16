// Notification Service
// - Belongs to: Member 5

import Notification from "./notification.model.js";
import { getIO } from "../../config/socket.js";

const createNotification = async (recipientId, type, title, message, relatedEntity) => {
  const notification = await Notification.create({
    recipient: recipientId,
    type: type,
    title: title,
    message: message,
    relatedEntity: relatedEntity || null,
  });

  try {
    const io = getIO();
    if (io && recipientId) {
      const room = `user_${recipientId.toString()}`;
      io.to(room).emit("new_notification", notification);
      console.log(`[Socket.io] Emitted new_notification to ${room}`);
    }
  } catch (err) {
    console.error("Socket emit error:", err);
  }

  return notification;
};

const getUserNotifications = async (userId) => {
  const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
  return notifications;
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );
  return { message: "All notifications marked as read" };
};

export {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
