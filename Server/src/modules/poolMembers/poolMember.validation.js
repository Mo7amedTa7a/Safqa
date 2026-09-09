// PoolMember Validation (express-validator)
// - Belongs to: Member 3
// - validateJoinPool: poolId, buyingRequestId, quantity >= 1



const joi = require("joi");

const PoolMemberValidation = joi.object({
  poolId: joi.required(),

  buyingRequestId: joi.required(),

  quantity: joi.number().min(1).required()
});

module.exports = PoolMemberValidation;
