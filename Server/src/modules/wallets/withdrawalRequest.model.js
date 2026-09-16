import mongoose from "mongoose";

const withdrawalRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      accountName: String,
    },
    adminNotes: String,
  },
  { timestamps: true }
);

const WithdrawalRequest = mongoose.model("WithdrawalRequest", withdrawalRequestSchema);
export default WithdrawalRequest;
