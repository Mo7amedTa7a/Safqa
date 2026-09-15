// Review Validation
// - Belongs to: Member 5

import Joi from "joi";

const createReviewValidation = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow(""),
});

export { createReviewValidation };
