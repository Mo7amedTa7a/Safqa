import express from 'express';

import { selectDirectOfferController } from './deal.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { restrictTo } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.post(
  '/:requestId/select-offer',
  authMiddleware,
  restrictTo('BUYER'),
  selectDirectOfferController
);

export default router;