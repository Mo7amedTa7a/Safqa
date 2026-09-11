import Joi from "joi";

export const createSupplierProfileSchema = Joi.object({
    companyName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    companyDescription: Joi.string()
        .trim()
        .min(10)
        .max(500)
        .required(),

    commercialRegistrationNumber: Joi.string()
        .trim()
        .required(),

    taxIdentificationNumber: Joi.string()
        .trim()
        .required(),

    businessAddress: Joi.string()
        .trim()
        .required(),

    businessPhone: Joi.string()
        .trim()
        .required(),

    website: Joi.string()
        .trim()
        .uri()
        .optional(),

    yearsInBusiness: Joi.number()
        .integer()
        .min(0)
        .optional()
});

export const rejectSupplierProfileSchema = Joi.object({
    rejectionReason: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .required()
        .messages({
            "string.empty": "Rejection reason is required",
            "any.required": "Rejection reason is required"
        })
});