

import express from 'express'
import protect from '../../middlewares/auth.middleware.js'
import validate from '../../middlewares/validation.middleware.js'
import { createSupplierProfileSchema, rejectSupplierProfileSchema } from './supplierProfile.validation.js'
import { approveSupplierProfile, createSupplierProfile, rejectSupplierProfile } from './supplierProfile.controller.js'
import authorize from '../../middlewares/role.middleware.js'

const router = express.Router()


router.post(
    "/", 
    protect,
    authorize("SUPPLIER"),
    validate(createSupplierProfileSchema),
    createSupplierProfile
)

router.patch(
    "/:id/approve",
    protect,
    authorize("ADMIN"),
    approveSupplierProfile
)

router.patch(
    "/:id/reject",
    protect, authorize("ADMIN"),
    validate(rejectSupplierProfileSchema),
    rejectSupplierProfile
)

export default router;