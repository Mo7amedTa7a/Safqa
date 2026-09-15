// Return Controller
// - Belongs to: Member 5

import {
  createReturn,
  getReturns,
  getReturnById,
  updateReturnStatus,
} from "./return.service.js";

const createReturnController = async (req, res, next) => {
  try {
    const { disputeId } = req.params;
    const newReturn = await createReturn(disputeId);
    res.status(201).json({
      success: true,
      data: newReturn,
    });
  } catch (err) {
    next(err);
  }
};

const getReturnsController = async (req, res, next) => {
  try {
    const returns = await getReturns(req.user);
    res.status(200).json({
      success: true,
      data: returns,
    });
  } catch (err) {
    next(err);
  }
};

const getReturnByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const returnRecord = await getReturnById(id);
    res.status(200).json({
      success: true,
      data: returnRecord,
    });
  } catch (err) {
    next(err);
  }
};

const updateReturnStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const returnRecord = await updateReturnStatus(id, status);
    res.status(200).json({
      success: true,
      data: returnRecord,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createReturnController,
  getReturnsController,
  getReturnByIdController,
  updateReturnStatusController,
};
