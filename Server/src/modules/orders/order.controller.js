const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');
const { sendSuccess } = require('../../utils/apiResponse');

const {
  getOrders,
  getOrderById,
  updateOrderStatus,
  markOrderReadyForPickup,
  cancelOrder,
} = require('./order.service');

const getOrdersController = asyncHandler(async (req, res) => {
  const orders = await getOrders(req.user);
  return sendSuccess(res, 200, 'Orders fetched successfully', orders);
});

const getOrderByIdController = asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.id, req.user);
  return sendSuccess(res, 200, 'Order fetched successfully', order);
});

const updateOrderStatusController = asyncHandler(async (req, res) => {
  const order = await updateOrderStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, 'Order status updated successfully', order);
});

const readyForPickupController = asyncHandler(async (req, res) => {
  const order = await markOrderReadyForPickup(req.params.id, req.user._id);
  return sendSuccess(res, 200, 'Order marked as ready for pickup', order);
});

const cancelOrderController = asyncHandler(async (req, res) => {
  const order = await cancelOrder(req.params.id, req.user);
  return sendSuccess(res, 200, 'Order cancelled successfully', order);
});

module.exports = {
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  readyForPickupController,
  cancelOrderController,
};