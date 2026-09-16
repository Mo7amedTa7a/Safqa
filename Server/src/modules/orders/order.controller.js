import asyncHandler from '../../utils/asyncHandler.js';

import { sendSuccess } from '../../utils/apiResponse.js';

import {
  createOrderFromDeal,
  getOrders,
  getOrderById,
  updateOrderStatus,
  markOrderReadyForPickup,
  cancelOrder,
  confirmOrder,
} from './order.service.js';

const createOrderController = asyncHandler(async (req, res) => {
  const { dealId } = req.params;

  const { shippingAddress, phone } = req.body;

  const order = await createOrderFromDeal(
    dealId,
    req.user.id,
    shippingAddress,
    phone
  );

  return sendSuccess(
    res,
    201,
    'Order created successfully',
    order
  );
});

const getOrdersController = asyncHandler(async (req, res) => {
  const orders = await getOrders(req.user);

  return sendSuccess(
    res,
    200,
    'Orders fetched successfully',
    orders
  );
});

const getOrderByIdController = asyncHandler(async (req, res) => {
  const order = await getOrderById(
    req.params.id,
    req.user
  );

  return sendSuccess(
    res,
    200,
    'Order fetched successfully',
    order
  );
});

const updateOrderStatusController = asyncHandler(async (req, res) => {
  const order = await updateOrderStatus(
    req.params.id,
    req.body.status,
    req.user
  );

  return sendSuccess(
    res,
    200,
    'Order status updated successfully',
    order
  );
});

const readyForPickupController = asyncHandler(async (req, res) => {
  const order = await markOrderReadyForPickup(
    req.params.id,
    req.user.id
  );

  return sendSuccess(
    res,
    200,
    'Order marked as ready for pickup',
    order
  );
});

const confirmOrderController = asyncHandler(async (req, res) => {
  const order = await confirmOrder(
    req.params.id,
    req.user,
    req.body
  );

  return sendSuccess(
    res,
    200,
    'Order confirmed successfully',
    order
  );
});

const cancelOrderController = asyncHandler(async (req, res) => {
  const order = await cancelOrder(
    req.params.id,
    req.user
  );

  return sendSuccess(
    res,
    200,
    'Order cancelled successfully',
    order
  );
});

export {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  readyForPickupController,
  confirmOrderController,
  cancelOrderController,
};