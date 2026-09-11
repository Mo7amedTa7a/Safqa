// Product Model
// - Belongs to: Member 2
// - Fields: name, description, category, images[], variants[], supplier, status
// - Variant sub-schema: sku, attributes (size/color...), price, stock
// - Index on category and name for search queries

import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        attributes: {
            type: Map,
            of: String,
            default: {},
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { _id: true }
);

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        images: {
            type: [String],
            default: [],
        },
        variants: {
            type: [variantSchema],
            required: true,
            validate: {
                validator: (variants) => variants.length > 0,
                message: "Product must contain at least one variant",
            },
        },
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE",
            index: true,
        },
    },
    { timestamps: true }
);

productSchema.index({ category: 1, name: 1 });
productSchema.index({ "variants.sku": 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
