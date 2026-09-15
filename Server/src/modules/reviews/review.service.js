// Review Service
// - Belongs to: Member 5

import Review from "./review.model.js";
import Order from "../orders/order.model.js";
import User from "../users/user.model.js"; // Assuming this exists to update reputation

const createReview = async (orderId, reviewerId, data) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "DELIVERED" && order.status !== "COMPLETED") {
    throw new Error("Can only review completed or delivered orders");
  }

  const isBuyer = order.buyer.toString() === reviewerId.toString();
  const isSupplier = order.supplier.toString() === reviewerId.toString();

  if (!isBuyer && !isSupplier) {
    throw new Error("Not authorized to review this order");
  }

  const reviewedUserId = isBuyer ? order.supplier : order.buyer;

  const review = await Review.create({
    order: orderId,
    reviewer: reviewerId,
    reviewedUser: reviewedUserId,
    rating: data.rating,
    comment: data.comment,
  });

  // Calculate new average rating for the user
  const reviews = await Review.find({ reviewedUser: reviewedUserId });
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  await User.findByIdAndUpdate(reviewedUserId, { rating: avgRating });

  return review;
};

const getReviewsByUser = async (userId) => {
  const reviews = await Review.find({ reviewedUser: userId })
    .populate("reviewer", "name email") // Adjust fields as per User model
    .populate("order");
  return reviews;
};

export {
  createReview,
  getReviewsByUser,
};
