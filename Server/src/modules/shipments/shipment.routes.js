// Shipment Routes
// - Belongs to: Member 5

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createShipmentValidation,
  updateShipmentStatusValidation,
  assignShipmentValidation,
} from "./shipment.validation.js";
import {
  createShipmentController,
  getShipmentsController,
  getShipmentByIdController,
  assignShippingPartnerController,
  updateShipmentStatusController,
  addPickupProofController,
} from "./shipment.controller.js";

const router = express.Router();

router.post(
  "/orders/:orderId/shipments",
  protect,
  authorize("ADMIN"),
  validate(createShipmentValidation),
  createShipmentController
);

router.get(
  "/shipments",
  protect,
  authorize("SHIPPING_PARTNER", "SUPPLIER", "ADMIN"),
  getShipmentsController
);

router.get(
  "/shipments/:id",
  protect,
  getShipmentByIdController
);

router.patch(
  "/shipments/:id/assign",
  protect,
  authorize("ADMIN"),
  validate(assignShipmentValidation),
  assignShippingPartnerController
);

router.patch(
  "/shipments/:id/status",
  protect,
  authorize("SHIPPING_PARTNER", "ADMIN"),
  validate(updateShipmentStatusValidation),
  updateShipmentStatusController
);

router.post(
  "/shipments/:id/pickup-proof",
  protect,
  authorize("SHIPPING_PARTNER"),
  addPickupProofController
);

export default router;
