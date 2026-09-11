const express = require('express');

const {
    getDealsController,
    getDealByIdController,
    updateDealStatusController
} = require('./deal.controller');

const authMiddleware = require('../../middlewares/auth.middleware');
const { restrictTo } = require('../../middlewares/role.middleware');

const router = express.Router();

router.get(
    '/',
    authMiddleware,
    restrictTo('ADMIN'),
    getDealsController
);

router.get(
    '/:id',
    authMiddleware,
    restrictTo('ADMIN', 'SUPPLIER'),
    getDealByIdController
);

router.patch(
    '/:id/status',
    authMiddleware,
    restrictTo('ADMIN', 'SUPPLIER'),
    updateDealStatusController
);

module.exports = router;