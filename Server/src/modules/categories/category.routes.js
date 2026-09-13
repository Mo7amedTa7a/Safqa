import express from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller.js";
import {
  createCategorySchema,
  updateCategorySchema,
  validateCategoryId,
} from "./category.validation.js";

import protect from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

const router = express.Router();

// Public routes for fetching categories
router.get("/", getAllCategoriesController);
router.get("/:id", validate(validateCategoryId, "params"), getCategoryByIdController);

// Protected routes for Admin
router.use(protect);
router.use(authorize("ADMIN"));

router.post("/", validate(createCategorySchema), createCategoryController);

router.patch(
  "/:id",
  validate(validateCategoryId, "params"),
  validate(updateCategorySchema),
  updateCategoryController
);

router.delete("/:id", validate(validateCategoryId, "params"), deleteCategoryController);

export default router;
