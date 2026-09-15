// Product Controller
// - Belongs to: Member 2
// - POST / → createProduct (SUPPLIER)
// - GET / → getAllProducts (public)
// - GET /:id → getProductById (public)
// - PATCH /:id → updateProduct (SUPPLIER - owner)
// - DELETE /:id → deleteProduct (ADMIN)

import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";

import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "./product.service.js";

// Create Product
const createProductController = asyncHandler(async (req, res) => {
    const product = await createProduct(req.body, req.user.id);

    sendSuccess(
        res,
        201,
        "Product created successfully",
        product
    );
});

// Get All Products
const getAllProductsController = asyncHandler(async (req, res) => {
    const products = await getAllProducts(req.query);

    sendSuccess(
        res,
        200,
        "Products retrieved successfully",
        products
    );
});

// Get Product By ID
const getProductByIdController = asyncHandler(async (req, res) => {
    const product = await getProductById(req.params.id);

    sendSuccess(
        res,
        200,
        "Product retrieved successfully",
        product
    );
});

// Update Product
const updateProductController = asyncHandler(async (req, res) => {
    const product = await updateProduct(
        req.params.id,
        req.user.id,
        req.body
    );

    sendSuccess(
        res,
        200,
        "Product updated successfully",
        product
    );
});

// Delete Product
const deleteProductController = asyncHandler(async (req, res) => {
    const product = await deleteProduct(req.params.id);

    sendSuccess(
        res,
        200,
        "Product deleted successfully",
        product
    );
});

export {
    createProductController,
    getAllProductsController,
    getProductByIdController,
    updateProductController,
    deleteProductController
};