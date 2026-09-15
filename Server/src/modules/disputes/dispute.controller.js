// Dispute Controller
// - Belongs to: Member 5

import {
  createDispute,
  getDisputes,
  getDisputeById,
  reviewDispute,
  resolveDispute,
} from "./dispute.service.js";

const createDisputeController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const buyerId = req.user._id || req.user.id;
    const data = req.body;
    const dispute = await createDispute(orderId, buyerId, data);
    res.status(201).json({
      success: true,
      data: dispute,
    });
  } catch (err) {
    next(err);
  }
};

const getDisputesController = async (req, res, next) => {
  try {
    const disputes = await getDisputes(req.user);
    res.status(200).json({
      success: true,
      data: disputes,
    });
  } catch (err) {
    next(err);
  }
};

const getDisputeByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dispute = await getDisputeById(id, req.user);
    res.status(200).json({
      success: true,
      data: dispute,
    });
  } catch (err) {
    next(err);
  }
};

const reviewDisputeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;
    const dispute = await reviewDispute(id, adminNote);
    res.status(200).json({
      success: true,
      data: dispute,
    });
  } catch (err) {
    next(err);
  }
};

const resolveDisputeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;
    const dispute = await resolveDispute(id, status, adminNote);
    res.status(200).json({
      success: true,
      data: dispute,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createDisputeController,
  getDisputesController,
  getDisputeByIdController,
  reviewDisputeController,
  resolveDisputeController,
};
