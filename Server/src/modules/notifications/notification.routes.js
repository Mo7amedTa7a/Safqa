// Notification Routes
// - Belongs to: Member 5

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import {
  getUserNotificationsController,
  markAsReadController,
  markAllAsReadController,
} from "./notification.controller.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getUserNotificationsController
);

router.patch(
  "/read-all",
  protect,
  markAllAsReadController
);

router.patch(
  "/:id/read",
  protect,
  markAsReadController
);

export default router;
