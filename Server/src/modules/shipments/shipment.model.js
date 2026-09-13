// Shipment Model
// - Belongs to: Member 5
// - Fields: order, shippingPartner, shipmentType, trackingNumber, pickupAddress, deliveryAddress, codAmount, status, pickupProof
// - Status: PENDING | READY_FOR_PICKUP | PICKED_UP | IN_TRANSIT | OUT_FOR_DELIVERY | DELIVERED | DELIVERY_FAILED | RETURN_TO_SUPPLIER | RETURNED
// - Index on order, trackingNumber unique, shippingPartner + status, shipmentType

import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    shippingPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shipmentType: {
      type: String,
      enum: ["OUTBOUND", "RETURN"],
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    pickupAddress: {
      street: { type: String },
      city: { type: String },
      country: { type: String },
    },
    deliveryAddress: {
      street: { type: String },
      city: { type: String },
      country: { type: String },
    },
    codAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "READY_FOR_PICKUP",
        "PICKED_UP",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "DELIVERY_FAILED",
        "RETURN_TO_SUPPLIER",
        "RETURNED",
      ],
      default: "PENDING",
    },
    pickupProof: {
      type: { type: String },
      value: { type: String },
      time: { type: Date },
    },
  },
  { timestamps: true }
);

shipmentSchema.index({ order: 1 });
shipmentSchema.index({ shippingPartner: 1, status: 1 });
shipmentSchema.index({ shipmentType: 1 });

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
