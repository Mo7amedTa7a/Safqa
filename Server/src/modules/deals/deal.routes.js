import express from 'express';

import {
  getDealsController,
  getDealByIdController,
  updateDealStatusController,
} from './deal.controller.js';

import authMiddleware from '../../middlewares/auth.middleware.js';

import authorize from '../../middlewares/role.middleware.js';


const router = express.Router();


// ==========================================
// GET ALL DEALS
// ==========================================

router.get(
  '/',
  authMiddleware,
  authorize(
    'BUYER',
    'SUPPLIER',
    'ADMIN'
  ),
  getDealsController
);


// ==========================================
// GET DEAL BY ID
// ==========================================

router.get(
  '/:id',
  authMiddleware,
  authorize(
    'BUYER',
    'SUPPLIER',
    'ADMIN'
  ),
  getDealByIdController
);


// ==========================================
// UPDATE DEAL STATUS
// ==========================================

router.patch(
  '/:id/status',
  authMiddleware,
  authorize(
    'SUPPLIER',
    'ADMIN'
  ),
  updateDealStatusController
);


export default router;