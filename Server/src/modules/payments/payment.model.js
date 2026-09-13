// Payment Model
// - Belongs to: Member 5
// - Fields: order (ref), buyer (ref), productAmount, deliveryFee, expectedAmount, collectedAmount, method, status, collectedAt, collectedBy
// - Status: PENDING | COD | COLLECTED | FAILED | REFUNDED

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // MVP: one payment record per order
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    expectedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    collectedAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    method: {
      type: String,
      enum: ["COD"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COD", "COLLECTED", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    collectedAt: {
      type: Date,
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

paymentSchema.index({ status: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
