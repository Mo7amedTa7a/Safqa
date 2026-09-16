// BuyingRequest Validation
import Joi from "joi";

const validateCreateBuyingRequest = Joi.object({
    purchaseType: Joi.string()
        .valid("DIRECT", "GROUP")
        .default("GROUP")
        .required(),

    productName: Joi.string()
        .trim()
        .min(2)
        .required(),

    category: Joi.string()
        .trim()
        .required(),

    specifications: Joi.string()
        .trim()
        .min(5)
        .required(),

    quantity: Joi.number()
        .integer()
        .min(1)
        .required(),

    location: Joi.string()
        .trim()
        .optional()
        .allow("")
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