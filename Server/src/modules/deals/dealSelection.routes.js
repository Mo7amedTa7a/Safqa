const express = require('express');
const router = express.Router();

const { selectOfferController } = require('./deal.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { restrictTo } = require('../../middlewares/role.middleware');

router.post(
    '/:poolId/select-offer',
    authMiddleware,
    restrictTo('ADMIN'),
    selectOfferController
);

module.exports = router;