// Refund Routes
// - Belongs to: Member 5

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { updateRefundStatusValidation } from "./refund.validation.js";
import {
  createRefundController,
  getRefundsController,
  getRefundByIdController,
  updateRefundStatusController,
} from "./refund.controller.js";

const router = express.Router();

router.post(
  "/returns/:returnId/refund",
  protect,
  restrictTo("ADMIN"),
  createRefundController
);

router.get(
  "/refunds",
  protect,
  restrictTo("BUYER", "ADMIN"),
  getRefundsController
);

router.get(
  "/refunds/:id",
  protect,
  restrictTo("BUYER", "ADMIN"),
  getRefundByIdController
);

router.patch(
  "/refunds/:id/status",
  protect,
  restrictTo("ADMIN"),
  validate(updateRefundStatusValidation),
  updateRefundStatusController
);

export default router;
