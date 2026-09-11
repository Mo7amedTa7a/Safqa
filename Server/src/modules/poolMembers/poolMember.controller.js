// PoolMember Controller
// - Belongs to: Member 3
// - POST  /join       → joinPool (BUYER)
// - PATCH /:id        → updateQuantity (BUYER)
// - DELETE /:id       → leavePool (BUYER)
// - GET   /pool/:id   → getPoolMembers (ADMIN | SUPPLIER)

const {joinPool,updateQuantity,leavePool,getPoolMembersbyid}=require("./poolMember.service")



const joinPoolcontrol=async(req,res,next)=>{
  try{
    const {id}=req.params
    
    const buyerId=req.user.id
    const result=await joinPool(id,buyerId)

    res.status(200).json({
      success:true,
      data:result
    })

  }catch(err){
    next(err)




  }
}






const updateQuantitycontrol = async (req, res, next) => {
  try {
    const { id } = req.params;
    const buyerId = req.user.id;
    const { quantity } = req.body;

    const updatemember = await updateQuantity(
      id,
      buyerId,
      quantity
    );

    res.status(200).json({
      success: true,
      data: updatemember
    });

  } catch (err) {
    next(err);
  }
};

/////////////////////////////////


const leavePoolcontrol = async (req, res, next) => {
  try {

    const { id } = req.params;
    const buyerId = req.user.id;

    const result = await leavePool(id, buyerId);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
};



///////////////////



const getPoolMemberscontrol = async (req, res, next) => {
  try {

    const { id } = req.params;

    const members = await getPoolMembersbyid(id);

    res.status(200).json({
      success: true,
      data: members
    });

  } catch (err) {
    next(err);
  }
};






module.exports={updateQuantitycontrol,leavePoolcontrol,getPoolMemberscontrol,joinPoolcontrol}