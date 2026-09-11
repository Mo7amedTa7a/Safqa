// Auth Validation (express-validator)
// - Belongs to: Member 1
// - validateRegister: name required, email valid, password min 8 chars, role valid
// - validateLogin: email valid, password required

import joi from 'joi'

export const registerSchema = joi.object({
    name: joi.string().trim().required()
        .messages({
            "string.empty": "Name is required",
            "any.required": "Name is required"
        }),
    email: joi.string().email().trim().required(),

    password: joi.string().min(8).required(),

    role: joi.string().valid("BUYER", "SUPPLIER")
        .default("BUYER"),

    phone: joi.string()
        .trim()
        .required(),

    address: joi.string()
        .trim()
        .optional(),

    profileImage: joi.string()
        .trim()
        .optional()
})


export const loginSchema = joi.object({
    email: joi.string()
        .trim()
        .email()
        .required(),

    password: joi.string()
        .required()
})