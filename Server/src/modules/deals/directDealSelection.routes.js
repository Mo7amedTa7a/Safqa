const express = require('express');
const router = express.Router();

const { selectDirectOfferController } = require('./deal.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { restrictTo } = require('../../middlewares/role.middleware');

router.post(
  '/:requestId/select-offer',
  authMiddleware,
  restrictTo('BUYER'),
  selectDirectOfferController
);

module.exports = router;