// Review Routes
// - Belongs to: Member 5

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createReviewValidation } from "./review.validation.js";
import {
  createReviewController,
  getReviewsByUserController,
} from "./review.controller.js";

const router = express.Router();

router.post(
  "/orders/:orderId/reviews",
  protect,
  restrictTo("BUYER", "SUPPLIER"),
  validate(createReviewValidation),
  createReviewController
);

router.get(
  "/users/:userId/reviews",
  protect,
  getReviewsByUserController
);

export default router;
