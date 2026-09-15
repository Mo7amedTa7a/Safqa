// Dispute Validation
// - Belongs to: Member 5

import Joi from "joi";

const createDisputeValidation = Joi.object({
  reason: Joi.string()
    .valid("DAMAGED", "WRONG_PRODUCT", "MISSING_ITEM", "NOT_AS_DESCRIBED", "OTHER")
    .required(),
  description: Joi.string().required(),
  evidence: Joi.array().items(Joi.string()),
});

const reviewDisputeValidation = Joi.object({
  adminNote: Joi.string().required(),
});

const resolveDisputeValidation = Joi.object({
  status: Joi.string().valid("APPROVED", "REJECTED", "RESOLVED").required(),
  adminNote: Joi.string(),
});

export {
  createDisputeValidation,
  reviewDisputeValidation,
  resolveDisputeValidation,
};
