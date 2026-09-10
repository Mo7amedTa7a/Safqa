// Product Model
// - Belongs to: Member 2
// - Fields: name, description, category, images[], variants[]
// - Variant sub-schema: sku, attributes (size/color...), price, stock
// - Index on category and name for search queries
const mongoose = require("mongoose");


const variantSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            required: true,
            unique: true
        },

        attributes: {
            type: Map,
            of: String,
            default: {}
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        stock: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: true
    }
);



const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        images: [
            {
                type: String
            }
        ],

        variants: [variantSchema]
    },
    {
        timestamps: true
    }
);



productSchema.index({
    category: 1,
    name: 1
});


const Product = mongoose.model(
    "Product",
    productSchema
);


module.exports = Product;
