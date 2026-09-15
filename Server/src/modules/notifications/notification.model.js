// Notification Model
// - Belongs to: Member 5
// - Fields: recipient, type, title, message, isRead, relatedEntity

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedEntity: {
      entityModel: {
        type: String,
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
