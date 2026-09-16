// BuyingPool Model
// - Belongs to: Member 3
// - Fields: product (ref), variant, totalQuantity, status, startAt, closeAt, joinCloseAt, offerCloseAt
// - status: OPEN | OPEN_OFFERS | CLOSED | EXPIRED
// - Index on product + variant + status


import mongoose from "mongoose";

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

    joinCloseAt: {
      type: Date
    },

    offerCloseAt: {
      type: Date
    },

    status: {
      type: String,
      enum: ["OPEN", "OPEN_OFFERS", "CLOSED"],
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

export default BuyingPool;