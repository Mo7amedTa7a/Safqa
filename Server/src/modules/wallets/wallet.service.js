import Wallet from "./wallet.model.js";
import Transaction from "./transaction.model.js";
import WithdrawalRequest from "./withdrawalRequest.model.js";
import AppError from "../../utils/AppError.js";

const getWallet = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId, balance: 0, pendingBalance: 0 });
  }
  return wallet;
};

const getTransactions = async (userId) => {
  const wallet = await getWallet(userId);
  return Transaction.find({ wallet: wallet._id })
    .populate("referenceOrder")
    .sort("-createdAt");
};

const requestWithdrawal = async (userId, amount, bankDetails) => {
  const wallet = await getWallet(userId);

  if (amount <= 0) {
    throw new AppError("Amount must be greater than zero", 400);
  }

  if (wallet.balance < amount) {
    throw new AppError("Insufficient balance", 400);
  }

  // Deduct from balance and add to pending balance
  wallet.balance -= amount;
  wallet.pendingBalance += amount;
  await wallet.save();

  const withdrawal = await WithdrawalRequest.create({
    user: userId,
    amount,
    bankDetails,
    status: "PENDING",
  });

  return withdrawal;
};

const getAllWithdrawalRequests = async () => {
  return WithdrawalRequest.find()
    .populate("user", "name email role")
    .sort("-createdAt");
};

const processWithdrawal = async (requestId, action, adminNotes) => {
  const withdrawal = await WithdrawalRequest.findById(requestId);
  if (!withdrawal) {
    throw new AppError("Withdrawal request not found", 404);
  }

  if (withdrawal.status !== "PENDING") {
    throw new AppError("Request already processed", 400);
  }

  const wallet = await Wallet.findOne({ user: withdrawal.user });
  if (!wallet) {
    throw new AppError("Wallet not found", 404);
  }

  if (action === "APPROVE") {
    withdrawal.status = "APPROVED";
    wallet.pendingBalance -= withdrawal.amount;
    
    // Create transaction log
    await Transaction.create({
      wallet: wallet._id,
      amount: withdrawal.amount,
      type: "DEBIT",
      description: "Withdrawal Approved & Transferred",
    });
  } else if (action === "REJECT") {
    withdrawal.status = "REJECTED";
    wallet.pendingBalance -= withdrawal.amount;
    wallet.balance += withdrawal.amount; // return money
  } else {
    throw new AppError("Invalid action", 400);
  }

  withdrawal.adminNotes = adminNotes;
  await withdrawal.save();
  await wallet.save();

  return withdrawal;
};

export {
  getWallet,
  getTransactions,
  requestWithdrawal,
  getAllWithdrawalRequests,
  processWithdrawal,
};
