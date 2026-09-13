// BuyingPool Routes
// - Belongs to: Member 3
// - GET routes: public or authenticated
// - POST /:id/close: ADMIN only
const express=require("express")

const router=express.Router()

import protect from "../../middlewares/auth.middleware"
import apiLimit from "../../middlewares/role.middleware"
import validate from "../../middlewares/validation.middleware"
const {createPool,getpools,getPoolsById,}=require("./buyingPool.controller")
const {createBuyingPoolValidation}=require("./buyingPool.validation")

router.post("/",protect,apiLimit("BUYER"),validate(createBuyingPoolValidation),createPool)
router.get("/",protect,apiLimit("BUYER", "SUPPLIER", "ADMIN"),getpools)
router.get("/:id",protect,apiLimit("BUYER", "SUPPLIER", "ADMIN"),getPoolsById)
router.post("/:id/close",protect,apiLimit("ADMIN"),closePoolcontrol);



module.exports=router