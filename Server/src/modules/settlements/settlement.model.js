// Settlement Model
// - Belongs to: Member 5
// - Fields: order (ref), payment (ref), supplier (ref), productAmount, commissionAmount, supplierAmount, status, heldUntil, releasedAt
// - Status: PENDING | HELD | RELEASED | CANCELLED

import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // MVP: one settlement per order
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    commissionAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    supplierAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "HELD", "RELEASED", "CANCELLED"],
      default: "PENDING",
    },
    heldUntil: {
      type: Date,
    },
    releasedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

settlementSchema.index({ order: 1 });
settlementSchema.index({ supplier: 1, status: 1 });
settlementSchema.index({ payment: 1 });

const Settlement = mongoose.model("Settlement", settlementSchema);

export default Settlement;
