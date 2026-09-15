import express from 'express';
import protect from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';
import { getDashboardStats, getAllBuyingPools, getAllBuyingRequests } from './admin.controller.js';

const router = express.Router();

router.get("/dashboard-stats", protect, authorize("ADMIN"), getDashboardStats);
router.get("/buying-pools", protect, authorize("ADMIN"), getAllBuyingPools);
router.get("/buying-requests", protect, authorize("ADMIN"), getAllBuyingRequests);

export default router;
