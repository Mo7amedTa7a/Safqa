// Payment Controller
// - Belongs to: Member 5

import {
  createCodPayment,
  getPaymentById,
  collectPayment,
  failPayment,
} from "./payment.service.js";

const createCodPaymentController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const payment = await createCodPayment(orderId);
    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

const getPaymentByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await getPaymentById(id);
    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

const collectPaymentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { collectedAmount } = req.body;
    const userId = req.user._id || req.user.id;
    const payment = await collectPayment(id, collectedAmount, userId);
    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

const failPaymentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await failPayment(id);
    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createCodPaymentController,
  getPaymentByIdController,
  collectPaymentController,
  failPaymentController,
};
