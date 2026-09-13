// BuyingPool Controller
// - Belongs to: Member 3
// - GET  /          → list all OPEN pools (public or ADMIN)
// - GET  /:id       → getPoolById
// - POST /:id/close → closePool (ADMIN)
const { createBuyingPool,getpool,getPoolById ,closePool} = require('./buyingPool.service');

//////////////////////////////////////////////////////////////////////////

const createPool = async (req, res, next) => {
  try {
    const { buyingRequestId } = req.body;

    const buyerId = req.user.id;

    const pool = await createBuyingPool(
      buyingRequestId,
      buyerId
    );

    res.status(201).json({
      success: true,
      message: "Buying pool created successfully",
      data: pool
    });

  } catch (error) {
    next(error);
  }
};


//////////////////////////////////////////////

const getpools=async(req,res,next)=>{
  try{

    const pool=await getpool()
    res.status(200).json({
      success:true,
      data:pool
    })
  }catch(err){
    next(err)
  }
 

}
///////////////////////////////////////////////////
const getPoolsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pool = await getPoolById(id);

    res.status(200).json({
      success: true,
      data: pool
    });

  } catch (err) {
    next(err);
  }
};

/////////////////////////////////////
const closePoolcontrol = async (req, res, next) => {
  try {

    const { id } = req.params;

    const pool = await closePool(id);

    res.status(200).json({
      success: true,
      data: pool
    });

  } catch (err) {
    next(err);
  }
};


module.exports = {createPool,getpools,getPoolsById,closePoolcontrol};