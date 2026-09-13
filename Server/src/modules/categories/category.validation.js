import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(1000).allow(""),
  image: Joi.string().allow(""),
  isActive: Joi.boolean()
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().max(1000).allow(""),
  image: Joi.string().allow(""),
  isActive: Joi.boolean()
}).min(1);

export const validateCategoryId = Joi.object({
  id: Joi.string().hex().length(24).required()
});
