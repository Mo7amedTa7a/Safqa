// Settlement Service
// - Belongs to: Member 5

import Settlement from "./settlement.model.js";
import Payment from "../payments/payment.model.js";
import Order from "../orders/order.model.js";

const COMMISSION_RATE = 0.03; // 3%

const createSettlement = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  const payment = await Payment.findOne({ order: orderId });
  if (!payment) {
    throw new Error("Payment record not found for this order");
  }

  const existingSettlement = await Settlement.findOne({ order: orderId });
  if (existingSettlement) {
    throw new Error("Settlement record already exists for this order");
  }

  const productAmount = payment.productAmount;
  const commissionAmount = productAmount * COMMISSION_RATE;
  const supplierAmount = productAmount - commissionAmount;

  const heldUntil = new Date();
  heldUntil.setHours(heldUntil.getHours() + 48); // 48-hour protection period

  const settlement = await Settlement.create({
    order: orderId,
    payment: payment._id,
    supplier: order.supplier,
    productAmount: productAmount,
    commissionAmount: commissionAmount,
    supplierAmount: supplierAmount,
    status: "HELD",
    heldUntil: heldUntil,
  });

  return settlement;
};

const getSettlements = async (user) => {
  let filter = {};

  if (user.role === "SUPPLIER") {
    filter.supplier = user._id || user.id;
  }

  const settlements = await Settlement.find(filter)
    .populate("order")
    .populate("payment")
    .populate("supplier");

  return settlements;
};

const getSettlementById = async (settlementId, user) => {
  const settlement = await Settlement.findById(settlementId)
    .populate("order")
    .populate("payment")
    .populate("supplier");

  if (!settlement) {
    throw new Error("Settlement not found");
  }

  if (user.role === "SUPPLIER" && settlement.supplier._id.toString() !== (user._id || user.id).toString()) {
    throw new Error("Not authorized to view this settlement");
  }

  return settlement;
};

const holdSettlement = async (settlementId) => {
  const settlement = await Settlement.findById(settlementId);

  if (!settlement) {
    throw new Error("Settlement not found");
  }

  settlement.status = "HELD";
  await settlement.save();

  return settlement;
};

const releaseSettlement = async (settlementId) => {
  const settlement = await Settlement.findById(settlementId);

  if (!settlement) {
    throw new Error("Settlement not found");
  }

  settlement.status = "RELEASED";
  settlement.releasedAt = new Date();
  await settlement.save();

  return settlement;
};

export {
  createSettlement,
  getSettlements,
  getSettlementById,
  holdSettlement,
  releaseSettlement,
};
