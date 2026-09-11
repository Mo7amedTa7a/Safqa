const express = require('express');
const router = express.Router();

const {
    getOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
} = require('./order.controller');

const authMiddleware = require('../../middlewares/auth.middleware');
const { restrictTo } = require('../../middlewares/role.middleware');

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
    updateOrderStatusController
);

module.exports = router;