import express from 'express';

import {
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  readyForPickupController,
  cancelOrderController,
} from './order.controller.js';

import authMiddleware from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { updateOrderStatusValidation } from './order.validation.js';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  authorize('BUYER', 'SUPPLIER', 'ADMIN'),
  getOrdersController
);

router.get(
  '/:id',
  authMiddleware,
  authorize('BUYER', 'SUPPLIER', 'ADMIN'),
  getOrderByIdController
);

router.patch(
  '/:id/status',
  authMiddleware,
  authorize('SUPPLIER', 'ADMIN'),
  validate(updateOrderStatusValidation),
  updateOrderStatusController
);

router.patch(
  '/:id/ready-for-pickup',
  authMiddleware,
  authorize('SUPPLIER'),
  readyForPickupController
);

router.patch(
  '/:id/cancel',
  authMiddleware,
  authorize('BUYER', 'SUPPLIER', 'ADMIN'),
  cancelOrderController
);

export default router;
