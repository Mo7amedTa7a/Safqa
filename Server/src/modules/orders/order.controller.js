const {
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('./order.service');

const getOrdersController = async (req, res) => {
  try {
    const orders = await getOrders(req.user);
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getOrderByIdController = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id, req.user);
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatusController = async (req, res) => {
  try {
    const order = await updateOrderStatus(req.params.id, req.body.status);
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
};