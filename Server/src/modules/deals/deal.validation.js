import Joi from 'joi';

const selectOfferParamsValidation = Joi.object({
  poolId: Joi.string().required(),
});

const updateDealStatusValidation = Joi.object({
  status: Joi.string()
    .valid('ACTIVE', 'COMPLETED', 'CANCELLED')
    .required(),
});

export {
  selectOfferParamsValidation,
  updateDealStatusValidation,
};