// Review Controller
// - Belongs to: Member 5

import {
  createReview,
  getReviewsByUser,
} from "./review.service.js";

const createReviewController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const reviewerId = req.user._id || req.user.id;
    const data = req.body;
    const review = await createReview(orderId, reviewerId, data);
    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

const getReviewsByUserController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const reviews = await getReviewsByUser(userId);
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createReviewController,
  getReviewsByUserController,
};
