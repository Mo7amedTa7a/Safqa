import AppError from '../../utils/AppError.js';

import Order from './order.model.js';
import Deal from '../deals/deal.model.js';
import PoolMember from '../poolMembers/poolMember.model.js';
import BuyingRequest from '../buyingRequests/buyingRequest.model.js';

async function createOrderFromDeal(
  dealId,
  buyerId,
  shippingAddress,
  phone
) {
  const deal = await Deal.findById(dealId);

  if (!deal) {
    throw new AppError('Deal not found', 404);
  }

  if (deal.status !== 'ACTIVE') {
    throw new AppError(
      'Cannot create order from inactive deal',
      400
    );
  }

  const existingOrder = await Order.findOne({
    deal: dealId,
    buyer: buyerId
  });

  if (existingOrder) {
    throw new AppError(
      'You already have an order for this deal',
      409
    );
  }

  let quantity;
  let poolMemberId = null;
  let buyingRequestId = null;

  if (deal.pool) {
    const poolMember = await PoolMember.findOne({
      pool: deal.pool,
      buyer: buyerId,
      status: 'ACTIVE'
    });

    if (!poolMember) {
      throw new AppError(
        'You are not an active member of this buying pool',
        403
      );
    }

    quantity = poolMember.quantity;
    poolMemberId = poolMember._id;
  } else if (deal.buyingRequest) {
    const request = await BuyingRequest.findOne({
      _id: deal.buyingRequest,
      buyer: buyerId
    });

    if (!request) {
      throw new AppError(
        'You are not the buyer of this buying request',
        403
      );
    }

    quantity = request.quantity;
    buyingRequestId = request._id;
  } else {
    throw new AppError(
      'Deal is not linked to a pool or buying request',
      400
    );
  }

  const orderData = {
    deal: deal._id,
    buyer: buyerId,
    supplier: deal.supplier,
    quantity,
    unitPrice: deal.effectiveUnitPrice,
    deliveryFee: 0,
    totalAmount: quantity * deal.effectiveUnitPrice,
    shippingAddress,
    phone,
    status: 'PENDING'
  };

  if (poolMemberId) {
    orderData.poolMember = poolMemberId;
  }

  if (buyingRequestId) {
    orderData.buyingRequest = buyingRequestId;
  }

  const order = await Order.create(orderData);

  return order;
}

async function getOrders(user) {
  let filter = {};

  if (user.role === 'BUYER') {
    filter.buyer = user.id;
  }

  if (user.role === 'SUPPLIER') {
    filter.supplier = user.id;
  }

  return Order.find(filter)
    .populate('deal')
    .populate('buyer')
    .populate('supplier')
    .populate('poolMember')
    .populate('buyingRequest');
}

async function getOrderById(orderId, user) {
  const order = await Order.findById(orderId)
    .populate('deal')
    .populate('buyer')
    .populate('supplier')
    .populate('poolMember')
    .populate('buyingRequest');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (
    user.role === 'BUYER' &&
    order.buyer._id.toString() !== user.id.toString()
  ) {
    throw new AppError(
      'Not authorized to access this order',
      403
    );
  }

  if (
    user.role === 'SUPPLIER' &&
    order.supplier._id.toString() !== user.id.toString()
  ) {
    throw new AppError(
      'Not authorized to access this order',
      403
    );
  }

  return order;
}

/*
  Allowed status transitions

  PENDING
      ↓
  CONFIRMED
      ↓
  READY_FOR_PICKUP
      ↓
  SHIPPED
      ↓
  DELIVERED

  Cancellation is allowed only from:
  PENDING
  CONFIRMED
*/
const ALLOWED_STATUS_TRANSITIONS = {
  PENDING: ['CONFIRMED'],
  CONFIRMED: ['READY_FOR_PICKUP'],
  READY_FOR_PICKUP: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: []
};

async function updateOrderStatus(orderId, status, user) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const isAdmin = user.role === 'ADMIN';

  const isSupplier =
    user.role === 'SUPPLIER' &&
    order.supplier.toString() === user.id.toString();

  if (!isAdmin && !isSupplier) {
    throw new AppError(
      'Not authorized to update this order',
      403
    );
  }

  const currentStatus = order.status;

  const allowedNextStatuses =
    ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];

  if (!allowedNextStatuses.includes(status)) {
    throw new AppError(
      `Cannot change order status from ${currentStatus} to ${status}`,
      400
    );
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
    throw new AppError(
      'Not authorized to update this order',
      403
    );
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

const CANCELLABLE_STATUSES = [
  'PENDING',
  'CONFIRMED'
];

async function cancelOrder(orderId, user) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const isBuyer =
    user.role === 'BUYER' &&
    order.buyer.toString() === user.id.toString();

  const isSupplier =
    user.role === 'SUPPLIER' &&
    order.supplier.toString() === user.id.toString();

  const isAdmin = user.role === 'ADMIN';

  if (!isBuyer && !isSupplier && !isAdmin) {
    throw new AppError(
      'Not authorized to cancel this order',
      403
    );
  }

  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    throw new AppError(
      `Cannot cancel order with status: ${order.status}`,
      400
    );
  }

  order.status = 'CANCELLED';

  await order.save();

  return order;
}

export {
  createOrderFromDeal,
  getOrders,
  getOrderById,
  updateOrderStatus,
  markOrderReadyForPickup,
  cancelOrder
};