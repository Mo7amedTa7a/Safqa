// PoolMember Service
// - Belongs to: Member 3
// - joinPool(poolId, buyerId, requestId, quantity): add buyer to pool
// - updateQuantity(memberId, quantity): adjust buyer quantity
// - leavePool(memberId): set status WITHDRAWN
// - getPoolMembers(poolId): list all ACTIVE members

import PoolMember from './poolMember.model.js';
import BuyingPool from "../buyingPools/buyingPool.model.js";
import BuyingRequest from "../buyingRequests/buyingRequest.model.js";



const joinPool = async (poolId, buyerId, quantity) => {

    const pool = await BuyingPool.findById(poolId);

    if (!pool) {
        throw new Error("Buying pool not found");
    }

    if (pool.status !== "OPEN") {
        throw new Error("Buying pool is not open");
    }

    if (!quantity || quantity <= 0) {
        throw new Error("يجب تحديد كمية صحيحة للانضمام إلى التجمع");
    }

    const existingMember = await PoolMember.findOne({
         pool: poolId,
         buyer: buyerId
    })

    if (existingMember) {
        throw new Error("You are already a member of this pool");
    }

    // Get location from an existing member's BuyingRequest in this pool
    const existingPoolMember = await PoolMember.findOne({ pool: poolId, status: "ACTIVE" }).populate('buyingRequest');
    let location = "غير محدد";
    if (existingPoolMember && existingPoolMember.buyingRequest) {
        const existingRequest = await BuyingRequest.findById(existingPoolMember.buyingRequest);
        if (existingRequest && existingRequest.location) {
            location = existingRequest.location;
        }
    }

    // Auto-create a Buying Request for this buyer
    const request = await BuyingRequest.create({
        buyer: buyerId,
        product: pool.product,
        variant: pool.variant,
        quantity: quantity,
        location: location,
        purchaseType: "GROUP",
        status: "OPEN"
    });

    const newMember = await PoolMember.create({
        pool: poolId,
        buyer: buyerId,
        buyingRequest: request._id,
        quantity: quantity,
        status: "ACTIVE"
    });

    pool.totalQuantity += quantity;
    pool.memberCount += 1;

    await pool.save();

    return {member: newMember, pool: pool};
};




const updateQuantity = async (poolId, buyerId, nwequantity) => {
    const member = await PoolMember.findOne({
        pool: poolId,
        buyer: buyerId

    })
    if (!member) {
        throw new Error("not exist member")
    }

    if (member.status !== "ACTIVE") {
        throw new Error("the member not active")

    }
    const different = nwequantity - member.quantity

    member.quantity = nwequantity

    const pool = await BuyingPool.findById(poolId)
    if (!pool) {
        throw new Error("the pool not exist")
    }

    pool.totalQuantity += different

    await member.save()
    await pool.save()
    

    return {
        member, pool
    }



}



const leavePool = async (poolId, buyerId) => {

  const member = await PoolMember.findOne({
    pool: poolId,
    buyer: buyerId
  });

  if (!member) {
    throw new Error("Member does not exist");
  }

  if (member.status !== "ACTIVE") {
    throw new Error("Member is already withdrawn");
  }

  const pool = await BuyingPool.findById(poolId);

  if (!pool) {
    throw new Error("The pool does not exist");
  }

  const oldQuantity = member.quantity;

  const newTotalQuantity =
    pool.totalQuantity - oldQuantity;

  const newMemberCount =
    pool.memberCount - 1;

  member.status = "WITHDRAWN";

  pool.totalQuantity = newTotalQuantity;
  pool.memberCount = newMemberCount;

  await member.save();
  await pool.save();

  return {
    member,
    pool
  };
};
///////////////////////////


const getPoolMembersbyid = async (poolId) => {

  const pool = await BuyingPool.findById(poolId);

  if (!pool) {
    throw new Error("The pool does not exist");
  }

  const members = await PoolMember.find({
    pool: poolId,
    status: "ACTIVE"
  });

  return members;
};



export { joinPool, updateQuantity, leavePool, getPoolMembersbyid };