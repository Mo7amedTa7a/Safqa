// User Validation (express-validator)
// - Belongs to: Member 1
// - validateUpdateMe: optional name, optional phone, optional address

import joi from 'joi'

export const updateProfileSchema = joi.object({
    name: joi.string().trim().min(2).max(50),
    phone: joi.string().trim(),
    address: joi.string().trim(),
    profileImage: joi.string().trim()
})