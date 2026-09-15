// BuyingPool Service
// - Belongs to: Member 3
// - findOrCreatePool(product, variant): find OPEN pool or create new one with 3-day expiry
// - createBuyingPool: create/find pool and add the buying request as a pool member
// - getPoolById(id): get pool
// - closePool(poolId): close pool

import BuyingRequest from "../buyingRequests/buyingRequest.model.js";
import BuyingPool from "./buyingPool.model.js";
import PoolMember from "../poolMembers/poolMember.model.js";

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

    if (request.status !== "OPEN") {
        throw new Error("Buying request cannot be added to a pool");
    }

    let pool = await BuyingPool.findOne({
        product: request.product,
        variant: request.variant,
        status: "OPEN"
    });

    if (!pool) {

        const startAt = new Date();

        const closeAt = new Date(
            startAt.getTime() + 3 * 24 * 60 * 60 * 1000
        );

        pool = await BuyingPool.create({
            product: request.product,
            createdBy: request.buyer,
            variant: request.variant,
            totalQuantity: 0,
            memberCount: 0,
            startAt: startAt,
            closeAt: closeAt,
            status: "OPEN"
        });
    }

    const existingMember = await PoolMember.findOne({
        pool: pool._id,
        buyer: buyerId,
        buyingRequest: request._id
    });

    if (existingMember) {
        throw new Error("You are already a member of this pool");
    }

    const newMember = await PoolMember.create({
        pool: pool._id,
        buyer: buyerId,
        buyingRequest: request._id,
        quantity: request.quantity,
        status: "ACTIVE"
    });

    pool.totalQuantity += request.quantity;
    pool.memberCount += 1;

    await pool.save();

    return {
        pool,
        member: newMember
    };
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

const getPoolById = async (poolid) => {

    const person = await BuyingPool.findById(poolid);

    if (!person) {
        throw new Error("not exist pool");
    }

    return person;
};


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


export {
    createBuyingPool,
    getpool,
    getPoolById,
    closePool
};