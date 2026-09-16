// Shipment Service
// - Belongs to: Member 5

import Shipment from "./shipment.model.js";
import Order from "../orders/order.model.js";
import Transaction from "../wallets/transaction.model.js";
import { getWallet } from "../wallets/wallet.service.js";
import crypto from "crypto";

const generateTrackingNumber = () => {
  return "SFQ-" + crypto.randomBytes(6).toString("hex").toUpperCase();
};

const createShipment = async (orderId, data, user) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // If supplier, verify ownership
  if (user && user.role === 'SUPPLIER') {
    if (order.supplier.toString() !== user.id.toString()) {
      throw new Error("Not authorized to create shipment for this order");
    }
  }

  // Check if shipment already exists for this order
  const existingShipment = await Shipment.findOne({ order: orderId });
  if (existingShipment) {
    throw new Error("Shipment already exists for this order");
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

  // Update order status to READY_FOR_PICKUP
  if (order.status === 'CONFIRMED') {
    order.status = 'READY_FOR_PICKUP';
    await order.save();
  }

  return shipment;
};

const getShipments = async (user) => {
  let filter = {};

  if (user.role === "SHIPPING_PARTNER") {
    filter.$or = [
      { shippingPartner: user._id || user.id },
      { shippingPartner: { $exists: false } },
      { shippingPartner: null }
    ];
  }

  if (user.role === "SUPPLIER") {
    // Find all orders belonging to this supplier
    const supplierOrders = await Order.find({ supplier: user._id || user.id }).select('_id');
    const orderIds = supplierOrders.map(o => o._id);
    filter.order = { $in: orderIds };
  }

  const shipments = await Shipment.find(filter)
    .populate({
      path: "order",
      populate: [
        { path: "buyer", select: "name email phone" },
        { path: "supplier", select: "name email phone" }
      ]
    })
    .populate("shippingPartner")
    .sort({ createdAt: -1 });

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

const updateShipmentStatus = async (shipmentId, status, user) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new Error("Shipment not found");
  }

  // Assign to this shipping partner if unassigned
  if (user && user.role === 'SHIPPING_PARTNER' && !shipment.shippingPartner) {
    shipment.shippingPartner = user._id || user.id;
  }

  const oldStatus = shipment.status;

  // Sync order status based on shipment status
  const order = await Order.findById(shipment.order);
  if (order) {
    if (status === 'PICKED_UP' || status === 'IN_TRANSIT') {
      if (order.status !== 'SHIPPED') {
        order.status = 'SHIPPED';
        await order.save();
      }
    } else if (status === 'DELIVERED') {
      order.status = 'DELIVERED';
      await order.save();

      // Ensure we only process payments once if status was already DELIVERED
      if (oldStatus !== 'DELIVERED') {
        try {
          // Shipping Partner gets COD collected
          const spWallet = await getWallet(shipment.shippingPartner);
          spWallet.balance += shipment.codAmount;
          await spWallet.save();
          
          await Transaction.create({
            wallet: spWallet._id,
            amount: shipment.codAmount,
            type: "CREDIT",
            description: "COD Collected",
            referenceOrder: order._id
          });

          // Supplier gets product price - commission (3%)
          const commission = order.totalAmount * 0.03;
          const supplierShare = order.totalAmount - commission;
          const supplierWallet = await getWallet(order.supplier);
          supplierWallet.balance += supplierShare;
          await supplierWallet.save();

          await Transaction.create({
            wallet: supplierWallet._id,
            amount: supplierShare,
            type: "CREDIT",
            description: "Order Revenue",
            referenceOrder: order._id
          });
        } catch (error) {
          console.error("Wallet update failed:", error);
        }
      }
    }
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

const getShipmentByOrderId = async (orderId) => {
  const shipment = await Shipment.findOne({ order: orderId })
    .populate({
      path: "order",
      populate: [
        { path: "buyer", select: "name email phone" },
        { path: "supplier", select: "name email phone" }
      ]
    })
    .populate("shippingPartner");

  if (!shipment) {
    throw new Error("Shipment not found for this order");
  }

  return shipment;
};

export {
  createShipment,
  getShipments,
  getShipmentById,
  getShipmentByOrderId,
  assignShippingPartner,
  updateShipmentStatus,
  addPickupProof,
};
