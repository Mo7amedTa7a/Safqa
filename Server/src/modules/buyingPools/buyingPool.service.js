// BuyingPool Service
// - Belongs to: Member 3 & Member 4

import BuyingRequest from "../buyingRequests/buyingRequest.model.js";
import BuyingPool from "./buyingPool.model.js";
import PoolMember from "../poolMembers/poolMember.model.js";
import SupplierOffer from "../supplierOffers/supplierOffer.model.js";

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
        const joinCloseAt = new Date(startAt.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days

        pool = await BuyingPool.create({
            product: request.product,
            createdBy: request.buyer,
            variant: request.variant,
            totalQuantity: 0,
            memberCount: 0,
            startAt: startAt,
            joinCloseAt: joinCloseAt,
            closeAt: joinCloseAt, // To be deprecated later, but kept for compatibility
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

const getpool = async () => {
    const pool = await BuyingPool.find()
        .populate("product", "name category images variants description")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

    return pool;
};

const getPoolById = async (poolid) => {
    const poolObj = await BuyingPool.findById(poolid)
        .populate("product", "name category images variants description")
        .populate("createdBy", "name email");

    if (!poolObj) {
        throw new Error("The pool does not exist");
    }

    const members = await PoolMember.find({ pool: poolid, status: "ACTIVE" })
        .populate("buyer", "name email companyName");

    const offers = await SupplierOffer.find({ pool: poolid })
        .populate("supplier", "name email companyName");

    const result = poolObj.toObject();
    result.members = members;
    result.offers = offers;

    return result;
};

const closePool = async (poolId) => {
    const pool = await BuyingPool.findById(poolId);

    if (!pool) {
        throw new Error("The pool does not exist");
    }

    if (pool.status === "OPEN") {
        pool.status = "OPEN_OFFERS";
        pool.offerCloseAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
        await pool.save();
        return pool;
    } else if (pool.status === "OPEN_OFFERS") {
        pool.status = "CLOSED";
        await pool.save();
        return pool;
    } else {
        throw new Error("The pool cannot be closed from its current state");
    }
};

export {
    createBuyingPool,
    getpool,
    getPoolById,
    closePool
};
