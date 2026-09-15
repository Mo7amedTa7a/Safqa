import Joi from 'joi';


// ==========================================
// CREATE ORDER VALIDATION
// ==========================================

const createOrderValidation = Joi.object({
  shippingAddress: Joi.object({
    street: Joi.string().required(),

    city: Joi.string().required(),

    country: Joi.string().required(),
  }).required(),

  phone: Joi.string()
    .pattern(/^[0-9+\-\s]{8,20}$/)
    .required(),
});


// ==========================================
// UPDATE ORDER STATUS VALIDATION
// ==========================================

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


export {
  createOrderValidation,
  updateOrderStatusValidation,
};