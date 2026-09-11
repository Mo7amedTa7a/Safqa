// Product Routes
// - Belongs to: Member 2
// - Public routes: GET / and GET /:id
// - Protected routes: POST, PATCH, DELETE require auth middleware

import express from "express";

import {
    createProductController,
    getAllProductsController,
    getProductByIdController,
    updateProductController,
    deleteProductController
} from "./product.controller.js";

import protect from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validation.middleware.js";

import {
    validateCreateProduct,
    validateUpdateProduct,
    validateProductId,
    validateProductQuery
} from "./product.validation.js";

const router = express.Router();



// Public
router.get(
    "/",
    validateProductQuery,
    getAllProductsController
);



// Public
router.get(
    "/:id",
    validateProductId,
    getProductByIdController
);



// SUPPLIER only
router.post(
    "/",
    protect,
    authorize("SUPPLIER"),
    validate(validateCreateProduct),
    createProductController
);



// SUPPLIER - owner only
router.patch(
    "/:id",
    protect,
    authorize("SUPPLIER"),
    validate(validateProductId, "params"),
    validate(validateUpdateProduct),
    updateProductController
);



// ADMIN only
router.delete(
    "/:id",
    protect,
    authorize("ADMIN"),
    validate(validateProductId, "params"),
    deleteProductController
);


export default router;