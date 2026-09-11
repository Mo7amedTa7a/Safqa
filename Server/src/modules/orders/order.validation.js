// Order Validation (express-validator)
// - Belongs to: Member 4
// - validateUpdateStatus: status must be one of valid enum values


const Joi = require('joi');

const updateOrderStatusValidation = Joi.object({
  status: Joi.string()
    .valid(
        'PENDING',
        'CONFIRMED',
        'SHIPPED',
        'DELIVERED',
        'RETURNED',
        'CANCELLED'
    )
    .required(),
});

module.exports = {
  updateOrderStatusValidation,
};