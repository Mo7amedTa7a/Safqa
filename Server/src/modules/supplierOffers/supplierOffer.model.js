// SupplierOffer Model
// - Belongs to: Member 3
// - Fields: pool (ref), supplier (ref: User), moq, pricingTiers[], deliveryDays, warranty, terms
// - pricingTier sub-schema: minQty, unitPrice
// - status: PENDING | ELIGIBLE | INELIGIBLE | WITHDRAWN | SELECTED
// - Index on pool + supplier (unique)



const mongoose = require("mongoose");

// pricingTier sub-schema
const pricingTierSchema = new mongoose.Schema(
  {
    minQty: {
      type: Number
    },

    unitPrice: {
      type: Number,
    }
  },
  { _id: false }
);

// SupplierOffer Schema
const SupplierOfferSchema = new mongoose.Schema({
    pool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuyingPool",
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    moq: {
      type: Number,
    },

    pricingTiers: {
      type: [pricingTierSchema],
      required: true
    },

    deliveryDays: {
      type: Number,
      required: true,
    },

    warranty: {
      type: String,
      required: true
    },

    terms: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING","ELIGIBLE","INELIGIBLE","WITHDRAWN","SELECTED"],
      default: "PENDING"
    }
  });

SupplierOfferSchema.index({ pool: 1, supplier: 1 }, { unique: true });

const SupplierOffer = mongoose.model("SupplierOffer",SupplierOfferSchema);

module.exports = SupplierOffer;
