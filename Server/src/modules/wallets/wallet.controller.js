import {
  getWallet,
  getTransactions,
  requestWithdrawal,
  getAllWithdrawalRequests,
  processWithdrawal,
} from "./wallet.service.js";
import catchAsync from "../../utils/asyncHandler.js";

const getMyWalletController = catchAsync(async (req, res) => {
  const wallet = await getWallet(req.user.id || req.user._id);
  res.status(200).json({ status: "success", data: wallet });
});

const getMyTransactionsController = catchAsync(async (req, res) => {
  const transactions = await getTransactions(req.user.id || req.user._id);
  res.status(200).json({ status: "success", data: transactions });
});

const requestWithdrawalController = catchAsync(async (req, res) => {
  const { amount, bankDetails } = req.body;
  const withdrawal = await requestWithdrawal(req.user.id || req.user._id, amount, bankDetails);
  res.status(201).json({ status: "success", data: withdrawal });
});

const getAllWithdrawalRequestsController = catchAsync(async (req, res) => {
  const requests = await getAllWithdrawalRequests();
  res.status(200).json({ status: "success", data: requests });
});

const processWithdrawalController = catchAsync(async (req, res) => {
  const { action, adminNotes } = req.body;
  const request = await processWithdrawal(req.params.id, action, adminNotes);
  res.status(200).json({ status: "success", data: request });
});

export {
  getMyWalletController,
  getMyTransactionsController,
  requestWithdrawalController,
  getAllWithdrawalRequestsController,
  processWithdrawalController,
};
