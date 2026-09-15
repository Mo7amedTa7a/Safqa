// Payment Routes
// - Belongs to: Member 5

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { collectPaymentValidation } from "./payment.validation.js";
import {
  createCodPaymentController,
  getPaymentByIdController,
  collectPaymentController,
  failPaymentController,
} from "./payment.controller.js";

const router = express.Router();

router.post(
  "/orders/:orderId/payments/cod",
  protect,
  authorize("SYSTEM", "ADMIN", "SHIPPING_PARTNER"),
  createCodPaymentController
);

router.get(
  "/payments/:id",
  protect,
  getPaymentByIdController
);

router.patch(
  "/payments/:id/collect",
  protect,
  authorize("SHIPPING_PARTNER", "ADMIN"),
  validate(collectPaymentValidation),
  collectPaymentController
);

router.patch(
  "/payments/:id/failed",
  protect,
  authorize("SHIPPING_PARTNER", "ADMIN"),
  failPaymentController
);

export default router;
