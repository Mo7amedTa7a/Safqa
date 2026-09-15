import express from 'express';
import protect from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { createSupplierProfileSchema, rejectSupplierProfileSchema } from './supplierProfile.validation.js';
import { 
    createSupplierProfile, 
    getMySupplierProfile, 
    getAllSupplierProfiles, 
    approveSupplierProfile, 
    rejectSupplierProfile 
} from './supplierProfile.controller.js';
import authorize from '../../middlewares/role.middleware.js';

const router = express.Router();

// Admin: Get all supplier profiles
router.get(
    "/",
    protect,
    authorize("ADMIN"),
    getAllSupplierProfiles
);

// Supplier: Get own supplier profile
router.get(
    "/me",
    protect,
    authorize("SUPPLIER"),
    getMySupplierProfile
);

// Supplier: Submit/Complete supplier profile
router.post(
    "/", 
    protect,
    authorize("SUPPLIER"),
    validate(createSupplierProfileSchema),
    createSupplierProfile
);

// Admin: Approve supplier profile
router.patch(
    "/:id/approve",
    protect,
    authorize("ADMIN"),
    approveSupplierProfile
);

// Admin: Reject supplier profile
router.patch(
    "/:id/reject",
    protect, 
    authorize("ADMIN"),
    validate(rejectSupplierProfileSchema),
    rejectSupplierProfile
);

export default router;
