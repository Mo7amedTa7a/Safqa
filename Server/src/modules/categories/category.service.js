import Category from "./category.model.js";
import AppError from "../../utils/AppError.js";

export const createCategoryService = async (categoryData) => {
  const existingCategory = await Category.findOne({ name: categoryData.name });
  if (existingCategory) {
    throw new AppError("Category name already exists", 400);
  }
  const category = await Category.create(categoryData);
  return category;
};

export const getAllCategoriesService = async (query) => {
  // Simple filtering (e.g., ?isActive=true)
  const filter = {};
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  const categories = await Category.find(filter).sort("-createdAt");
  return categories;
};

export const getCategoryByIdService = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  return category;
};

export const updateCategoryService = async (categoryId, updateData) => {
  if (updateData.name) {
    const existingCategory = await Category.findOne({ name: updateData.name, _id: { $ne: categoryId } });
    if (existingCategory) {
      throw new AppError("Another category with this name already exists", 400);
    }
  }

  const category = await Category.findByIdAndUpdate(categoryId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const deleteCategoryService = async (categoryId) => {
  // Rather than deleting, it's safer to deactivate categories so products don't lose their reference.
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { isActive: false },
    { new: true }
  );

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};
