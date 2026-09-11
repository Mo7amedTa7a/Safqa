// SupplierOffer Validation (express-validator)
// - Belongs to: Member 3
// - validateCreateOffer: pool required, moq >= 1, pricingTiers array, deliveryDays >= 1

const Joi = require("joi");

const createOfferValidation = Joi.object({

  moq: Joi.number()
    .integer()
    .min(1)
    .required(),

  pricingTiers: Joi.array()
    .items(
      Joi.object({
        minQty: Joi.number()
          .integer()
          .min(1)
          .required(),

        unitPrice: Joi.number()
          .min(0)
          .required()
      })
    )
    .min(1)
    .required(),

  deliveryDays: Joi.number()
    .integer()
    .min(1)
    .required(),

  warranty: Joi.string()
    .required(),

  terms: Joi.string()
    .required()

});



module.exports = {createOfferValidation};