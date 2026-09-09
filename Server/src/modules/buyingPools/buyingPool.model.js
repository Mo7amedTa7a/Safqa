// BuyingPool Model
// - Belongs to: Member 3
// - Fields: product (ref), variant, totalQuantity, status, expiresAt (3-day window)
// - status: OPEN | CLOSED | EXPIRED
// - Index on product + variant + status


const mongoose = require("mongoose");

const BuyingPoolSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },

    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant"
    },

    totalQuantity: Number,

    buyerCount: Number,

    status: {
      type: String,
      enum: ["OPEN", "CLOSED", "EXPIRED"]
    },

    closesAt: Date
  },
  {
    timestamps: true
  }
);

const BuyingPool = mongoose.model("BuyingPool", BuyingPoolSchema);

module.exports = BuyingPool;