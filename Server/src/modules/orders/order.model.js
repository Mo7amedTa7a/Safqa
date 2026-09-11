const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    deal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deal',
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    poolMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PoolMember',
        required: true,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    deliveryFee: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [
            'PENDING',
            'CONFIRMED',
            'READY_FOR_PICKUP',
            'SHIPPED',
            'DELIVERED',
            'RETURNED',
            'CANCELLED',
        ],
        default: 'PENDING',
    },
  },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);