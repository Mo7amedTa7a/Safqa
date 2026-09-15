// PoolMember Routes
// - Belongs to: Member 3
// - All routes protected by auth middleware
import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { joinPoolcontrol, updateQuantitycontrol, leavePoolcontrol, getPoolMemberscontrol } from "./poolMember.controller.js";
import { updateQuantityValidation } from "./poolMember.validation.js";

const router = express.Router();

router.post("/:id/join", protect, authorize("BUYER"), joinPoolcontrol);
router.patch("/:id/members/me", protect, authorize("BUYER"), validate(updateQuantityValidation), updateQuantitycontrol);
router.delete("/:id/members/me", protect, authorize("BUYER"), leavePoolcontrol);
router.get("/:id/members", protect, authorize("ADMIN"), getPoolMemberscontrol);

export default router; 
