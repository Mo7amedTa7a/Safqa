// SupplierOffer Validation (express-validator)
// - Belongs to: Member 3
// - validateCreateOffer: pool required, moq >= 1, pricingTiers array, deliveryDays >= 1

const joi = require("joi");

const pricingTiervalidation = joi.object({
    minQty: joi.number().min(1).required(),
    unitPrice: joi.number().min(0).required()
});

const SupplierOffevalidation = joi.object({
    pool: joi.required(),

    moq: joi.number().min(1).required(),

    pricingTiers: joi.array().items(pricingTiervalidation).required(),

    deliveryDays: joi.number().min(1).required()
});

module.exports = {pricingTiervalidation,SupplierOffevalidation};