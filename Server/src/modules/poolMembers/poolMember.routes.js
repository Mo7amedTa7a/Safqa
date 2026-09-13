// PoolMember Routes
// - Belongs to: Member 3
// - All routes protected by auth middleware
import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { joinPoolcontrol, updateQuantitycontrol, leavePoolcontrol, getPoolMemberscontrol } from "./poolMember.controller.js";
import { updateQuantityValidation } from "./poolMember.validation.js";

const router = express.Router();

router.post("/:id/join", protect, restrictTo("BUYER"), joinPoolcontrol);
router.patch("/:id/members/me", protect, restrictTo("BUYER"), validate(updateQuantityValidation), updateQuantitycontrol);
router.delete("/:id/members/me", protect, restrictTo("BUYER"), leavePoolcontrol);
router.get("/:id/members", protect, restrictTo("ADMIN"), getPoolMemberscontrol);

export default router;
