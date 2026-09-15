// Return Model
// - Belongs to: Member 5
// - Fields: order (ref), dispute (ref), returnShipment (ref), reason, status
// - Status: REQUESTED | APPROVED | IN_PROGRESS | RETURNED | COMPLETED

import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    dispute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dispute",
      required: true,
    },
    returnShipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["REQUESTED", "APPROVED", "IN_PROGRESS", "RETURNED", "COMPLETED"],
      default: "REQUESTED",
    },
  },
  { timestamps: true }
);

returnSchema.index({ order: 1 });
returnSchema.index({ status: 1 });

const ReturnModel = mongoose.model("Return", returnSchema);

export default ReturnModel;
