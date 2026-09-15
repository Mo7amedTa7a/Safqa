import express from 'express';

import { selectOfferController } from './deal.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';

const router = express.Router();

router.post(
    '/:poolId/select-offer',
    authMiddleware,
    authorize('ADMIN'),
    selectOfferController
);

export default router;
