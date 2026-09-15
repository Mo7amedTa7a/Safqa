// Shipment Validation
// - Belongs to: Member 5

import Joi from "joi";

const createShipmentValidation = Joi.object({
  shipmentType: Joi.string().valid("OUTBOUND", "RETURN").required(),
  trackingNumber: Joi.string().required(),
  pickupAddress: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
  }),
  deliveryAddress: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
  }),
  codAmount: Joi.number().min(0).default(0),
});

const updateShipmentStatusValidation = Joi.object({
  status: Joi.string()
    .valid(
      "PENDING",
      "READY_FOR_PICKUP",
      "PICKED_UP",
      "IN_TRANSIT",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "DELIVERY_FAILED",
      "RETURN_TO_SUPPLIER",
      "RETURNED"
    )
    .required(),
});

const assignShipmentValidation = Joi.object({
  shippingPartnerId: Joi.string().required(),
});

export {
  createShipmentValidation,
  updateShipmentStatusValidation,
  assignShipmentValidation,
};
