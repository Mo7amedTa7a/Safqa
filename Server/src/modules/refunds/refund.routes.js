// Refund Routes
// - Belongs to: Member 5

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
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
  authorize("ADMIN"),
  createRefundController
);

router.get(
  "/refunds",
  protect,
  authorize("BUYER", "ADMIN"),
  getRefundsController
);

router.get(
  "/refunds/:id",
  protect,
  authorize("BUYER", "ADMIN"),
  getRefundByIdController
);

router.patch(
  "/refunds/:id/status",
  protect,
  authorize("ADMIN"),
  validate(updateRefundStatusValidation),
  updateRefundStatusController
);

export default router;
