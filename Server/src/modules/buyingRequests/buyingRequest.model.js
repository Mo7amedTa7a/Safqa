// BuyingRequest Model
// - Belongs to: Member 2
// - Fields: buyer (ref: User), product (ref: Product), variant, quantity, location
// - purchaseType: DIRECT | GROUP
// - status: OPEN | CLOSED | CANCELLED | FULFILLED
// - Index on buyer+status and product+variant

import mongoose from "mongoose";

const buyingRequestSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        variant: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        purchaseType: {
            type: String,
            enum: ["DIRECT", "GROUP"],
            default: "GROUP"
        },

        status: {
            type: String,
            enum: ["OPEN", "CLOSED", "CANCELLED", "FULFILLED"],
            default: "OPEN"
        }
    },
    {
        timestamps: true
    }
);


buyingRequestSchema.index({
    buyer: 1,
    status: 1
});

buyingRequestSchema.index({
    product: 1,
    variant: 1,
    status: 1
});


const BuyingRequest = mongoose.model(
    "BuyingRequest",
    buyingRequestSchema
);

export default BuyingRequest;