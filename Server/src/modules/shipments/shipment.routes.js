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
  getShipmentByOrderIdController,
  assignShippingPartnerController,
  updateShipmentStatusController,
  addPickupProofController,
} from "./shipment.controller.js";

const router = express.Router();

router.post(
  "/orders/:orderId",
  protect,
  authorize("SUPPLIER", "ADMIN"),
  validate(createShipmentValidation),
  createShipmentController
);

router.get(
  "/",
  protect,
  authorize("SHIPPING_PARTNER", "SUPPLIER", "ADMIN"),
  getShipmentsController
);

router.get(
  "/:id",
  protect,
  getShipmentByIdController
);

router.get(
  "/order/:orderId",
  protect,
  getShipmentByOrderIdController
);

router.patch(
  "/:id/assign",
  protect,
  authorize("ADMIN"),
  validate(assignShipmentValidation),
  assignShippingPartnerController
);

router.patch(
  "/:id/status",
  protect,
  authorize("SHIPPING_PARTNER", "ADMIN"),
  validate(updateShipmentStatusValidation),
  updateShipmentStatusController
);

router.post(
  "/:id/pickup-proof",
  protect,
  authorize("SHIPPING_PARTNER"),
  addPickupProofController
);

export default router;
