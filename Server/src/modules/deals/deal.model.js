const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    pool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BuyingPool',
        required: false,
    },
    selectedOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupplierOffer',
        required: true,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    finalQuantity: {
        type: Number,
        required: true,
        min: 1,
    },
    effectiveUnitPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    deliveryDays: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
        default: 'ACTIVE',
    },
  },
    { timestamps: true }
);

module.exports = mongoose.model('Deal', dealSchema);