// Refund Model
// - Belongs to: Member 5
// - Fields: order (ref), return (ref), amount, method, processedAt, status
// - Status: REQUESTED | PROCESSING | REFUNDED | FAILED

import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    returnRecord: { // 'return' is a reserved keyword in JS, using returnRecord
      type: mongoose.Schema.Types.ObjectId,
      ref: "Return",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      default: "MANUAL", // No online payment gateway in MVP
    },
    status: {
      type: String,
      enum: ["REQUESTED", "PROCESSING", "REFUNDED", "FAILED"],
      default: "REQUESTED",
    },
    processedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

refundSchema.index({ order: 1 });
refundSchema.index({ status: 1 });

const Refund = mongoose.model("Refund", refundSchema);

export default Refund;
