import asyncHandler from '../../utils/asyncHandler.js';

import { sendSuccess } from '../../utils/apiResponse.js';

import {
  getDeals,
  getDealById,
  updateDealStatus,
  createDealFromPool,
  createDealFromRequest,
} from './deal.service.js';


// ==========================================
// GET ALL DEALS
// ==========================================

const getDealsController = asyncHandler(
  async (req, res) => {

    const deals =
      await getDeals(req.user);

    return sendSuccess(
      res,
      200,
      'Deals fetched successfully',
      deals
    );
  }
);


// ==========================================
// GET DEAL BY ID
// ==========================================

const getDealByIdController = asyncHandler(
  async (req, res) => {

    const deal =
      await getDealById(
        req.params.id,
        req.user
      );

    return sendSuccess(
      res,
      200,
      'Deal fetched successfully',
      deal
    );
  }
);


// ==========================================
// UPDATE DEAL STATUS
// ==========================================

const updateDealStatusController =
  asyncHandler(async (req, res) => {

    const deal =
      await updateDealStatus(
        req.params.id,
        req.body.status,
        req.user
      );

    return sendSuccess(
      res,
      200,
      'Deal status updated successfully',
      deal
    );
  });


// ==========================================
// SELECT OFFER FROM POOL
// ==========================================

const selectOfferController =
  asyncHandler(async (req, res) => {

    const { poolId } =
      req.params;

    const result =
      await createDealFromPool(
        poolId
      );

    return sendSuccess(
      res,
      201,
      'Deal created successfully',
      result
    );
  });


// ==========================================
// SELECT DIRECT OFFER
// ==========================================

const selectDirectOfferController =
  asyncHandler(async (req, res) => {

    const { requestId } =
      req.params;

    const result =
      await createDealFromRequest(
        requestId
      );

    return sendSuccess(
      res,
      201,
      'Deal created successfully',
      result
    );
  });


export {
  getDealsController,
  getDealByIdController,
  updateDealStatusController,
  selectOfferController,
  selectDirectOfferController,
};