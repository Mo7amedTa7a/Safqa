const express = require('express');

const {
    getDealsController,
    getDealByIdController,
    updateDealStatusController
} = require('./deal.controller');

const router = express.Router();

router.get('/', getDealsController);

router.get('/:id', getDealByIdController);

router.patch('/:id/status', updateDealStatusController);

module.exports = router;