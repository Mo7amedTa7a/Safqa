const Order = require('./order.model');

async function getOrders(user) {
  let filter = {};

  if (user.role === 'BUYER') {
    filter.buyer = user._id;
  }

  if (user.role === 'SUPPLIER') {
    filter.supplier = user._id;
  }

  const orders = await Order.find(filter)
    .populate('deal')
    .populate('buyer')
    .populate('supplier')
    .populate('poolMember');

  return orders;
}

async function getOrderById(orderId, user) {
  const order = await Order.findById(orderId)
    .populate('deal')
    .populate('buyer')
    .populate('supplier')
    .populate('poolMember');

  if (!order) {
    throw new Error('Order not found');
  }

  if (
    user.role === 'BUYER' &&
    order.buyer._id.toString() !== user._id.toString()
  ) {
    throw new Error('Not authorized to access this order');
  }

  if (
    user.role === 'SUPPLIER' &&
    order.supplier._id.toString() !== user._id.toString()
  ) {
    throw new Error('Not authorized to access this order');
  }

  return order;
}

async function updateOrderStatus(orderId, status) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();

  return order;
}

async function markOrderReadyForPickup(orderId, supplierId) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.supplier.toString() !== supplierId.toString()) {
    throw new Error('Not authorized to update this order');
  }

  if (order.status !== 'CONFIRMED') {
    throw new Error(
      `Cannot mark as ready for pickup from status: ${order.status}`
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
    throw new Error('Order not found');
  }

  const isBuyer =
    user.role === 'BUYER' && order.buyer.toString() === user._id.toString();
  const isSupplier =
    user.role === 'SUPPLIER' &&
    order.supplier.toString() === user._id.toString();
  const isAdmin = user.role === 'ADMIN';

  if (!isBuyer && !isSupplier && !isAdmin) {
    throw new Error('Not authorized to cancel this order');
  }

  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    throw new Error(`Cannot cancel order with status: ${order.status}`);
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