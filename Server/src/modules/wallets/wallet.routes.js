import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";

import {
  getMyWalletController,
  getMyTransactionsController,
  requestWithdrawalController,
  getAllWithdrawalRequestsController,
  processWithdrawalController,
} from "./wallet.controller.js";

const router = express.Router();

// All users can view their own wallet and transactions
router.get("/my-wallet", protect, getMyWalletController);
router.get("/my-transactions", protect, getMyTransactionsController);

// Suppliers and Shipping Partners can request withdrawals
router.post(
  "/withdraw",
  protect,
  authorize("SUPPLIER", "SHIPPING_PARTNER"),
  requestWithdrawalController
);

// Admins manage withdrawals
router.get(
  "/withdrawals",
  protect,
  authorize("ADMIN"),
  getAllWithdrawalRequestsController
);

router.patch(
  "/withdrawals/:id/process",
  protect,
  authorize("ADMIN"),
  processWithdrawalController
);

export default router;
