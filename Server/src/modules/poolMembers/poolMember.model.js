// PoolMember Model
// - Belongs to: Member 3
// - Fields: pool (ref: BuyingPool), buyer (ref: User), buyingRequest (ref), quantity
// - status: ACTIVE | WITHDRAWN
// - Unique index on pool + buyer (one buyer per pool)


const mongoose = require("mongoose");

const PoolMember_schema = new mongoose.Schema(
  {
    pool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuyingPool",
      required: true
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    buyingRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuyingRequest",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: ["ACTIVE", "WITHDRAWN"],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
);

PoolMember_schema.index(
  { pool: 1, buyer: 1 },
  { unique: true }
);

const PoolMember = mongoose.model("PoolMember", PoolMember_schema);

module.exports = PoolMember;

