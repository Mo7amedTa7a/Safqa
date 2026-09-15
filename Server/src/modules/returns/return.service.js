// Return Service
// - Belongs to: Member 5

import ReturnModel from "./return.model.js";
import Dispute from "../disputes/dispute.model.js";
import Order from "../orders/order.model.js";

const createReturn = async (disputeId) => {
  const dispute = await Dispute.findById(disputeId);

  if (!dispute) {
    throw new Error("Dispute not found");
  }

  if (dispute.status !== "APPROVED") {
    throw new Error("Can only create return for APPROVED disputes");
  }

  const existingReturn = await ReturnModel.findOne({ dispute: disputeId });
  if (existingReturn) {
    throw new Error("Return already created for this dispute");
  }

  const newReturn = await ReturnModel.create({
    order: dispute.order,
    dispute: disputeId,
    reason: dispute.reason,
    status: "APPROVED", // Directly approved since dispute is approved
  });

  return newReturn;
};

const getReturns = async (user) => {
  // If user is BUYER, we might want to filter by order.buyer. 
  // For simplicity MVP, admins get all. Shipping partners get all (or assigned).
  const returns = await ReturnModel.find()
    .populate("order")
    .populate("dispute")
    .populate("returnShipment");

  return returns;
};

const getReturnById = async (returnId) => {
  const returnRecord = await ReturnModel.findById(returnId)
    .populate("order")
    .populate("dispute")
    .populate("returnShipment");

  if (!returnRecord) {
    throw new Error("Return not found");
  }

  return returnRecord;
};

const updateReturnStatus = async (returnId, status) => {
  const returnRecord = await ReturnModel.findById(returnId);

  if (!returnRecord) {
    throw new Error("Return not found");
  }

  returnRecord.status = status;
  await returnRecord.save();

  return returnRecord;
};

export {
  createReturn,
  getReturns,
  getReturnById,
  updateReturnStatus,
};
