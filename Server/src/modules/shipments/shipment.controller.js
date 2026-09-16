// Shipment Controller
// - Belongs to: Member 5

import {
  createShipment,
  getShipments,
  getShipmentById,
  getShipmentByOrderId,
  assignShippingPartner,
  updateShipmentStatus,
  addPickupProof,
} from "./shipment.service.js";

const createShipmentController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const data = req.body;
    const shipment = await createShipment(orderId, data, req.user);
    res.status(201).json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    next(err);
  }
};

const getShipmentsController = async (req, res, next) => {
  try {
    const shipments = await getShipments(req.user);
    res.status(200).json({
      success: true,
      data: shipments,
    });
  } catch (err) {
    next(err);
  }
};

const getShipmentByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shipment = await getShipmentById(id);
    res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    next(err);
  }
};

const assignShippingPartnerController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { shippingPartnerId } = req.body;
    const shipment = await assignShippingPartner(id, shippingPartnerId);
    res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    next(err);
  }
};

const updateShipmentStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const shipment = await updateShipmentStatus(id, status, req.user);
    res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    next(err);
  }
};

const addPickupProofController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const proofData = req.body;
    const shipment = await addPickupProof(id, proofData);
    res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    next(err);
  }
};

const getShipmentByOrderIdController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const shipment = await getShipmentByOrderId(orderId);
    res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createShipmentController,
  getShipmentsController,
  getShipmentByIdController,
  getShipmentByOrderIdController,
  assignShippingPartnerController,
  updateShipmentStatusController,
  addPickupProofController,
};
