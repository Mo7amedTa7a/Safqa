// Refund Validation
// - Belongs to: Member 5

import Joi from "joi";

const updateRefundStatusValidation = Joi.object({
  status: Joi.string()
    .valid("PROCESSING", "REFUNDED", "FAILED")
    .required(),
});

export { updateRefundStatusValidation };
