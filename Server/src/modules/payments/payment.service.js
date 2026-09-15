// Payment Service
// - Belongs to: Member 5

import Payment from "./payment.model.js";
import Order from "../orders/order.model.js";

const createCodPayment = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  const existingPayment = await Payment.findOne({ order: orderId });
  if (existingPayment) {
    throw new Error("Payment record already exists for this order");
  }

  const productAmount = order.totalAmount - (order.deliveryFee || 0); // Assuming totalAmount in Order included deliveryFee
  const expectedAmount = order.totalAmount;

  const payment = await Payment.create({
    order: orderId,
    buyer: order.buyer,
    productAmount: productAmount,
    deliveryFee: order.deliveryFee || 0,
    expectedAmount: expectedAmount,
    collectedAmount: 0,
    method: "COD",
    status: "COD", // Or PENDING
  });

  return payment;
};

const getPaymentById = async (paymentId) => {
  const payment = await Payment.findById(paymentId)
    .populate("order")
    .populate("buyer")
    .populate("collectedBy");

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

const collectPayment = async (paymentId, collectedAmount, userId) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (collectedAmount > payment.expectedAmount) {
    throw new Error("Collected amount cannot exceed expected amount");
  }

  payment.collectedAmount = collectedAmount;
  payment.status = "COLLECTED";
  payment.collectedAt = new Date();
  payment.collectedBy = userId;

  await payment.save();

  return payment;
};

const failPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  payment.status = "FAILED";
  await payment.save();

  return payment;
};

export {
  createCodPayment,
  getPaymentById,
  collectPayment,
  failPayment,
};
