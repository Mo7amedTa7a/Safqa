// BuyingPool Validation (express-validator)
// - Belongs to: Member 3
// - validateClosePool: poolId must be valid MongoDB ObjectId
import Joi from "joi";

const createBuyingPoolValidation = Joi.object({
  buyingRequestId: Joi.string().required()
});

export { createBuyingPoolValidation };