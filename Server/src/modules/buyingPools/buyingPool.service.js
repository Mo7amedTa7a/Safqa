// BuyingPool Service
// - Belongs to: Member 3
// - findOrCreatePool(product, variant): find OPEN pool or create new one with 3-day expiry
// - getPoolById(id): get pool with members and offers
// - closePool(poolId): set status CLOSED, trigger Deal creation (notify Member 4)
// - calculateTotalQuantity(poolId): sum all PoolMember quantities
const { get } = require("mongoose");
const BuyingRequest = require("../buyingRequests/buyingRequest.model");
const BuyingPool = require("./buyingPool.model");
const PoolMember=require("../poolMembers/poolMember.model")

const createBuyingPool = async (buyingRequestId, buyerId) => {

    const request = await BuyingRequest.findById(buyingRequestId);

    if (!request) {
        throw new Error("Buying request not found");
    }

    if (request.buyer.toString() !== buyerId.toString()) {
        throw new Error("You are not allowed to use this buying request");
    }

    if (request.purchaseType !== "GROUP") {
        throw new Error("This buying request is not for group purchase");
    }

    if (request.status !== "PENDING") {
        throw new Error("Buying request cannot be added to a pool");
    }


    const pool = await BuyingPool.findOne({
        product: request.product,
        variant:request.variant,

        status: "OPEN"
    });

    if (pool) {
        return pool;
    }

    const startAt = new Date();

    const closeAt = new Date(
        startAt.getTime() + 3 * 24 * 60 * 60 * 1000
    );

    const newPool = await BuyingPool.create({
        product: request.product,
        createdBy: request.buyer,
        variant:request.variant,
        totalQuantity: request.quantity,
        memberCount: 1,
        startAt: startAt,
        closeAt: closeAt,
        status: "OPEN"
    });

    return newPool;
};

/////////////////////////////////////////////////////////
const getpool = async () => {
    const pool = await BuyingPool.find();

    if (pool.length === 0) {
        throw new Error("No buying pools found");
    }

    return pool;
};


/////////////////////////////////////////////////////

const getPoolById=async(poolid)=>{
    const person=await BuyingPool.findById(poolid)
    if(!person){
        throw new Error("not exist pool")
    }
    return person

}
///////////////////////////////////////

const closePool = async (poolId) => {

  const pool = await BuyingPool.findById(poolId);

  if (!pool) {
    throw new Error("The pool does not exist");
  }

  if (pool.status !== "OPEN") {
    throw new Error("The pool is not open");
  }

  pool.status = "CLOSED";

  await pool.save();

  return pool;
};





module.exports = {createBuyingPool,getpool,getPoolById,closePool};