// User Validation
// - Belongs to: Member 1
// - validateUpdateMe: optional name, optional phone, optional address

import Joi from 'joi';

export const updateProfileSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50),
    phone: Joi.string().trim(),
    address: Joi.string().trim().allow('', null),
    profileImage: Joi.string().trim().allow('', null),
    removeProfileImage: Joi.any().optional()
}).unknown(true);
