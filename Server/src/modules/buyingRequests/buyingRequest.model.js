// BuyingRequest Model
// - Belongs to: Member 2
// - Fields: buyer (ref: User), product (ref: Product), variant, quantity
// - purchaseType: DIRECT | GROUP
// - status: PENDING | POOLED | COMPLETED | CANCELLED
// - Index on buyer+status and product+variant
const mongoose = require("mongoose");

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

        purchaseType: {
            type: String,

            enum: [
                "DIRECT",
                "GROUP"
            ],

            required: true
        },

        status: {
            type: String,

            enum: [
                "PENDING",
                "POOLED",
                "COMPLETED",
                "CANCELLED"
            ],

            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);



buyingRequestSchema.index({
    buyer: 1,
    product: 1,
    status: 1
});


const BuyingRequest = mongoose.model(
    "BuyingRequest",
    buyingRequestSchema
);


module.exports = BuyingRequest;
