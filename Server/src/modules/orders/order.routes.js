import express from 'express';

import {
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  readyForPickupController,
  cancelOrderController,
} from './order.controller.js';

import authMiddleware from '../../middlewares/auth.middleware.js';
import { restrictTo } from '../../middlewares/role.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { updateOrderStatusValidation } from './order.validation.js';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  restrictTo('BUYER', 'SUPPLIER', 'ADMIN'),
  getOrdersController
);

router.get(
  '/:id',
  authMiddleware,
  restrictTo('BUYER', 'SUPPLIER', 'ADMIN'),
  getOrderByIdController
);

router.patch(
  '/:id/status',
  authMiddleware,
  restrictTo('SUPPLIER', 'ADMIN'),
  validate(updateOrderStatusValidation),
  updateOrderStatusController
);

router.patch(
  '/:id/ready-for-pickup',
  authMiddleware,
  restrictTo('SUPPLIER'),
  readyForPickupController
);

router.patch(
  '/:id/cancel',
  authMiddleware,
  restrictTo('BUYER', 'SUPPLIER', 'ADMIN'),
  cancelOrderController
);

export default router;