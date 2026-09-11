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
    // order.buyer._id.equals(user._id) => هي هي نفس اللي فوقها بس دي ب ميثود جاهزة علشان تقارن objects
) {
    throw new Error('Not authorized to access this order');
}

if (
    user.role === 'SUPPLIER' &&
    order.supplier._id.toString() !== user._id.toString()
    // order.buyer._id.equals(user._id) => هي هي نفس اللي فوقها بس دي ب ميثود جاهزة علشان تقارن objects
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

module.exports = {
    getOrders,
    getOrderById,
    updateOrderStatus
};