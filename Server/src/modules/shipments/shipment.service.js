// Shipment Service
// - Belongs to: Member 5

import Shipment from "./shipment.model.js";
import Order from "../orders/order.model.js";
import crypto from "crypto";

const generateTrackingNumber = () => {
  return "SFQ-" + crypto.randomBytes(6).toString("hex").toUpperCase();
};

const createShipment = async (orderId, data) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  const trackingNumber = data.trackingNumber || generateTrackingNumber();

  const shipment = await Shipment.create({
    order: orderId,
    shipmentType: data.shipmentType || "OUTBOUND",
    trackingNumber: trackingNumber,
    pickupAddress: data.pickupAddress || {},
    deliveryAddress: data.deliveryAddress || order.shippingAddress,
    codAmount: data.codAmount || order.totalAmount,
    status: "PENDING",
  });

  return shipment;
};

const getShipments = async (user) => {
  let filter = {};

  if (user.role === "SHIPPING_PARTNER") {
    filter.shippingPartner = user._id || user.id;
  }

  const shipments = await Shipment.find(filter)
    .populate("order")
    .populate("shippingPartner");

  return shipments;
};

const getShipmentById = async (shipmentId) => {
  const shipment = await Shipment.findById(shipmentId)
    .populate("order")
    .populate("shippingPartner");

  if (!shipment) {
    throw new Error("Shipment not found");
  }

  return shipment;
};

const assignShippingPartner = async (shipmentId, shippingPartnerId) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new Error("Shipment not found");
  }

  shipment.shippingPartner = shippingPartnerId;
  await shipment.save();

  return shipment;
};

const updateShipmentStatus = async (shipmentId, status) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new Error("Shipment not found");
  }

  shipment.status = status;
  await shipment.save();

  return shipment;
};

const addPickupProof = async (shipmentId, proofData) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new Error("Shipment not found");
  }

  shipment.pickupProof = {
    type: proofData.type || "QR",
    value: proofData.value,
    time: new Date(),
  };

  shipment.status = "PICKED_UP";
  await shipment.save();

  return shipment;
};

export {
  createShipment,
  getShipments,
  getShipmentById,
  assignShippingPartner,
  updateShipmentStatus,
  addPickupProof,
};
