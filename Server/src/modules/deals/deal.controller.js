import asyncHandler from '../../utils/asyncHandler.js';
import AppError from '../../utils/AppError.js';
import { sendSuccess } from '../../utils/apiResponse.js';

import {
  getDeals,
  getDealById,
  updateDealStatus,
  createDealFromPool,
  createDealFromRequest
} from './deal.service.js';


const getDealsController = asyncHandler(async (req, res) => {
  const deals = await getDeals();
  return sendSuccess(res, 200, 'Deals fetched successfully', deals);
});

const getDealByIdController = asyncHandler(async (req, res) => {
  const deal = await getDealById(req.params.id);
  if (!deal) {
    throw new AppError('Deal not found', 404);
  }
  return sendSuccess(res, 200, 'Deal fetched successfully', deal);
});

const updateDealStatusController = asyncHandler(async (req, res) => {
  const deal = await updateDealStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, 'Deal status updated successfully', deal);
});

const selectOfferController = asyncHandler(async (req, res) => {
  const { poolId } = req.params;
  const result = await createDealFromPool(poolId);
  return sendSuccess(res, 201, 'Deal created successfully', result);
});

const selectDirectOfferController = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const result = await createDealFromRequest(requestId);
  return sendSuccess(res, 201, 'Deal created successfully', result);
});

export {
  getDealsController,
  getDealByIdController,
  updateDealStatusController,
  selectOfferController,
  selectDirectOfferController,
};