// Review Model
// - Belongs to: Member 5
// - Fields: order (ref), reviewer (ref), reviewedUser (ref), rating, comment

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ reviewedUser: 1 });
reviewSchema.index({ order: 1 });
// Ensure a user can only review an order once
reviewSchema.index({ order: 1, reviewer: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
