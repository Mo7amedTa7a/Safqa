// BuyingRequest Routes
// - Belongs to: Member 2
// - All routes require auth middleware + BUYER role

import express from "express";

import {
    createBuyingRequestController,
    getMyBuyingRequestsController,
    getBuyingRequestByIdController,
    updateBuyingRequestController,
    cancelBuyingRequestController
} from "./buyingRequest.controller.js";

import {
    validateCreateBuyingRequest,
    validateUpdateBuyingRequest,
    validateBuyingRequestId
} from "./buyingRequest.validation.js";

import protect  from "../../middlewares/auth.middleware.js";
import authorize  from "../../middlewares/role.middleware.js";
import validate  from "../../middlewares/validate.middleware.js";


const router = express.Router();



router.use(protect);

router.post(
    "/",
    authorize("BUYER"),
    validate(validateCreateBuyingRequest),
    createBuyingRequestController
);

router.get(
    "/",
    authorize("BUYER", "SUPPLIER", "ADMIN"),
    getMyBuyingRequestsController
);

router.get(
    "/:id",
    authorize("BUYER", "SUPPLIER", "ADMIN"),
    validate(validateBuyingRequestId, "params"),
    getBuyingRequestByIdController
);

router.patch(
    "/:id",
    authorize("BUYER"),
    validate(validateBuyingRequestId, "params"),
    validate(validateUpdateBuyingRequest),
    updateBuyingRequestController
);

router.patch(
    "/:id/cancel",
    authorize("BUYER"),
    validate(validateBuyingRequestId, "params"),
    cancelBuyingRequestController
);


export default router;
