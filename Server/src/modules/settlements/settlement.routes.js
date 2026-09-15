// Settlement Routes
// - Belongs to: Member 5

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import {
  createSettlementController,
  getSettlementsController,
  getSettlementByIdController,
  holdSettlementController,
  releaseSettlementController,
} from "./settlement.controller.js";

const router = express.Router();

router.get(
  "/settlements",
  protect,
  authorize("SUPPLIER", "ADMIN"),
  getSettlementsController
);

router.get(
  "/settlements/:id",
  protect,
  authorize("SUPPLIER", "ADMIN"),
  getSettlementByIdController
);

router.post(
  "/orders/:orderId/settlement",
  protect,
  authorize("SYSTEM", "ADMIN"),
  createSettlementController
);

router.patch(
  "/settlements/:id/hold",
  protect,
  authorize("SYSTEM", "ADMIN"),
  holdSettlementController
);

router.patch(
  "/settlements/:id/release",
  protect,
  authorize("SYSTEM", "ADMIN"),
  releaseSettlementController
);

export default router;
