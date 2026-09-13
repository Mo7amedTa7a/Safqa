import express from 'express';

import {
    getDealsController,
    getDealByIdController,
    updateDealStatusController
} from './deal.controller.js';

import authMiddleware from '../../middlewares/auth.middleware.js';
import { restrictTo } from '../../middlewares/role.middleware.js';

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

export default router;