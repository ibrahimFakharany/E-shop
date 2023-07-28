const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  addCategoryIdToBodyMiddlware,
  addFilterOptionsMiddleware,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

router
  .route("/")
  .post(
    addCategoryIdToBodyMiddlware,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(addFilterOptionsMiddleware, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategory, deleteSubCategory);

module.exports = router;
