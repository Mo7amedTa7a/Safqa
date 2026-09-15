// Settlement Controller
// - Belongs to: Member 5

import {
  createSettlement,
  getSettlements,
  getSettlementById,
  holdSettlement,
  releaseSettlement,
} from "./settlement.service.js";

const createSettlementController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const settlement = await createSettlement(orderId);
    res.status(201).json({
      success: true,
      data: settlement,
    });
  } catch (err) {
    next(err);
  }
};

const getSettlementsController = async (req, res, next) => {
  try {
    const settlements = await getSettlements(req.user);
    res.status(200).json({
      success: true,
      data: settlements,
    });
  } catch (err) {
    next(err);
  }
};

const getSettlementByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const settlement = await getSettlementById(id, req.user);
    res.status(200).json({
      success: true,
      data: settlement,
    });
  } catch (err) {
    next(err);
  }
};

const holdSettlementController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const settlement = await holdSettlement(id);
    res.status(200).json({
      success: true,
      data: settlement,
    });
  } catch (err) {
    next(err);
  }
};

const releaseSettlementController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const settlement = await releaseSettlement(id);
    res.status(200).json({
      success: true,
      data: settlement,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createSettlementController,
  getSettlementsController,
  getSettlementByIdController,
  holdSettlementController,
  releaseSettlementController,
};
