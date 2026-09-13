// Refund Service
// - Belongs to: Member 5

import Refund from "./refund.model.js";
import ReturnModel from "../returns/return.model.js";
import Order from "../orders/order.model.js";

const createRefund = async (returnId) => {
  const returnRecord = await ReturnModel.findById(returnId);

  if (!returnRecord) {
    throw new Error("Return record not found");
  }

  const order = await Order.findById(returnRecord.order);
  if (!order) {
    throw new Error("Order not found");
  }

  const existingRefund = await Refund.findOne({ returnRecord: returnId });
  if (existingRefund) {
    throw new Error("Refund already created for this return");
  }

  // Assuming full product amount is refunded. Delivery fee might not be refunded depending on policy.
  const refundAmount = order.totalAmount - (order.deliveryFee || 0);

  const refund = await Refund.create({
    order: order._id,
    returnRecord: returnId,
    amount: refundAmount,
    status: "REQUESTED",
  });

  return refund;
};

const getRefunds = async (user) => {
  const refunds = await Refund.find()
    .populate("order")
    .populate("returnRecord");
  return refunds;
};

const getRefundById = async (refundId) => {
  const refund = await Refund.findById(refundId)
    .populate("order")
    .populate("returnRecord");

  if (!refund) {
    throw new Error("Refund not found");
  }
  return refund;
};

const updateRefundStatus = async (refundId, status) => {
  const refund = await Refund.findById(refundId);

  if (!refund) {
    throw new Error("Refund not found");
  }

  refund.status = status;
  if (status === "REFUNDED" || status === "FAILED") {
    refund.processedAt = new Date();
  }

  await refund.save();
  return refund;
};

export {
  createRefund,
  getRefunds,
  getRefundById,
  updateRefundStatus,
};
