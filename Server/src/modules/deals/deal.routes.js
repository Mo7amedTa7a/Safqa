import express from 'express';

import {
    getDealsController,
    getDealByIdController,
    updateDealStatusController
} from './deal.controller.js';

import authMiddleware from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';

const router = express.Router();

router.get(
    '/',
    authMiddleware,
    authorize('ADMIN'),
    getDealsController
);

router.get(
    '/:id',
    authMiddleware,
    authorize('ADMIN', 'SUPPLIER'),
    getDealByIdController
);

router.patch(
    '/:id/status',
    authMiddleware,
    authorize('ADMIN', 'SUPPLIER'),
    updateDealStatusController
);

export default router;
