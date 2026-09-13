// Settlement Routes
// - Belongs to: Member 5

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";
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
  restrictTo("SUPPLIER", "ADMIN"),
  getSettlementsController
);

router.get(
  "/settlements/:id",
  protect,
  restrictTo("SUPPLIER", "ADMIN"),
  getSettlementByIdController
);

router.post(
  "/orders/:orderId/settlement",
  protect,
  restrictTo("SYSTEM", "ADMIN"),
  createSettlementController
);

router.patch(
  "/settlements/:id/hold",
  protect,
  restrictTo("SYSTEM", "ADMIN"),
  holdSettlementController
);

router.patch(
  "/settlements/:id/release",
  protect,
  restrictTo("SYSTEM", "ADMIN"),
  releaseSettlementController
);

export default router;
