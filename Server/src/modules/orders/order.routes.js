import express from 'express';

import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  readyForPickupController,
  confirmOrderController,
  cancelOrderController,
} from './order.controller.js';

import authMiddleware from '../../middlewares/auth.middleware.js';

import authorize from '../../middlewares/role.middleware.js';

import validate from '../../middlewares/validate.middleware.js';

import {
  updateOrderStatusValidation,
  createOrderValidation,
} from './order.validation.js';

const router = express.Router();


// ==========================================
// CREATE ORDER FROM DEAL
// ==========================================

router.post(
  '/:dealId/create',
  authMiddleware,
  authorize('BUYER'),
  validate(createOrderValidation),
  createOrderController
);


// ==========================================
// GET ALL ORDERS
// ==========================================

router.get(
  '/',
  authMiddleware,
  authorize('BUYER', 'SUPPLIER', 'ADMIN', 'SHIPPING_PARTNER'),
  getOrdersController
);


// ==========================================
// GET ORDER BY ID
// ==========================================

router.get(
  '/:id',
  authMiddleware,
  authorize('BUYER', 'SUPPLIER', 'ADMIN', 'SHIPPING_PARTNER'),
  getOrderByIdController
);


// ==========================================
// CONFIRM ORDER (BUYER APPROVAL WITHIN 24H)
// ==========================================

router.patch(
  '/:id/confirm',
  authMiddleware,
  authorize('BUYER', 'ADMIN'),
  confirmOrderController
);


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

router.patch(
  '/:id/status',
  authMiddleware,
  authorize('SUPPLIER', 'ADMIN', 'SHIPPING_PARTNER'),
  validate(updateOrderStatusValidation),
  updateOrderStatusController
);


// ==========================================
// READY FOR PICKUP
// ==========================================

router.patch(
  '/:id/ready-for-pickup',
  authMiddleware,
  authorize('SUPPLIER'),
  readyForPickupController
);


// ==========================================
// CANCEL ORDER
// ==========================================

router.patch(
  '/:id/cancel',
  authMiddleware,
  authorize('BUYER', 'SUPPLIER', 'ADMIN'),
  cancelOrderController
);

export default router;