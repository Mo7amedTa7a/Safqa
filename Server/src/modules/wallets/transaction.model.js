import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"], // CREDIT = add, DEBIT = subtract
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    referenceOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "COMPLETED",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
