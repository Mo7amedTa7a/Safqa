// BuyingPool Validation (express-validator)
// - Belongs to: Member 3
// - validateClosePool: poolId must be valid MongoDB ObjectId
const Joi = require("joi");

const createBuyingPoolValidation = Joi.object({
  buyingRequestId: Joi.string().required()
});
module.exports = {createBuyingPoolValidation};