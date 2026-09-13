// BuyingRequest Validation
// - Belongs to: Member 2
// - create: product, variant, quantity, location, purchaseType
// - update: quantity and location only while request is OPEN
// - cancel: request id

import Joi from "joi";


const validateCreateBuyingRequest = Joi.object({
    product: Joi.string()
        .required(),

    variant: Joi.string()
        .required(),

    quantity: Joi.number()
        .integer()
        .min(1)
        .required(),

    location: Joi.string()
        .trim()
        .required(),

    purchaseType: Joi.string()
        .valid("DIRECT", "GROUP")
        .default("GROUP")
        .required()
});



const validateUpdateBuyingRequest = Joi.object({
    quantity: Joi.number()
        .integer()
        .min(1),

    location: Joi.string()
        .trim()
});



const validateBuyingRequestId = Joi.object({
    id: Joi.string()
        .required()
});


export {
    validateCreateBuyingRequest,
    validateUpdateBuyingRequest,
    validateBuyingRequestId
};