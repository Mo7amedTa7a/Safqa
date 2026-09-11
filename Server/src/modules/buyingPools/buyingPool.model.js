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
      ref: "Product",
      required: true
    },

    variant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    totalQuantity: {
      type: Number,
      required: true
    },

    memberCount: {
      type: Number,
      required: true
    },

    startAt: {
      type: Date,
      required: true
    },

    closeAt: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      required: true,
      default: "OPEN"
    },

    selectedOffer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupplierOffer"
    }
  },
  {
    timestamps: true
  }
);

BuyingPoolSchema.index({
  product: 1,
  variantSku: 1,
  status: 1
});

const BuyingPool = mongoose.model("BuyingPool", BuyingPoolSchema);

module.exports = BuyingPool;