// BuyingPool Routes
// - Belongs to: Member 3
// - GET routes: public or authenticated
// - POST /:id/close: ADMIN only
import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createPool, getpools, getPoolsById, closePoolcontrol } from "./buyingPool.controller.js";
import { createBuyingPoolValidation } from "./buyingPool.validation.js";

const router = express.Router();

router.post("/", protect, restrictTo("BUYER"), validate(createBuyingPoolValidation), createPool);
router.get("/", protect, restrictTo("BUYER", "SUPPLIER", "ADMIN"), getpools);
router.get("/:id", protect, restrictTo("BUYER", "SUPPLIER", "ADMIN"), getPoolsById);
router.post("/:id/close", protect, restrictTo("ADMIN"), closePoolcontrol);

export default router;