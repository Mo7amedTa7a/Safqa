// Dispute Model
// - Belongs to: Member 5
// - Fields: order (ref), buyer (ref), reason, description, evidence, status, adminNote
// - Reason: DAMAGED | WRONG_PRODUCT | MISSING_ITEM | NOT_AS_DESCRIBED | OTHER
// - Status: OPEN | UNDER_REVIEW | APPROVED | REJECTED | RESOLVED

import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: ["DAMAGED", "WRONG_PRODUCT", "MISSING_ITEM", "NOT_AS_DESCRIBED", "OTHER"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    evidence: [
      {
        type: String, // URLs to images/videos
      },
    ],
    status: {
      type: String,
      enum: ["OPEN", "UNDER_REVIEW", "APPROVED", "REJECTED", "RESOLVED"],
      default: "OPEN",
    },
    adminNote: {
      type: String,
    },
  },
  { timestamps: true }
);

disputeSchema.index({ order: 1, status: 1 });

const Dispute = mongoose.model("Dispute", disputeSchema);

export default Dispute;
