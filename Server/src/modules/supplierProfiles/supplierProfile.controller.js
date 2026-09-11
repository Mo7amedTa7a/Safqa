import { sendSuccess } from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import supplierProfileService from "./supplierProfile.service.js";


export const createSupplierProfile = asyncHandler(async (req, res) => {
    const SupplierProfile = await supplierProfileService.createSupplierProfile(
        req.user.id,
        req.body
    )
    return sendSuccess(res, 201, "Supplier profile submitted successfully", SupplierProfile)
})

export const approveSupplierProfile = asyncHandler(async (req, res) => {
    const approveSupplierProfile = await supplierProfileService.approveSupplierProfile(
        req.params.id,
        req.user.id
    )

    return sendSuccess(res, 200, "Supplier profile approved successfully", approveSupplierProfile)
})

export const rejectSupplierProfile = asyncHandler(async (req, res) => {
    const supplierProfile = await supplierProfileService.rejectSupplierProfile(
        req.params.id,
        req.user.id,
        req.body.rejectionReason
    )

    return sendSuccess(res, 200, "Supplier profile rejected successfully", supplierProfile)
})