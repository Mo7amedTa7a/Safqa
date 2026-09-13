const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');
const { sendSuccess } = require('../../utils/apiResponse');

const {
  getDeals,
  getDealById,
  updateDealStatus,
  createDealFromPool,
  createDealFromRequest,
} = require('./deal.service');

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

module.exports = {
  getDealsController,
  getDealByIdController,
  updateDealStatusController,
  selectOfferController,
  selectDirectOfferController,
};