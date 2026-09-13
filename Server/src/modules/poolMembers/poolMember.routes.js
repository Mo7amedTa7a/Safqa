// PoolMember Routes
// - Belongs to: Member 3
// - All routes protected by auth middleware
const express=require("express")

const router=express.Router()

import protect from "../../middlewares/auth.middleware"
import apiLimit from "../../middlewares/role.middleware"
import validate from "../../middlewares/validation.middleware"

const {joinPoolcontrol, updateQuantitycontrol,leavePoolcontrol,getPoolMemberscontrol } = require("./poolMember.controller");
const  {updateQuantityValidation}=require("./poolMember.validation")

router.post("/:id/join",protect,apiLimit("BUYER"),joinPoolcontrol)

router.patch("/:id/members/me",protect,apiLimit("BUYER"),validate(updateQuantityValidation),updateQuantitycontrol)
router.delete("/:id/members/me",protect,apiLimit("BUYER"),leavePoolcontrol)
router.get("/:id/members",protect,apiLimit("ADMIN"),getPoolMemberscontrol);


