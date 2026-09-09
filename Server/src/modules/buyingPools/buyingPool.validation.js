// BuyingPool Validation (express-validator)
// - Belongs to: Member 3
// - validateClosePool: poolId must be valid MongoDB ObjectId
const joi =require("joi")

const BuyingPoolvalidation=joi.object({
    product:joi.required(),
    variant:joi.required(),
    totalQuantity:joi.number().required().default(0).min(1),
    buyerCount:joi.number().required().default(0).min(0),
    status:joi.string().default("OPEN"),
    closesAt:joi.required()

})


module.exports=BuyingPoolvalidation