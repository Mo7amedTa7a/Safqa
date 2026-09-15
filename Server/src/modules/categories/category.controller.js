import {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "./category.service.js";

export const createCategoryController = async (req, res, next) => {
  try {
    const category = await createCategoryService(req.body);
    res.status(201).json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategoriesController = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesService(req.query);
    res.status(200).json({
      status: "success",
      results: categories.length,
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryByIdController = async (req, res, next) => {
  try {
    const category = await getCategoryByIdService(req.params.id);
    res.status(200).json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (req, res, next) => {
  try {
    const category = await updateCategoryService(req.params.id, req.body);
    res.status(200).json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (req, res, next) => {
  try {
    await deleteCategoryService(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
