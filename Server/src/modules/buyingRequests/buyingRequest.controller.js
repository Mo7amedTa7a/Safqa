// BuyingRequest Controller
// - Belongs to: Member 2
// - POST / → createRequest (BUYER)
// - GET / → getMyRequests (BUYER)
// - GET /:id → getRequestById (BUYER)
// - PATCH /:id → updateRequest (BUYER)
// - PATCH /:id/cancel → cancelRequest (BUYER)

import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";

import {
    createBuyingRequest,
    getMyBuyingRequests,
    getBuyingRequestById,
    updateBuyingRequest,
    cancelBuyingRequest
} from "./buyingRequest.service.js";



const createBuyingRequestController = asyncHandler(async (req, res) => {

    const buyingRequest = await createBuyingRequest(
        req.body,
        req.user.id
    );

    sendSuccess(
        res,
        201,
        "Buying request created successfully",
        buyingRequest
    );
});



const getMyBuyingRequestsController = asyncHandler(async (req, res) => {

    const buyingRequests = await getMyBuyingRequests(
        req.user.id
    );

    sendSuccess(
        res,
        200,
        "Buying requests retrieved successfully",
        buyingRequests
    );
});



const getBuyingRequestByIdController = asyncHandler(async (req, res) => {

    const buyingRequest = await getBuyingRequestById(
        req.params.id,
        req.user.id
    );

    sendSuccess(
        res,
        200,
        "Buying request retrieved successfully",
        buyingRequest
    );
});



const updateBuyingRequestController = asyncHandler(async (req, res) => {

    const buyingRequest = await updateBuyingRequest(
        req.params.id,
        req.user.id,
        req.body
    );

    sendSuccess(
        res,
        200,
        "Buying request updated successfully",
        buyingRequest
    );
});



const cancelBuyingRequestController = asyncHandler(async (req, res) => {

    const buyingRequest = await cancelBuyingRequest(
        req.params.id,
        req.user.id
    );

    sendSuccess(
        res,
        200,
        "Buying request cancelled successfully",
        buyingRequest
    );
});


export {
    createBuyingRequestController,
    getMyBuyingRequestsController,
    getBuyingRequestByIdController,
    updateBuyingRequestController,
    cancelBuyingRequestController
};