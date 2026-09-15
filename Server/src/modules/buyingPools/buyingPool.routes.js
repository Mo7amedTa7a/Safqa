// BuyingPool Routes
// - Belongs to: Member 3
// - GET routes: public or authenticated
// - POST /:id/close: ADMIN only
import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createPool, getpools, getPoolsById, closePoolcontrol } from "./buyingPool.controller.js";
import { createBuyingPoolValidation } from "./buyingPool.validation.js";

const router = express.Router();

router.post("/", protect, authorize("BUYER"), validate(createBuyingPoolValidation), createPool);
router.get("/", protect, authorize("BUYER", "SUPPLIER", "ADMIN"), getpools);
router.get("/:id", protect, authorize("BUYER", "SUPPLIER", "ADMIN"), getPoolsById);
router.post("/:id/close", protect, authorize("ADMIN"), closePoolcontrol);

export default router;
