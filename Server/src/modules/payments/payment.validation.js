// Payment Validation
// - Belongs to: Member 5

import Joi from "joi";

const collectPaymentValidation = Joi.object({
  collectedAmount: Joi.number().min(0).required(),
});

export { collectPaymentValidation };
