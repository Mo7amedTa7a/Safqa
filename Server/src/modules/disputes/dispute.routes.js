// Dispute Routes
// - Belongs to: Member 5

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createDisputeValidation,
  reviewDisputeValidation,
  resolveDisputeValidation,
} from "./dispute.validation.js";
import {
  createDisputeController,
  getDisputesController,
  getDisputeByIdController,
  reviewDisputeController,
  resolveDisputeController,
} from "./dispute.controller.js";

const router = express.Router();

router.post(
  "/orders/:orderId",
  protect,
  authorize("BUYER"),
  validate(createDisputeValidation),
  createDisputeController
);

router.get(
  "/",
  protect,
  authorize("BUYER", "ADMIN"),
  getDisputesController
);

router.get(
  "/:id",
  protect,
  authorize("BUYER", "ADMIN"),
  getDisputeByIdController
);

router.patch(
  "/:id/review",
  protect,
  authorize("ADMIN"),
  validate(reviewDisputeValidation),
  reviewDisputeController
);

router.patch(
  "/:id/resolve",
  protect,
  authorize("ADMIN"),
  validate(resolveDisputeValidation),
  resolveDisputeController
);

export default router;
