import asyncHandler from "../../utils/asyncHandler.js";
import adminService from "./admin.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getDashboardStats();
    return sendSuccess(res, 200, "Dashboard stats retrieved successfully", stats);
});

export const getAllBuyingPools = asyncHandler(async (req, res) => {
    const pools = await adminService.getAllBuyingPools();
    return sendSuccess(res, 200, "Buying pools retrieved successfully", pools);
});

export const getAllBuyingRequests = asyncHandler(async (req, res) => {
    const requests = await adminService.getAllBuyingRequests();
    return sendSuccess(res, 200, "Buying requests retrieved successfully", requests);
});
