// Return Validation
// - Belongs to: Member 5

import Joi from "joi";

const updateReturnStatusValidation = Joi.object({
  status: Joi.string()
    .valid("APPROVED", "IN_PROGRESS", "RETURNED", "COMPLETED")
    .required(),
});

export { updateReturnStatusValidation };
