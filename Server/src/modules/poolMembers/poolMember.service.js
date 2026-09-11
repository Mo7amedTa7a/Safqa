// PoolMember Service
// - Belongs to: Member 3
// - joinPool(poolId, buyerId, requestId, quantity): add buyer to pool
// - updateQuantity(memberId, quantity): adjust buyer quantity
// - leavePool(memberId): set status WITHDRAWN
// - getPoolMembers(poolId): list all ACTIVE members

const poolMember=require('./poolMember.model')
const BuyingPool=require("../buyingPools/buyingPool.model")



const joinPool = async (poolId,buyerId) => {

    const pool = await BuyingPool.findById(poolId);

    if (!pool) {
        throw new Error("Buying pool not found");
    }

    if (pool.status !== "OPEN") {
        throw new Error("Buying pool is not open");
    }


    const request = await BuyingRequest.findOne({
        buyer: buyerId,
        purchaseType: "GROUP",
        status: "PENDING"
    });
    if (!request) {
        throw new Error("No valid buying request found");
    }

if (request.product.toString() !== pool.product.toString()) {
        throw new Error("Product does not match the pool");
    }

    if (request.variant.toString() !== pool.variant.toString()) {
        throw new Error("Variant does not match the pool");
    }

    const existingMember=await PoolMember.findOne({
         pool: poolId,
         buyer: buyerId
    })


    if (existingMember) {
    throw new Error("You are already a member of this pool");


}


const newMember = await PoolMember.create({
    pool: poolId,
    buyer: buyerId,
    buyingRequest: request._id,
    quantity: request.quantity,
    status: "ACTIVE"
});



pool.totalQuantity += request.quantity;
pool.memberCount += 1;

await pool.save();




return {member: newMember,pool: pool};





    
};







const updateQuantity=async(poolId,buyerId,nwequantity)=>{
    const member=await poolMember.findOne({
        pool:poolId,
        buyer:buyerId

    })
    if(!member){
        throw new Error("not exist member")
    }

    if(member.status!=="ACTIVE"){
        throw new Error("the member not active")

    }
    const different=nwequantity-member.quantity

    member.quantity=nwequantity

    const pool=await BuyingPool.findById(poolId)
    if(!pool){
        throw new Error("the pool not exist")
    }

    pool.totalQuantity +=different

    await member.save()
    await pool.save()
    

    return {
        member,pool
    }



}



const leavePool = async (poolId, buyerId) => {

  const member = await poolMember.findOne({
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

  const members = await poolMember.find({
    pool: poolId,
    status: "ACTIVE"
  });

  return members;
};




module.exports={joinPool,updateQuantity,leavePool,getPoolMembersbyid}