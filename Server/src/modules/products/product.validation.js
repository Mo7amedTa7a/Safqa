// Product Validation
// - Belongs to: Member 2
// - validateCreateProduct: name, category, variants required
// - validateUpdateProduct: all fields optional

import Joi from "joi";

const variantSchema = Joi.object({
    _id: Joi.string().hex().length(24).optional(),
    sku: Joi.string().trim().min(2).max(80).required(),
    attributes: Joi.object().pattern(
        Joi.string().min(1),
        Joi.string().trim().max(100)
    ).default({}),
    price: Joi.number().min(0).required(),
    stock: Joi.number().integer().min(0).default(0),
});

const validateCreateProduct = Joi.object({
    name: Joi.string().trim().min(2).max(150).required(),
    description: Joi.string().trim().max(2000).allow("").optional(),
    category: Joi.string().trim().min(2).max(100).required(),
    images: Joi.array().items(Joi.string().trim().uri()).default([]),
    variants: Joi.array().items(variantSchema).min(1).required(),
});

const validateUpdateProduct = Joi.object({
    name: Joi.string().trim().min(2).max(150).optional(),
    description: Joi.string().trim().max(2000).allow("").optional(),
    category: Joi.string().trim().min(2).max(100).optional(),
    images: Joi.array().items(Joi.string().trim().uri()).optional(),
    variants: Joi.array().items(variantSchema).min(1).optional(),
    status: Joi.string().valid("ACTIVE", "INACTIVE").optional(),
}).min(1);

const validateProductId = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

const validateProductQuery = Joi.object({
    name: Joi.string().trim().max(150).optional(),
    category: Joi.string().trim().max(100).optional(),
    status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
});

export {
    validateCreateProduct,
    validateUpdateProduct,
    validateProductId,
    validateProductQuery,
};
