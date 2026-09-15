// Refund Controller
// - Belongs to: Member 5

import {
  createRefund,
  getRefunds,
  getRefundById,
  updateRefundStatus,
} from "./refund.service.js";

const createRefundController = async (req, res, next) => {
  try {
    const { returnId } = req.params;
    const refund = await createRefund(returnId);
    res.status(201).json({
      success: true,
      data: refund,
    });
  } catch (err) {
    next(err);
  }
};

const getRefundsController = async (req, res, next) => {
  try {
    const refunds = await getRefunds(req.user);
    res.status(200).json({
      success: true,
      data: refunds,
    });
  } catch (err) {
    next(err);
  }
};

const getRefundByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const refund = await getRefundById(id);
    res.status(200).json({
      success: true,
      data: refund,
    });
  } catch (err) {
    next(err);
  }
};

const updateRefundStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const refund = await updateRefundStatus(id, status);
    res.status(200).json({
      success: true,
      data: refund,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createRefundController,
  getRefundsController,
  getRefundByIdController,
  updateRefundStatusController,
};
