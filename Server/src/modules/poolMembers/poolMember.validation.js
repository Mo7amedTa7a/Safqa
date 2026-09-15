// PoolMember Validation (express-validator)
// - Belongs to: Member 3
// - validateJoinPool: poolId, buyingRequestId, quantity >= 1



import Joi from "joi";

const updateQuantityValidation = Joi.object({
  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
});

export { updateQuantityValidation };