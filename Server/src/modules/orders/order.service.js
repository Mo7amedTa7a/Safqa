const AppError = require('../../utils/AppError');
const Order = require('./order.model');

async function getOrders(user) {
  let filter = {};

  if (user.role === 'BUYER') {
    filter.buyer = user._id;
  }

  if (user.role === 'SUPPLIER') {
    filter.supplier = user._id;
  }

  return Order.find(filter)
    .populate('deal')
    .populate('buyer')
    .populate('supplier')
    .populate('poolMember');
}

async function getOrderById(orderId, user) {
  const order = await Order.findById(orderId)
    .populate('deal')
    .populate('buyer')
    .populate('supplier')
    .populate('poolMember');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (user.role === 'BUYER' && order.buyer._id.toString() !== user._id.toString()) {
    throw new AppError('Not authorized to access this order', 403);
  }

  if (user.role === 'SUPPLIER' && order.supplier._id.toString() !== user._id.toString()) {
    throw new AppError('Not authorized to access this order', 403);
  }

  return order;
}

async function updateOrderStatus(orderId, status) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.status = status;
  await order.save();

  return order;
}

async function markOrderReadyForPickup(orderId, supplierId) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.supplier.toString() !== supplierId.toString()) {
    throw new AppError('Not authorized to update this order', 403);
  }

  if (order.status !== 'CONFIRMED') {
    throw new AppError(
      `Cannot mark as ready for pickup from status: ${order.status}`,
      400
    );
  }

  order.status = 'READY_FOR_PICKUP';
  await order.save();

  return order;
}

const CANCELLABLE_STATUSES = ['PENDING', 'CONFIRMED'];

async function cancelOrder(orderId, user) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const isBuyer =
    user.role === 'BUYER' && order.buyer.toString() === user._id.toString();
  const isSupplier =
    user.role === 'SUPPLIER' &&
    order.supplier.toString() === user._id.toString();
  const isAdmin = user.role === 'ADMIN';

  if (!isBuyer && !isSupplier && !isAdmin) {
    throw new AppError('Not authorized to cancel this order', 403);
  }

  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    throw new AppError(`Cannot cancel order with status: ${order.status}`, 400);
  }

  order.status = 'CANCELLED';
  await order.save();

  return order;
}

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  markOrderReadyForPickup,
  cancelOrder,
};