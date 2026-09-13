// Return Routes
// - Belongs to: Member 5

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { updateReturnStatusValidation } from "./return.validation.js";
import {
  createReturnController,
  getReturnsController,
  getReturnByIdController,
  updateReturnStatusController,
} from "./return.controller.js";

const router = express.Router();

// Note: creation happens from dispute endpoint as per PDF POST /api/disputes/:disputeId/return
router.post(
  "/disputes/:disputeId/return",
  protect,
  restrictTo("ADMIN"),
  createReturnController
);

router.get(
  "/returns",
  protect,
  restrictTo("BUYER", "ADMIN", "SHIPPING_PARTNER"),
  getReturnsController
);

router.get(
  "/returns/:id",
  protect,
  restrictTo("BUYER", "ADMIN", "SHIPPING_PARTNER"),
  getReturnByIdController
);

router.patch(
  "/returns/:id/status",
  protect,
  restrictTo("SHIPPING_PARTNER", "ADMIN"),
  validate(updateReturnStatusValidation),
  updateReturnStatusController
);

export default router;
