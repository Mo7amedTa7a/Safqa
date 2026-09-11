// User Routes
// - Belongs to: Member 1
// - All routes protected by auth.middleware
// - /me routes: any authenticated user
// - / and /:id routes: ADMIN only (restrictTo middleware)


import express from 'express'
import { deactivateUser, getAllUsers, getMe, getUserById, updateMe } from './user.controller.js'
import protect from '../../middlewares/auth.middleware.js'
import validate from '../../middlewares/validation.middleware.js'
import { updateProfileSchema } from './user.validation.js'
import authorize from '../../middlewares/role.middleware.js'
const router = express.Router()


router.get("/me",
    protect,
    getMe
)
router.patch(
    "/me",
    protect,
    validate(updateProfileSchema),
    updateMe
);


router.get("/",
    protect,
    authorize("ADMIN"),
    getAllUsers
)
router.get("/:id",
    protect,
    authorize("ADMIN"),
    getUserById
)
router.delete("/:id",
    protect,
    authorize("ADMIN"),
    deactivateUser
)
export default router