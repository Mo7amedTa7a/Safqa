const express = require('express');
const router = express.Router();

const {
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  readyForPickupController,
  cancelOrderController,
} = require('./order.controller');

const authMiddleware = require('../../middlewares/auth.middleware');
const { restrictTo } = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');
const { updateOrderStatusValidation } = require('./order.validation');

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

module.exports = router;