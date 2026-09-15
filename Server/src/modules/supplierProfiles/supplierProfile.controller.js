import { sendSuccess } from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import supplierProfileService from "./supplierProfile.service.js";

export const createSupplierProfile = asyncHandler(async (req, res) => {
    const profile = await supplierProfileService.createSupplierProfile(
        req.user.id,
        req.body
    );
    return sendSuccess(res, 201, "Supplier profile submitted successfully", profile);
});

export const getMySupplierProfile = asyncHandler(async (req, res) => {
    const profile = await supplierProfileService.getMySupplierProfile(req.user.id);
    return sendSuccess(res, 200, "Supplier profile fetched successfully", profile);
});

export const getAllSupplierProfiles = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.status) {
        filter.verificationStatus = req.query.status;
    }
    const profiles = await supplierProfileService.getAllSupplierProfiles(filter);
    return sendSuccess(res, 200, "Supplier profiles retrieved successfully", profiles);
});

export const approveSupplierProfile = asyncHandler(async (req, res) => {
    const approvedProfile = await supplierProfileService.approveSupplierProfile(
        req.params.id,
        req.user.id
    );

    return sendSuccess(res, 200, "Supplier profile approved successfully", approvedProfile);
});

export const rejectSupplierProfile = asyncHandler(async (req, res) => {
    const rejectedProfile = await supplierProfileService.rejectSupplierProfile(
        req.params.id,
        req.user.id,
        req.body.rejectionReason
    );

    return sendSuccess(res, 200, "Supplier profile rejected successfully", rejectedProfile);
});