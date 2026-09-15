// Dispute Service
// - Belongs to: Member 5

import Dispute from "./dispute.model.js";
import Order from "../orders/order.model.js";
import Settlement from "../settlements/settlement.model.js";

const createDispute = async (orderId, buyerId, data) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.buyer.toString() !== buyerId.toString()) {
    throw new Error("Not authorized to open a dispute for this order");
  }

  const existingDispute = await Dispute.findOne({ order: orderId, status: { $ne: "RESOLVED" } });
  if (existingDispute) {
    throw new Error("An active dispute already exists for this order");
  }

  const dispute = await Dispute.create({
    order: orderId,
    buyer: buyerId,
    reason: data.reason,
    description: data.description,
    evidence: data.evidence || [],
    status: "OPEN",
  });

  // Automatically hold the settlement if a dispute is opened
  const settlement = await Settlement.findOne({ order: orderId });
  if (settlement && settlement.status !== "RELEASED") {
    settlement.status = "HELD";
    await settlement.save();
  }

  return dispute;
};

const getDisputes = async (user) => {
  let filter = {};

  if (user.role === "BUYER") {
    filter.buyer = user._id || user.id;
  }

  const disputes = await Dispute.find(filter)
    .populate("order")
    .populate("buyer");

  return disputes;
};

const getDisputeById = async (disputeId, user) => {
  const dispute = await Dispute.findById(disputeId)
    .populate("order")
    .populate("buyer");

  if (!dispute) {
    throw new Error("Dispute not found");
  }

  if (user.role === "BUYER" && dispute.buyer._id.toString() !== (user._id || user.id).toString()) {
    throw new Error("Not authorized to view this dispute");
  }

  return dispute;
};

const reviewDispute = async (disputeId, adminNote) => {
  const dispute = await Dispute.findById(disputeId);

  if (!dispute) {
    throw new Error("Dispute not found");
  }

  dispute.status = "UNDER_REVIEW";
  if (adminNote) {
    dispute.adminNote = adminNote;
  }
  await dispute.save();

  return dispute;
};

const resolveDispute = async (disputeId, status, adminNote) => {
  const dispute = await Dispute.findById(disputeId);

  if (!dispute) {
    throw new Error("Dispute not found");
  }

  dispute.status = status;
  if (adminNote) {
    dispute.adminNote = adminNote;
  }
  await dispute.save();

  // If dispute is rejected, and it was the only thing holding settlement, we could theoretically release it.
  // But let's keep it simple for MVP.

  return dispute;
};

export {
  createDispute,
  getDisputes,
  getDisputeById,
  reviewDispute,
  resolveDispute,
};
