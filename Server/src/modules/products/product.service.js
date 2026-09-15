// Product Service
// - Belongs to: Member 2
// - createProduct(data, supplierId): create a new product
// - getAllProducts(filters): list products with category/name filters
// - getProductById(id): get single product with variants
// - updateProduct(id, supplierId, data): update product fields or variants
// - deleteProduct(id): set status inactive (ADMIN)

import mongoose from "mongoose";
import Product from "./product.model.js";
import AppError from "../../utils/AppError.js";



const createProduct = async (data, supplierId) => {
    const product = await Product.create({
        name: data.name,
        description: data.description,
        category: data.category,
        images: data.images,
        variants: data.variants,
        supplier: supplierId,
        status: data.status || "ACTIVE"
    });

    await product.populate("supplier", "name email rating");

    return product;
};


const getAllProducts = async (filters) => {
    const query = {};

    if (filters.name) {
        query.name = {
            $regex: filters.name,
            $options: "i"
        };
    }

    if (filters.category) {
        query.category = filters.category;
    }

    if (filters.status) {
        query.status = filters.status;
    }

    const products = await Product.find(query)
        .populate("supplier", "name email rating")
        .sort({ createdAt: -1 });

    return products;
};


const getProductById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid product ID", 400);
    }

    const product = await Product.findById(id)
        .populate("supplier", "name email rating");

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    return product;
};


const updateProduct = async (id, supplierId, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid product ID", 400);
    }

    const product = await Product.findOne({
        _id: id,
        supplier: supplierId
    });

    if (!product) {
        throw new AppError(
            "Product not found or you are not the owner of this product",
            404
        );
    }

    if (data.name !== undefined) {
        product.name = data.name;
    }

    if (data.description !== undefined) {
        product.description = data.description;
    }

    if (data.category !== undefined) {
        product.category = data.category;
    }

    if (data.images !== undefined) {
        product.images = data.images;
    }

    if (data.variants !== undefined) {
        product.variants = data.variants;
    }

    if (data.status !== undefined) {
        product.status = data.status;
    }

    await product.save();

    await product.populate("supplier", "name email rating");

    return product;
};


const deleteProduct = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid product ID", 400);
    }

    const product = await Product.findById(id);

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    product.status = "INACTIVE";

    await product.save();

    return product;
};


export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};